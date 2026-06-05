const bcrypt = require('bcrypt');
const crypto = require('crypto');

const authService = require('./auth-service');
const participantService = require('./participant-service');
const predictionService = require('./prediction-service');
const competitionRepository = require('../repositories/competition-repository');

function createServiceError(status, code, message, details) {
  const error = new Error(message);
  error.status = status;
  error.code = code;

  if (details) {
    error.details = details;
  }

  return error;
}

function normalizeOptionalText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();
  return text.length ? text : null;
}

function pickDefined(value, fallback) {
  return value === undefined ? fallback : value;
}

async function loginAdmin(input) {
  return authService.loginAdmin(input);
}

function getAdminSession(session) {
  return authService.getAdminSession(session);
}

async function getOverview() {
  const [registrationState, phases, matches, participants] = await Promise.all([
    participantService.getRegistrationState(),
    competitionRepository.listCompetitionPhases(),
    competitionRepository.listCompetitionMatches(),
    participantService.listPublicParticipants()
  ]);

  const openPhaseCount = phases.filter((phase) => phase.windowState === 'open').length;
  const lockedPhaseCount = phases.filter((phase) => phase.windowState === 'locked').length;
  const revealedPhaseCount = phases.filter((phase) => phase.revealEnabled).length;

  return {
    registrationState,
    summary: {
      phaseCount: phases.length,
      matchCount: matches.length,
      openPhaseCount,
      lockedPhaseCount,
      revealedPhaseCount
    },
    phases,
    matches,
    participants
  };
}

async function setRegistrationState(isRegistrationOpen) {
  return participantService.setRegistrationState(Boolean(isRegistrationOpen));
}

async function listPhases() {
  return competitionRepository.listCompetitionPhases();
}

async function createPhase(input) {
  return competitionRepository.createCompetitionPhase({
    code: input.code,
    name: input.name,
    stageType: input.stageType,
    groupCode: normalizeOptionalText(input.groupCode),
    roundLabel: normalizeOptionalText(input.roundLabel),
    sortOrder: Number(input.sortOrder || 0),
    windowState: input.windowState || 'closed',
    deadlineAt: normalizeOptionalText(input.deadlineAt),
    matchCount: input.matchCount === undefined || input.matchCount === null || input.matchCount === '' ? null : Number(input.matchCount),
    revealEnabled: Boolean(input.revealEnabled)
  });
}

async function updatePhase(phaseId, input) {
  const existing = await competitionRepository.findCompetitionPhaseById(phaseId);

  if (!existing) {
    throw createServiceError(404, 'PHASE_NOT_FOUND', 'Fase não encontrada.');
  }

  return competitionRepository.updateCompetitionPhase(phaseId, {
    code: pickDefined(input.code, existing.code),
    name: pickDefined(input.name, existing.name),
    stageType: pickDefined(input.stageType, existing.stageType),
    groupCode: input.groupCode !== undefined ? normalizeOptionalText(input.groupCode) : existing.groupCode,
    roundLabel: input.roundLabel !== undefined ? normalizeOptionalText(input.roundLabel) : existing.roundLabel,
    sortOrder: input.sortOrder !== undefined ? Number(input.sortOrder || 0) : existing.sortOrder,
    windowState: pickDefined(input.windowState, existing.windowState),
    deadlineAt: input.deadlineAt !== undefined ? normalizeOptionalText(input.deadlineAt) : existing.deadlineAt,
    matchCount:
      input.matchCount !== undefined
        ? input.matchCount === null || input.matchCount === ''
          ? null
          : Number(input.matchCount)
        : existing.matchCount,
    revealEnabled: input.revealEnabled !== undefined ? Boolean(input.revealEnabled) : existing.revealEnabled
  });
}

async function listMatches() {
  return competitionRepository.listCompetitionMatches();
}

