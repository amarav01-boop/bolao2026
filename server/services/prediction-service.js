const competitionRepository = require('../repositories/competition-repository');
const participantService = require('./participant-service');
const predictionRepository = require('../repositories/prediction-repository');

function createServiceError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeScore(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function calculatePredictionPoints({
  stageType,
  predictedHomeScore,
  predictedAwayScore,
  resultHomeScore,
  resultAwayScore
}) {
  if (
    predictedHomeScore === null ||
    predictedAwayScore === null ||
    resultHomeScore === null ||
    resultAwayScore === null ||
    resultHomeScore === undefined ||
    resultAwayScore === undefined
  ) {
    return null;
  }

  const exactMatch = predictedHomeScore === resultHomeScore && predictedAwayScore === resultAwayScore;
  const predictedOutcome = Math.sign(predictedHomeScore - predictedAwayScore);
  const actualOutcome = Math.sign(resultHomeScore - resultAwayScore);
  const outcomeMatch = predictedOutcome === actualOutcome;
  const exactPoints = stageType === 'group' ? 3 : 5;
  const outcomePoints = stageType === 'group' ? 1 : 2;

  if (exactMatch) {
    return exactPoints;
  }

  return outcomeMatch ? outcomePoints : 0;
}

function buildTeamOptions(matches = []) {
  const teams = new Map();

  matches.forEach((match) => {
    [
      { code: match.homeTeamCode, name: match.homeTeamName },
      { code: match.awayTeamCode, name: match.awayTeamName }
    ].forEach((team) => {
      if (!team.code || !team.name) {
        return;
      }

      teams.set(team.code, {
        code: team.code,
        name: team.name
      });
    });
  });

  return Array.from(teams.values()).sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

function buildGroups(matches = []) {
  const groups = new Map();

  matches.forEach((match) => {
    const groupCode = match.groupCode || '';
    const groupLabel = groupCode ? `Grupo ${groupCode}` : match.phaseName || 'Geral';

    if (!groups.has(groupCode)) {
      groups.set(groupCode, {
        code: groupCode,
        label: groupLabel,
        matches: []
      });
    }

    groups.get(groupCode).matches.push(match);
  });

  return Array.from(groups.values());
}

function mergePrediction(match, prediction) {
  return {
    id: Number(match.id),
    phaseId: Number(match.phaseId),
    phaseCode: match.phaseCode,
    phaseName: match.phaseName,
    stageType: match.stageType,
    groupCode: match.groupCode,
    matchCode: match.matchCode,
    matchOrder: Number(match.matchOrder),
    homeTeamName: match.homeTeamName,
    awayTeamName: match.awayTeamName,
    homeTeamCode: match.homeTeamCode,
    awayTeamCode: match.awayTeamCode,
    kickoffAt: match.kickoffAt,
    venue: match.venue,
    status: match.status,
    isPlayed: Boolean(match.isPlayed),
    resultHomeScore: match.resultHomeScore,
    resultAwayScore: match.resultAwayScore,
    predictionId: prediction ? prediction.id : null,
    predictionHomeScore: prediction ? prediction.predictedHomeScore : null,
    predictionAwayScore: prediction ? prediction.predictedAwayScore : null,
    predictionIsDefaulted: prediction ? prediction.isDefaulted : false,
    pointsAwarded: prediction ? prediction.pointsAwarded : null,
    createdAt: match.createdAt,
    updatedAt: match.updatedAt
  };
}

function buildActivePhasePayload(phase, matches, predictions, extras) {
  const predictionsByMatchId = new Map(predictions.map((prediction) => [prediction.matchId, prediction]));
  const mergedMatches = matches.map((match) => mergePrediction(match, predictionsByMatchId.get(Number(match.id))));
  const groups = buildGroups(mergedMatches);
  const completedPredictions = mergedMatches.filter(
    (match) => match.predictionHomeScore !== null && match.predictionAwayScore !== null
  ).length;
  const missingPredictions = mergedMatches.length - completedPredictions;

  return {
    phase: {
      id: Number(phase.id),
      code: phase.code,
      name: phase.name,
      stageType: phase.stageType,
      groupCode: phase.groupCode,
      roundLabel: phase.roundLabel,
      sortOrder: Number(phase.sortOrder),
      windowState: phase.windowState,
      deadlineAt: phase.deadlineAt,
      matchCount: phase.matchCount === null || phase.matchCount === undefined ? null : Number(phase.matchCount),
      revealEnabled: Boolean(phase.revealEnabled)
    },
    matches: mergedMatches,
    groups,
    summary: {
      totalMatches: mergedMatches.length,
      completedPredictions,
      missingPredictions,
      completionPercent: mergedMatches.length ? Math.round((completedPredictions / mergedMatches.length) * 100) : 0
    },
    teamOptions: buildTeamOptions(matches),
    canEdit: phase.windowState === 'open',
    extras
  };
}

async function getActivePhasePredictionState(session) {
  const participant = participantService.getSessionParticipant(session);

  if (!participant) {
    throw createServiceError(401, 'AUTH_REQUIRED', 'É necessário fazer login.');
  }

  const phase = await competitionRepository.findCurrentCompetitionPhase();

  if (!phase) {
    return {
      phase: null,
      matches: [],
      groups: [],
      summary: {
        totalMatches: 0,
        completedPredictions: 0,
        missingPredictions: 0,
        completionPercent: 0
      },
      canEdit: false,
      extras: null
    };
  }

  const [matches, predictions, extras] = await Promise.all([
    competitionRepository.listCompetitionMatchesByPhaseId(phase.id),
    predictionRepository.listParticipantPredictionsForPhase(participant.id, phase.id),
    predictionRepository.findExtraPredictionForPhase(participant.id, phase.id)
  ]);

  return buildActivePhasePayload(phase, matches, predictions, extras);
}

function resolveTeamName(teamOptions, teamCode) {
  if (!teamCode) {
    return null;
  }

  const team = teamOptions.find((item) => item.code === teamCode);
  return team ? team.name : null;
}

async function saveActivePhasePredictions(session, input) {
  const participant = participantService.getSessionParticipant(session);

  if (!participant) {
    throw createServiceError(401, 'AUTH_REQUIRED', 'É necessário fazer login.');
  }

  const phase = await competitionRepository.findCurrentCompetitionPhase();

  if (!phase || phase.windowState !== 'open') {
    throw createServiceError(409, 'NO_ACTIVE_PHASE', 'Não há fase ativa aberta para palpites.');
  }

  if (Number(input.phaseId) !== Number(phase.id)) {
    throw createServiceError(409, 'PHASE_MISMATCH', 'A fase ativa mudou. Recarregue a página.');
  }

  const matches = await competitionRepository.listCompetitionMatchesByPhaseId(phase.id);
  const matchMap = new Map(matches.map((match) => [Number(match.id), match]));
  const payload = Array.isArray(input.predictions) ? input.predictions : [];

  for (const item of payload) {
    const matchId = Number(item.matchId);
    const match = matchMap.get(matchId);

    if (!match) {
      throw createServiceError(400, 'INVALID_MATCH', 'Um dos jogos enviados não pertence à fase ativa.');
    }

    const homeScore = normalizeScore(item.homeScore);
    const awayScore = normalizeScore(item.awayScore);

    if (homeScore === null || awayScore === null) {
      continue;
    }

    await predictionRepository.upsertParticipantPrediction({
      participantId: participant.id,
      matchId,
      phaseId: phase.id,
      predictedHomeScore: homeScore,
      predictedAwayScore: awayScore,
      isDefaulted: false,
      pointsAwarded: null
    });
  }

  if (input.extras && phase.code === 'group-stage') {
    const teamOptions = buildTeamOptions(matches);
    const teamByCode = new Map(teamOptions.map((team) => [team.code, team]));

    const champion = teamByCode.get(input.extras.championTeamCode) || null;
    const semiFinalist1 = teamByCode.get(input.extras.semiFinalist1Code) || null;
    const semiFinalist2 = teamByCode.get(input.extras.semiFinalist2Code) || null;
    const semiFinalist3 = teamByCode.get(input.extras.semiFinalist3Code) || null;
    const semiFinalist4 = teamByCode.get(input.extras.semiFinalist4Code) || null;

    await predictionRepository.upsertExtraPrediction({
      participantId: participant.id,
      phaseId: phase.id,
      championTeamCode: champion ? champion.code : null,
      championTeamName: champion ? champion.name : null,
      topScorerName: input.extras.topScorerName || null,
      topScorerGoals: input.extras.topScorerGoals ?? null,
      semiFinalist1Code: semiFinalist1 ? semiFinalist1.code : null,
      semiFinalist1Name: semiFinalist1 ? semiFinalist1.name : null,
      semiFinalist2Code: semiFinalist2 ? semiFinalist2.code : null,
      semiFinalist2Name: semiFinalist2 ? semiFinalist2.name : null,
      semiFinalist3Code: semiFinalist3 ? semiFinalist3.code : null,
      semiFinalist3Name: semiFinalist3 ? semiFinalist3.name : null,
      semiFinalist4Code: semiFinalist4 ? semiFinalist4.code : null,
      semiFinalist4Name: semiFinalist4 ? semiFinalist4.name : null,
      pointsAwarded: null
    });
  }

  return getActivePhasePredictionState(session);
}

async function ensureDefaultPredictionsForMatch(match) {
  const participants = await participantService.listPublicParticipants();
  const existingPredictions = await predictionRepository.listPredictionsForMatch(match.id);
  const predictedParticipantIds = new Set(existingPredictions.map((prediction) => Number(prediction.participantId)));

  for (const participant of participants) {
    if (predictedParticipantIds.has(Number(participant.id))) {
      continue;
    }

    await predictionRepository.upsertParticipantPrediction({
      participantId: participant.id,
      matchId: match.id,
      phaseId: match.phaseId,
      predictedHomeScore: 0,
      predictedAwayScore: 0,
      isDefaulted: true,
      pointsAwarded: null
    });
  }
}

async function refreshMatchPredictionPoints(matchId) {
  const match = await competitionRepository.findCompetitionMatchById(matchId);

  if (!match) {
    return;
  }

  if (!match.isPlayed || match.resultHomeScore === null || match.resultAwayScore === null) {
    return;
  }

  await ensureDefaultPredictionsForMatch(match);

  const predictions = await predictionRepository.listPredictionsForMatch(matchId);

  for (const prediction of predictions) {
    const points = calculatePredictionPoints({
      stageType: match.stageType,
      predictedHomeScore: prediction.predictedHomeScore,
      predictedAwayScore: prediction.predictedAwayScore,
      resultHomeScore: match.resultHomeScore,
      resultAwayScore: match.resultAwayScore
    });

    await predictionRepository.updatePredictionPoints(prediction.id, points);
  }
}

async function recalculateRankingPoints() {
  const matches = await competitionRepository.listPlayedCompetitionMatches();

  for (const match of matches) {
    await refreshMatchPredictionPoints(match.id);
  }

  return {
    recalculatedMatches: matches.length
  };
}

module.exports = {
  calculatePredictionPoints,
  getActivePhasePredictionState,
  recalculateRankingPoints,
  refreshMatchPredictionPoints,
  saveActivePhasePredictions
};
