import { renderAppShell } from '../components/app-shell.js';
import { renderEmptyState } from '../components/empty-state.js';
import { renderParticipantBadge } from '../components/participant-badge.js';
import { renderParticipantNav } from '../components/participant-nav.js';
import { renderStatusMessage } from '../components/status-message.js';
import { escapeHtml } from '../utils/escape-html.js';
import {
  calculateGroupClassificationPoints,
  calculateGroupStandings,
  hasCompleteScores
} from '../utils/group-standings.js';

const BRAND_LABEL = 'BOLÃO DA COPA 2026 - AMIGOS DA VILA OLÍMPIA';

function renderParticipantSelector(revealState) {
  const participants = revealState?.participants || [];
  const selectedId = revealState?.selectedParticipant?.id || '';

  if (!participants.length) {
    return '';
  }

  return `
    <label class="field" for="reveal-participant">
      <span class="field__label">Participante</span>
      <select id="reveal-participant" data-reveal-participant-select>
        ${participants
          .map(
            (participant) => `
              <option value="${escapeHtml(participant.id)}" ${Number(participant.id) === Number(selectedId) ? 'selected' : ''}>
                ${escapeHtml(participant.nickname)}
              </option>
            `
          )
          .join('')}
      </select>
    </label>
  `;
}

function renderPredictionRows(matches = []) {
  return matches
    .map(
      (match) => `
        <div class="revealed-prediction-row">
          <span>${escapeHtml(match.homeTeamName)}</span>
          <strong>${escapeHtml(match.predictionHomeScore)} x ${escapeHtml(match.predictionAwayScore)}</strong>
          <span>${escapeHtml(match.awayTeamName)}</span>
          <span class="chip ${match.predictionIsDefaulted ? 'chip--danger' : 'chip--accent'}">
            ${match.predictionIsDefaulted ? '0x0 defaultado' : 'Explícito'}
          </span>
          <span class="chip">${match.pointsAwarded === null || match.pointsAwarded === undefined ? 'Sem pontos' : `${escapeHtml(match.pointsAwarded)} pts`}</span>
        </div>
      `
    )
    .join('');
}

function renderStandingsTable(standings = []) {
  if (!standings.length) {
    return '';
  }

  return `
    <div class="group-standings-table-wrap">
      <table class="group-standings-table">
        <thead>
          <tr>
            <th>Equipe</th>
            <th>Tot pts</th>
            <th>Saldo G</th>
            <th>Tot GP</th>
            <th>Tot GC</th>
          </tr>
        </thead>
        <tbody>
          ${standings
            .map(
              (team) => `
                <tr>
                  <td>${escapeHtml(team.name)}</td>
                  <td>${escapeHtml(team.points)}</td>
                  <td>${escapeHtml(team.goalDifference)}</td>
                  <td>${escapeHtml(team.goalsFor)}</td>
                  <td>${escapeHtml(team.goalsAgainst)}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderRevealedGroupStandings(group) {
  const matches = group.matches || [];
  const predictedStandings = calculateGroupStandings(matches, (match) => ({
    homeScore: match.predictionHomeScore,
    awayScore: match.predictionAwayScore
  }));
  const realStandingsReady = hasCompleteScores(matches, (match) => ({
    homeScore: match.resultHomeScore,
    awayScore: match.resultAwayScore
  }));
  const realStandings = realStandingsReady
    ? calculateGroupStandings(matches, (match) => ({
        homeScore: match.resultHomeScore,
        awayScore: match.resultAwayScore
      }))
    : [];
  const classificationPoints = realStandingsReady
    ? calculateGroupClassificationPoints(predictedStandings, realStandings)
    : null;
  const predictedOrder = predictedStandings.map((team) => team.name).join(' | ');
  const realOrder = realStandings.map((team) => team.name).join(' | ');

  return `
    <section class="group-standings-card">
      <div class="panel__header">
        <p class="panel__label">Classificação pelo palpite</p>
        <span class="chip">${escapeHtml(group.label)}</span>
      </div>
      ${renderStandingsTable(predictedStandings)}
      <div class="group-classification-summary">
        <div>
          <strong>Ordem pelo palpite</strong>
          <span>${escapeHtml(predictedOrder || 'Sem palpites suficientes.')}</span>
        </div>
        <div>
          <strong>Ordem real do grupo</strong>
          <span>${realOrder ? escapeHtml(realOrder) : 'Aguardando gabarito completo do grupo.'}</span>
        </div>
        <div>
          <strong>Pontos classificação grupo</strong>
          <span>${classificationPoints === null ? 'Aguardando fechamento' : `${escapeHtml(classificationPoints)} pts`}</span>
        </div>
      </div>
    </section>
  `;
}

function renderRevealedPhases(revealState) {
  if (!revealState?.phases?.length) {
    return renderEmptyState({
      title: 'Nenhum palpite revelado',
      body: revealState?.message || 'O admin ainda não liberou a visualização dos palpites.'
    });
  }

  return revealState.phases
    .map(
      (phasePayload) => `
        <section class="panel panel--span-12">
          <div class="panel__header">
            <p class="panel__label">${escapeHtml(phasePayload.phase.name)}</p>
            <span class="chip chip--accent">Revelado</span>
          </div>
          <div class="revealed-group-list">
            ${phasePayload.groups
              .map(
                (group) => `
                  <section class="revealed-group">
                    <h3>${escapeHtml(group.label)}</h3>
                    ${renderRevealedGroupStandings(group)}
                    <div class="revealed-prediction-list">
                      ${renderPredictionRows(group.matches)}
                    </div>
                  </section>
                `
              )
              .join('')}
          </div>
        </section>
      `
    )
    .join('');
}

export function renderRevealPage(state) {
  const revealState = state.revealState;
  const selected = revealState?.selectedParticipant;
  const content = `
    ${renderParticipantNav('reveal')}
    <section class="panel panel--span-12">
      ${renderStatusMessage({
        tone: revealState?.state === 'revealed' ? 'success' : 'warning',
        title: revealState?.state === 'revealed' ? 'Palpites liberados' : 'Palpites ainda protegidos',
        body: state.revealLoadError || revealState?.message || 'Quando o admin revelar a fase, você poderá consultar os palpites por participante.'
      })}
    </section>
    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">Escolha um participante</p>
      </div>
      ${selected
          ? renderParticipantBadge({
              nickname: selected.nickname,
              city: selected.city,
              username: selected.username,
              avatarKey: selected.avatarKey
            })
        : ''}
      <div style="height: 1rem"></div>
      ${renderParticipantSelector(revealState)}
    </section>
    ${state.revealLoadError
      ? `<section class="panel panel--span-12">${renderStatusMessage({ tone: 'danger', title: 'Erro ao carregar', body: state.revealLoadError })}</section>`
      : renderRevealedPhases(revealState)}
  `;

  return renderAppShell({
    eyebrow: BRAND_LABEL,
    title: 'Todos os Palpites',
    lead: 'Depois da liberação do admin, escolha um participante e veja os palpites daquela fase.',
    content,
    footer: 'A revelação é controlada pelo admin para preservar a justiça do bolão.',
    variant: 'participant'
  });
}
