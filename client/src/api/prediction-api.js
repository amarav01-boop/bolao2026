import { fetchJson } from './api-client.js';

export function getActivePhasePredictions() {
  return fetchJson('/api/predictions/active-phase');
}

export function saveActivePhasePredictions(payload) {
  return fetchJson('/api/predictions/active-phase', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}
