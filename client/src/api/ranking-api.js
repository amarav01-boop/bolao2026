import { fetchJson } from './api-client.js';

export function getRanking() {
  return fetchJson('/api/ranking');
}
