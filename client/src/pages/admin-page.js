import { renderAppShell } from '../components/app-shell.js';
import { renderEmptyState } from '../components/empty-state.js';
import { renderFormField } from '../components/form-field.js';
import { renderStatusMessage } from '../components/status-message.js';
import { escapeHtml } from '../utils/escape-html.js';
import { formatBytes, formatDurationSeconds } from '../utils/formatters.js';

const BRAND_LABEL = 'BOLÃO DA COPA 2026 - AMIGOS DA VILA OLÍMPIA';

function renderSelectField({
  id,
  name,
  label,
  value = '',
  options = [],
  helpText = '',
  errors = [],
  disabled = false
}) {
  const errorClass = errors.length ? ' field--error' : '';

  return `
    <label class="field${errorClass}" for="${id}">
      <span class="field__label">${escapeHtml(label)}<span aria-hidden="true">*</span></span>
      <select
        id="${id}"
        name="${name}"
        data-admin-input
        ${disabled ? 'disabled' : ''}
        aria-invalid="${errors.length ? 'true' : 'false'}"
      >
        ${options
          .map((option) => `
            <option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>
              ${escapeHtml(option.label)}
            </option>
          `)
          .join('')}
      </select>
      ${helpText ? `<span class="field__hint">${escapeHtml(helpText)}</span>` : ''}
      ${errors.length ? `<p class="field__error">${escapeHtml(errors[0])}</p>` : ''}
    </label>
  `;
}

function renderCheckboxField({ id, name, label, checked = false, helpText = '', disabled = false }) {
  return `
    <label class="field field--checkbox" for="${id}">
      <span class="field__checkbox-control">
        <input
          id="${id}"
          name="${name}"
          type="checkbox"
          data-admin-input
          ${checked ? 'checked' : ''}
          ${disabled ? 'disabled' : ''}
        />
        <span class="field__checkbox-box" aria-hidden="true"></span>
        <span class="field__checkbox-text">${escapeHtml(label)}</span>
      </span>
      ${helpText ? `<span class="field__hint">${escapeHtml(helpText)}</span>` : ''}
    </label>
  `;
}

