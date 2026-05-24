function normalizeScore(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function ensureTeam(table, code, name) {
  const key = code || name;

  if (!key) {
    return null;
  }

  if (!table.has(key)) {
    table.set(key, {
      key,
      code: code || key,
      name: name || code,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0
    });
  }

  return table.get(key);
}

function calculateGroupStandings(matches = [], scoreResolver) {
  const table = new Map();

  matches.forEach((match) => {
    const home = ensureTeam(table, match.homeTeamCode, match.homeTeamName);
    const away = ensureTeam(table, match.awayTeamCode, match.awayTeamName);
    const scores = scoreResolver(match);
    const homeScore = normalizeScore(scores && scores.homeScore);
    const awayScore = normalizeScore(scores && scores.awayScore);

    if (!home || !away || homeScore === null || awayScore === null) {
      return;
    }

    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.points += 3;
    } else if (homeScore < awayScore) {
      away.points += 3;
    } else {
      home.points += 1;
      away.points += 1;
    }
  });

  return Array.from(table.values())
    .map((team) => ({
      ...team,
      goalDifference: team.goalsFor - team.goalsAgainst
    }))
    .sort((left, right) => {
      if (right.points !== left.points) {
        return right.points - left.points;
      }

      if (right.goalDifference !== left.goalDifference) {
        return right.goalDifference - left.goalDifference;
      }

      if (right.goalsFor !== left.goalsFor) {
        return right.goalsFor - left.goalsFor;
      }

      return String(left.name).localeCompare(String(right.name), 'pt-BR');
    });
}

function hasCompleteScores(matches = [], scoreResolver) {
  return matches.length > 0 && matches.every((match) => {
    const scores = scoreResolver(match);
    return normalizeScore(scores && scores.homeScore) !== null && normalizeScore(scores && scores.awayScore) !== null;
  });
}

function calculateGroupClassificationPoints(predictedStandings = [], realStandings = []) {
  if (!predictedStandings.length || predictedStandings.length !== realStandings.length) {
    return null;
  }

  const predictedOrder = predictedStandings.map((team) => team.code).join('|');
  const realOrder = realStandings.map((team) => team.code).join('|');
  return predictedOrder === realOrder ? 5 : 0;
}

module.exports = {
  calculateGroupClassificationPoints,
  calculateGroupStandings,
  hasCompleteScores
};