async function createMatch(input) {
  const match = await competitionRepository.createCompetitionMatch({
    phaseId: input.phaseId,
    matchCode: input.matchCode,
    groupCode: normalizeOptionalText(input.groupCode),
    matchOrder: Number(input.matchOrder || 0),
    homeTeamName: input.homeTeamName,
    awayTeamName: input.awayTeamName,
    homeTeamCode: normalizeOptionalText(input.homeTeamCode),
    awayTeamCode: normalizeOptionalText(input.awayTeamCode),
    kickoffAt: normalizeOptionalText(input.kickoffAt),
    venue: normalizeOptionalText(input.venue),
    isPlayed: Boolean(input.isPlayed),
    status: Boolean(input.isPlayed) ? 'completed' : input.status || 'scheduled',
    resultHomeScore: input.resultHomeScore ?? null,
    resultAwayScore: input.resultAwayScore ?? null
  });

  if (match) {
    await predictionService.refreshMatchPredictionPoints(match.id);
  }

  return match;
}

async function updateMatch(matchId, input) {
  const existing = await competitionRepository.findCompetitionMatchById(matchId);

  if (!existing) {
    throw createServiceError(404, 'MATCH_NOT_FOUND', 'Jogo não encontrado.');
  }

  const match = await competitionRepository.updateCompetitionMatch(matchId, {
    phaseId: input.phaseId !== undefined ? Number(input.phaseId) : existing.phaseId,
    matchCode: pickDefined(input.matchCode, existing.matchCode),
    groupCode: input.groupCode !== undefined ? normalizeOptionalText(input.groupCode) : existing.groupCode,
    matchOrder: input.matchOrder !== undefined ? Number(input.matchOrder || 0) : existing.matchOrder,
    homeTeamName: pickDefined(input.homeTeamName, existing.homeTeamName),
    awayTeamName: pickDefined(input.awayTeamName, existing.awayTeamName),
    homeTeamCode: input.homeTeamCode !== undefined ? normalizeOptionalText(input.homeTeamCode) : existing.homeTeamCode,
    awayTeamCode: input.awayTeamCode !== undefined ? normalizeOptionalText(input.awayTeamCode) : existing.awayTeamCode,
    kickoffAt: input.kickoffAt !== undefined ? normalizeOptionalText(input.kickoffAt) : existing.kickoffAt,
    venue: input.venue !== undefined ? normalizeOptionalText(input.venue) : existing.venue,
    isPlayed: input.isPlayed !== undefined ? Boolean(input.isPlayed) : Boolean(existing.isPlayed),
    status:
      input.isPlayed !== undefined
        ? Boolean(input.isPlayed)
          ? 'completed'
          : pickDefined(input.status, existing.status)
        : pickDefined(input.status, existing.status),
    resultHomeScore: input.resultHomeScore !== undefined ? input.resultHomeScore : existing.resultHomeScore,
    resultAwayScore: input.resultAwayScore !== undefined ? input.resultAwayScore : existing.resultAwayScore
  });

  await predictionService.refreshMatchPredictionPoints(matchId);

  return match;
}

async function recalculateRanking() {
  return predictionService.recalculateRankingPoints();
}

function generateTemporaryPassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(12);
  const token = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
  return `B26-${token.slice(0, 4)}-${token.slice(4, 8)}-${token.slice(8, 12)}`;
}

async function resetParticipantPassword(participantId) {
  const participant = await participantService.findParticipantById(participantId);

  if (!participant || participant.isAdmin) {
    throw createServiceError(404, 'PARTICIPANT_NOT_FOUND', 'Participante nÃ£o encontrado.');
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 12);
  const updatedParticipant = await participantService.updateParticipantPasswordHash(participant.id, passwordHash);

  return {
    participant: participantService.mapParticipantToSession(updatedParticipant),
    temporaryPassword
  };
}

module.exports = {
  createMatch,
  createPhase,
  getAdminSession,
  getOverview,
  listMatches,
  listPhases,
  loginAdmin,
  recalculateRanking,
  resetParticipantPassword,
  setRegistrationState,
  updateMatch,
  updatePhase
};
