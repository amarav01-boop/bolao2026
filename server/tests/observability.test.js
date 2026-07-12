const test = require('node:test');
const assert = require('node:assert/strict');

const {
  collectMetrics,
  createHttpMetricsMiddleware,
  resetMetricsForTests
} = require('../observability/metrics');

test('collectMetrics exposes process and HTTP series', () => {
  resetMetricsForTests();
  const metrics = collectMetrics();

  assert.match(metrics, /# HELP bolao2026_app_info/);
  assert.match(metrics, /bolao2026_process_uptime_seconds/);
  assert.match(metrics, /bolao2026_http_requests_in_flight 0/);
});

test('HTTP metrics middleware records requests and latency buckets', async () => {
  resetMetricsForTests();
  const middleware = createHttpMetricsMiddleware();

  const req = {
    method: 'GET',
    originalUrl: '/api/home',
    baseUrl: '/api',
    route: { path: '/home' }
  };

  const listeners = {};
  const res = {
    statusCode: 200,
    on(event, handler) {
      listeners[event] = handler;
    }
  };

  middleware(req, res, () => {});
  assert.equal(typeof listeners.finish, 'function');

  listeners.finish();

  const metrics = collectMetrics();

  assert.match(metrics, /bolao2026_http_requests_total\{method="GET",route="\/api\/home",status_code="200"\} 1/);
  assert.match(metrics, /bolao2026_http_request_duration_seconds_count\{method="GET",route="\/api\/home"\} 1/);
  assert.match(metrics, /bolao2026_http_request_duration_seconds_sum\{method="GET",route="\/api\/home"\} [0-9.]+/);
});
