import './styles/base.css';
import './styles/layout.css';
import './styles/forms.css';
import './styles/ranking.css';
import './styles/admin.css';
import './styles/chat.css';

import { fetchJson } from './api/api-client.js';
import {
  getRegistrationState,
  getSessionParticipant,
  loginParticipant,
  logoutParticipant,
  registerParticipant
} from './api/auth-api.js';
import {
  createAdminMatch,
  createAdminPhase,
  getAdminOverview,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  recalculateAdminRanking,
  resetAdminParticipantPassword,
  saveRegistrationState,
  updateAdminMatch,
  updateAdminPhase
} from './api/admin-api.js';
import { getActivePhasePredictions, saveActivePhasePredictions } from './api/prediction-api.js';
import { getHomeState } from './api/home-api.js';
import {
  createChatMessage,
  getChatMessages,
  getChatParticipants
} from './api/chat-api.js';
import { getRanking } from './api/ranking-api.js';
import { getRevealState } from './api/reveal-api.js';
import { renderAuthPage } from './pages/register-page.js';
import { renderChatMentionOptions, renderHomePage } from './pages/home-page.js';
import { renderRulesPage } from './pages/rules-page.js';
import { renderRankingPage } from './pages/ranking-page.js';
import { renderRevealPage } from './pages/reveal-page.js';
import { renderAdminLoginPage, renderAdminDashboardPage } from './pages/admin-page.js';
import { getDefaultAvatarKey } from './data/avatar-options.js';
import { sessionState } from './state/session-state.js';
import { escapeHtml } from './utils/escape-html.js';

const app = document.querySelector('#app');
const toastRoot = document.querySelector('#toast-root');
const DEFAULT_ADMIN_USERNAME = 'admin@bolao.local';
const CHAT_POLL_INTERVAL_MS = 10000;

function getInitialRoute() {
  if (window.location.pathname.startsWith('/regras')) {
    return 'rules';
  }

  if (window.location.pathname.startsWith('/ranking')) {
    return 'ranking';
  }

  if (window.location.pathname.startsWith('/todos-palpites')) {
    return 'reveal';
  }

  return window.location.pathname.startsWith('/admin') ? 'admin' : 'participant';
}

function createDefaultPhaseForm() {
  return {
    phaseId: null,
    code: 'group-stage',
    name: 'Fase de Grupos',
    stageType: 'group',
    groupCode: 'A',
    roundLabel: '',
    matchCount: '',
    sortOrder: 0,
    windowState: 'closed',
    deadlineAt: '',
    revealEnabled: false
  };
}

function createDefaultMatchForm() {
  return {
    matchId: null,
    phaseId: '',
    matchCode: '',
    groupCode: '',
    matchOrder: 0,
    homeTeamName: '',
    awayTeamName: '',
    homeTeamCode: '',
    awayTeamCode: '',
    kickoffDate: '',
    kickoffTime: '',
    venue: '',
    status: 'scheduled',
    isPlayed: false,
    resultHomeScore: '',
    resultAwayScore: ''
  };
}

const state = {
  route: getInitialRoute(),
  connection: 'loading',
  registrationOpen: true,
  health: null,
  banner: null,
  participantSession: null,
  sessionParticipant: null,
  adminSession: null,
  adminOverview: null,
  isLoggingIn: false,
  isRegistering: false,
  isAdminLoggingIn: false,
  isSavingRegistration: false,
  isSavingPhase: false,
  isSavingMatch: false,
  isRecalculatingRanking: false,
  isResettingParticipantPassword: false,
  resettingParticipantId: null,
  adminPasswordResetResult: null,
  adminPasswordResetError: null,
  loginForm: {
    username: '',
    password: ''
  },
  loginErrors: {},
  loginFormError: null,
  registrationForm: {
    username: '',
    password: '',
    nickname: '',
    city: '',
    avatarKey: getDefaultAvatarKey()
  },
  registrationErrors: {},
  registrationFormError: null,
  adminLoginForm: {
    username: DEFAULT_ADMIN_USERNAME,
    password: ''
  },
  adminLoginFormError: null,
  adminPhaseFormError: null,
  adminMatchFormError: null,
  adminMatchFilters: {
    phaseId: 'all',
    groupCode: 'all'
  },
  activePrediction: null,
  predictionDrafts: {},
  extraPredictionDraft: {
    championTeamCode: '',
    topScorerName: '',
    topScorerGoals: '',
    semiFinalist1Code: '',
    semiFinalist2Code: '',
    semiFinalist3Code: '',
    semiFinalist4Code: ''
  },
  predictionUi: {
    activeGroupCode: 'all',
    knockoutWinners: {}
  },
  predictionSaveState: {
    status: 'idle',
    message: ''
  },
  predictionLoadError: null,
  predictionSaveTimer: null,
  sessionHydrated: false,
  homeState: null,
  homeLoadError: null,
  chat: {
    messages: [],
    participants: [],
    draft: '',
    mentionedParticipantId: null,
    mentionedNickname: '',
    mentionStart: null,
    mentionEnd: null,
    isLoading: false,
    isLoadingOlder: false,
    isSending: false,
    error: null,
    hasMore: false,
    nextBeforeId: null
  },
  chatPollTimer: null,
  rankingState: null,
  rankingLoadError: null,
  revealState: null,
  revealLoadError: null,
  revealSelectedParticipantId: '',
  toast: null,
  toastTimer: null,
  adminForms: {
    registrationState: true,
    phase: createDefaultPhaseForm(),
    match: createDefaultMatchForm()
  }
};

function renderToast() {
  if (!toastRoot) {
    return;
  }

  if (!state.toast) {
    toastRoot.innerHTML = '';
    return;
  }

  toastRoot.innerHTML = `
    <div class="toast toast--${state.toast.tone || 'success'}" role="status" aria-live="polite">
      <span class="toast__message">${escapeHtml(state.toast.message)}</span>
    </div>
  `;
}

function notify(message, tone = 'success') {
  if (state.toastTimer) {
    window.clearTimeout(state.toastTimer);
    state.toastTimer = null;
  }

  state.toast = {
    message,
    tone
  };
  renderToast();

  state.toastTimer = window.setTimeout(() => {
    state.toast = null;
    renderToast();
  }, 2800);
}

