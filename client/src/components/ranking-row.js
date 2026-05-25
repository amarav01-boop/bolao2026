import { renderParticipantBadge } from './participant-badge.js';

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
      <td>${movement}</td>
      <td><span class="chip">${chip}</span></td>
    </tr>
  `;
}
