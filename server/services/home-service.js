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

async function getHomeState(session) {
  const participant = participantService.getSessionParticipant(session);

  if (!participant) {
    throw createServiceError(401, 'AUTH_REQUIRED', 'É necessário fazer login.');
  }

  const phase = await competitionRepository.findCurrentCompetitionPhase();
  const rankingPayload = await rankingService.getRanking();
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
      }
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
    }
  };
}

module.exports = {
  buildAttentionMessage,
  getHomeState
};