function syncSessionState() {
  state.sessionParticipant = state.participantSession;
  sessionState.participant = state.participantSession;
  sessionState.isAdmin = Boolean(state.adminSession);
  sessionState.registrationOpen = state.registrationOpen;
  sessionState.connection = state.connection;
  sessionState.isLoading = state.connection === 'loading';
}

function normalizeIssues(issues = []) {
  return issues.reduce((accumulator, issue) => {
    const field = issue.path && issue.path[0] ? issue.path[0] : 'form';
    const current = accumulator[field]?.issues || [];

    return {
      ...accumulator,
      [field]: {
        issues: [...current, issue]
      }
    };
  }, {});
}

function readFormValues(form) {
  const values = {};
  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }

  return values;
}

function parseBoolean(value) {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
}

function toDatetimeLocal(value) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    if (value.includes('T')) {
      return value.slice(0, 16);
    }

    return value.replace(' ', 'T').slice(0, 16);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (input) => String(input).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function splitDateTimeInput(value) {
  if (!value) {
    return { kickoffDate: '', kickoffTime: '' };
  }

  const normalized = String(value).replace('T', ' ').trim();
  const [datePart = '', timePart = ''] = normalized.split(' ');
  return {
    kickoffDate: datePart,
    kickoffTime: timePart.slice(0, 5)
  };
}

function joinDateAndTime(datePart, timePart) {
  if (!datePart || !timePart) {
    return '';
  }

  return `${datePart} ${timePart}:00`;
}

function readSelectedOptionText(form, selector) {
  const select = form.querySelector(selector);
  const selectedOption = select?.selectedOptions?.[0];

  if (!selectedOption || !select.value) {
    return '';
  }

  return selectedOption.textContent.trim();
}

function setRoute(nextRoute) {
  if (nextRoute !== 'participant') {
    clearChatPolling();
  }

  state.route = nextRoute;
  const routePaths = {
    admin: '/admin',
    participant: '/',
    ranking: '/ranking',
    reveal: '/todos-palpites',
    rules: '/regras'
  };
  const desiredPath = routePaths[nextRoute] || '/';

  if (window.location.pathname !== desiredPath) {
    window.history.pushState({}, '', desiredPath);
  }
}

function hydrateAdminFormsFromOverview() {
  if (!state.adminOverview) {
    return;
  }

  state.adminForms.registrationState = Boolean(state.adminOverview.registrationState?.isRegistrationOpen);

  if (!state.adminForms.phaseId && !state.adminForms.phase.code) {
    state.adminForms.phase = createDefaultPhaseForm();
  }

  if (!state.adminForms.matchId && !state.adminForms.match.matchCode) {
    state.adminForms.match = createDefaultMatchForm();
  }
}

function normalizeAdminPhaseForm(input) {
  return {
    phaseId: input.phaseId ? Number(input.phaseId) : null,
    code: input.code || '',
    name: input.name || '',
    stageType: input.stageType || 'group',
    groupCode: input.groupCode || '',
    roundLabel: input.roundLabel || '',
    matchCount: input.matchCount === '' || input.matchCount === undefined ? '' : Number(input.matchCount),
    sortOrder: Number(input.sortOrder || 0),
    windowState: input.windowState || 'closed',
    deadlineAt: input.deadlineAt || '',
    revealEnabled: parseBoolean(input.revealEnabled)
  };
}

function normalizeAdminMatchForm(input) {
  return {
    matchId: input.matchId ? Number(input.matchId) : null,
    phaseId: input.phaseId ? Number(input.phaseId) : '',
    matchCode: input.matchCode || '',
    groupCode: input.groupCode || '',
    matchOrder: Number(input.matchOrder || 0),
    homeTeamName: input.homeTeamName || '',
    awayTeamName: input.awayTeamName || '',
    homeTeamCode: input.homeTeamCode || '',
    awayTeamCode: input.awayTeamCode || '',
    kickoffDate: input.kickoffDate || '',
    kickoffTime: input.kickoffTime || '',
    venue: input.venue || '',
    status: input.status || 'scheduled',
    isPlayed: parseBoolean(input.isPlayed),
    resultHomeScore: input.resultHomeScore === '' || input.resultHomeScore === undefined ? '' : Number(input.resultHomeScore),
    resultAwayScore: input.resultAwayScore === '' || input.resultAwayScore === undefined ? '' : Number(input.resultAwayScore)
  };
}

function populatePhaseForm(phase) {
  state.adminForms.phaseId = phase.id;
  state.adminForms.phase = normalizeAdminPhaseForm({
    phaseId: phase.id,
    code: phase.code,
    name: phase.name,
    stageType: phase.stageType,
    groupCode: phase.groupCode || '',
    roundLabel: phase.roundLabel || '',
    matchCount: phase.matchCount === null || phase.matchCount === undefined ? '' : Number(phase.matchCount),
    sortOrder: phase.sortOrder,
    windowState: phase.windowState,
    deadlineAt: toDatetimeLocal(phase.deadlineAt),
    revealEnabled: phase.revealEnabled
  });
}

function populateMatchForm(match) {
  state.adminForms.matchId = match.id;
  const kickoffParts = splitDateTimeInput(toDatetimeLocal(match.kickoffAt));
  state.adminForms.match = normalizeAdminMatchForm({
    matchId: match.id,
    phaseId: match.phaseId,
    matchCode: match.matchCode,
    groupCode: match.groupCode || '',
    matchOrder: match.matchOrder,
    homeTeamName: match.homeTeamName,
    awayTeamName: match.awayTeamName,
    homeTeamCode: match.homeTeamCode || '',
    awayTeamCode: match.awayTeamCode || '',
    kickoffDate: kickoffParts.kickoffDate,
    kickoffTime: kickoffParts.kickoffTime,
    venue: match.venue || '',
    status: match.status,
    isPlayed: Boolean(match.isPlayed),
    resultHomeScore: match.resultHomeScore ?? '',
    resultAwayScore: match.resultAwayScore ?? ''
  });
}

function resetPhaseForm() {
  state.adminForms.phaseId = null;
  state.adminForms.phase = createDefaultPhaseForm();
}

function resetMatchForm() {
  state.adminForms.matchId = null;
  state.adminForms.match = createDefaultMatchForm();
}

