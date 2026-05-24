import { fetchJson } from './api-client.js';

export function getHomeState() {
  return fetchJson('/api/home');
}
