import { fetchText } from './api-client.js';
import {
  calculateHistogramQuantile,
  getFirstMetricValue,
  groupMetricsByName,
  parsePrometheusMetrics,
  sumMetricValues
} from '../utils/metrics-parser.js';

export async function getMonitoringSnapshot() {
  const rawMetrics = await fetchText('/api/metrics');
  const entries = parsePrometheusMetrics(rawMetrics);
  const byName = groupMetricsByName(entries);
  const requestEntries = byName.bolao2026_http_requests_total || [];
  const errorEntries = byName.bolao2026_http_request_errors_total || [];
  const routeTotals = new Map();
  const routeErrors = new Map();

  requestEntries.forEach((entry) => {
    const route = entry.labels.route || 'desconhecida';
    routeTotals.set(route, (routeTotals.get(route) || 0) + Number(entry.value || 0));
  });

  errorEntries.forEach((entry) => {
    const route = entry.labels.route || 'desconhecida';
    routeErrors.set(route, (routeErrors.get(route) || 0) + Number(entry.value || 0));
  });

  const routes = [...routeTotals.entries()]
    .map(([route, requests]) => ({
      route,
      requests,
      errors: routeErrors.get(route) || 0
    }))
    .sort((left, right) => right.requests - left.requests)
    .slice(0, 8);

  return {
    generatedAt: new Date().toISOString(),
    uptimeSeconds: getFirstMetricValue(byName.bolao2026_process_uptime_seconds || []),
    memoryBytes: getFirstMetricValue(byName.bolao2026_process_resident_memory_bytes || []),
    heapBytes: getFirstMetricValue(byName.bolao2026_process_heap_used_bytes || []),
    inFlightRequests: getFirstMetricValue(byName.bolao2026_http_requests_in_flight || []),
    totalRequests: sumMetricValues(requestEntries),
    totalErrors: sumMetricValues(errorEntries),
    p95LatencySeconds: calculateHistogramQuantile(byName.bolao2026_http_request_duration_seconds_bucket || [], 0.95),
    routes
  };
}
