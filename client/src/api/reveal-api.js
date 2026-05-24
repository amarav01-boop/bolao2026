import { fetchJson } from './api-client.js';

export function getRevealState(participantId = '') {
  const query = participantId ? `?participantId=${encodeURIComponent(participantId)}` : '';
  return fetchJson(`/api/reveal${query}`);
}