function focusGabaritoCard() {
  window.setTimeout(() => {
    const element = document.getElementById('admin-gabarito');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

function clearPredictionSaveTimer() {
  if (state.predictionSaveTimer) {
    window.clearTimeout(state.predictionSaveTimer);
    state.predictionSaveTimer = null;
  }
}

function clearChatPolling() {
  if (state.chatPollTimer) {
    window.clearTimeout(state.chatPollTimer);
    state.chatPollTimer = null;
  }
}

function resetChatWorkspace() {
  clearChatPolling();
  state.chat = {
    messages: [],
    participants: [],
    draft: '',
    mentionedParticipantId: null,
    mentionedNickname: '',
    mentionStart: null,
    mentionEnd: null,
    isLoading: false,
    isLoadingOlder: false,
    isSending: false,
    error: null,
    hasMore: false,
    nextBeforeId: null
  };
}

function mergeChatMessages(...messageGroups) {
  const messagesById = new Map();

  messageGroups.flat().forEach((message) => {
    const id = Number(message?.id);
    if (id) {
      messagesById.set(id, {
        ...message,
        id
      });
    }
  });

  return [...messagesById.values()].sort((left, right) => right.id - left.id);
}

function chatMessagesChanged(previousMessages, nextMessages) {
  if (previousMessages.length !== nextMessages.length) {
    return true;
  }

  return previousMessages.some((message, index) => message.id !== nextMessages[index]?.id);
}

function scheduleChatPolling() {
  clearChatPolling();

  if (!state.participantSession || state.route !== 'participant' || state.connection === 'offline') {
    return;
  }

  state.chatPollTimer = window.setTimeout(async () => {
    state.chatPollTimer = null;

    try {
      const response = await getChatMessages({ limit: 30 });
      const nextMessages = mergeChatMessages(
        response.data.messages || [],
        state.chat.messages || []
      );
      const shouldRender =
        Boolean(state.chat.error) ||
        chatMessagesChanged(state.chat.messages || [], nextMessages);

      state.chat.messages = nextMessages;
      state.chat.error = null;

      if (shouldRender) {
        render();
      }

      scheduleChatPolling();
    } catch (error) {
      state.chat.error = error.message;
      clearChatPolling();
      render();
    }
  }, CHAT_POLL_INTERVAL_MS);
}

async function loadChatWorkspace() {
  clearChatPolling();
  state.chat.isLoading = true;
  state.chat.error = null;

  try {
    const [messageResponse, participantResponse] = await Promise.all([
      getChatMessages({ limit: 30 }),
      getChatParticipants()
    ]);

    state.chat.messages = mergeChatMessages(messageResponse.data.messages || []);
    state.chat.participants = participantResponse.data.participants || [];
    state.chat.hasMore = Boolean(messageResponse.data.hasMore);
    state.chat.nextBeforeId = messageResponse.data.nextBeforeId || null;
    state.chat.error = null;
    scheduleChatPolling();
  } catch (error) {
    state.chat.messages = [];
    state.chat.participants = [];
    state.chat.hasMore = false;
    state.chat.nextBeforeId = null;
    state.chat.error = error.message;
  } finally {
    state.chat.isLoading = false;
  }
}

function createPredictionDrafts(activePrediction) {
  const drafts = {};

  (activePrediction?.matches || []).forEach((match) => {
    drafts[String(match.id)] = {
      homeScore:
        match.predictionHomeScore === null || match.predictionHomeScore === undefined ? '' : String(match.predictionHomeScore),
      awayScore:
        match.predictionAwayScore === null || match.predictionAwayScore === undefined ? '' : String(match.predictionAwayScore)
    };
  });

  return drafts;
}

function createExtraPredictionDraft(activePrediction) {
  const extras = activePrediction?.extras || {};

  return {
    championTeamCode: extras.championTeamCode || '',
    topScorerName: extras.topScorerName || '',
    topScorerGoals: extras.topScorerGoals === null || extras.topScorerGoals === undefined ? '' : String(extras.topScorerGoals),
    semiFinalist1Code: extras.semiFinalist1Code || '',
    semiFinalist2Code: extras.semiFinalist2Code || '',
    semiFinalist3Code: extras.semiFinalist3Code || '',
    semiFinalist4Code: extras.semiFinalist4Code || ''
  };
}

function resetPredictionWorkspace() {
  clearPredictionSaveTimer();
  state.activePrediction = null;
  state.predictionDrafts = {};
  state.extraPredictionDraft = {
    championTeamCode: '',
    topScorerName: '',
    topScorerGoals: '',
    semiFinalist1Code: '',
    semiFinalist2Code: '',
    semiFinalist3Code: '',
    semiFinalist4Code: ''
  };
  state.predictionUi = {
    activeGroupCode: 'all',
    knockoutWinners: {}
  };
  state.predictionSaveState = {
    status: 'idle',
    message: ''
  };
  state.predictionLoadError = null;
}

async function loadParticipantWorkspace() {
  clearPredictionSaveTimer();
  clearChatPolling();
  state.predictionLoadError = null;
  state.homeLoadError = null;

  try {
    const [predictionResponse, homeResponse] = await Promise.all([
      getActivePhasePredictions(),
      getHomeState()
    ]);
    state.activePrediction = predictionResponse.data;
    state.homeState = homeResponse.data;
    state.predictionDrafts = createPredictionDrafts(predictionResponse.data);
    state.extraPredictionDraft = createExtraPredictionDraft(predictionResponse.data);
    state.predictionUi.activeGroupCode = predictionResponse.data.groups?.[0]?.code || 'all';
    state.predictionSaveState = {
      status: 'saved',
      message: predictionResponse.data.phase ? 'Palpites carregados.' : 'Nenhuma fase ativa no momento.'
    };
  } catch (error) {
    state.activePrediction = null;
    state.homeState = null;
    state.predictionDrafts = {};
    state.extraPredictionDraft = {
      championTeamCode: '',
      topScorerName: '',
      topScorerGoals: '',
      semiFinalist1Code: '',
      semiFinalist2Code: '',
      semiFinalist3Code: '',
      semiFinalist4Code: ''
    };
    state.predictionUi.activeGroupCode = 'all';
    state.predictionSaveState = {
      status: 'error',
      message: error.message
    };
    state.predictionLoadError = error.message;
    state.homeLoadError = error.message;
  }

  await loadChatWorkspace();
}

async function loadRankingWorkspace() {
  state.rankingLoadError = null;

  try {
    const response = await getRanking();
    state.rankingState = response.data;
  } catch (error) {
    state.rankingState = null;
    state.rankingLoadError = error.message;
  }
}

async function loadRevealWorkspace(participantId = state.revealSelectedParticipantId) {
  state.revealLoadError = null;

  try {
    const response = await getRevealState(participantId);
    state.revealState = response.data;
    state.revealSelectedParticipantId = response.data.selectedParticipant?.id || '';
  } catch (error) {
    state.revealState = null;
    state.revealLoadError = error.message;
  }
}

function schedulePredictionAutosave() {
  clearPredictionSaveTimer();
  state.predictionSaveTimer = window.setTimeout(() => {
    savePredictionWorkspace();
  }, 600);
}

function buildPredictionPayload() {
  return Object.entries(state.predictionDrafts).reduce((accumulator, [matchId, draft]) => {
    const homeScore = String(draft.homeScore ?? '').trim();
    const awayScore = String(draft.awayScore ?? '').trim();

    if (homeScore === '' || awayScore === '') {
      return accumulator;
    }

    accumulator.push({
      matchId: Number(matchId),
      homeScore: Number(homeScore),
      awayScore: Number(awayScore)
    });

    return accumulator;
  }, []);
}

function buildExtraPredictionPayload() {
  return {
    championTeamCode: String(state.extraPredictionDraft.championTeamCode || '').trim() || null,
    topScorerName: String(state.extraPredictionDraft.topScorerName || '').trim() || null,
    topScorerGoals:
      String(state.extraPredictionDraft.topScorerGoals ?? '').trim() === ''
        ? null
        : Number(state.extraPredictionDraft.topScorerGoals),
    semiFinalist1Code: String(state.extraPredictionDraft.semiFinalist1Code || '').trim() || null,
    semiFinalist2Code: String(state.extraPredictionDraft.semiFinalist2Code || '').trim() || null,
    semiFinalist3Code: String(state.extraPredictionDraft.semiFinalist3Code || '').trim() || null,
    semiFinalist4Code: String(state.extraPredictionDraft.semiFinalist4Code || '').trim() || null
  };
}

async function savePredictionWorkspace() {
  if (!state.activePrediction?.phase || !state.activePrediction?.canEdit) {
    return;
  }

  clearPredictionSaveTimer();
  state.predictionSaveState = {
    status: 'saving',
    message: 'Salvando palpites...'
  };
  render();

  try {
    const response = await saveActivePhasePredictions({
      phaseId: state.activePrediction.phase.id,
      predictions: buildPredictionPayload(),
      extras: buildExtraPredictionPayload()
    });

    state.activePrediction = response.data;
    state.predictionDrafts = {
      ...createPredictionDrafts(response.data),
      ...state.predictionDrafts
    };
    state.extraPredictionDraft = {
      ...createExtraPredictionDraft(response.data),
      ...state.extraPredictionDraft
    };
    state.predictionUi.activeGroupCode = response.data.groups?.find((group) => group.code === state.predictionUi.activeGroupCode)
      ? state.predictionUi.activeGroupCode
      : response.data.groups?.[0]?.code || 'all';
    state.predictionSaveState = {
      status: 'saved',
      message: 'Palpites salvos.'
    };
    notify('Palpites salvos.');
  } catch (error) {
    state.predictionSaveState = {
      status: 'error',
      message: error.message
    };
  }

  render();
}

async function refreshAdminOverview() {
  const response = await getAdminOverview();
  state.adminOverview = response.data;
  state.adminForms.registrationState = Boolean(state.adminOverview.registrationState?.isRegistrationOpen);
  render();
}

function findChatMentionContext(value, cursorPosition) {
  const beforeCursor = String(value || '').slice(0, cursorPosition);
  const match = beforeCursor.match(/(^|\s)@([^@\n]*)$/u);

  if (!match) {
    return null;
  }

  const start = match.index + match[1].length;
  return {
    start,
    end: cursorPosition,
    query: match[2].trim().toLocaleLowerCase('pt-BR')
  };
}

function selectChatMention(participant) {
  const start = state.chat.mentionStart;
  const end = state.chat.mentionEnd;

  if (start === null || end === null) {
    return;
  }

  const prefix = state.chat.draft.slice(0, start);
  const suffix = state.chat.draft.slice(end);
  const insertedMention = `@${participant.nickname} `;
  state.chat.draft = `${prefix}${insertedMention}${suffix}`;
  state.chat.mentionedParticipantId = Number(participant.id);
  state.chat.mentionedNickname = participant.nickname;
  state.chat.mentionStart = null;
  state.chat.mentionEnd = null;
  render();

  window.setTimeout(() => {
    const input = app.querySelector('[data-chat-input]');
    if (input) {
      const cursor = prefix.length + insertedMention.length;
      input.focus();
      input.setSelectionRange(cursor, cursor);
    }
  }, 0);
}

function insertChatEmoji(input, emoji) {
  const start = input.selectionStart ?? state.chat.draft.length;
  const end = input.selectionEnd ?? start;
  const nextDraft = `${state.chat.draft.slice(0, start)}${emoji}${state.chat.draft.slice(end)}`;

  if (Array.from(nextDraft).length > 240) {
    state.chat.error = 'A mensagem deve ter no máximo 240 caracteres.';
    render();
    return;
  }

  state.chat.draft = nextDraft;
  state.chat.error = null;
  render();

  window.setTimeout(() => {
    const nextInput = app.querySelector('[data-chat-input]');
    if (nextInput) {
      const cursor = start + emoji.length;
      nextInput.focus();
      nextInput.setSelectionRange(cursor, cursor);
    }
  }, 0);
}

function updateChatMentionPopover(input) {
  const popover = app.querySelector('[data-chat-mention-options]');
  const counter = app.querySelector('[data-chat-character-count]');
  const characterCount = Array.from(state.chat.draft).length;

  if (counter) {
    counter.textContent = `${characterCount}/240`;
    counter.classList.toggle('chat-character-count--danger', characterCount > 240);
  }

  if (
    state.chat.mentionedNickname &&
    !state.chat.draft.includes(`@${state.chat.mentionedNickname}`)
  ) {
    state.chat.mentionedParticipantId = null;
    state.chat.mentionedNickname = '';
  }

  if (!popover) {
    return;
  }

  if (
    state.chat.mentionedParticipantId &&
    state.chat.mentionedNickname &&
    state.chat.draft.includes(`@${state.chat.mentionedNickname}`)
  ) {
    state.chat.mentionStart = null;
    state.chat.mentionEnd = null;
    popover.hidden = true;
    popover.innerHTML = '';
    return;
  }

  const context = findChatMentionContext(
    state.chat.draft,
    input.selectionStart ?? state.chat.draft.length
  );

  if (!context) {
    state.chat.mentionStart = null;
    state.chat.mentionEnd = null;
    popover.hidden = true;
    popover.innerHTML = '';
    return;
  }

  const matches = state.chat.participants
    .filter((participant) =>
      participant.nickname.toLocaleLowerCase('pt-BR').includes(context.query)
    )
    .slice(0, 8);

  if (!matches.length) {
    state.chat.mentionStart = null;
    state.chat.mentionEnd = null;
    popover.hidden = true;
    popover.innerHTML = '';
    return;
  }

  state.chat.mentionStart = context.start;
  state.chat.mentionEnd = context.end;
  popover.innerHTML = renderChatMentionOptions(matches);
  popover.hidden = false;

  popover.querySelectorAll('[data-chat-mention-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const participantId = Number(button.getAttribute('data-chat-mention-id'));
      const participant = state.chat.participants.find(
        (item) => Number(item.id) === participantId
      );

      if (participant) {
        selectChatMention(participant);
      }
    });
  });
}

