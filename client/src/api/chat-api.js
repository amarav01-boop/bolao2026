import { fetchJson } from './api-client.js';

export function getChatMessages({ limit = 30, beforeId } = {}) {
  const params = new URLSearchParams({
    limit: String(limit)
  });

  if (beforeId) {
    params.set('beforeId', String(beforeId));
  }

  return fetchJson(`/api/chat/messages?${params.toString()}`);
}

export function getChatParticipants() {
  return fetchJson('/api/chat/participants');
}

export function createChatMessage(payload) {
  return fetchJson('/api/chat/messages', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
