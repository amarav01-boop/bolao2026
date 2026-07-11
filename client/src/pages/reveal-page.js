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

function shouldShowClassificationCard(phase) {
  return phase?.stageType === 'group';
}

function normalizeRevealText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isRoundOf16Phase(phase) {
  const haystack = [
    phase?.code,
    phase?.name,
    phase?.roundLabel
  ]
    .map(normalizeRevealText)
    .join(' ');

  return (
    haystack.includes('round of 16') ||
    haystack.includes('oitavas de final') ||
    haystack.includes('oitavas')
  );
}

function isRoundOf8Phase(phase) {
  const haystack = [
    phase?.code,
    phase?.name,
    phase?.roundLabel
  ]
    .map(normalizeRevealText)
    .join(' ');

  return (
    haystack.includes('round of 8') ||
    haystack.includes('quarterfinal') ||
    haystack.includes('quartas de final') ||
    haystack.includes('quartas')
  );
}

function isSecondRoundPhase(phase) {
  const haystack = [
    phase?.code,
    phase?.name,
    phase?.roundLabel
  ]
    .map(normalizeRevealText)
    .join(' ');

  return (
    haystack.includes('second round') ||
    haystack.includes('segunda rodada')
  );
}

function getRevealPhasePriority(phase) {
  if (isRoundOf8Phase(phase)) {
    return 0;
  }

  if (isRoundOf16Phase(phase)) {
    return 1;
  }

  if (isSecondRoundPhase(phase)) {
    return 2;
  }

  return 3;
}

