const competitionRepository = require('../repositories/competition-repository');
const predictionRepository = require('../repositories/prediction-repository');
const participantService = require('./participant-service');
const rankingService = require('./ranking-service');

function createServiceError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function buildAttentionMessage({ phase, summary }) {
  if (!phase) {
    return {
      tone: 'warning',
      title: 'Nenhuma fase aberta',
      body: 'Aguarde o admin abrir a próxima janela de palpites.'
    };
  }

  if (phase.windowState === 'open' && summary.missingPredictions > 0) {
    return {
      tone: 'danger',
      title: 'Você ainda tem palpites pendentes',
      body: `Faltam ${summary.missingPredictions} jogo${summary.missingPredictions === 1 ? '' : 's'} para fechar esta fase.`
    };
  }

  if (phase.windowState === 'open') {
    return {
      tone: 'success',
      title: 'Palpites da fase em dia',
      body: 'Você pode revisar seus placares até o fechamento da janela.'
    };
  }

  return {
    tone: 'neutral',
    title: 'Aguardando próximos resultados',
    body: 'Quando os jogos forem atualizados, o ranking começa a se mover.'
  };
}

function getBrazilDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function calculatePercentages(counts) {
  const values = [counts.homeWin, counts.draw, counts.awayWin];

  if (!counts.total) {
    return { homeWin: 0, draw: 0, awayWin: 0 };
  }

  const exact = values.map((value) => (value / counts.total) * 100);
  const roundedDown = exact.map(Math.floor);
  let remaining = 100 - roundedDown.reduce((total, value) => total + value, 0);
  const remainderOrder = exact
    .map((value, index) => ({ index, remainder: value - roundedDown[index] }))
    .sort((left, right) => right.remainder - left.remainder || left.index - right.index);

  for (let index = 0; index < remaining; index += 1) {
    roundedDown[remainderOrder[index].index] += 1;
  }

  return {
    homeWin: roundedDown[0],
    draw: roundedDown[1],
    awayWin: roundedDown[2]
  };
}

function isDailyDistributionMatch(match, todayKey) {
  return (
    match.phaseRevealEnabled &&
    match.phaseWindowState !== 'open' &&
    getBrazilDateKey(match.kickoffAt) === todayKey
  );
}

function buildDailyPredictionDistribution({ matches = [], predictionsByMatch = new Map(), now = new Date() }) {
  const todayKey = getBrazilDateKey(now);
  const relevantMatches = matches.filter((match) => isDailyDistributionMatch(match, todayKey));

  return {
    available: relevantMatches.length > 0,
    date: todayKey,
    matches: relevantMatches.map((match) => {
      const predictions = (predictionsByMatch.get(match.id) || []).filter(
        (prediction) =>
          prediction.predictedHomeScore !== null &&
          prediction.predictedHomeScore !== undefined &&
          prediction.predictedAwayScore !== null &&
          prediction.predictedAwayScore !== undefined
      );
      const counts = predictions.reduce(
        (totals, prediction) => {
          if (prediction.predictedHomeScore > prediction.predictedAwayScore) {
            totals.homeWin += 1;
          } else if (prediction.predictedHomeScore < prediction.predictedAwayScore) {
            totals.awayWin += 1;
          } else {
            totals.draw += 1;
          }

          totals.total += 1;
          return totals;
        },
        { homeWin: 0, draw: 0, awayWin: 0, total: 0 }
      );

      return {
        id: match.id,
        homeTeamName: match.homeTeamName,
        awayTeamName: match.awayTeamName,
        kickoffAt: match.kickoffAt,
        counts,
        percentages: calculatePercentages(counts)
      };
    })
  };
}

