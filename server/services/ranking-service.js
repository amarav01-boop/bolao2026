const participantService = require('./participant-service');
const competitionRepository = require('../repositories/competition-repository');
const predictionRepository = require('../repositories/prediction-repository');
const {
  calculateGroupClassificationPoints,
  calculateGroupStandings,
  hasCompleteScores
} = require('../utils/group-standings');

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
      avatarKey: participant.avatarKey,
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

  return ordered.map((participant) => {
    if (previousPoints === null || participant.points !== previousPoints) {
      currentRank += 1;
      previousPoints = participant.points;
    }

    return {
      ...participant,
      rank: currentRank,
      movement: 'steady',
      statusChip: participant.points > 0 ? 'Em alta' : 'Aguardando início da copa'
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

module.exports = {
  calculateGroupClassificationBonuses,
  calculateDenseRanking,
  getRanking
};
