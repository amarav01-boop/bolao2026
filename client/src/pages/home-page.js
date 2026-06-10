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
import { buildKnockoutSimulation } from '../utils/knockout-simulator.js';

const BRAND_LABEL = 'BOLÃO DA COPA 2026 - AMIGOS DA VILA OLÍMPIA';

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const pad = (input) => String(input).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatCountdown(value) {
  if (!value) {
    return 'Sem prazo definido';
  }

  const deadline = new Date(value);
  const milliseconds = deadline.getTime() - new Date().getTime();

  if (Number.isNaN(deadline.getTime())) {
    return 'Prazo em formato inválido';
  }

  if (milliseconds <= 0) {
    return 'Prazo encerrado';
  }

  const totalHours = Math.floor(milliseconds / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return `${days} dia${days === 1 ? '' : 's'} e ${hours} hora${hours === 1 ? '' : 's'}`;
}

function getPredictionDraft(state, matchId) {
  return state.predictionDrafts[String(matchId)] || { homeScore: '', awayScore: '' };
}

function renderPredictionTabs(groups = [], activeGroupCode = 'all') {
  const sortedGroups = [...groups].sort((left, right) =>
    String(left.code).localeCompare(String(right.code), 'pt-BR', { numeric: true, sensitivity: 'base' })
  );

  if (!sortedGroups.length) {
    return '';
  }

  return `
    <div class="prediction-tabs" role="tablist" aria-label="Grupos da fase ativa">
      ${sortedGroups
        .map(
          (group) => `
            <button
              type="button"
              class="chip ${group.code === activeGroupCode ? 'chip--accent' : ''}"
              data-prediction-group-tab="${escapeHtml(group.code)}"
            >
              ${escapeHtml(group.label)}
            </button>
          `
        )
        .join('')}
    </div>
  `;
}

function renderPredictionRow(match, draft, disabled) {
  return `
    <div class="prediction-entry-row prediction-entry-row--participant">
      <label class="field prediction-entry-team">
        <span class="field__label">Seleção 1</span>
        <input
          type="text"
          value="${escapeHtml(match.homeTeamName)}"
          readonly
          aria-label="Seleção 1"
        />
      </label>
      <label class="field prediction-entry-score">
        <span class="field__label">Placar 1</span>
        <input
          type="number"
          min="0"
          inputmode="numeric"
          value="${escapeHtml(draft.homeScore)}"
          ${disabled ? 'disabled' : ''}
          data-prediction-input
          data-match-id="${match.id}"
          data-score-field="homeScore"
          aria-label="Placar da seleção 1"
        />
      </label>
      <div class="prediction-entry-vs" aria-hidden="true">X</div>
      <label class="field prediction-entry-score">
        <span class="field__label">Placar 2</span>
        <input
          type="number"
          min="0"
          inputmode="numeric"
          value="${escapeHtml(draft.awayScore)}"
          ${disabled ? 'disabled' : ''}
          data-prediction-input
          data-match-id="${match.id}"
          data-score-field="awayScore"
          aria-label="Placar da seleção 2"
        />
      </label>
      <label class="field prediction-entry-team">
        <span class="field__label">Seleção 2</span>
        <input
          type="text"
          value="${escapeHtml(match.awayTeamName)}"
          readonly
          aria-label="Seleção 2"
        />
      </label>
    </div>
  `;
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

function renderGroupClassificationSummary(group, predictedStandings, realStandings, classificationPoints) {
  const predictedOrder = predictedStandings.map((team) => team.name).join(' | ');
  const realOrder = realStandings.map((team) => team.name).join(' | ');

  return `
    <div class="group-classification-summary">
      <div>
        <strong>Ordem pelo seu palpite</strong>
        <span>${escapeHtml(predictedOrder || 'Preencha os placares do grupo para ver a ordem.')}</span>
      </div>
      <div>
        <strong>Ordem real do ${escapeHtml(group.label)}</strong>
        <span>${realOrder ? escapeHtml(realOrder) : 'Aguardando gabarito completo do grupo.'}</span>
      </div>
      <div>
        <strong>Pontos classificação grupo</strong>
        <span>${classificationPoints === null ? 'Aguardando fechamento' : `${escapeHtml(classificationPoints)} pts`}</span>
      </div>
    </div>
  `;
}

function renderGroupStandingsPreview(state, group) {
  const matches = group.matches || [];
  const predictedStandings = calculateGroupStandings(matches, (match) => {
    const draft = getPredictionDraft(state, match.id);
    return {
      homeScore: draft.homeScore,
      awayScore: draft.awayScore
    };
  });
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

  return `
    <section class="group-standings-card" aria-label="Classificação simulada do ${escapeHtml(group.label)}">
      <div class="panel__header">
        <p class="panel__label">Classificação pelo palpite</p>
        <span class="chip">${escapeHtml(group.label)}</span>
      </div>
      ${renderStandingsTable(predictedStandings)}
      ${renderGroupClassificationSummary(group, predictedStandings, realStandings, classificationPoints)}
    </section>
  `;
}

function renderGroupBlock(state, group) {
  const matches = group.matches || [];
  const remaining = matches.filter((match) => {
    const draft = getPredictionDraft(state, match.id);
    return String(draft.homeScore ?? '').trim() === '' || String(draft.awayScore ?? '').trim() === '';
  }).length;

  return `
    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">${escapeHtml(group.label)}</p>
        <span class="chip ${remaining ? 'chip--danger' : 'chip--accent'}">
          ${remaining ? `${remaining} pendente${remaining === 1 ? '' : 's'}` : 'Tudo preenchido'}
        </span>
      </div>
      <div class="prediction-list">
        ${matches
          .map((match) => renderPredictionRow(match, getPredictionDraft(state, match.id), !state.activePrediction.canEdit))
          .join('')}
      </div>
      ${renderGroupStandingsPreview(state, group)}
    </section>
  `;
}

function renderExtraSectionTitle(title, hint) {
  return `
    <div class="panel__header">
      <p class="panel__label">${escapeHtml(title)}</p>
      <span class="chip">Palpite extra</span>
    </div>
    <p class="panel__text">${escapeHtml(hint)}</p>
  `;
}

function buildPredictedGroupStandingsByCode(state) {
  const standingsByCode = new Map();

  (state.activePrediction?.groups || []).forEach((group) => {
    const standings = calculateGroupStandings(group.matches || [], (match) => {
      const draft = getPredictionDraft(state, match.id);

      return {
        homeScore: String(draft.homeScore ?? '').trim() === '' ? 0 : draft.homeScore,
        awayScore: String(draft.awayScore ?? '').trim() === '' ? 0 : draft.awayScore
      };
    });

    if (group.code && standings.length) {
      standingsByCode.set(group.code, standings);
    }
  });

  return standingsByCode;
}

function renderKnockoutMatch(match) {
  const renderTeamButton = (side) => {
    const selected = match.winner?.code && side.team?.code === match.winner.code;

    return `
      <button
        class="knockout-team${selected ? ' knockout-team--selected' : ''}"
        type="button"
        ${side.team ? '' : 'disabled'}
        data-knockout-winner-match="${escapeHtml(match.code)}"
        data-knockout-winner-team="${escapeHtml(side.team?.code || '')}"
      >
        ${escapeHtml(side.label || 'A definir')}
      </button>
    `;
  };

  return `
    <article class="knockout-match">
      <div class="knockout-match__heading">
        <span class="knockout-match__code">${escapeHtml(match.code)}</span>
        ${match.label ? `<span class="chip knockout-match__label">${escapeHtml(match.label)}</span>` : ''}
      </div>
      <div class="knockout-match__teams">
        ${renderTeamButton(match.home)}
        <span>X</span>
        ${renderTeamButton(match.away)}
      </div>
    </article>
  `;
}

function renderBestThirds(bestThirds = []) {
  return `
    <div class="knockout-thirds">
      <p class="panel__label">8 melhores terceiros pela sua simulação</p>
      <div class="chip-row">
        ${
          bestThirds.length
            ? bestThirds
                .map(
                  (team, index) => `
                    <span class="chip ${index < 8 ? 'chip--accent' : ''}">
                      ${index + 1}. ${escapeHtml(team.name)} (${escapeHtml(team.groupCode)})
                    </span>
                  `
                )
                .join('')
            : '<span class="chip">Preencha os grupos para calcular os terceiros.</span>'
        }
      </div>
    </div>
  `;
}

function renderKnockoutSimulation(state) {
  if (!state.activePrediction?.canEdit) {
    return '';
  }

  const standingsByCode = buildPredictedGroupStandingsByCode(state);

  if (standingsByCode.size < 12) {
    return '';
  }

  const simulation = buildKnockoutSimulation(standingsByCode, state.predictionUi.knockoutWinners);

  return `
    <section class="panel panel--span-12 knockout-simulator">
      <div class="panel__header">
        <p class="panel__label">Simulador do mata-mata</p>
        <span class="chip chip--accent">Baseado nos seus grupos</span>
      </div>
      <p class="panel__text">
        A segunda fase abaixo usa a classificação simulada dos seus palpites. Jogos em branco entram como 0x0 apenas nesta simulação.
        Alguns confrontos entre dois segundos colocados fazem parte da tabela oficial da Copa.
      </p>
      ${renderBestThirds(simulation.bestThirds)}
      <div class="knockout-round">
        <div class="panel__header">
          <p class="panel__label">Segunda fase</p>
          <span class="chip">M73-M88</span>
        </div>
        <div class="knockout-match-grid">
          ${simulation.roundOf32.map(renderKnockoutMatch).join('')}
        </div>
      </div>
      <section class="knockout-round">
        <div class="panel__header">
          <p class="panel__label">Oitavas de final</p>
          <span class="chip">M89-M96</span>
        </div>
        <div class="knockout-match-grid">
          ${simulation.roundOf16.map(renderKnockoutMatch).join('')}
        </div>
      </section>
      <section class="knockout-round">
        <div class="panel__header">
          <p class="panel__label">Quartas de final</p>
          <span class="chip">M97-M100</span>
        </div>
        <div class="knockout-match-grid">
          ${simulation.quarterFinals.map(renderKnockoutMatch).join('')}
        </div>
      </section>
      <section class="knockout-round">
        <div class="panel__header">
          <p class="panel__label">Semifinais</p>
          <span class="chip">M101-M102</span>
        </div>
        <div class="knockout-match-grid">
          ${simulation.semiFinals.map(renderKnockoutMatch).join('')}
        </div>
      </section>
      <section class="knockout-round knockout-round--finals">
        <div class="panel__header">
          <p class="panel__label">Finais</p>
          <span class="chip chip--accent">M103-M104</span>
        </div>
        <div class="knockout-match-grid">
          ${simulation.final.map(renderKnockoutMatch).join('')}
        </div>
      </section>
    </section>
  `;
}

function renderExtraPredictions(state, disabled) {
  const phase = state.activePrediction?.phase;

  if (phase?.code !== 'group-stage') {
    return '';
  }

  const draft = state.extraPredictionDraft || {};
  const teams = state.activePrediction?.teamOptions || [];

  return `
    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">Palpites extras</p>
        <span class="chip chip--accent">Junto com a fase de grupos</span>
      </div>
      <div class="extra-prediction-stack">
        <section class="extra-prediction-block">
          ${renderExtraSectionTitle('Campeão da Copa', 'Vale 10 pontos quando acertar o campeão da Copa.')}
          <label class="field" for="extra-champion">
            <span class="field__label">Campeão da Copa</span>
            <select
              id="extra-champion"
              name="championTeamCode"
              data-extra-prediction-input
              ${disabled ? 'disabled' : ''}
            >
              <option value="">Selecione uma seleção</option>
              ${teams
                .map(
                  (team) => `
                    <option value="${escapeHtml(team.code)}" ${team.code === draft.championTeamCode ? 'selected' : ''}>
                      ${escapeHtml(team.name)}
                    </option>
                  `
                )
                .join('')}
            </select>
          </label>
        </section>

        <section class="extra-prediction-block">
          ${renderExtraSectionTitle('Semifinalistas', 'Cada acerto de semifinalista vale 5 pontos.')}
          <div class="extra-prediction-group">
            ${[1, 2, 3, 4]
              .map(
                (index) => `
                  <label class="field" for="extra-semi-${index}">
                    <span class="field__label">Semifinalista ${index}</span>
                    <select
                      id="extra-semi-${index}"
                      name="semiFinalist${index}Code"
                      data-extra-prediction-input
                      ${disabled ? 'disabled' : ''}
                    >
                      <option value="">Selecione uma seleção</option>
                      ${teams
                        .map(
                          (team) => `
                            <option value="${escapeHtml(team.code)}" ${
                              team.code === draft[`semiFinalist${index}Code`] ? 'selected' : ''
                            }>
                              ${escapeHtml(team.name)}
                            </option>
                          `
                        )
                        .join('')}
                    </select>
                  </label>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="extra-prediction-block">
          ${renderExtraSectionTitle('Artilheiro', 'Vale 10 pontos se o nome estiver certo.')}
          <label class="field" for="extra-top-scorer">
            <span class="field__label">Artilheiro</span>
            <input
              id="extra-top-scorer"
              name="topScorerName"
              data-extra-prediction-input
              type="text"
              value="${escapeHtml(draft.topScorerName || '')}"
              placeholder="Nome do jogador"
              ${disabled ? 'disabled' : ''}
            />
          </label>
        </section>

        <section class="extra-prediction-block">
          ${renderExtraSectionTitle('Número de gols do artilheiro', 'Vale 5 pontos se o número de gols estiver certo.')}
          <label class="field" for="extra-top-scorer-goals">
            <span class="field__label">Gols do artilheiro</span>
            <input
              id="extra-top-scorer-goals"
              name="topScorerGoals"
              data-extra-prediction-input
              type="number"
              min="0"
              inputmode="numeric"
              value="${escapeHtml(draft.topScorerGoals || '')}"
              ${disabled ? 'disabled' : ''}
            />
          </label>
        </section>
      </div>
    </section>
  `;
}

function renderPhaseOverviewCard(state, phase, summary, attention) {
  const deadline = phase.deadlineAt ? formatDateTime(phase.deadlineAt) : 'Sem deadline definida';
  const countdown = formatCountdown(phase.deadlineAt);
  const stateLabel = phase.windowState === 'open' ? 'Aberta' : phase.windowState === 'locked' ? 'Travada' : 'Fechada';

  return `
    <section class="panel home-overview-card">
      <div class="panel__header">
        <p class="panel__label">Fase atual</p>
        <span class="chip chip--accent">${stateLabel}</span>
      </div>
      ${renderStatusMessage({
        tone: attention?.tone || (phase.windowState === 'open' ? 'success' : 'warning'),
        title: attention?.title || 'Atenção da fase',
        body:
          attention?.body ||
          (phase.windowState === 'open'
            ? 'Você ainda pode ajustar seus palpites até o fechamento da janela.'
            : 'A fase está travada para leitura.')
      })}
      <h2 class="home-overview-card__title">${escapeHtml(phase.name)}</h2>
      <p class="panel__text">Prazo: <strong>${escapeHtml(deadline)}</strong></p>
      <p class="panel__text">Tempo restante: <strong>${escapeHtml(countdown)}</strong></p>
      <p class="panel__text">Jogos na fase: <strong>${escapeHtml(summary.totalMatches)}</strong></p>
      <div class="progress">
        <div class="progress__bar" style="width:${Math.max(0, Math.min(100, summary.completionPercent || 0))}%"></div>
      </div>
    </section>
  `;
}

function renderRankingQuickCard(homeState) {
  const currentParticipant = homeState?.rankingSnapshot?.currentParticipant;

  return `
    <section class="panel home-overview-card">
      <div class="panel__header">
        <p class="panel__label">Ranking rápido</p>
        <a class="btn btn--secondary btn--inline" href="/ranking">Ver ranking</a>
      </div>
      ${
        currentParticipant
          ? `
            <div class="scoreboard">
              <div class="scoreboard__item">
                <span class="scoreboard__label">Posição</span>
                <strong>#${escapeHtml(currentParticipant.rank)}</strong>
              </div>
              <div class="scoreboard__item">
                <span class="scoreboard__label">Pontos</span>
                <strong>${escapeHtml(currentParticipant.points)} pts</strong>
              </div>
            </div>
            <div style="margin-top: 0.75rem">
              <span class="chip ${currentParticipant.statusChip === 'Aguardando início da copa' ? 'chip--danger' : 'chip--accent'}">
                ${escapeHtml(currentParticipant.statusChip || 'Aguardando início da copa')}
              </span>
            </div>
          `
          : renderEmptyState({
              title: 'Ranking pronto',
              body: 'Todo mundo começa com 0 pontos.'
            })
      }
    </section>
  `;
}

function renderIdentityCard(participant, summary) {
  return `
    <section class="panel home-overview-card">
      <div class="panel__header">
        <p class="panel__label">Sua identidade</p>
        <div class="panel-actions">
          <a class="btn btn--secondary btn--inline" href="/regras">Regras</a>
          <button class="btn btn--secondary btn--inline" type="button" data-logout-button>
            Sair
          </button>
        </div>
      </div>
      ${renderParticipantBadge({
        nickname: participant.nickname,
        city: participant.city,
        username: participant.username,
        avatarKey: participant.avatarKey
      })}
      <p class="panel__text">Esta é a sua identidade pública no ranking e nas telas de comparação.</p>
      <div class="chip-row">
        <span class="chip chip--accent">${summary.completedPredictions} preenchidos</span>
        <span class="chip chip--danger">${summary.missingPredictions} pendentes</span>
        <span class="chip">${summary.totalMatches} jogos</span>
      </div>
    </section>
  `;
}

function formatMatchTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function renderDailyPredictionDistribution(homeState) {
  const distribution = homeState?.dailyPredictionDistribution;

  return `
    <section class="panel home-insight-card">
      <div class="panel__header">
        <div>
          <p class="panel__label">Palpites de hoje</p>
          <h2 class="home-insight-card__title">Como a turma está apostando</h2>
        </div>
        <span class="chip">90 minutos</span>
      </div>
      ${
        distribution?.available && distribution.matches?.length
          ? `
            <div class="daily-distribution-list">
              ${distribution.matches
                .map(
                  (match) => `
                    <article class="daily-distribution-match">
                      <div class="daily-distribution-match__header">
                        <strong>${escapeHtml(match.homeTeamName)} x ${escapeHtml(match.awayTeamName)}</strong>
                        <span>${escapeHtml(formatMatchTime(match.kickoffAt))}</span>
                      </div>
                      <div class="daily-distribution-grid">
                        <div class="daily-distribution-option daily-distribution-option--home">
                          <span class="daily-distribution-option__label">${escapeHtml(match.homeTeamName)}</span>
                          <strong>${escapeHtml(match.percentages.homeWin)}%</strong>
                          <span class="daily-distribution-option__bar" style="--distribution-width:${match.percentages.homeWin}%"></span>
                        </div>
                        <div class="daily-distribution-option daily-distribution-option--draw">
                          <span class="daily-distribution-option__label">Empate</span>
                          <strong>${escapeHtml(match.percentages.draw)}%</strong>
                          <span class="daily-distribution-option__bar" style="--distribution-width:${match.percentages.draw}%"></span>
                        </div>
                        <div class="daily-distribution-option daily-distribution-option--away">
                          <span class="daily-distribution-option__label">${escapeHtml(match.awayTeamName)}</span>
                          <strong>${escapeHtml(match.percentages.awayWin)}%</strong>
                          <span class="daily-distribution-option__bar" style="--distribution-width:${match.percentages.awayWin}%"></span>
                        </div>
                      </div>
                      <p class="daily-distribution-match__total">${escapeHtml(match.counts.total)} palpites contabilizados</p>
                    </article>
                  `
                )
                .join('')}
            </div>
          `
          : `
            <div class="home-insight-empty">
              <strong>Distribuição indisponível</strong>
              <span>Ela aparece quando houver jogos no dia e os palpites estiverem travados e revelados.</span>
            </div>
          `
      }
    </section>
  `;
}

function renderExactHitHighlights(homeState) {
  const highlights = homeState?.exactHitHighlights || [];

  return `
    <section class="panel home-insight-card home-insight-card--exact">
      <div class="panel__header">
        <div>
          <p class="panel__label">Acertou na Mosca</p>
          <h2 class="home-insight-card__title">Placares cravados</h2>
        </div>
        <span class="chip chip--accent">Na mosca</span>
      </div>
      ${
        highlights.length
          ? `
            <div class="exact-hit-list">
              ${highlights
                .map(
                  (match) => `
                    <article class="exact-hit-match">
                      <div class="exact-hit-match__score">
                        <span>${escapeHtml(match.homeTeamName)}</span>
                        <strong>${escapeHtml(match.score.home)} x ${escapeHtml(match.score.away)}</strong>
                        <span>${escapeHtml(match.awayTeamName)}</span>
                      </div>
                      <div class="exact-hit-participants" aria-label="Participantes que acertaram o placar">
                        ${match.participants
                          .map(
                            (participant) => `
                              <span class="exact-hit-participant">
                                <strong>${escapeHtml(participant.nickname)}</strong>
                                ${participant.city ? `<small>${escapeHtml(participant.city)}</small>` : ''}
                              </span>
                            `
                          )
                          .join('')}
                      </div>
                    </article>
                  `
                )
                .join('')}
            </div>
          `
          : `
            <div class="home-insight-empty">
              <strong>A primeira mosca ainda está voando</strong>
              <span>Os acertos exatos dos jogos recentes aparecerão aqui.</span>
            </div>
          `
      }
    </section>
  `;
}

function renderHomeInsights(homeState) {
  return `
    <div class="home-insights-grid">
      ${renderDailyPredictionDistribution(homeState)}
      ${renderExactHitHighlights(homeState)}
    </div>
  `;
}

function renderActivePredictionPage(state, participant) {
  const predictionState = state.activePrediction;
  const phase = predictionState?.phase;
  const homeState = state.homeState;

  if (!phase) {
    return `
      ${renderParticipantNav('home')}
      <section class="panel panel--span-12">
        ${renderStatusMessage({
          tone: state.predictionLoadError ? 'danger' : 'warning',
          title: state.predictionLoadError ? 'Não foi possível carregar os palpites' : 'Nenhuma fase ativa no momento',
          body: state.predictionLoadError || 'Assim que o admin abrir uma fase, seus palpites vão aparecer aqui.'
        })}
      </section>
      ${renderHomeInsights(homeState)}
      <section class="panel panel--span-12">
        ${renderEmptyState({
          title: 'Palpites aguardando fase aberta',
          body: 'Quando a janela de palpites estiver aberta, você verá a lista de jogos da fase ativa e poderá salvar por grupo.'
        })}
      </section>
    `;
  }

  const activeGroupCode = state.predictionUi.activeGroupCode;
  const groups = [...(predictionState.groups || [])].sort((left, right) =>
    String(left.code).localeCompare(String(right.code), 'pt-BR', { numeric: true, sensitivity: 'base' })
  );
  const activeGroup =
    groups.find((group) => group.code === activeGroupCode) || groups[0] || {
      code: 'all',
      label: phase.name,
      matches: predictionState.matches || []
    };
  const summary = predictionState.summary || {
    totalMatches: 0,
    completedPredictions: 0,
    missingPredictions: 0,
    completionPercent: 0
  };
  const statusTone =
    state.predictionSaveState.status === 'error'
      ? 'danger'
      : state.predictionSaveState.status === 'saving'
        ? 'warning'
        : 'success';
  const statusTitle =
    state.predictionSaveState.status === 'error'
      ? 'Falha ao salvar'
      : state.predictionSaveState.status === 'saving'
        ? 'Salvando'
        : 'Estado dos palpites';
  const statusBody =
    state.predictionSaveState.message ||
    (phase.windowState === 'open'
      ? 'Preencha os jogos, navegue entre os grupos e a tela salva sozinha quando possível.'
      : 'A fase está travada para leitura.');

  const content = `
    ${renderParticipantNav('home')}
    <section class="hero hero--participant">
      <div class="home-overview-frame">
        <div class="home-overview-grid">
          ${renderPhaseOverviewCard(state, phase, summary, homeState?.attention)}
          ${renderRankingQuickCard(homeState)}
          ${renderIdentityCard(participant, summary)}
        </div>
      </div>
    </section>

    ${renderHomeInsights(homeState)}

    ${
      predictionState.canEdit
        ? `
    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">Palpites da fase</p>
        <span class="chip chip--accent">${summary.completionPercent}% pronto</span>
      </div>
      ${renderStatusMessage({
        tone: statusTone,
        title: statusTitle,
        body: statusBody
      })}
      <div style="height: 0.9rem"></div>
      ${renderPredictionTabs(groups, activeGroup.code)}
      <div style="height: 0.9rem"></div>
      <form class="auth-form" data-predictions-form novalidate>
        ${renderGroupBlock(state, activeGroup)}
        ${renderKnockoutSimulation(state)}
        ${renderExtraPredictions(state, phase.windowState !== 'open')}
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${phase.windowState !== 'open' ? 'disabled' : ''}>
            ${phase.windowState === 'open' ? 'Salvar palpites' : 'Palpites travados'}
          </button>
          <p class="form-note">
            Se o participante não preencher um jogo, o sistema considera 0x0 quando a janela fechar. Os placares sempre consideram o resultado dos 90 minutos de jogo.
          </p>
        </div>
      </form>
    </section>
    `
        : ''
    }
  `;

  return renderAppShell({
    eyebrow: BRAND_LABEL,
    title: `Bem-vindo de volta, ${participant.nickname}`,
    lead: 'A sua área já está pronta para a fase ativa de palpites, com tabs por grupo, autosave e o aviso do 0x0 para jogos em branco.',
    content,
    footer: 'A área do participante já conversa com a fase ativa e com o fechamento da janela de palpites.',
    variant: 'participant'
  });
}

export function renderHomePage(state) {
  const participant = state.sessionParticipant;

  if (!participant) {
    return renderAppShell({
      eyebrow: BRAND_LABEL,
      title: 'Participante',
      lead: 'Faça login para acessar seus palpites.',
      content: `
        <section class="panel panel--span-12">
          ${renderEmptyState({
            title: 'Sessão do participante indisponível',
            body: 'Entre com seu e-mail e senha para acessar a fase ativa.'
          })}
        </section>
      `,
      footer: 'Sessão do participante controlada pelo servidor.',
      variant: 'participant'
    });
  }

  return renderActivePredictionPage(state, participant);
}
