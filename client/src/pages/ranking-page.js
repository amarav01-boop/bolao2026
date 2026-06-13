import { renderAppShell } from '../components/app-shell.js';
import { renderEmptyState } from '../components/empty-state.js';
import { renderParticipantBadge } from '../components/participant-badge.js';
import { renderParticipantNav } from '../components/participant-nav.js';
import {
  getRankingStatusChipClass,
  renderRankingMovement
} from '../components/ranking-row.js';
import { renderStatusMessage } from '../components/status-message.js';
import { escapeHtml } from '../utils/escape-html.js';

const BRAND_LABEL = 'BOLÃO DA COPA 2026 - AMIGOS DA VILA OLÍMPIA';

export function renderRankingTable(ranking = [], currentParticipantId) {
  if (!ranking.length) {
    return renderEmptyState({
      title: 'Ranking aguardando participantes',
      body: 'Assim que houver participantes cadastrados, todos aparecem aqui. No início, todo mundo começa com 0 pontos.'
    });
  }

  return `
    <div class="ranking-table-wrap">
      <table class="ranking-table">
        <thead>
          <tr>
            <th>Posição</th>
            <th>Participante</th>
            <th>Pontos</th>
            <th>Movimento</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${ranking
            .map((row) => {
              const isCurrent = Number(row.id) === Number(currentParticipantId);
              return `
                <tr class="${isCurrent ? 'ranking-table__row--current' : ''}">
                  <td class="ranking-table__rank">#${escapeHtml(row.rank)}</td>
                  <td class="ranking-table__participant">
                    ${renderParticipantBadge({
                      nickname: row.nickname,
                      city: row.city,
                      username: row.username,
                      avatarKey: row.avatarKey,
                      compact: true
                    })}
                  </td>
                  <td class="ranking-table__points">${escapeHtml(row.points)} pts</td>
                  <td class="ranking-table__movement">
                    ${renderRankingMovement(row)}
                  </td>
                  <td>
                    <span class="chip ${getRankingStatusChipClass(row.statusChip)}">
                      ${escapeHtml(row.statusChip || 'Histórico iniciando')}
                    </span>
                  </td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function renderRankingPage(state) {
  const ranking = state.rankingState?.ranking || [];
  const content = `
    ${renderParticipantNav('ranking')}
    <section class="panel panel--span-12">
      ${renderStatusMessage({
        tone: 'neutral',
        title: 'Ranking geral',
        body: 'Todos começam com 0 pontos. Quando os resultados forem registrados, a tabela passa a refletir a pontuação acumulada.'
      })}
    </section>
    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">Classificação</p>
        <span class="chip chip--accent">${ranking.length} participante${ranking.length === 1 ? '' : 's'}</span>
      </div>
      ${state.rankingLoadError
        ? renderStatusMessage({ tone: 'danger', title: 'Falha ao carregar ranking', body: state.rankingLoadError })
        : renderRankingTable(ranking, state.sessionParticipant?.id)}
    </section>
  `;

  return renderAppShell({
    eyebrow: BRAND_LABEL,
    title: 'Ranking',
    lead: 'A classificação completa do bolão, com apelido, avatar, posição e pontos acumulados.',
    content,
    footer: 'Ranking calculado por AI para manter a regra de pontuação consistente.',
    variant: 'participant'
  });
}
