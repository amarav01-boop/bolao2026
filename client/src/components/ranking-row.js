import { renderParticipantBadge } from './participant-badge.js';
import { escapeHtml } from '../utils/escape-html.js';

export function getRankingStatusChipClass(statusChip) {
  if (['Em queda', 'Queda forte', 'Aguardando início da copa'].includes(statusChip)) {
    return 'chip--danger';
  }

  if (['Em alta', 'Arrancada', 'Disparou'].includes(statusChip)) {
    return 'chip--accent';
  }

  return 'chip--muted';
}

export function renderRankingMovement({ movement = 'unknown', rankDelta = null } = {}) {
  if (movement === 'up') {
    const positions = Math.abs(Number(rankDelta) || 0);
    const label = `Subiu ${positions} ${positions === 1 ? 'posição' : 'posições'}`;
    return `
      <span class="ranking-movement ranking-movement--up">
        <span class="ranking-movement__icon" aria-hidden="true">↑</span>
        <strong>${positions}</strong>
        <span class="sr-only">${label}</span>
      </span>
    `;
  }

  if (movement === 'down') {
    const positions = Math.abs(Number(rankDelta) || 0);
    const label = `Caiu ${positions} ${positions === 1 ? 'posição' : 'posições'}`;
    return `
      <span class="ranking-movement ranking-movement--down">
        <span class="ranking-movement__icon" aria-hidden="true">↓</span>
        <strong>${positions}</strong>
        <span class="sr-only">${label}</span>
      </span>
    `;
  }

  if (movement === 'steady') {
    return `
      <span class="ranking-movement ranking-movement--steady">
        <span class="ranking-movement__icon" aria-hidden="true">•</span>
        <span class="sr-only">Manteve a posição</span>
      </span>
    `;
  }

  return `
    <span class="ranking-movement ranking-movement--unknown">
      <span class="ranking-movement__icon" aria-hidden="true">–</span>
      <span class="sr-only">Histórico de posição ainda não iniciado</span>
    </span>
  `;
}

export function renderRankingRow({
  rank,
  name,
  nickname,
  city,
  username,
  avatarKey,
  points,
  movement,
  chip
}) {
  const participantName = nickname || name;

  return `
    <tr>
      <td class="ranking-table__rank">${rank}</td>
      <td class="ranking-table__participant">
        ${renderParticipantBadge({
          nickname: participantName,
          city,
          username,
          avatarKey,
          compact: true,
          showUsername: false
        })}
      </td>
      <td class="ranking-table__points">${points}</td>
      <td class="ranking-table__movement">${renderRankingMovement({ movement })}</td>
      <td><span class="chip ${getRankingStatusChipClass(chip)}">${escapeHtml(chip)}</span></td>
    </tr>
  `;
}
