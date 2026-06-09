const ROUND_OF_32_MATCHES = [
  { code: 'M73', home: { type: 'runnerUp', group: 'A' }, away: { type: 'runnerUp', group: 'B' } },
  { code: 'M74', home: { type: 'winner', group: 'E' }, away: { type: 'bestThird', groups: ['A', 'B', 'C', 'D', 'F'] } },
  { code: 'M75', home: { type: 'winner', group: 'F' }, away: { type: 'runnerUp', group: 'C' } },
  { code: 'M76', home: { type: 'winner', group: 'C' }, away: { type: 'runnerUp', group: 'F' } },
  { code: 'M77', home: { type: 'winner', group: 'I' }, away: { type: 'bestThird', groups: ['C', 'D', 'F', 'G', 'H'] } },
  { code: 'M78', home: { type: 'runnerUp', group: 'E' }, away: { type: 'runnerUp', group: 'I' } },
  { code: 'M79', home: { type: 'winner', group: 'A' }, away: { type: 'bestThird', groups: ['C', 'E', 'F', 'H', 'I'] } },
  { code: 'M80', home: { type: 'winner', group: 'L' }, away: { type: 'bestThird', groups: ['E', 'H', 'I', 'J', 'K'] } },
  { code: 'M81', home: { type: 'winner', group: 'D' }, away: { type: 'bestThird', groups: ['B', 'E', 'F', 'I', 'J'] } },
  { code: 'M82', home: { type: 'winner', group: 'G' }, away: { type: 'bestThird', groups: ['A', 'E', 'H', 'I', 'J'] } },
  { code: 'M83', home: { type: 'runnerUp', group: 'K' }, away: { type: 'runnerUp', group: 'L' } },
  { code: 'M84', home: { type: 'winner', group: 'H' }, away: { type: 'runnerUp', group: 'J' } },
  { code: 'M85', home: { type: 'winner', group: 'B' }, away: { type: 'bestThird', groups: ['E', 'F', 'G', 'I', 'J'] } },
  { code: 'M86', home: { type: 'winner', group: 'J' }, away: { type: 'runnerUp', group: 'H' } },
  { code: 'M87', home: { type: 'winner', group: 'K' }, away: { type: 'bestThird', groups: ['D', 'E', 'I', 'J', 'L'] } },
  { code: 'M88', home: { type: 'runnerUp', group: 'D' }, away: { type: 'runnerUp', group: 'G' } }
];

const ROUND_OF_16_MATCHES = [
  { code: 'M89', sources: ['M74', 'M77'] },
  { code: 'M90', sources: ['M73', 'M75'] },
  { code: 'M91', sources: ['M76', 'M78'] },
  { code: 'M92', sources: ['M79', 'M80'] },
  { code: 'M93', sources: ['M83', 'M84'] },
  { code: 'M94', sources: ['M81', 'M82'] },
  { code: 'M95', sources: ['M86', 'M88'] },
  { code: 'M96', sources: ['M85', 'M87'] }
];

const QUARTER_FINAL_MATCHES = [
  { code: 'M97', sources: ['M89', 'M90'] },
  { code: 'M98', sources: ['M93', 'M94'] },
  { code: 'M99', sources: ['M91', 'M92'] },
  { code: 'M100', sources: ['M95', 'M96'] }
];

const SEMI_FINAL_MATCHES = [
  { code: 'M101', sources: ['M97', 'M98'] },
  { code: 'M102', sources: ['M99', 'M100'] }
];

const THIRD_PLACE_MATCH = { code: 'M103', sources: ['M101', 'M102'] };
const FINAL_MATCHES = [{ code: 'M104', sources: ['M101', 'M102'] }];

function compareTeams(left, right) {
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
}

function getGroupPosition(groupStandingsByCode, groupCode, index) {
  const standings = groupStandingsByCode.get(groupCode) || [];
  const team = standings[index];

  return team
    ? {
        ...team,
        groupCode,
        position: index + 1
      }
    : null;
}

function resolveFixedSlot(slot, groupStandingsByCode) {
  if (slot.type === 'winner') {
    return getGroupPosition(groupStandingsByCode, slot.group, 0);
  }

  if (slot.type === 'runnerUp') {
    return getGroupPosition(groupStandingsByCode, slot.group, 1);
  }

  return null;
}

function formatPlaceholder(slot) {
  if (slot.type === 'winner') {
    return `1º Grupo ${slot.group}`;
  }

  if (slot.type === 'runnerUp') {
    return `2º Grupo ${slot.group}`;
  }

  return `3º Grupo ${slot.groups.join('/')}`;
}

function createTeamLabel(team, fallback) {
  if (!team) {
    return fallback;
  }

  return `${team.name} (${team.position}º ${team.groupCode})`;
}

