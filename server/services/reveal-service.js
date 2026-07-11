const competitionRepository = require('../repositories/competition-repository');
const participantService = require('./participant-service');
const predictionRepository = require('../repositories/prediction-repository');

function createServiceError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function buildGroups(matches = []) {
  const groups = new Map();

  matches.forEach((match) => {
    const groupCode = match.groupCode || 'geral';
    const label = match.groupCode ? `Grupo ${match.groupCode}` : match.phaseName || 'Geral';

    if (!groups.has(groupCode)) {
      groups.set(groupCode, {
        code: groupCode,
        label,
        matches: []
      });
    }

    groups.get(groupCode).matches.push(match);
  });

  return Array.from(groups.values()).sort((left, right) => String(left.code).localeCompare(String(right.code), 'pt-BR', { numeric: true, sensitivity: 'base' }));
}

function mergePredictions(matches, predictions) {
  const predictionsByMatchId = new Map(predictions.map((prediction) => [Number(prediction.matchId), prediction]));

  return matches.map((match) => {
    const prediction = predictionsByMatchId.get(Number(match.id));
    const hasPrediction =
      prediction &&
      prediction.predictedHomeScore !== null &&
      prediction.predictedAwayScore !== null;

    return {
      id: match.id,
      phaseId: match.phaseId,
      groupCode: match.groupCode,
      matchCode: match.matchCode,
      matchOrder: match.matchOrder,
      homeTeamName: match.homeTeamName,
      awayTeamName: match.awayTeamName,
      kickoffAt: match.kickoffAt,
      predictionHomeScore: hasPrediction ? prediction.predictedHomeScore : 0,
      predictionAwayScore: hasPrediction ? prediction.predictedAwayScore : 0,
      predictionIsDefaulted: hasPrediction ? prediction.isDefaulted : true,
      resultHomeScore: match.resultHomeScore,
      resultAwayScore: match.resultAwayScore,
      isPlayed: match.isPlayed,
      pointsAwarded: prediction ? prediction.pointsAwarded : null
    };
  });
}

function buildRevealTeam(code, name) {
  return {
    code: code || '',
    name: name || code || 'Não informado'
  };
}

function buildRevealExtras(extraPrediction) {
  if (!extraPrediction) {
    return null;
  }

  return {
    pointsAwarded: Number.isFinite(Number(extraPrediction.pointsAwarded))
      ? Number(extraPrediction.pointsAwarded)
      : null,
    champion: buildRevealTeam(
      extraPrediction.championTeamCode,
      extraPrediction.championTeamName
    ),
    semiFinalists: [1, 2, 3, 4].map((index) =>
      buildRevealTeam(
        extraPrediction[`semiFinalist${index}Code`],
        extraPrediction[`semiFinalist${index}Name`]
      )
    ),
    topScorer: {
      name: extraPrediction.topScorerName || 'Não informado',
      goals:
        extraPrediction.topScorerGoals === null ||
        extraPrediction.topScorerGoals === undefined
          ? null
          : Number(extraPrediction.topScorerGoals)
    }
  };
}

async function getRevealState(session, selectedParticipantId) {
  const participant = participantService.getSessionParticipant(session);

  if (!participant) {
    throw createServiceError(401, 'AUTH_REQUIRED', 'É necessário fazer login.');
  }

  const [participants, phases] = await Promise.all([
    participantService.listPublicParticipants(),
    competitionRepository.listCompetitionPhases()
  ]);
  const revealedPhases = phases.filter((phase) => phase.revealEnabled);

  if (!revealedPhases.length) {
    return {
      participants,
      selectedParticipant: null,
      phases: [],
      state: 'unrevealed',
      message: 'Os palpites ainda não foram revelados pelo admin.'
    };
  }

  const selectedParticipant =
    participants.find((item) => Number(item.id) === Number(selectedParticipantId)) ||
    participants.find((item) => Number(item.id) === Number(participant.id)) ||
    participants[0] ||
    null;

  if (!selectedParticipant) {
    return {
      participants,
      selectedParticipant: null,
      phases: [],
      state: 'empty',
      message: 'Nenhum participante disponível para consulta.'
    };
  }

  const phasePayload = [];

  for (const phase of revealedPhases) {
    const [matches, predictions, extraPrediction] = await Promise.all([
      competitionRepository.listCompetitionMatchesByPhaseId(phase.id),
      predictionRepository.listParticipantPredictionsForPhase(selectedParticipant.id, phase.id),
      predictionRepository.findExtraPredictionForPhase(selectedParticipant.id, phase.id)
    ]);
    const mergedMatches = mergePredictions(matches, predictions);

    phasePayload.push({
      phase,
      extras: buildRevealExtras(extraPrediction),
      groups: buildGroups(mergedMatches),
      matches: mergedMatches
    });
  }

  return {
    participants,
    selectedParticipant,
    phases: phasePayload,
    state: 'revealed',
    message: 'Palpites revelados para consulta.'
  };
}

module.exports = {
  buildGroups,
  buildRevealExtras,
  getRevealState,
  mergePredictions
};
