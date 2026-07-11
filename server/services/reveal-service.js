const competitionRepository = require('../repositories/competition-repository');
const participantService = require('./participant-service');
const predictionRepository = require('../repositories/prediction-repository');
const semifinalAnswerKeyService = require('./semifinal-answer-key-service');

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

function buildOfficialAnswerKey(answerKey) {
  if (!answerKey) {
    return {
      champion: null,
      semiFinalists: [],
      topScorer: { name: '', goals: null }
    };
  }

  const semifinalTeams = (answerKey.teams?.length ? answerKey.teams : answerKey.teamCodes || [])
    .map((team) => {
      if (typeof team === 'string') {
        return buildRevealTeam(team, team);
      }

      return buildRevealTeam(team?.code, team?.name);
    })
    .filter((team) => team.code || team.name);

  return {
    champion: answerKey.championTeamCode
      ? buildRevealTeam(answerKey.championTeamCode, answerKey.championTeamName)
      : null,
    semiFinalists: semifinalTeams,
    topScorer: {
      name: answerKey.topScorerName || '',
      goals: answerKey.topScorerGoals === null || answerKey.topScorerGoals === undefined
        ? null
        : Number(answerKey.topScorerGoals)
    }
  };
}

function buildRevealExtras(extraPrediction, answerKey = null) {
  if (!extraPrediction) {
    return null;
  }

  const participantPrediction = {
    championTeamCode: extraPrediction.championTeamCode,
    semiFinalistCodes: [
      extraPrediction.semiFinalist1Code,
      extraPrediction.semiFinalist2Code,
      extraPrediction.semiFinalist3Code,
      extraPrediction.semiFinalist4Code
    ],
    topScorerName: extraPrediction.topScorerName,
    topScorerGoals: extraPrediction.topScorerGoals
  };
  const participantSemiFinalists = [1, 2, 3, 4].map((index) =>
    buildRevealTeam(
      extraPrediction[`semiFinalist${index}Code`],
      extraPrediction[`semiFinalist${index}Name`]
    )
  );
  const official = buildOfficialAnswerKey(answerKey);
  const breakdown = semifinalAnswerKeyService.calculateExtraPredictionBreakdown(
    participantPrediction,
    answerKey || {}
  );

  return {
    pointsAwarded: Number.isFinite(Number(extraPrediction.pointsAwarded))
      ? Number(extraPrediction.pointsAwarded)
      : null,
    champion: buildRevealTeam(
      extraPrediction.championTeamCode,
      extraPrediction.championTeamName
    ),
    semiFinalists: participantSemiFinalists,
    topScorer: {
      name: extraPrediction.topScorerName || 'Não informado',
      goals:
        extraPrediction.topScorerGoals === null ||
        extraPrediction.topScorerGoals === undefined
          ? null
          : Number(extraPrediction.topScorerGoals)
    },
    scoring: {
      totalPoints: breakdown.totalPoints,
      calculatedCategories: breakdown.calculatedCategories,
      categories: {
        semifinalists: {
          ...breakdown.categories.semifinalists,
          prediction: participantSemiFinalists,
          answer: official.semiFinalists
        },
        champion: {
          ...breakdown.categories.champion,
          prediction: buildRevealTeam(
            extraPrediction.championTeamCode,
            extraPrediction.championTeamName
          ),
          answer: official.champion
        },
        topScorer: {
          ...breakdown.categories.topScorer,
          prediction: { name: extraPrediction.topScorerName || 'Não informado' },
          answer: { name: official.topScorer.name || '' }
        },
        topScorerGoals: {
          ...breakdown.categories.topScorerGoals,
          prediction: extraPrediction.topScorerGoals === null || extraPrediction.topScorerGoals === undefined
            ? null
            : Number(extraPrediction.topScorerGoals),
          answer: official.topScorer.goals
        }
      }
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
  const answerKey = await semifinalAnswerKeyService.getSemifinalAnswerKey();

  for (const phase of revealedPhases) {
    const [matches, predictions, extraPrediction] = await Promise.all([
      competitionRepository.listCompetitionMatchesByPhaseId(phase.id),
      predictionRepository.listParticipantPredictionsForPhase(selectedParticipant.id, phase.id),
      predictionRepository.findExtraPredictionForPhase(selectedParticipant.id, phase.id)
    ]);
    const mergedMatches = mergePredictions(matches, predictions);

    phasePayload.push({
      phase,
      extras: buildRevealExtras(extraPrediction, answerKey),
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