function buildExactHitHighlights({
  matches = [],
  predictionsByMatch = new Map(),
  participantsById = new Map(),
  maxMatches = 6
}) {
  return matches
    .filter(
      (match) =>
        match.isPlayed &&
        match.phaseRevealEnabled &&
        match.resultHomeScore !== null &&
        match.resultHomeScore !== undefined &&
        match.resultAwayScore !== null &&
        match.resultAwayScore !== undefined
    )
    .sort((left, right) => new Date(right.kickoffAt || 0) - new Date(left.kickoffAt || 0))
    .map((match) => {
      const participants = (predictionsByMatch.get(match.id) || [])
        .filter(
          (prediction) =>
            Number(prediction.predictedHomeScore) === Number(match.resultHomeScore) &&
            Number(prediction.predictedAwayScore) === Number(match.resultAwayScore)
        )
        .map((prediction) => participantsById.get(Number(prediction.participantId)))
        .filter(Boolean)
        .map((participant) => ({
          id: participant.id,
          nickname: participant.nickname,
          city: participant.city || '',
          avatarKey: participant.avatarKey
        }));

      return {
        id: match.id,
        homeTeamName: match.homeTeamName,
        awayTeamName: match.awayTeamName,
        kickoffAt: match.kickoffAt,
        score: {
          home: Number(match.resultHomeScore),
          away: Number(match.resultAwayScore)
        },
        participants
      };
    })
    .filter((match) => match.participants.length > 0)
    .slice(0, maxMatches);
}

async function loadDailyPredictionDistribution() {
  const matches = await competitionRepository.listCompetitionMatches();
  const todayKey = getBrazilDateKey(new Date());
  const relevantMatches = matches.filter((match) => isDailyDistributionMatch(match, todayKey));
  const predictionLists = await Promise.all(
    relevantMatches.map((match) => predictionRepository.listPredictionsForMatch(match.id))
  );
  const predictionsByMatch = new Map(
    relevantMatches.map((match, index) => [match.id, predictionLists[index]])
  );

  return buildDailyPredictionDistribution({ matches, predictionsByMatch });
}

async function loadExactHitHighlights() {
  const matches = (await competitionRepository.listPlayedCompetitionMatches())
    .filter((match) => match.phaseRevealEnabled)
    .sort((left, right) => new Date(right.kickoffAt || 0) - new Date(left.kickoffAt || 0))
    .slice(0, 8);

  if (!matches.length) {
    return [];
  }

  const [predictionLists, participants] = await Promise.all([
    Promise.all(matches.map((match) => predictionRepository.listPredictionsForMatch(match.id))),
    participantService.listPublicParticipants()
  ]);
  const predictionsByMatch = new Map(matches.map((match, index) => [match.id, predictionLists[index]]));
  const participantsById = new Map(participants.map((participant) => [Number(participant.id), participant]));

  return buildExactHitHighlights({ matches, predictionsByMatch, participantsById });
}

async function getHomeState(session) {
  const participant = participantService.getSessionParticipant(session);

  if (!participant) {
    throw createServiceError(401, 'AUTH_REQUIRED', 'É necessário fazer login.');
  }

  const [phase, rankingPayload, dailyPredictionDistribution, exactHitHighlights] = await Promise.all([
    competitionRepository.findCurrentCompetitionPhase(),
    rankingService.getRanking(),
    loadDailyPredictionDistribution(),
    loadExactHitHighlights()
  ]);
  const ranking = rankingPayload.ranking;
  const currentParticipantRanking = ranking.find((row) => Number(row.id) === Number(participant.id)) || null;

  if (!phase) {
    return {
      phase: null,
      summary: {
        totalMatches: 0,
        completedPredictions: 0,
        missingPredictions: 0,
        completionPercent: 0
      },
      attention: buildAttentionMessage({ phase: null, summary: { missingPredictions: 0 } }),
      rankingSnapshot: {
        currentParticipant: currentParticipantRanking,
        top: ranking.slice(0, 5)
      },
      dailyPredictionDistribution,
      exactHitHighlights
    };
  }

  const [matches, predictions] = await Promise.all([
    competitionRepository.listCompetitionMatchesByPhaseId(phase.id),
    predictionRepository.listParticipantPredictionsForPhase(participant.id, phase.id)
  ]);
  const completedPredictions = predictions.filter(
    (prediction) => prediction.predictedHomeScore !== null && prediction.predictedAwayScore !== null
  ).length;
  const summary = {
    totalMatches: matches.length,
    completedPredictions,
    missingPredictions: Math.max(0, matches.length - completedPredictions),
    completionPercent: matches.length ? Math.round((completedPredictions / matches.length) * 100) : 0
  };

  return {
    phase,
    summary,
    attention: buildAttentionMessage({ phase, summary }),
    rankingSnapshot: {
      currentParticipant: currentParticipantRanking,
      top: ranking.slice(0, 5)
    },
    dailyPredictionDistribution,
    exactHitHighlights
  };
}

module.exports = {
  buildAttentionMessage,
  buildDailyPredictionDistribution,
  buildExactHitHighlights,
  getHomeState
};