async function submitChatMessage() {
  const characterCount = Array.from(state.chat.draft).length;

  if (!state.chat.draft.trim()) {
    state.chat.error = 'Digite uma mensagem antes de enviar.';
    render();
    return;
  }

  if (characterCount > 240) {
    state.chat.error = 'A mensagem deve ter no máximo 240 caracteres.';
    render();
    return;
  }

  state.chat.isSending = true;
  state.chat.error = null;
  render();

  try {
    const response = await createChatMessage({
      content: state.chat.draft,
      mentionedParticipantId: state.chat.mentionedParticipantId
    });

    state.chat.messages = mergeChatMessages(
      [response.data.message],
      state.chat.messages
    );
    state.chat.draft = '';
    state.chat.mentionedParticipantId = null;
    state.chat.mentionedNickname = '';
    state.chat.mentionStart = null;
    state.chat.mentionEnd = null;
    state.chat.error = null;
  } catch (error) {
    state.chat.error = error.message;
  } finally {
    state.chat.isSending = false;
    render();
  }
}

async function loadOlderChatMessages() {
  if (!state.chat.nextBeforeId || state.chat.isLoadingOlder) {
    return;
  }

  state.chat.isLoadingOlder = true;
  state.chat.error = null;
  render();

  try {
    const response = await getChatMessages({
      limit: 30,
      beforeId: state.chat.nextBeforeId
    });
    state.chat.messages = mergeChatMessages(
      state.chat.messages,
      response.data.messages || []
    );
    state.chat.hasMore = Boolean(response.data.hasMore);
    state.chat.nextBeforeId = response.data.nextBeforeId || null;
  } catch (error) {
    state.chat.error = error.message;
  } finally {
    state.chat.isLoadingOlder = false;
    render();
  }
}

