const METRIC_PREFIX = 'bolao2026';

const DURATION_BUCKETS_SECONDS = [
  0.005,
  0.01,
  0.025,
  0.05,
  0.1,
  0.25,
  0.5,
  1,
  2.5,
  5,
  10
];

const state = createEmptyState();

function createEmptyState() {
  return {
    startedAt: Date.now(),
    inFlightRequests: 0,
    requestsTotal: new Map(),
    requestDurationBuckets: new Map(),
    requestDurationSum: new Map(),
    requestDurationCount: new Map(),
    requestErrorsTotal: new Map()
  };
}

function resetMetricsForTests() {
  const freshState = createEmptyState();
  Object.keys(freshState).forEach((key) => {
    state[key] = freshState[key];
  });
}

function escapeLabelValue(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"');
}

function formatLabels(labels = {}) {
  const keys = Object.keys(labels);

  if (!keys.length) {
    return '';
  }

  const sortedKeys = keys.sort();
  return `{${sortedKeys
    .map((key) => `${key}="${escapeLabelValue(labels[key])}"`)
    .join(',')}}`;
}

function formatMetricLine(name, labels, value) {
  return `${name}${formatLabels(labels)} ${value}`;
}

function incrementMapValue(map, key, by = 1) {
  const currentValue = map.get(key) || 0;
  map.set(key, currentValue + by);
}

function observeBucketSeries(map, key, durationSeconds) {
  const currentSeries = map.get(key) || Array(DURATION_BUCKETS_SECONDS.length + 1).fill(0);
  const nextSeries = currentSeries.slice();
  let matchedBucket = false;

  DURATION_BUCKETS_SECONDS.forEach((bucket, index) => {
    if (!matchedBucket && durationSeconds <= bucket) {
      nextSeries[index] += 1;
      matchedBucket = true;
    }
  });

  if (!matchedBucket) {
    nextSeries[nextSeries.length - 1] += 1;
  }

  map.set(key, nextSeries);
}

function getRequestRouteLabel(req) {
  const routePath = req.route && req.route.path ? `${req.baseUrl || ''}${req.route.path}` : null;
  if (routePath) {
    return routePath;
  }

  const originalPath = String(req.originalUrl || req.path || '/').split('?')[0];
  return originalPath
    .replace(/\/[0-9a-fA-F-]{8,}(?=\/|$)/g, '/:id')
    .replace(/\/\d+(?=\/|$)/g, '/:id');
}

function createHttpMetricsMiddleware() {
  return (req, res, next) => {
    state.inFlightRequests += 1;
    const startedAt = process.hrtime.bigint();
    let finalized = false;

    const finalize = (eventType) => {
      if (finalized) {
        return;
      }

      finalized = true;
      state.inFlightRequests = Math.max(0, state.inFlightRequests - 1);

      const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1e9;
      const route = getRequestRouteLabel(req);
      const method = String(req.method || 'GET').toUpperCase();
      const statusCode = String(eventType === 'close' && !res.writableEnded ? 499 : res.statusCode || 0);
      const key = `${method}|${route}|${statusCode}`;
      const durationKey = `${method}|${route}`;

      incrementMapValue(state.requestsTotal, key);
      if (Number(statusCode) >= 500) {
        incrementMapValue(state.requestErrorsTotal, key);
      }
      observeBucketSeries(state.requestDurationBuckets, durationKey, durationSeconds);

      const sum = state.requestDurationSum.get(durationKey) || 0;
      state.requestDurationSum.set(durationKey, sum + durationSeconds);

      incrementMapValue(state.requestDurationCount, durationKey);
    };

    res.on('finish', () => finalize('finish'));
    res.on('close', () => finalize('close'));

    return next();
  };
}

function renderMetricHeader(name, type, help) {
  return [`# HELP ${name} ${help}`, `# TYPE ${name} ${type}`];
}

function renderCounterSeries(metricName, map, labelNames) {
  const lines = [];

  map.forEach((value, key) => {
    const parts = key.split('|');
    const labels = labelNames.reduce((acc, labelName, index) => {
      acc[labelName] = parts[index];
      return acc;
    }, {});

    lines.push(formatMetricLine(metricName, labels, value));
  });

  return lines;
}

