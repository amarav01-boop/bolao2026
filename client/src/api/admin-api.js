import { fetchJson } from './api-client.js';

export function getAdminSession() {
  return fetchJson('/api/admin/session');
}

export function loginAdmin(payload) {
  return fetchJson('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function logoutAdmin() {
  return fetchJson('/api/admin/logout', {
    method: 'POST'
  });
}

export function getAdminOverview() {
  return fetchJson('/api/admin/overview');
}

export function saveRegistrationState(payload) {
  return fetchJson('/api/admin/registration-state', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function getAdminPhases() {
  return fetchJson('/api/admin/phases');
}

export function createAdminPhase(payload) {
  return fetchJson('/api/admin/phases', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateAdminPhase(phaseId, payload) {
  return fetchJson(`/api/admin/phases/${phaseId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function getAdminMatches() {
  return fetchJson('/api/admin/matches');
}

export function createAdminMatch(payload) {
  return fetchJson('/api/admin/matches', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateAdminMatch(matchId, payload) {
  return fetchJson(`/api/admin/matches/${matchId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function recalculateAdminRanking() {
  return fetchJson('/api/admin/ranking/recalculate', {
    method: 'POST'
  });
}