function collectTeamOptions(matches = []) {
  const teams = new Map();

  matches.forEach((match) => {
    [
      { code: match.homeTeamCode, name: match.homeTeamName },
      { code: match.awayTeamCode, name: match.awayTeamName }
    ].forEach((team) => {
      const code = String(team.code || '').trim();
      const name = String(team.name || '').trim();

      if (!code || !name || teams.has(code)) {
        return;
      }

      teams.set(code, { code, name });
    });
  });

  return Array.from(teams.values()).sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

function mergeTeamOptions(...optionGroups) {
  const teams = new Map();

  optionGroups.flat().forEach((team) => {
    const code = String(team?.code || '').trim();
    if (!code || teams.has(code)) {
      return;
    }

    teams.set(code, {
      code,
      name: String(team.name || code).trim()
    });
  });

  return Array.from(teams.values()).sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

function renderTeamSelectField({ id, name, label, value = '', options = [], disabled = false }) {
  return `
    <label class="field prediction-entry-team" for="${id}">
      <span class="field__label">${escapeHtml(label)}<span aria-hidden="true">*</span></span>
      <select id="${id}" name="${name}" data-admin-input ${disabled ? 'disabled' : ''} required>
        <option value="">Selecione uma seleção</option>
        ${options
          .map(
            (option) => `
              <option value="${escapeHtml(option.code)}" ${String(option.code) === String(value) ? 'selected' : ''}>
                ${escapeHtml(option.name)}
              </option>
            `
          )
          .join('')}
      </select>
    </label>
  `;
}

function renderSummaryCards(summary = {}) {
  const cards = [
    { label: 'Fases', value: summary.phaseCount ?? 0 },
    { label: 'Jogos', value: summary.matchCount ?? 0 },
    { label: 'Fases abertas', value: summary.openPhaseCount ?? 0 },
    { label: 'Fases bloqueadas', value: summary.lockedPhaseCount ?? 0 }
  ];

  return `
    <div class="admin-summary-grid">
      ${cards
        .map(
          (card) => `
            <section class="panel admin-summary-card">
              <p class="panel__label">${escapeHtml(card.label)}</p>
              <strong class="admin-summary-card__value">${escapeHtml(card.value)}</strong>
            </section>
          `
        )
        .join('')}
    </div>
  `;
}

function renderMonitoringPanel(state) {
  const snapshot = state.monitoringSnapshot;
  const metricsCards = snapshot
    ? [
        { label: 'Tempo ligado', value: formatDurationSeconds(snapshot.uptimeSeconds) },
        { label: 'Memória', value: formatBytes(snapshot.memoryBytes) },
        { label: 'Heap', value: formatBytes(snapshot.heapBytes) },
        { label: 'Em andamento', value: String(snapshot.inFlightRequests || 0) },
        { label: 'Requisições', value: String(snapshot.totalRequests || 0) },
        { label: 'Erros 5xx', value: String(snapshot.totalErrors || 0) }
      ]
    : [];

  return `
    <section class="panel panel--span-12" id="admin-monitoring">
      <div class="panel__header">
        <p class="panel__label">Monitoramento</p>
        <span class="chip chip--accent">Sem Docker</span>
      </div>
      ${state.monitoringLoadError
        ? renderStatusMessage({
            tone: 'danger',
            title: 'Falha ao carregar métricas',
            body: state.monitoringLoadError
          })
        : ''}
      ${snapshot
        ? `
          <div class="monitoring-grid">
            ${metricsCards
              .map(
                (card) => `
                  <section class="panel monitoring-card">
                    <p class="panel__label">${escapeHtml(card.label)}</p>
                    <strong class="monitoring-card__value">${escapeHtml(card.value)}</strong>
                  </section>
                `
              )
              .join('')}
          </div>
          <div style="height: 1rem"></div>
          <div class="monitoring-route-panel">
            <div class="panel__header">
              <p class="panel__label">Rotas mais acessadas</p>
              <span class="chip">Atualizado às ${escapeHtml(new Date(snapshot.generatedAt).toLocaleTimeString('pt-BR'))}</span>
            </div>
            ${
              snapshot.routes.length
                ? `
                  <table class="ranking-table">
                    <thead>
                      <tr>
                        <th>Rota</th>
                        <th>Requisições</th>
                        <th>Erros</th>
                        <th>Taxa de erro</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${snapshot.routes
                        .map((route) => {
                          const errorRate = route.requests ? Math.round((route.errors / route.requests) * 100) : 0;
                          return `
                            <tr>
                              <td>${escapeHtml(route.route)}</td>
                              <td>${escapeHtml(String(route.requests))}</td>
                              <td>${escapeHtml(String(route.errors))}</td>
                              <td>${escapeHtml(String(errorRate))}%</td>
                            </tr>
                          `;
                        })
                        .join('')}
                    </tbody>
                  </table>
                `
                : renderEmptyState({
                    title: 'Ainda sem tráfego relevante',
                    body: 'Quando o servidor receber requisições, as rotas mais acessadas aparecem aqui.'
                  })
            }
            <div class="monitoring-note">
              <span class="chip ${snapshot.p95LatencySeconds !== null ? 'chip--accent' : 'chip--muted'}">
                p95 ${snapshot.p95LatencySeconds === null ? 'indisponível' : `${formatDurationSeconds(snapshot.p95LatencySeconds)}`}
              </span>
              <span class="chip chip--muted">
                Atualiza automaticamente enquanto o painel estiver aberto
              </span>
            </div>
          </div>
        `
        : renderEmptyState({
            title: 'Monitoramento carregando',
            body: 'As métricas do backend aparecem aqui assim que o painel consulta o endpoint /api/metrics.'
          })}
    </section>
  `;
}

function renderRegistrationControl(state) {
  return `
    <section class="panel panel--span-6">
      <div class="panel__header">
        <p class="panel__label">Cadastro</p>
        <span class="chip chip--accent">${state.registrationOpen ? 'Aberto' : 'Fechado'}</span>
      </div>
      <form class="auth-form" data-admin-registration-form>
        ${renderSelectField({
          id: 'admin-registration-state',
          name: 'isRegistrationOpen',
          label: 'Estado do cadastro',
          value: state.adminForms.registrationState ? 'true' : 'false',
          options: [
            { value: 'true', label: 'Aberto' },
            { value: 'false', label: 'Fechado' }
          ],
          helpText: 'O login dos participantes segue disponível mesmo quando o cadastro estiver fechado.'
        })}
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${state.isSavingRegistration ? 'disabled' : ''}>
            ${state.isSavingRegistration ? 'Salvando...' : 'Salvar cadastro'}
          </button>
        </div>
      </form>
    </section>
  `;
}

function formatKickoffDate(value) {
  if (!value) {
    return '-';
  }

  return String(value).replace('T', ' ').slice(0, 16);
}

function buildMatchFilterOptions(matches = [], phases = []) {
  const groupCodes = Array.from(new Set(matches.map((match) => match.groupCode).filter(Boolean))).sort((left, right) =>
    String(left).localeCompare(String(right))
  );

  return {
    phases,
    groupCodes
  };
}

function filterMatches(matches = [], filters = {}) {
  return matches.filter((match) => {
    const phaseMatch =
      filters.phaseId && filters.phaseId !== 'all' ? String(match.phaseId) === String(filters.phaseId) : true;
    const groupMatch =
      filters.groupCode && filters.groupCode !== 'all' ? String(match.groupCode || '') === String(filters.groupCode) : true;
    return phaseMatch && groupMatch;
  });
}

function renderPhaseForm(state) {
  const editing = Boolean(state.adminForms.phaseId);
  const showMatchCount = state.adminForms.phase.stageType === 'knockout';

  return `
    <section class="panel panel--span-6">
      <div class="panel__header">
        <p class="panel__label">Fases</p>
        <span class="chip">${editing ? 'Editando' : 'Nova fase'}</span>
      </div>
      <form class="auth-form" data-admin-phase-form>
        ${state.adminPhaseFormError
          ? renderStatusMessage({
              tone: 'danger',
              title: 'Falha ao salvar fase',
              body: state.adminPhaseFormError
            })
          : ''}
        ${renderFormField({
          id: 'phase-code',
          name: 'code',
          label: 'Código',
          value: state.adminForms.phase.code,
          placeholder: 'group-stage',
          helpText: 'Chave única da fase, usada internamente.',
          disabled: state.isSavingPhase
        })}
        ${renderFormField({
          id: 'phase-name',
          name: 'name',
          label: 'Nome',
          value: state.adminForms.phase.name,
          placeholder: 'Fase de Grupos',
          helpText: 'Nome exibido no painel do admin.',
          disabled: state.isSavingPhase
        })}
        ${renderSelectField({
          id: 'phase-stage-type',
          name: 'stageType',
          label: 'Tipo',
          value: state.adminForms.phase.stageType,
          options: [
            { value: 'group', label: 'Grupo' },
            { value: 'knockout', label: 'Mata-mata' }
          ],
          helpText: 'Define o formato da janela de palpites.'
        })}
        ${renderFormField({
          id: 'phase-group-code',
          name: 'groupCode',
          label: 'Grupo',
          value: state.adminForms.phase.groupCode,
          placeholder: 'A',
          required: false,
          helpText: 'Use apenas para a fase de grupos.',
          disabled: state.isSavingPhase
        })}
        ${renderFormField({
          id: 'phase-round-label',
          name: 'roundLabel',
          label: 'Rótulo da rodada',
          value: state.adminForms.phase.roundLabel,
          placeholder: 'Oitavas de final',
          required: false,
          disabled: state.isSavingPhase
        })}
        ${showMatchCount
          ? renderFormField({
              id: 'phase-match-count',
              name: 'matchCount',
              label: 'Quantidade de jogos',
              type: 'number',
              value: state.adminForms.phase.matchCount === '' ? '' : String(state.adminForms.phase.matchCount),
              placeholder: '4',
              required: false,
              helpText: 'Use esse campo para fases de mata-mata.',
              disabled: state.isSavingPhase
            })
          : ''}
        ${renderFormField({
          id: 'phase-sort-order',
          name: 'sortOrder',
          label: 'Ordem',
          type: 'number',
          value: String(state.adminForms.phase.sortOrder),
          placeholder: '0',
          required: false,
          disabled: state.isSavingPhase
        })}
        ${renderSelectField({
          id: 'phase-window-state',
          name: 'windowState',
          label: 'Janela',
          value: state.adminForms.phase.windowState,
          options: [
            { value: 'closed', label: 'Fechada' },
            { value: 'open', label: 'Aberta' },
            { value: 'locked', label: 'Travada' }
          ],
          helpText: 'Controla a disponibilidade dos palpites.'
        })}
        ${renderFormField({
          id: 'phase-deadline',
          name: 'deadlineAt',
          label: 'Deadline',
          type: 'datetime-local',
          value: state.adminForms.phase.deadlineAt,
          required: false,
          disabled: state.isSavingPhase
        })}
        ${renderCheckboxField({
          id: 'phase-reveal',
          name: 'revealEnabled',
          label: 'Predições reveladas',
          checked: Boolean(state.adminForms.phase.revealEnabled),
          helpText: 'Permite a visualização dos palpites travados.'
        })}
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${state.isSavingPhase ? 'disabled' : ''}>
            ${state.isSavingPhase ? 'Salvando...' : editing ? 'Atualizar fase' : 'Criar fase'}
          </button>
          ${editing ? `<button class="btn btn--secondary" type="button" data-admin-phase-cancel>Cancelar edição</button>` : ''}
        </div>
      </form>
    </section>
  `;
}

function renderMatchForm(state) {
  const editing = Boolean(state.adminForms.matchId);
  const teamOptions = collectTeamOptions(state.adminOverview?.matches || []);
  const useTeamCombobox = true;

  return `
    <section class="panel panel--span-12 match-gabarito-card">
      <div class="panel__header">
        <p class="panel__label">Gabarito</p>
        <span class="chip">${editing ? 'Editando' : 'Novo jogo'}</span>
      </div>
      <form class="auth-form" data-admin-match-form>
        ${state.adminMatchFormError
          ? renderStatusMessage({
              tone: 'danger',
              title: 'Falha ao salvar jogo',
              body: state.adminMatchFormError
            })
          : ''}
        ${renderSelectField({
          id: 'match-phase',
          name: 'phaseId',
          label: 'Fase',
          value: String(state.adminForms.match.phaseId),
          options: state.adminOverview?.phases?.map((phase) => ({
            value: String(phase.id),
            label: `${phase.name} (${phase.code})`
          })) || [],
          helpText: 'Selecione a fase associada ao jogo.'
        })}
        <div class="match-editor-grid">
          ${renderFormField({
            id: 'match-code',
            name: 'matchCode',
            label: 'Código do jogo',
            value: state.adminForms.match.matchCode,
            placeholder: 'group-a-01',
            disabled: state.isSavingMatch
          })}
          ${renderFormField({
            id: 'match-group',
            name: 'groupCode',
            label: 'Grupo',
            value: state.adminForms.match.groupCode,
            placeholder: 'A',
            required: false,
            disabled: state.isSavingMatch
          })}
          ${renderFormField({
            id: 'match-order',
            name: 'matchOrder',
            label: 'Ordem',
            type: 'number',
            value: String(state.adminForms.match.matchOrder),
            required: false,
            disabled: state.isSavingMatch
          })}
        </div>
        <div class="match-result-grid">
          ${useTeamCombobox
            ? renderTeamSelectField({
                id: 'match-home-team',
                name: 'homeTeamCode',
                label: 'Seleção 1',
                value: state.adminForms.match.homeTeamCode,
                options: teamOptions,
                disabled: state.isSavingMatch
              })
            : `
          <label class="field prediction-entry-team">
            <span class="field__label">Seleção 1<span aria-hidden="true">*</span></span>
            <input
              id="match-home-team"
              name="homeTeamName"
              data-admin-input
              type="text"
              value="${escapeHtml(state.adminForms.match.homeTeamName)}"
              placeholder="Brasil"
              ${state.isSavingMatch ? 'disabled' : ''}
              required
            />
            <span class="field__hint">Cadastre ou importe os jogos da fase de grupos para liberar a lista de seleções.</span>
          </label>
            `}
          <label class="field prediction-entry-score">
            <span class="field__label">Placar 1</span>
            <input
              id="match-result-home"
              name="resultHomeScore"
              data-admin-input
              type="number"
              min="0"
              value="${state.adminForms.match.resultHomeScore === '' ? '' : escapeHtml(String(state.adminForms.match.resultHomeScore))}"
              ${state.isSavingMatch ? 'disabled' : ''}
            />
          </label>
          <div class="prediction-entry-vs" aria-hidden="true">X</div>
          <label class="field prediction-entry-score">
            <span class="field__label">Placar 2</span>
            <input
              id="match-result-away"
              name="resultAwayScore"
              data-admin-input
              type="number"
              min="0"
              value="${state.adminForms.match.resultAwayScore === '' ? '' : escapeHtml(String(state.adminForms.match.resultAwayScore))}"
              ${state.isSavingMatch ? 'disabled' : ''}
            />
          </label>
          ${useTeamCombobox
            ? renderTeamSelectField({
                id: 'match-away-team',
                name: 'awayTeamCode',
                label: 'Seleção 2',
                value: state.adminForms.match.awayTeamCode,
                options: teamOptions,
                disabled: state.isSavingMatch
              })
            : `
          <label class="field prediction-entry-team">
            <span class="field__label">Seleção 2<span aria-hidden="true">*</span></span>
            <input
              id="match-away-team"
              name="awayTeamName"
              data-admin-input
              type="text"
              value="${escapeHtml(state.adminForms.match.awayTeamName)}"
              placeholder="Estados Unidos"
              ${state.isSavingMatch ? 'disabled' : ''}
              required
            />
            <span class="field__hint">Cadastre ou importe os jogos da fase de grupos para liberar a lista de seleções.</span>
          </label>
            `}
        </div>
        <div class="match-editor-grid match-editor-grid--compact">
          <label class="field">
            <span class="field__label">Data<span aria-hidden="true">*</span></span>
            <input
              id="match-kickoff-date"
              name="kickoffDate"
              data-admin-input
              type="date"
              value="${escapeHtml(state.adminForms.match.kickoffDate)}"
              ${state.isSavingMatch ? 'disabled' : ''}
              required
            />
          </label>
          <label class="field">
            <span class="field__label">Hora<span aria-hidden="true">*</span></span>
            <input
              id="match-kickoff-time"
              name="kickoffTime"
              data-admin-input
              type="time"
              value="${escapeHtml(state.adminForms.match.kickoffTime)}"
              ${state.isSavingMatch ? 'disabled' : ''}
              required
            />
          </label>
          ${renderFormField({
            id: 'match-venue',
            name: 'venue',
            label: 'Estádio',
            value: state.adminForms.match.venue,
            placeholder: 'MetLife Stadium',
            required: false,
            disabled: state.isSavingMatch
          })}
        </div>
        ${renderCheckboxField({
          id: 'match-played',
          name: 'isPlayed',
          label: 'Jogo realizado',
          checked: Boolean(state.adminForms.match.isPlayed),
          helpText: 'Marque quando o jogo já tiver sido realizado e o placar oficial estiver confirmado.',
          disabled: state.isSavingMatch
        })}
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${state.isSavingMatch ? 'disabled' : ''}>
            ${state.isSavingMatch ? 'Salvando...' : editing ? 'Atualizar jogo' : 'Criar jogo'}
          </button>
          ${editing ? `<button class="btn btn--secondary" type="button" data-admin-match-cancel>Cancelar edição</button>` : ''}
        </div>
      </form>
    </section>
  `;
}

function renderSemifinalAnswerKeyForm(state) {
  const savedAnswerKey = state.adminSavedAnswerKey || {};
  const answerKey = state.adminForms.semifinalAnswerKey || {};
  const savedTeams = savedAnswerKey.teams || [];
  const savedTeamCodes = savedAnswerKey.teamCodes || ['', '', '', ''];
  const formTeams = (answerKey.teamCodes || [])
    .filter(Boolean)
    .map((code) => ({ code, name: code }));
  const teamOptions = mergeTeamOptions(
    collectTeamOptions(state.adminOverview?.matches || []),
    savedTeams,
    formTeams
  );
  const teamCodes = answerKey.teamCodes || ['', '', '', ''];
  const championFallback = savedAnswerKey.championTeamCode
    ? [{ code: savedAnswerKey.championTeamCode, name: savedAnswerKey.championTeamName || savedAnswerKey.championTeamCode }]
    : [];
  const championOptions = mergeTeamOptions(
    savedTeamCodes.map((code) => teamOptions.find((team) => team.code === code)).filter(Boolean),
    championFallback
  );
  const isSavingAnswerKey = state.isSavingSemifinalAnswerKey || state.isSavingFinalAnswerKey;

  return `
    <div class="extra-answer-key-cards">
    <section class="panel semifinal-answer-key-card">
      <div class="panel__header">
        <div>
          <p class="panel__label">Semifinalistas</p>
          <p class="semifinal-answer-key-card__help">Salve assim que as quatro selecoes forem conhecidas.</p>
        </div>
        <span class="chip">Ate 20 pontos</span>
      </div>
      <form class="auth-form" data-admin-semifinal-answer-key-form>
        ${state.adminSemifinalAnswerKeyMessage
          ? renderStatusMessage(state.adminSemifinalAnswerKeyMessage)
          : ''}
        <div class="semifinal-answer-key-grid">
          ${teamCodes.map((code, index) => renderTeamSelectField({
            id: `semifinal-answer-key-${index + 1}`,
            name: `teamCode${index + 1}`,
            label: `Semifinalista ${index + 1} - 5 pts`,
            value: code,
            options: teamOptions,
            disabled: isSavingAnswerKey
          }).replace('data-admin-input', `data-admin-input data-semifinal-index="${index}"`)).join('')}
        </div>
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${isSavingAnswerKey || teamOptions.length < 4 ? 'disabled' : ''}>
            ${state.isSavingSemifinalAnswerKey ? 'Salvando e pontuando...' : 'Salvar semifinalistas'}
          </button>
        </div>
      </form>
    </section>
    <section class="panel semifinal-answer-key-card">
      <div class="panel__header">
        <div>
          <p class="panel__label">Resultado final</p>
          <p class="semifinal-answer-key-card__help">Informe campeao e artilheiro depois de salvar os semifinalistas.</p>
        </div>
        <span class="chip">Ate 25 pontos</span>
      </div>
      <form class="auth-form" data-admin-final-answer-key-form>
        ${state.adminFinalAnswerKeyMessage ? renderStatusMessage(state.adminFinalAnswerKeyMessage) : ''}
        <div class="semifinal-answer-key-grid">
          ${renderTeamSelectField({
            id: 'extra-answer-key-champion',
            name: 'championTeamCode',
            label: 'Campeao da Copa - 10 pts',
            value: answerKey.championTeamCode || '',
            options: championOptions,
            disabled: isSavingAnswerKey
          })}
          ${renderFormField({
            id: 'extra-answer-key-scorer',
            name: 'topScorerName',
            label: 'Artilheiro - 10 pts',
            value: answerKey.topScorerName || '',
            placeholder: 'Nome oficial do jogador',
            disabled: isSavingAnswerKey
          })}
          ${renderFormField({
            id: 'extra-answer-key-goals',
            name: 'topScorerGoals',
            label: 'Gols do artilheiro - 5 pts',
            type: 'number',
            value: answerKey.topScorerGoals ?? '',
            disabled: isSavingAnswerKey
          })}
        </div>
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${isSavingAnswerKey || savedTeamCodes.some((code) => !code) ? 'disabled' : ''}>
            ${state.isSavingFinalAnswerKey ? 'Salvando e pontuando...' : 'Salvar resultado final'}
          </button>
        </div>
      </form>
    </section>
    </div>
  `;
}

function renderPhasesTable(phases = []) {
  if (!phases.length) {
    return renderEmptyState({
      title: 'Nenhuma fase criada ainda',
      body: 'Use o formulário acima para criar a primeira fase da competição.'
    });
  }

  return `
    <table class="ranking-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Jogos</th>
          <th>Janela</th>
          <th>Deadline</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${phases
          .map(
            (phase) => `
              <tr>
                <td>${escapeHtml(phase.code)}</td>
                <td>${escapeHtml(phase.name)}</td>
                <td>${escapeHtml(phase.stageType)}</td>
                <td>${phase.matchCount === null || phase.matchCount === undefined ? '-' : escapeHtml(String(phase.matchCount))}</td>
                <td>${escapeHtml(phase.windowState)}</td>
                <td>${phase.deadlineAt ? escapeHtml(String(phase.deadlineAt)) : '-'}</td>
                <td>
                  <button class="btn btn--secondary btn--inline" type="button" data-admin-edit-phase="${phase.id}">
                    Editar
                  </button>
                </td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function renderMatchFilters(state) {
  const { phases, groupCodes } = buildMatchFilterOptions(state.adminOverview?.matches || [], state.adminOverview?.phases || []);

  return `
    <div class="match-filters">
      ${renderSelectField({
        id: 'match-filter-phase',
        name: 'phaseId',
        label: 'Filtrar por fase',
        value: state.adminMatchFilters.phaseId,
        options: [
          { value: 'all', label: 'Todas as fases' },
          ...phases.map((phase) => ({ value: String(phase.id), label: phase.name }))
        ],
        helpText: 'Mostra apenas os jogos da fase escolhida.'
      })}
      ${renderSelectField({
        id: 'match-filter-group',
        name: 'groupCode',
        label: 'Filtrar por grupo',
        value: state.adminMatchFilters.groupCode,
        options: [
          { value: 'all', label: 'Todos os grupos' },
          ...groupCodes.map((groupCode) => ({ value: String(groupCode), label: `Grupo ${groupCode}` }))
        ],
        helpText: 'Ajuda a achar rapidamente o bloco de jogos.'
      })}
    </div>
  `;
}

function renderMatchesTable(matches = []) {
  if (!matches.length) {
    return renderEmptyState({
      title: 'Nenhum jogo cadastrado ainda',
      body: 'Use o formulário acima para cadastrar os jogos da fase ativa.'
    });
  }

  return `
    <table class="ranking-table">
      <thead>
        <tr>
          <th>Fase</th>
          <th>Jogo</th>
          <th>Grupo</th>
          <th>Data</th>
          <th>Hora</th>
          <th>Placar</th>
          <th>Realizado</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${matches
          .map(
            (match) => `
              <tr>
                <td>${escapeHtml(match.phaseName)}</td>
                <td>${escapeHtml(match.homeTeamName)} x ${escapeHtml(match.awayTeamName)}</td>
                <td>${match.groupCode ? escapeHtml(match.groupCode) : '-'}</td>
                <td>${escapeHtml(formatKickoffDate(match.kickoffAt).slice(0, 10))}</td>
                <td>${escapeHtml(formatKickoffDate(match.kickoffAt).slice(11, 16))}</td>
                <td>${match.resultHomeScore !== null && match.resultHomeScore !== undefined && match.resultAwayScore !== null && match.resultAwayScore !== undefined ? `${escapeHtml(String(match.resultHomeScore))} x ${escapeHtml(String(match.resultAwayScore))}` : '-'}</td>
                <td>${match.isPlayed ? 'Sim' : 'Não'}</td>
                <td>${escapeHtml(match.isPlayed ? 'completed' : match.status || 'scheduled')}</td>
                <td>
                  <button class="btn btn--secondary btn--inline" type="button" data-admin-edit-match="${match.id}">
                    Editar
                  </button>
                </td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function renderParticipantPasswordReset(state) {
  const participants = state.adminOverview?.participants || [];
  const resetResult = state.adminPasswordResetResult;

  return `
    <section class="panel panel--span-12">
      <div class="section-title">
        <h2>Acesso dos participantes</h2>
        <p>Gere uma nova senha temporÃ¡ria quando alguÃ©m esquecer o acesso.</p>
      </div>
      ${state.adminPasswordResetError
        ? renderStatusMessage({
            tone: 'danger',
            title: 'Falha ao gerar senha',
            body: state.adminPasswordResetError
          })
        : ''}
      ${resetResult
        ? `
          <div class="admin-password-result">
            <div>
              <p class="panel__label">Senha temporÃ¡ria gerada</p>
              <h3>${escapeHtml(resetResult.participant?.nickname || resetResult.participant?.username || 'Participante')}</h3>
              <p class="panel__text">${escapeHtml(resetResult.participant?.username || '')}</p>
            </div>
            <code>${escapeHtml(resetResult.temporaryPassword)}</code>
          </div>
        `
        : renderStatusMessage({
            tone: 'neutral',
            title: 'SeguranÃ§a',
            body: 'A senha atual nÃ£o pode ser visualizada porque fica protegida por hash. O admin pode gerar uma nova senha e enviÃ¡-la ao participante.'
          })}
      <div style="height: 1rem"></div>
      ${participants.length
        ? `
          <table class="ranking-table">
            <thead>
              <tr>
                <th>Participante</th>
                <th>E-mail</th>
                <th>Cidade</th>
                <th>AÃ§Ã£o</th>
              </tr>
            </thead>
            <tbody>
              ${participants
                .map(
                  (participant) => `
                    <tr>
                      <td>${escapeHtml(participant.nickname)}</td>
                      <td>${escapeHtml(participant.username)}</td>
                      <td>${participant.city ? escapeHtml(participant.city) : '-'}</td>
                      <td>
                        <button
                          class="btn btn--secondary btn--inline"
                          type="button"
                          data-admin-reset-password="${escapeHtml(participant.id)}"
                          ${state.isResettingParticipantPassword ? 'disabled' : ''}
                        >
                          ${
                            state.resettingParticipantId === participant.id
                              ? 'Gerando...'
                              : 'Gerar senha'
                          }
                        </button>
                      </td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        `
        : renderEmptyState({
            title: 'Nenhum participante cadastrado',
            body: 'Quando os participantes se registrarem, eles aparecerÃ£o aqui para suporte de acesso.'
          })}
    </section>
  `;
}

export function renderAdminLoginPage(state) {
  const content = `
    <section class="panel panel--span-12">
      ${renderStatusMessage({
        tone: state.connection === 'offline' ? 'danger' : 'neutral',
        title: state.connection === 'offline' ? 'API indisponível' : 'Área administrativa',
        body: state.connection === 'offline'
          ? state.banner?.body || 'O backend não está acessível agora.'
          : 'Use o login de administrador para abrir o painel de setup.'
      })}
    </section>

    <section class="panel panel--span-6">
      <div class="panel__header">
        <p class="panel__label">Admin</p>
        <span class="chip chip--accent">Protegido</span>
      </div>
      <form class="auth-form" data-admin-login-form novalidate>
        ${state.adminLoginFormError
          ? renderStatusMessage({
              tone: 'danger',
              title: 'Falha no login',
              body: state.adminLoginFormError
            })
          : ''}
        ${renderFormField({
          id: 'admin-username',
          name: 'username',
          label: 'Usuário',
          value: state.adminLoginForm.username,
          placeholder: 'admin@bolao.local',
          autoComplete: 'username',
          disabled: state.isAdminLoggingIn
        })}
        ${renderFormField({
          id: 'admin-password',
          name: 'password',
          label: 'Senha',
          type: 'password',
          value: state.adminLoginForm.password,
          placeholder: 'Senha de administrador',
          autoComplete: 'current-password',
          disabled: state.isAdminLoggingIn
        })}
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${state.isAdminLoggingIn ? 'disabled' : ''}>
            ${state.isAdminLoggingIn ? 'Entrando...' : 'Entrar no admin'}
          </button>
        </div>
      </form>
    </section>

    <section class="panel panel--span-6">
      ${renderEmptyState({
        title: 'Somente o admin acessa este painel',
        body: 'Aqui ficam as histórias de setup da competição: cadastro, fases, janelas e jogos.'
      })}
    </section>
  `;

  return renderAppShell({
    eyebrow: BRAND_LABEL,
    title: 'Administração da competição',
    lead: 'O painel de admin concentra as decisões operacionais da competição e deixa o lançamento rápido de manter.',
    content,
    footer: 'Login de administrador protegido por sessão.',
  });
}

export function renderAdminDashboardPage(state) {
  const overview = state.adminOverview || { summary: {}, phases: [], matches: [] };
  const filteredMatches = filterMatches(overview.matches, state.adminMatchFilters);
  const content = `
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-copy">
          ${renderStatusMessage({
            tone: 'success',
            title: 'Admin autenticado',
            body: 'Você está no painel de setup da competição. Aqui ficam registro, fases, janelas e jogos.'
          })}
          ${renderSummaryCards(overview.summary)}
        </div>
        <div class="hero-status">
          <section class="panel">
            <div class="panel__header">
              <p class="panel__label">Sessão admin</p>
              <button class="btn btn--secondary btn--inline" type="button" data-admin-logout-button>
                Sair
              </button>
            </div>
            ${renderEmptyState({
              title: state.adminSession?.username || 'Administrador',
              body: 'A sessão atual controla toda a operação do setup.'
            })}
          </section>
        </div>
      </div>
    </section>

    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">Operação</p>
        <span class="chip chip--accent">Funcional</span>
      </div>
      <div class="two-up">
        ${renderRegistrationControl(state)}
        <section class="panel">
          ${renderStatusMessage({
            tone: 'neutral',
            title: 'Resumo do setup',
            body: 'Use os formulários abaixo para criar ou ajustar fases e jogos. O layout é direto para acelerar o trabalho do admin.'
          })}
        </section>
      </div>
    </section>

    <section class="panel panel--span-12">
      <div class="section-title">
        <h2>Fases</h2>
        <p>Cadastro e janela de palpites.</p>
      </div>
      <div class="two-up">
        ${renderPhaseForm(state)}
      </div>
      <div style="height: 1rem"></div>
      ${renderPhasesTable(overview.phases)}
    </section>

    ${renderParticipantPasswordReset(state)}

    ${renderMonitoringPanel(state)}

    <section class="panel panel--span-12" id="admin-gabarito">
      <div class="section-title">
        <h2>Gabarito dos jogos</h2>
        <p>Placar real, flag de jogo realizado e base para o cálculo dos pontos.</p>
      </div>
      <div class="panel__header">
        <p class="panel__label">Pontuação</p>
        <button class="btn btn--secondary btn--inline" type="button" data-admin-recalculate-ranking ${state.isRecalculatingRanking ? 'disabled' : ''}>
          ${state.isRecalculatingRanking ? 'Recalculando...' : 'Recalcular ranking'}
        </button>
      </div>
      ${renderSemifinalAnswerKeyForm(state)}
      <div style="height: 1rem"></div>
      ${renderMatchForm(state)}
      <div style="height: 1rem"></div>
      ${renderMatchFilters(state)}
      <div style="height: 1rem"></div>
      ${renderMatchesTable(filteredMatches)}
    </section>
  `;

  return renderAppShell({
    eyebrow: BRAND_LABEL,
    title: 'Painel administrativo',
    lead: 'Administração funcional para controlar cadastro, fase de grupos, janelas de palpites e jogos sem complicar o fluxo.',
    content,
    footer: 'Setup do bolão em modo operacional.',
  });
}