function renderHistogramSeries(metricName, map) {
  const lines = [];

  map.forEach((series, key) => {
    const [method, route] = key.split('|');
    let runningCount = 0;

    DURATION_BUCKETS_SECONDS.forEach((bucket, index) => {
      runningCount += series[index] || 0;
      lines.push(
        formatMetricLine(`${metricName}_bucket`, { method, route, le: String(bucket) }, runningCount)
      );
    });

    runningCount += series[series.length - 1] || 0;
    lines.push(formatMetricLine(`${metricName}_bucket`, { method, route, le: '+Inf' }, runningCount));
  });

  return lines;
}

function collectMetrics() {
  const lines = [];
  const uptimeSeconds = (Date.now() - state.startedAt) / 1000;
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const activeHandles = typeof process._getActiveHandles === 'function' ? process._getActiveHandles().length : 0;
  const activeRequests = typeof process._getActiveRequests === 'function' ? process._getActiveRequests().length : 0;

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_app_info`, 'gauge', 'Application build information.'));
  lines.push(
    formatMetricLine(`${METRIC_PREFIX}_app_info`, { service: METRIC_PREFIX, node_env: process.env.NODE_ENV || 'development' }, 1)
  );

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_process_uptime_seconds`, 'gauge', 'Process uptime in seconds.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_process_uptime_seconds`, {}, uptimeSeconds.toFixed(3)));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_process_resident_memory_bytes`, 'gauge', 'Resident memory used by the process.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_process_resident_memory_bytes`, {}, memoryUsage.rss));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_process_heap_used_bytes`, 'gauge', 'V8 heap used bytes.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_process_heap_used_bytes`, {}, memoryUsage.heapUsed));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_process_cpu_user_seconds_total`, 'counter', 'Total user CPU time consumed by the process.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_process_cpu_user_seconds_total`, {}, (cpuUsage.user / 1e6).toFixed(6)));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_process_cpu_system_seconds_total`, 'counter', 'Total system CPU time consumed by the process.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_process_cpu_system_seconds_total`, {}, (cpuUsage.system / 1e6).toFixed(6)));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_process_active_handles`, 'gauge', 'Number of active event loop handles.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_process_active_handles`, {}, activeHandles));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_process_active_requests`, 'gauge', 'Number of active libuv requests.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_process_active_requests`, {}, activeRequests));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_http_requests_in_flight`, 'gauge', 'Number of in-flight HTTP requests.'));
  lines.push(formatMetricLine(`${METRIC_PREFIX}_http_requests_in_flight`, {}, state.inFlightRequests));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_http_requests_total`, 'counter', 'Total HTTP requests by method, route and status code.'));
  lines.push(...renderCounterSeries(`${METRIC_PREFIX}_http_requests_total`, state.requestsTotal, ['method', 'route', 'status_code']));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_http_request_errors_total`, 'counter', 'Total HTTP 5xx requests by method, route and status code.'));
  lines.push(...renderCounterSeries(`${METRIC_PREFIX}_http_request_errors_total`, state.requestErrorsTotal, ['method', 'route', 'status_code']));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_http_request_duration_seconds`, 'histogram', 'HTTP request duration in seconds.'));
  lines.push(...renderHistogramSeries(`${METRIC_PREFIX}_http_request_duration_seconds`, state.requestDurationBuckets));

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_http_request_duration_seconds_sum`, 'counter', 'HTTP request duration sum in seconds.'));
  state.requestDurationSum.forEach((value, key) => {
    const [method, route] = key.split('|');
    lines.push(formatMetricLine(`${METRIC_PREFIX}_http_request_duration_seconds_sum`, { method, route }, value.toFixed(6)));
  });

  lines.push(...renderMetricHeader(`${METRIC_PREFIX}_http_request_duration_seconds_count`, 'counter', 'HTTP request duration count.'));
  state.requestDurationCount.forEach((value, key) => {
    const [method, route] = key.split('|');
    lines.push(formatMetricLine(`${METRIC_PREFIX}_http_request_duration_seconds_count`, { method, route }, value));
  });

  return `${lines.join('\n')}\n`;
}

module.exports = {
  METRIC_PREFIX,
  collectMetrics,
  createHttpMetricsMiddleware,
  resetMetricsForTests
};