function resolveThirdPlaceSlots(groupStandingsByCode) {
  const thirdPlaced = Array.from(groupStandingsByCode.entries())
    .map(([groupCode, standings]) => {
      const team = standings[2];
      return team
        ? {
            ...team,
            groupCode,
            position: 3
          }
        : null;
    })
    .filter(Boolean)
    .sort(compareTeams);

  const bestThirds = thirdPlaced.slice(0, 8);
  const assignments = new Map();
  const thirdSlots = [];

  ROUND_OF_32_MATCHES.forEach((match) => {
    [match.home, match.away].forEach((slot, slotIndex) => {
      if (slot.type !== 'bestThird') {
        return;
      }

      thirdSlots.push({
        key: `${match.code}-${slotIndex}`,
        groups: slot.groups
      });
    });
  });

  function assignSlot(index, usedGroups) {
    if (index >= thirdSlots.length) {
      return true;
    }

    const slot = thirdSlots[index];
    const candidates = bestThirds.filter(
      (team) => slot.groups.includes(team.groupCode) && !usedGroups.has(team.groupCode)
    );

    for (const candidate of candidates) {
      assignments.set(slot.key, candidate);
      usedGroups.add(candidate.groupCode);

      if (assignSlot(index + 1, usedGroups)) {
        return true;
      }

      assignments.delete(slot.key);
      usedGroups.delete(candidate.groupCode);
    }

    return false;
  }

  assignSlot(0, new Set());

  return {
    bestThirds,
    assignments
  };
}

function resolveRoundOf32Match(match, groupStandingsByCode, thirdAssignments) {
  const slots = [match.home, match.away].map((slot, slotIndex) => {
    const team =
      slot.type === 'bestThird'
        ? thirdAssignments.assignments.get(`${match.code}-${slotIndex}`)
        : resolveFixedSlot(slot, groupStandingsByCode);

    return {
      slot,
      team,
      label: createTeamLabel(team, formatPlaceholder(slot))
    };
  });

  return {
    code: match.code,
    home: slots[0],
    away: slots[1],
    winner: null
  };
}

function resolveMatchWinner(match, winnerCodes) {
  const winnerCode = winnerCodes?.[match.code];

  if (!winnerCode) {
    return null;
  }

  return [match.home.team, match.away.team].find((team) => team?.code === winnerCode) || null;
}

function createPreviousWinnerSlot(sourceCode, previousMatchesByCode) {
  const sourceMatch = previousMatchesByCode.get(sourceCode);
  const team = sourceMatch?.winner || null;

  return {
    sourceCode,
    team,
    label: team ? createTeamLabel(team, `Vencedor ${sourceCode}`) : `Vencedor ${sourceCode}`
  };
}

function createPreviousLoserSlot(sourceCode, previousMatchesByCode) {
  const sourceMatch = previousMatchesByCode.get(sourceCode);
  const teams = [sourceMatch?.home?.team, sourceMatch?.away?.team].filter(Boolean);
  const team = sourceMatch?.winner
    ? teams.find((candidate) => candidate.code !== sourceMatch.winner.code) || null
    : null;

  return {
    sourceCode,
    team,
    label: team ? createTeamLabel(team, `Perdedor ${sourceCode}`) : `Perdedor ${sourceCode}`
  };
}

function createDerivedRound(matches, previousMatchesByCode, winnerCodes) {
  return matches.map((match) => {
    const resolvedMatch = {
      code: match.code,
      home: createPreviousWinnerSlot(match.sources[0], previousMatchesByCode),
      away: createPreviousWinnerSlot(match.sources[1], previousMatchesByCode),
      winner: null
    };

    resolvedMatch.winner = resolveMatchWinner(resolvedMatch, winnerCodes);
    return resolvedMatch;
  });
}

function createThirdPlaceMatch(previousMatchesByCode, winnerCodes) {
  const resolvedMatch = {
    code: THIRD_PLACE_MATCH.code,
    label: 'Disputa do 3º lugar',
    home: createPreviousLoserSlot(THIRD_PLACE_MATCH.sources[0], previousMatchesByCode),
    away: createPreviousLoserSlot(THIRD_PLACE_MATCH.sources[1], previousMatchesByCode),
    winner: null
  };

  resolvedMatch.winner = resolveMatchWinner(resolvedMatch, winnerCodes);
  return resolvedMatch;
}

function createMatchMap(matches) {
  return new Map(matches.map((match) => [match.code, match]));
}

export function buildKnockoutSimulation(groupStandingsByCode, winnerCodes = {}) {
  const thirdAssignments = resolveThirdPlaceSlots(groupStandingsByCode);
  const roundOf32 = ROUND_OF_32_MATCHES.map((match) =>
    resolveRoundOf32Match(match, groupStandingsByCode, thirdAssignments)
  );
  roundOf32.forEach((match) => {
    match.winner = resolveMatchWinner(match, winnerCodes);
  });

  const roundOf16 = createDerivedRound(ROUND_OF_16_MATCHES, createMatchMap(roundOf32), winnerCodes);
  const quarterFinals = createDerivedRound(QUARTER_FINAL_MATCHES, createMatchMap(roundOf16), winnerCodes);
  const semiFinals = createDerivedRound(SEMI_FINAL_MATCHES, createMatchMap(quarterFinals), winnerCodes);
  const semiFinalsByCode = createMatchMap(semiFinals);
  const final = createDerivedRound(FINAL_MATCHES, semiFinalsByCode, winnerCodes).map((match) => ({
    ...match,
    label: 'Final'
  }));
  const finals = [createThirdPlaceMatch(semiFinalsByCode, winnerCodes), ...final];

  return {
    bestThirds: thirdAssignments.bestThirds,
    roundOf32,
    roundOf16,
    quarterFinals,
    semiFinals,
    final: finals
  };
}