function bindParticipantForms() {
  const loginForm = app.querySelector('[data-login-form]');
  const registrationForm = app.querySelector('[data-registration-form]');
  const logoutButton = app.querySelector('[data-logout-button]');

  if (loginForm) {
    const fields = loginForm.querySelectorAll('input[data-auth-input]');
    fields.forEach((input) => {
      input.addEventListener('input', (event) => {
        state.loginForm[input.name] = event.target.value;
      });
    });

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.isLoggingIn = true;
      state.loginFormError = null;
      state.loginErrors = {};
      render();

      try {
        const response = await loginParticipant({
          username: state.loginForm.username,
          password: state.loginForm.password
        });

        state.participantSession = response.data.participant;
        state.sessionParticipant = state.participantSession;
        state.adminSession = null;
        state.sessionHydrated = true;
        state.connection = 'online';
        state.isLoggingIn = false;
        state.loginFormError = null;
        state.loginErrors = {};
        state.loginForm.password = '';
        if (state.route === 'ranking') {
          await loadRankingWorkspace();
        } else if (state.route === 'reveal') {
          await loadRevealWorkspace();
        } else {
          await loadParticipantWorkspace();
        }
        render();
      } catch (error) {
        state.isLoggingIn = false;
        state.loginForm.password = '';

        if (error.status === 400) {
          state.loginErrors = normalizeIssues(error.details?.issues || []);
          state.loginFormError = null;
        } else if (error.status === 401) {
          state.loginFormError = error.message;
        } else {
          state.loginFormError = error.message;
        }

        render();
      }
    });
  }

  if (registrationForm) {
    const fields = registrationForm.querySelectorAll('input[data-auth-input]');
    fields.forEach((input) => {
      input.addEventListener('input', (event) => {
        state.registrationForm[input.name] = event.target.value;
      });
    });

    const avatarInputs = registrationForm.querySelectorAll('input[data-avatar-input]');
    avatarInputs.forEach((input) => {
      input.addEventListener('change', (event) => {
        state.registrationForm.avatarKey = event.target.value;
        const nextErrors = { ...state.registrationErrors };
        delete nextErrors.avatarKey;
        state.registrationErrors = nextErrors;
        state.registrationFormError = null;
        render();
      });
    });

    registrationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.isRegistering = true;
      state.registrationFormError = null;
      state.registrationErrors = {};
      render();

      try {
        const response = await registerParticipant({
          username: state.registrationForm.username,
          password: state.registrationForm.password,
          nickname: state.registrationForm.nickname,
          city: state.registrationForm.city,
          avatarKey: state.registrationForm.avatarKey
        });

        state.participantSession = response.data.participant;
        state.sessionParticipant = state.participantSession;
        state.adminSession = null;
        state.registrationOpen = response.data.registrationOpen;
        state.sessionHydrated = true;
        state.connection = 'online';
        state.isRegistering = false;
        state.registrationFormError = null;
        state.registrationErrors = {};
        state.registrationForm = {
          username: '',
          password: '',
          nickname: '',
          city: '',
          avatarKey: getDefaultAvatarKey()
        };
        if (state.route === 'ranking') {
          await loadRankingWorkspace();
        } else if (state.route === 'reveal') {
          await loadRevealWorkspace();
        } else {
          await loadParticipantWorkspace();
        }
        render();
      } catch (error) {
        state.isRegistering = false;
        state.registrationForm.password = '';

        if (error.status === 400 || error.status === 409) {
          state.registrationErrors = normalizeIssues(error.details?.issues || []);
          state.registrationFormError = null;
        } else if (error.status === 403) {
          state.registrationOpen = false;
          state.registrationFormError = error.message;
        } else {
          state.registrationFormError = error.message;
        }

        render();
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      state.connection = 'online';

      try {
        await logoutParticipant();
      } finally {
        state.participantSession = null;
        state.sessionParticipant = null;
        resetPredictionWorkspace();
        resetChatWorkspace();
        state.homeState = null;
        state.rankingState = null;
        state.revealState = null;
        state.isLoggingIn = false;
        state.isRegistering = false;
        state.loginForm.password = '';
        state.loginFormError = null;
        state.loginErrors = {};
        render();
      }
    });
  }

  const predictionForm = app.querySelector('[data-predictions-form]');
  const predictionGroupTabs = app.querySelectorAll('[data-prediction-group-tab]');
  const predictionInputs = app.querySelectorAll('[data-prediction-input]');
  const extraPredictionInputs = app.querySelectorAll('[data-extra-prediction-input]');
  const knockoutWinnerButtons = app.querySelectorAll('[data-knockout-winner-match]');
  const chatForm = app.querySelector('[data-chat-form]');
  const chatInput = app.querySelector('[data-chat-input]');
  const chatLoadMoreButton = app.querySelector('[data-chat-load-more]');
  const chatEmojiButtons = app.querySelectorAll('[data-chat-emoji]');

  if (chatInput) {
    chatInput.addEventListener('input', (event) => {
      state.chat.draft = event.target.value;
      updateChatMentionPopover(event.target);
    });

    chatInput.addEventListener('keydown', (event) => {
      const popover = app.querySelector('[data-chat-mention-options]');

      if (event.key === 'Escape' && popover && !popover.hidden) {
        popover.hidden = true;
        state.chat.mentionStart = null;
        state.chat.mentionEnd = null;
      }

      if (event.key === 'ArrowDown' && popover && !popover.hidden) {
        const firstOption = popover.querySelector('[data-chat-mention-id]');
        if (firstOption) {
          event.preventDefault();
          firstOption.focus();
        }
      }
    });
  }

  if (chatForm) {
    chatForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitChatMessage();
    });
  }

  if (chatEmojiButtons.length && chatInput) {
    chatEmojiButtons.forEach((button) => {
      button.addEventListener('click', () => {
        insertChatEmoji(chatInput, button.getAttribute('data-chat-emoji') || '');
      });
    });
  }

  if (chatLoadMoreButton) {
    chatLoadMoreButton.addEventListener('click', loadOlderChatMessages);
  }

  if (predictionGroupTabs.length) {
    predictionGroupTabs.forEach((button) => {
      button.addEventListener('click', () => {
        state.predictionUi.activeGroupCode = button.getAttribute('data-prediction-group-tab') || 'all';
        render();
      });
    });
  }

  if (predictionInputs.length) {
    predictionInputs.forEach((input) => {
      input.addEventListener('input', (event) => {
        const matchId = String(input.getAttribute('data-match-id') || '');
        const field = input.getAttribute('data-score-field');

        if (!matchId || !field) {
          return;
        }

        state.predictionDrafts[matchId] = {
          ...(state.predictionDrafts[matchId] || { homeScore: '', awayScore: '' }),
          [field]: event.target.value
        };
        state.predictionSaveState = {
          status: 'dirty',
          message: 'Alterações pendentes.'
        };
        schedulePredictionAutosave();
      });
    });
  }

  if (extraPredictionInputs.length) {
    extraPredictionInputs.forEach((input) => {
      const eventName = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(eventName, (event) => {
        state.extraPredictionDraft[input.name] = event.target.value;
        state.predictionSaveState = {
          status: 'dirty',
          message: 'Alterações pendentes.'
        };
        schedulePredictionAutosave();
      });
    });
  }

  if (knockoutWinnerButtons.length) {
    knockoutWinnerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const matchCode = button.getAttribute('data-knockout-winner-match');
        const teamCode = button.getAttribute('data-knockout-winner-team');

        if (!matchCode || !teamCode) {
          return;
        }

        state.predictionUi.knockoutWinners = {
          ...(state.predictionUi.knockoutWinners || {}),
          [matchCode]: teamCode
        };
        render();
      });
    });
  }

  if (predictionForm) {
    predictionForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await savePredictionWorkspace();
    });
  }

  const revealParticipantSelect = app.querySelector('[data-reveal-participant-select]');
  if (revealParticipantSelect) {
    revealParticipantSelect.addEventListener('change', async (event) => {
      state.revealSelectedParticipantId = event.target.value;
      await loadRevealWorkspace(event.target.value);
      render();
    });
  }
}

