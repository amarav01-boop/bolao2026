import { fetchJson } from './api-client.js';

export function getRegistrationState() {
  return fetchJson('/api/auth/registration-state');
}

export function getSessionParticipant() {
  return fetchJson('/api/auth/session');
}

export function loginParticipant(payload) {
  return fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function logoutParticipant() {
  return fetchJson('/api/auth/logout', {
    method: 'POST'
  });
}

export function registerParticipant(payload) {
  return fetchJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