function renderRevealedGroupStandings(group, showClassification = true) {
  if (!showClassification) {
    return '';
  }

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
      ${showClassification
        ? `
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
        `
        : ''}
    </section>
  `;
}

function renderRevealExtrasLegacy(extras) {
  if (!extras) {
    return '';
  }

  const semiFinalists = extras.semiFinalists || [];
  const topScorerGoals =
    extras.topScorer?.goals === null || extras.topScorer?.goals === undefined
      ? 'Não informado'
      : String(extras.topScorer.goals);

  return `
    <section class="revealed-extras" aria-label="Palpites extras do participante">
      <div class="panel__header">
        <div>
          <p class="panel__label">Palpites extras</p>
          <h3>Escolhas para a Copa</h3>
        </div>
        <span class="chip">${extras.pointsAwarded === null || extras.pointsAwarded === undefined ? 'Aguardando pontuacao' : `${escapeHtml(extras.pointsAwarded)} pts nos extras`}</span>
      </div>
      <dl class="revealed-extras__grid">
        <div class="revealed-extra-item">
          <dt>Campeão da Copa</dt>
          <dd>${escapeHtml(extras.champion?.name || 'Não informado')}</dd>
        </div>
        <div class="revealed-extra-item revealed-extra-item--wide">
          <dt>Semifinalistas</dt>
          <dd class="revealed-extra-teams">
            ${[0, 1, 2, 3]
              .map(
                (index) => `
                  <span>${index + 1}. ${escapeHtml(semiFinalists[index]?.name || 'Não informado')}</span>
                `
              )
              .join('')}
          </dd>
        </div>
        <div class="revealed-extra-item">
          <dt>Artilheiro</dt>
          <dd>${escapeHtml(extras.topScorer?.name || 'Não informado')}</dd>
        </div>
        <div class="revealed-extra-item">
          <dt>Número de gols</dt>
          <dd>${escapeHtml(topScorerGoals)}</dd>
        </div>
      </dl>
    </section>
  `;
}

const EXTRA_CATEGORY_LABELS = {
  semifinalists: 'Semifinalistas',
  champion: 'Campeão',
  topScorer: 'Artilheiro',
  topScorerGoals: 'Número de gols'
};

function formatRevealTeams(teams = []) {
  const values = [0, 1, 2, 3].map((index) => {
    const team = teams[index] || {};
    return `${index + 1}. ${team.name || team.code || 'Não informado'}`;
  });

  return values.join(' | ');
}

function formatRevealCategoryValue(categoryKey, value) {
  if (categoryKey === 'semifinalists') {
    return formatRevealTeams(value);
  }

  if (categoryKey === 'champion') {
    return value?.name || value?.code || 'Não informado';
  }

  if (categoryKey === 'topScorer') {
    return value?.name || 'Não informado';
  }

  if (categoryKey === 'topScorerGoals') {
    return value === null || value === undefined || value === '' ? 'Não informado' : String(value);
  }

  return value || 'Não informado';
}

function renderRevealScoringSummary(extras) {
  const scoring = extras?.scoring;
  if (!scoring?.categories) {
    return '';
  }

  const calculatedLabels = (scoring.calculatedCategories || [])
    .map((categoryKey) => EXTRA_CATEGORY_LABELS[categoryKey])
    .filter(Boolean);
  const pendingLabels = Object.entries(scoring.categories)
    .filter(([, category]) => !category.calculated)
    .map(([categoryKey]) => EXTRA_CATEGORY_LABELS[categoryKey])
    .filter(Boolean);
  const calculatedText = calculatedLabels.length
    ? `Pontuação calculada: ${calculatedLabels.join(', ')}.`
    : 'Nenhuma pontuação extra foi calculada ainda.';
  const pendingText = pendingLabels.length
    ? ` Aguardando gabarito: ${pendingLabels.join(', ')}.`
    : '';
  const persistedPoints = extras.pointsAwarded === null || extras.pointsAwarded === undefined
    ? null
    : Number(extras.pointsAwarded);
  const calculatedTotal = Number(scoring.totalPoints);
  const totalText = Number.isFinite(persistedPoints) && Number.isFinite(calculatedTotal) && persistedPoints !== calculatedTotal
    ? ` Total calculado pelas categorias exibidas: ${calculatedTotal} pts. Total oficial persistido: ${persistedPoints} pts.`
    : '';

  return `<p class="revealed-extras__summary">${escapeHtml(calculatedText + pendingText + totalText)}</p>`;
}

function renderRevealScoringRows(scoring) {
  if (!scoring?.categories) {
    return '';
  }

  return `
    <div class="revealed-extra-score-list">
      ${Object.entries(scoring.categories)
        .map(([categoryKey, category]) => `
          <div class="revealed-extra-score-row">
            <div>
              <p class="panel__label">${escapeHtml(EXTRA_CATEGORY_LABELS[categoryKey] || categoryKey)}</p>
              <strong>${escapeHtml(category.points)} / ${escapeHtml(category.maxPoints)} pts</strong>
            </div>
            <div>
              <span>Palpite</span>
              <strong>${escapeHtml(formatRevealCategoryValue(categoryKey, category.prediction))}</strong>
            </div>
            <div>
              <span>Gabarito</span>
              <strong>${escapeHtml(category.calculated ? formatRevealCategoryValue(categoryKey, category.answer) : 'Aguardando gabarito')}</strong>
            </div>
            <span class="chip ${category.calculated ? 'chip--accent' : ''}">
              ${category.calculated ? 'Calculado' : 'Aguardando gabarito'}
            </span>
          </div>
        `)
        .join('')}
    </div>
  `;
}

export function renderRevealExtras(extras) {
  if (!extras?.scoring?.categories) {
    return renderRevealExtrasLegacy(extras);
  }

  return `
    <section class="revealed-extras" aria-label="Palpites extras do participante">
      <div class="panel__header">
        <div>
          <p class="panel__label">Palpites extras</p>
          <h3>Escolhas para a Copa</h3>
        </div>
        <span class="chip">${extras.pointsAwarded === null || extras.pointsAwarded === undefined ? 'Aguardando pontuacao' : `${escapeHtml(extras.pointsAwarded)} pts nos extras`}</span>
      </div>
      ${renderRevealScoringSummary(extras)}
      ${renderRevealScoringRows(extras.scoring)}
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

  return [...revealState.phases]
    .sort((left, right) => {
      const priorityDiff = getRevealPhasePriority(left.phase) - getRevealPhasePriority(right.phase);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      const sortOrderDiff = Number(left.phase?.sortOrder || 0) - Number(right.phase?.sortOrder || 0);
      if (sortOrderDiff !== 0) {
        return sortOrderDiff;
      }

      return Number(left.phase?.id || 0) - Number(right.phase?.id || 0);
    })
    .map(
      (phasePayload) => `
        <section class="panel panel--span-12">
          <div class="panel__header">
            <p class="panel__label">${escapeHtml(phasePayload.phase.name)}</p>
            <span class="chip chip--accent">Revelado</span>
          </div>
          ${renderRevealExtras(phasePayload.extras)}
          <div class="revealed-group-list">
            ${phasePayload.groups
              .map(
                (group) => `
                  <section class="revealed-group">
                    <h3>${escapeHtml(group.label)}</h3>
                    ${renderRevealedGroupStandings(group, shouldShowClassificationCard(phasePayload.phase))}
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