function bindAdminForms() {
  const loginForm = app.querySelector('[data-admin-login-form]');
  const logoutButton = app.querySelector('[data-admin-logout-button]');
  const registrationForm = app.querySelector('[data-admin-registration-form]');
  const phaseForm = app.querySelector('[data-admin-phase-form]');
  const matchForm = app.querySelector('[data-admin-match-form]');
  const phaseCancel = app.querySelector('[data-admin-phase-cancel]');
  const matchCancel = app.querySelector('[data-admin-match-cancel]');
  const matchFilterPhase = app.querySelector('#match-filter-phase');
  const matchFilterGroup = app.querySelector('#match-filter-group');
  const recalculateRankingButton = app.querySelector('[data-admin-recalculate-ranking]');
  const resetPasswordButtons = app.querySelectorAll('[data-admin-reset-password]');

  if (loginForm) {
    const fields = loginForm.querySelectorAll('input[data-admin-input]');
    fields.forEach((input) => {
      input.addEventListener('input', (event) => {
        state.adminLoginForm[input.name] = event.target.value;
      });
    });

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.isAdminLoggingIn = true;
      state.adminLoginFormError = null;
      render();

      try {
        const response = await loginAdmin({
          username: state.adminLoginForm.username || DEFAULT_ADMIN_USERNAME,
          password: state.adminLoginForm.password
        });

        state.adminSession = response.data.admin;
        state.participantSession = null;
        state.sessionParticipant = null;
        state.sessionHydrated = true;
        state.isAdminLoggingIn = false;
        state.adminLoginForm = { username: DEFAULT_ADMIN_USERNAME, password: '' };
        setRoute('admin');
        render();

        try {
          await refreshAdminOverview();
        } catch (overviewError) {
          state.adminOverview = null;
          state.banner = {
            tone: 'danger',
            title: 'Admin autenticado, mas o painel ainda não carregou',
            body: overviewError.message
          };
          render();
        }
      } catch (error) {
        state.isAdminLoggingIn = false;
        state.adminLoginFormError = error.message;
        render();
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        await logoutAdmin();
      } finally {
        state.adminSession = null;
        state.adminOverview = null;
        resetPhaseForm();
        resetMatchForm();
        state.adminLoginFormError = null;
        state.adminLoginForm = { username: DEFAULT_ADMIN_USERNAME, password: '' };
        render();
      }
    });
  }

  if (registrationForm) {
    const select = registrationForm.querySelector('select[name="isRegistrationOpen"]');
    if (select) {
      select.addEventListener('change', (event) => {
        state.adminForms.registrationState = event.target.value === 'true';
      });
    }

    registrationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.isSavingRegistration = true;
      render();

      try {
        const response = await saveRegistrationState({
          isRegistrationOpen: state.adminForms.registrationState
        });
        state.registrationOpen = response.data.isRegistrationOpen;
        await refreshAdminOverview();
        notify('Cadastro salvo.');
      } catch (error) {
        state.adminLoginFormError = error.message;
      } finally {
        state.isSavingRegistration = false;
        render();
      }
    });
  }

  if (phaseForm) {
    const fields = phaseForm.querySelectorAll('input[data-admin-input], select[data-admin-input]');
    fields.forEach((input) => {
      const eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(eventName, (event) => {
        if (input.type === 'checkbox') {
          state.adminForms.phase[input.name] = event.target.checked;
        } else {
          state.adminForms.phase[input.name] = event.target.value;
        }
        if (input.name === 'stageType') {
          render();
        }
      });
    });

    phaseForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.isSavingPhase = true;
      state.adminPhaseFormError = null;
      render();

      const payload = {
        code: state.adminForms.phase.code,
        name: state.adminForms.phase.name,
        stageType: state.adminForms.phase.stageType,
        groupCode: state.adminForms.phase.groupCode,
        roundLabel: state.adminForms.phase.roundLabel,
        matchCount:
          state.adminForms.phase.stageType === 'knockout'
            ? state.adminForms.phase.matchCount === '' || state.adminForms.phase.matchCount === undefined
              ? null
              : Number(state.adminForms.phase.matchCount)
            : null,
        sortOrder: Number(state.adminForms.phase.sortOrder || 0),
        windowState: state.adminForms.phase.windowState,
        deadlineAt: state.adminForms.phase.deadlineAt,
        revealEnabled: Boolean(state.adminForms.phase.revealEnabled)
      };

      try {
        if (state.adminForms.phaseId) {
          await updateAdminPhase(state.adminForms.phaseId, payload);
        } else {
          await createAdminPhase(payload);
        }

        resetPhaseForm();
        await refreshAdminOverview();
        notify('Fase salva.');
      } catch (error) {
        state.adminPhaseFormError = error.message;
      } finally {
        state.isSavingPhase = false;
        render();
      }
    });
  }

  if (matchForm) {
    const fields = matchForm.querySelectorAll('input[data-admin-input], select[data-admin-input]');
    fields.forEach((input) => {
      const eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(eventName, (event) => {
        if (input.type === 'checkbox') {
          state.adminForms.match[input.name] = event.target.checked;
        } else if (input.tagName === 'SELECT' && (input.name === 'homeTeamCode' || input.name === 'awayTeamCode')) {
          state.adminForms.match[input.name] = event.target.value;
          const selectedOption = event.target.selectedOptions && event.target.selectedOptions[0];
          const teamNameField = input.name === 'homeTeamCode' ? 'homeTeamName' : 'awayTeamName';
          state.adminForms.match[teamNameField] = selectedOption ? selectedOption.textContent.trim() : '';
        } else {
          state.adminForms.match[input.name] = event.target.value;
        }
      });
    });

    matchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.isSavingMatch = true;
      state.adminMatchFormError = null;
      render();

      const selectedHomeTeamName = readSelectedOptionText(matchForm, 'select[name="homeTeamCode"]');
      const selectedAwayTeamName = readSelectedOptionText(matchForm, 'select[name="awayTeamCode"]');
      const homeTeamName = state.adminForms.match.homeTeamName || selectedHomeTeamName;
      const awayTeamName = state.adminForms.match.awayTeamName || selectedAwayTeamName;

      const payload = {
        phaseId: Number(state.adminForms.match.phaseId),
        matchCode: state.adminForms.match.matchCode,
        groupCode: state.adminForms.match.groupCode,
        matchOrder: Number(state.adminForms.match.matchOrder || 0),
        homeTeamName,
        awayTeamName,
        homeTeamCode: state.adminForms.match.homeTeamCode,
        awayTeamCode: state.adminForms.match.awayTeamCode,
        kickoffAt: joinDateAndTime(state.adminForms.match.kickoffDate, state.adminForms.match.kickoffTime),
        venue: state.adminForms.match.venue,
        status: state.adminForms.match.status,
        isPlayed: Boolean(state.adminForms.match.isPlayed),
        resultHomeScore: state.adminForms.match.resultHomeScore === '' ? null : Number(state.adminForms.match.resultHomeScore),
        resultAwayScore: state.adminForms.match.resultAwayScore === '' ? null : Number(state.adminForms.match.resultAwayScore)
      };

      try {
        if (state.adminForms.matchId) {
          await updateAdminMatch(state.adminForms.matchId, payload);
        } else {
          await createAdminMatch(payload);
        }

        resetMatchForm();
        await refreshAdminOverview();
        notify('Jogo salvo.');
      } catch (error) {
        state.adminMatchFormError = error.message;
      } finally {
        state.isSavingMatch = false;
        render();
      }
    });
  }

  if (phaseCancel) {
    phaseCancel.addEventListener('click', () => {
      resetPhaseForm();
      render();
    });
  }

  if (matchCancel) {
    matchCancel.addEventListener('click', () => {
      resetMatchForm();
      render();
    });
  }

  if (matchFilterPhase) {
    matchFilterPhase.addEventListener('change', (event) => {
      state.adminMatchFilters.phaseId = event.target.value;
      render();
    });
  }

  if (matchFilterGroup) {
    matchFilterGroup.addEventListener('change', (event) => {
      state.adminMatchFilters.groupCode = event.target.value;
      render();
    });
  }

  if (recalculateRankingButton) {
    recalculateRankingButton.addEventListener('click', async () => {
      state.isRecalculatingRanking = true;
      state.adminPhaseFormError = null;
      render();

      try {
        await recalculateAdminRanking();
        await refreshAdminOverview();
        notify('Ranking recalculado.');
      } catch (error) {
        state.adminPhaseFormError = error.message;
      } finally {
        state.isRecalculatingRanking = false;
        render();
      }
    });
  }

  if (resetPasswordButtons.length) {
    resetPasswordButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const participantId = Number(button.getAttribute('data-admin-reset-password'));

        if (!participantId) {
          return;
        }

        state.isResettingParticipantPassword = true;
        state.resettingParticipantId = participantId;
        state.adminPasswordResetError = null;
        state.adminPasswordResetResult = null;
        render();

        try {
          const response = await resetAdminParticipantPassword(participantId);
          state.adminPasswordResetResult = response.data;
          notify('Senha temporÃ¡ria gerada.');
        } catch (error) {
          state.adminPasswordResetError = error.message;
        } finally {
          state.isResettingParticipantPassword = false;
          state.resettingParticipantId = null;
          render();
        }
      });
    });
  }

  app.querySelectorAll('[data-admin-edit-phase]').forEach((button) => {
    button.addEventListener('click', () => {
      const phaseId = Number(button.getAttribute('data-admin-edit-phase'));
      const phase = state.adminOverview?.phases?.find((item) => item.id === phaseId);
      if (phase) {
        populatePhaseForm(phase);
        render();
      }
    });
  });

  app.querySelectorAll('[data-admin-edit-match]').forEach((button) => {
    button.addEventListener('click', () => {
      const matchId = Number(button.getAttribute('data-admin-edit-match'));
      const match = state.adminOverview?.matches?.find((item) => item.id === matchId);
      if (match) {
        populateMatchForm(match);
        render();
        focusGabaritoCard();
      }
    });
  });
}

