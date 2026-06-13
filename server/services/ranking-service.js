const participantService = require('./participant-service');
const participantRepository = require('../repositories/participant-repository');
const competitionRepository = require('../repositories/competition-repository');
const predictionRepository = require('../repositories/prediction-repository');
const {
  calculateGroupClassificationPoints,
  calculateGroupStandings,
  hasCompleteScores
} = require('../utils/group-standings');

function deriveRankingMovement({
  currentPosition,
  lastPosition,
  rankingHasStarted = false
}) {
  const hasCurrentPosition = currentPosition !== null && currentPosition !== undefined;
  const hasLastPosition = lastPosition !== null && lastPosition !== undefined;

  if (!rankingHasStarted) {
    return {
      rankDelta: hasCurrentPosition && hasLastPosition ? Number(lastPosition) - Number(currentPosition) : null,
      movement: hasCurrentPosition && hasLastPosition ? 'steady' : 'unknown',
      statusChip: 'Aguardando início da copa'
    };
  }

  if (!hasCurrentPosition || !hasLastPosition) {
    return {
      rankDelta: null,
      movement: 'unknown',
      statusChip: 'Histórico iniciando'
    };
  }

  const rankDelta = Number(lastPosition) - Number(currentPosition);

  if (rankDelta >= 5) {
    return { rankDelta, movement: 'up', statusChip: 'Disparou' };
  }

  if (rankDelta >= 3) {
    return { rankDelta, movement: 'up', statusChip: 'Arrancada' };
  }

  if (rankDelta >= 1) {
    return { rankDelta, movement: 'up', statusChip: 'Em alta' };
  }

  if (rankDelta <= -3) {
    return { rankDelta, movement: 'down', statusChip: 'Queda forte' };
  }

  if (rankDelta <= -1) {
    return { rankDelta, movement: 'down', statusChip: 'Em queda' };
  }

  return { rankDelta: 0, movement: 'steady', statusChip: 'Estável' };
}

function shouldPersistRankingPositions(ranking = [], forceSnapshot = false) {
  if (forceSnapshot) {
    return true;
  }

  return ranking.some(
    (participant) =>
      participant.currentPosition === null ||
      participant.currentPosition === undefined ||
      Number(participant.currentPosition) !== Number(participant.rank)
  );
}

function calculateDenseRanking(participants = [], predictions = [], bonusPoints = []) {
  const pointsByParticipantId = predictions.reduce((accumulator, prediction) => {
    const participantId = Number(prediction.participantId);
    const points = prediction.pointsAwarded === null || prediction.pointsAwarded === undefined ? 0 : Number(prediction.pointsAwarded);

    accumulator.set(participantId, (accumulator.get(participantId) || 0) + points);
    return accumulator;
  }, new Map());

  bonusPoints.forEach((bonus) => {
    const participantId = Number(bonus.participantId);
    const points = bonus.pointsAwarded === null || bonus.pointsAwarded === undefined ? 0 : Number(bonus.pointsAwarded);
    pointsByParticipantId.set(participantId, (pointsByParticipantId.get(participantId) || 0) + points);
  });

  const ordered = participants
    .map((participant) => ({
      id: Number(participant.id),
      username: participant.username,
      nickname: participant.nickname,
      city: participant.city || '',
      avatarKey: participant.avatarKey,
      currentPosition: participant.currentPosition,
      lastPosition: participant.lastPosition,
      points: pointsByParticipantId.get(Number(participant.id)) || 0
    }))
    .sort((left, right) => {
      if (right.points !== left.points) {
        return right.points - left.points;
      }

      return String(left.nickname).localeCompare(String(right.nickname), 'pt-BR');
    });

  let currentRank = 0;
  let previousPoints = null;
  const rankingHasStarted = ordered.some((participant) => participant.points > 0);

  return ordered.map((participant) => {
    if (previousPoints === null || participant.points !== previousPoints) {
      currentRank += 1;
      previousPoints = participant.points;
    }

    return {
      ...participant,
      rank: currentRank,
      ...deriveRankingMovement({
        currentPosition: participant.currentPosition,
        lastPosition: participant.lastPosition,
        rankingHasStarted
      })
    };
  });
}

function groupMatchesByCode(matches = []) {
  return matches.reduce((accumulator, match) => {
    const groupCode = match.groupCode || '';

    if (!groupCode) {
      return accumulator;
    }

    if (!accumulator.has(groupCode)) {
      accumulator.set(groupCode, []);
    }

    accumulator.get(groupCode).push(match);
    return accumulator;
  }, new Map());
}

async function calculateGroupClassificationBonuses(participants = []) {
  const phases = await competitionRepository.listCompetitionPhases();
  const groupPhase = phases.find((phase) => phase.stageType === 'group');

  if (!groupPhase) {
    return [];
  }

  const [matches, predictions] = await Promise.all([
    competitionRepository.listCompetitionMatchesByPhaseId(groupPhase.id),
    predictionRepository.listPredictionsForPhase(groupPhase.id)
  ]);
  const groups = groupMatchesByCode(matches);
  const predictionsByParticipantAndMatch = predictions.reduce((accumulator, prediction) => {
    accumulator.set(`${prediction.participantId}:${prediction.matchId}`, prediction);
    return accumulator;
  }, new Map());
  const bonuses = [];

  groups.forEach((groupMatches, groupCode) => {
    const realReady = hasCompleteScores(groupMatches, (match) => ({
      homeScore: match.isPlayed ? match.resultHomeScore : null,
      awayScore: match.isPlayed ? match.resultAwayScore : null
    }));

    if (!realReady) {
      return;
    }

    const realStandings = calculateGroupStandings(groupMatches, (match) => ({
      homeScore: match.resultHomeScore,
      awayScore: match.resultAwayScore
    }));

    participants.forEach((participant) => {
      const predictedStandings = calculateGroupStandings(groupMatches, (match) => {
        const prediction = predictionsByParticipantAndMatch.get(`${participant.id}:${match.id}`);
        return {
          homeScore: prediction ? prediction.predictedHomeScore : 0,
          awayScore: prediction ? prediction.predictedAwayScore : 0
        };
      });
      const pointsAwarded = calculateGroupClassificationPoints(predictedStandings, realStandings);

      bonuses.push({
        participantId: participant.id,
        phaseId: groupPhase.id,
        groupCode,
        pointsAwarded
      });
    });
  });

  return bonuses;
}

async function getRanking() {
  const participants = await participantService.listPublicParticipants();
  const [predictions, groupClassificationBonuses] = await Promise.all([
    predictionRepository.listAllPredictions(),
    calculateGroupClassificationBonuses(participants)
  ]);

  return {
    ranking: calculateDenseRanking(participants, predictions, groupClassificationBonuses),
    generatedAt: new Date().toISOString()
  };
}

async function recalculateRankingPositions({ forceSnapshot = false } = {}) {
  const rankingPayload = await getRanking();
  const shouldPersist = shouldPersistRankingPositions(rankingPayload.ranking, forceSnapshot);
  const updatedParticipants = shouldPersist
    ? await participantRepository.updateRankingPositions(rankingPayload.ranking)
    : 0;

  return {
    updatedParticipants,
    snapshotCreated: shouldPersist,
    ranking: rankingPayload.ranking
  };
}

module.exports = {
  calculateGroupClassificationBonuses,
  calculateDenseRanking,
  deriveRankingMovement,
  recalculateRankingPositions,
  shouldPersistRankingPositions,
  getRanking
};
