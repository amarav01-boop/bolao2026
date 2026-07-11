const competitionRepository = require('../repositories/competition-repository');
const answerKeyRepository = require('../repositories/semifinal-answer-key-repository');

function createServiceError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeTeamCode(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizePersonName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function levenshteinDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function isScorerNameMatch(predictedName, officialName) {
  const predicted = normalizePersonName(predictedName);
  const official = normalizePersonName(officialName);

  if (!predicted || !official) {
    return false;
  }
  if (predicted === official) {
    return true;
  }

  const predictedTokens = predicted.split(' ');
  const officialTokens = official.split(' ');
  const ignoredSingleTokens = new Set(['jr', 'junior', 'filho', 'neto']);

  if (predictedTokens.length === 1) {
    const token = predictedTokens[0];
    return token.length >= 4 && !ignoredSingleTokens.has(token) && officialTokens.includes(token);
  }

  if (
    predictedTokens.length <= officialTokens.length &&
    predictedTokens.every((token, index) => {
      const officialToken = officialTokens[index];
      return token.length >= 2 && (
        officialToken.startsWith(token) ||
        (token === 'jr' && officialToken === 'junior')
      );
    })
  ) {
    return true;
  }

  const longestLength = Math.max(predicted.length, official.length);
  return longestLength >= 5 && 1 - levenshteinDistance(predicted, official) / longestLength >= 0.85;
}

function calculateSemifinalPoints(selections = [], answerKey = []) {
  if (!Array.isArray(selections) || !Array.isArray(answerKey)) {
    return 0;
  }
  const answerSet = new Set(answerKey.map(normalizeTeamCode).filter(Boolean));
  const selectionSet = new Set(selections.map(normalizeTeamCode).filter(Boolean));
  return Array.from(selectionSet).filter((code) => answerSet.has(code)).length * 5;
}

function calculateExtraPredictionPoints(prediction = {}, answerKey = {}) {
  let points = calculateSemifinalPoints(prediction.semiFinalistCodes, answerKey.teamCodes);

  if (
    normalizeTeamCode(answerKey.championTeamCode) &&
    normalizeTeamCode(prediction.championTeamCode) === normalizeTeamCode(answerKey.championTeamCode)
  ) {
    points += 10;
  }
  if (isScorerNameMatch(prediction.topScorerName, answerKey.topScorerName)) {
    points += 10;
  }
  if (
    prediction.topScorerGoals !== null && prediction.topScorerGoals !== undefined &&
    answerKey.topScorerGoals !== null && answerKey.topScorerGoals !== undefined &&
    Number(prediction.topScorerGoals) === Number(answerKey.topScorerGoals)
  ) {
    points += 5;
  }

  return points;
}

async function getSemifinalAnswerKey() {
  return answerKeyRepository.findSemifinalAnswerKey();
}

async function listTournamentTeams() {
  const matches = await competitionRepository.listCompetitionMatches();
  const teamsByCode = new Map();

  matches.forEach((match) => {
    [
      { code: match.homeTeamCode, name: match.homeTeamName },
      { code: match.awayTeamCode, name: match.awayTeamName }
    ].forEach((team) => {
      const code = normalizeTeamCode(team.code);
      if (code && team.name && !teamsByCode.has(code)) {
        teamsByCode.set(code, { code, name: String(team.name).trim() });
      }
    });
  });

  return teamsByCode;
}

function toPersistedAnswerKey(answerKey) {
  const teams = answerKey?.teams || [];
  return {
    champion: answerKey?.championTeamCode
      ? { code: answerKey.championTeamCode, name: answerKey.championTeamName }
      : null,
    semifinalists: teams,
    teamCodes: answerKey?.teamCodes || teams.map((team) => team.code),
    topScorerName: answerKey?.topScorerName || null,
    topScorerGoals: answerKey?.topScorerGoals ?? null
  };
}

async function saveSemifinalAnswerKeyUnlocked(input) {
  const [teamsByCode, existing] = await Promise.all([
    listTournamentTeams(),
    answerKeyRepository.findSemifinalAnswerKey()
  ]);
  const semifinalists = input.teamCodes.map((code) => teamsByCode.get(normalizeTeamCode(code)));
  if (semifinalists.some((team) => !team)) {
    throw createServiceError(400, 'INVALID_SEMIFINAL_TEAM', 'Selecione apenas times cadastrados na competicao.');
  }
  if (existing?.championTeamCode && !input.teamCodes.includes(existing.championTeamCode)) {
    throw createServiceError(409, 'CHAMPION_NOT_SEMIFINALIST', 'O campeao salvo deve permanecer entre os semifinalistas.');
  }

  const answerKey = {
    ...toPersistedAnswerKey(existing),
    semifinalists,
    teamCodes: semifinalists.map((team) => team.code)
  };
  const updatedPredictions = await answerKeyRepository.saveAnswerKeyAndScores(
    answerKey,
    (prediction) => calculateExtraPredictionPoints(prediction, answerKey)
  );

  return {
    answerKey: await answerKeyRepository.findSemifinalAnswerKey(),
    updatedPredictions
  };
}

async function saveSemifinalAnswerKey(input) {
  return answerKeyRepository.withAnswerKeyLock(() => saveSemifinalAnswerKeyUnlocked(input));
}

async function saveFinalAnswerKeyUnlocked(input) {
  const existing = await answerKeyRepository.findSemifinalAnswerKey();
  if (existing?.teamCodes?.filter(Boolean).length !== 4) {
    throw createServiceError(409, 'SEMIFINAL_ANSWER_KEY_REQUIRED', 'Salve os semifinalistas antes do resultado final.');
  }

  const championCode = normalizeTeamCode(input.championTeamCode);
  const champion = existing.teams.find((team) => normalizeTeamCode(team.code) === championCode);
  if (!champion) {
    throw createServiceError(400, 'CHAMPION_NOT_SEMIFINALIST', 'O campeao deve estar entre os semifinalistas salvos.');
  }

  const answerKey = {
    ...toPersistedAnswerKey(existing),
    champion,
    topScorerName: input.topScorerName,
    topScorerGoals: input.topScorerGoals
  };
  const updatedPredictions = await answerKeyRepository.saveAnswerKeyAndScores(
    answerKey,
    (prediction) => calculateExtraPredictionPoints(prediction, answerKey)
  );

  return {
    answerKey: await answerKeyRepository.findSemifinalAnswerKey(),
    updatedPredictions
  };
}

async function saveFinalAnswerKey(input) {
  return answerKeyRepository.withAnswerKeyLock(() => saveFinalAnswerKeyUnlocked(input));
}

module.exports = {
  calculateExtraPredictionPoints,
  calculateSemifinalPoints,
  getSemifinalAnswerKey,
  normalizeTeamCode,
  isScorerNameMatch,
  normalizePersonName,
  saveFinalAnswerKey,
  saveSemifinalAnswerKey
};