function render() {
  syncSessionState();

  if (state.route === 'rules') {
    app.innerHTML = renderRulesPage(state);
    renderToast();
    return;
  }

  if (state.route === 'ranking') {
    app.innerHTML = state.participantSession ? renderRankingPage(state) : renderAuthPage(state);
    bindParticipantForms();
    renderToast();
    return;
  }

  if (state.route === 'reveal') {
    app.innerHTML = state.participantSession ? renderRevealPage(state) : renderAuthPage(state);
    bindParticipantForms();
    renderToast();
    return;
  }

  if (state.adminSession || state.route === 'admin') {
    if (state.adminSession && !window.location.pathname.startsWith('/admin')) {
      window.history.replaceState({}, '', '/admin');
    }

    app.innerHTML = state.adminSession
      ? renderAdminDashboardPage(state)
      : renderAdminLoginPage(state);
    bindAdminForms();
    renderToast();
    return;
  }

  app.innerHTML = state.participantSession ? renderHomePage(state) : renderAuthPage(state);
  bindParticipantForms();
  renderToast();
}

async function boot() {
  render();

  try {
    const [health, registrationState, participantSession, adminSession] = await Promise.all([
      fetchJson('/api/health'),
      getRegistrationState(),
      getSessionParticipant(),
      getAdminSession()
    ]);

    state.connection = 'online';
    state.health = health.data;
    state.registrationOpen = Boolean(registrationState.data.isRegistrationOpen);
    if (!state.sessionHydrated) {
      state.participantSession = participantSession.data.participant;
      state.sessionParticipant = state.participantSession;
      state.adminSession = adminSession.data.admin;
      state.sessionHydrated = true;
    }
    state.banner = null;

    const pathRoute = getInitialRoute();

    if (state.adminSession && pathRoute === 'admin') {
      state.route = 'admin';
      if (!window.location.pathname.startsWith('/admin')) {
        window.history.replaceState({}, '', '/admin');
      }

      const overview = await getAdminOverview();
      state.adminOverview = overview.data;
      hydrateAdminFormsFromOverview();
    } else if (pathRoute === 'admin') {
      state.route = 'admin';
    }

    if (state.participantSession) {
      state.route = ['rules', 'ranking', 'reveal'].includes(pathRoute) ? pathRoute : 'participant';

      if (state.route === 'ranking') {
        await loadRankingWorkspace();
      } else if (state.route === 'reveal') {
        await loadRevealWorkspace();
      } else if (state.route === 'participant') {
        await loadParticipantWorkspace();
      }
    } else {
      resetPredictionWorkspace();
      resetChatWorkspace();
    }
  } catch (error) {
    state.connection = 'offline';
    state.banner = {
      tone: 'danger',
      title: 'API offline',
      body: error.message
    };
  }

  render();
}

window.addEventListener('popstate', () => {
  if (window.location.pathname.startsWith('/regras')) {
    state.route = 'rules';
  } else if (window.location.pathname.startsWith('/ranking')) {
    state.route = 'ranking';
  } else if (window.location.pathname.startsWith('/todos-palpites')) {
    state.route = 'reveal';
  } else if (window.location.pathname.startsWith('/admin')) {
    state.route = 'admin';
  } else {
    state.route = 'participant';
  }

  if (state.route !== 'participant') {
    clearChatPolling();
  } else if (state.participantSession) {
    scheduleChatPolling();
  }

  render();
});

window.addEventListener('error', (event) => {
  app.innerHTML = `
    <main class="app-shell">
      <section class="panel panel--span-12">
        <div class="status-message status-message--danger">
          <div>
            <p class="status-message__title">Erro ao carregar a tela</p>
            <p class="status-message__body">${event.message || 'Erro inesperado no frontend.'}</p>
          </div>
        </div>
      </section>
    </main>
  `;
});

boot();
