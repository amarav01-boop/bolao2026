const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateDenseRanking,
  deriveRankingMovement,
  shouldPersistRankingPositions
} = require('../services/ranking-service');
const { calculatePredictionPoints } = require('../services/prediction-service');

test('calculateDenseRanking applies dense ranks and keeps all participants with zero points initially', () => {
  const ranking = calculateDenseRanking(
    [
      { id: 1, username: 'ana@example.com', nickname: 'Ana', avatarKey: 'craque' },
      { id: 2, username: 'bia@example.com', nickname: 'Bia', avatarKey: 'maestro' },
      { id: 3, username: 'caio@example.com', nickname: 'Caio', avatarKey: 'bruxo' }
    ],
    []
  );

  assert.deepEqual(
    ranking.map((row) => ({ nickname: row.nickname, rank: row.rank, points: row.points })),
    [
      { nickname: 'Ana', rank: 1, points: 0 },
      { nickname: 'Bia', rank: 1, points: 0 },
      { nickname: 'Caio', rank: 1, points: 0 }
    ]
  );
});

test('calculateDenseRanking totals points and does not skip tied positions', () => {
  const ranking = calculateDenseRanking(
    [
      { id: 1, username: 'ana@example.com', nickname: 'Ana', avatarKey: 'craque' },
      { id: 2, username: 'bia@example.com', nickname: 'Bia', avatarKey: 'maestro' },
      { id: 3, username: 'caio@example.com', nickname: 'Caio', avatarKey: 'bruxo' }
    ],
    [
      { participantId: 1, pointsAwarded: 3 },
      { participantId: 2, pointsAwarded: 3 },
      { participantId: 3, pointsAwarded: 1 }
    ]
  );

  assert.deepEqual(
    ranking.map((row) => ({ nickname: row.nickname, rank: row.rank, points: row.points })),
    [
      { nickname: 'Ana', rank: 1, points: 3 },
      { nickname: 'Bia', rank: 1, points: 3 },
      { nickname: 'Caio', rank: 2, points: 1 }
    ]
  );
});

test('calculateDenseRanking includes group classification bonus points', () => {
  const ranking = calculateDenseRanking(
    [
      { id: 1, username: 'ana@example.com', nickname: 'Ana', avatarKey: 'craque' },
      { id: 2, username: 'bia@example.com', nickname: 'Bia', avatarKey: 'maestro' }
    ],
    [
      { participantId: 1, pointsAwarded: 3 },
      { participantId: 2, pointsAwarded: 3 }
    ],
    [
      { participantId: 1, pointsAwarded: 5 },
      { participantId: 2, pointsAwarded: 0 }
    ]
  );

  assert.deepEqual(
    ranking.map((row) => ({ nickname: row.nickname, rank: row.rank, points: row.points })),
    [
      { nickname: 'Ana', rank: 1, points: 8 },
      { nickname: 'Bia', rank: 2, points: 3 }
    ]
  );
});

test('calculateDenseRanking includes persisted semifinal bonus points', () => {
  const ranking = calculateDenseRanking(
    [
      { id: 1, username: 'ana@example.com', nickname: 'Ana', avatarKey: 'craque' },
      { id: 2, username: 'bia@example.com', nickname: 'Bia', avatarKey: 'maestro' }
    ],
    [{ participantId: 2, pointsAwarded: 2 }],
    [{ participantId: 1, pointsAwarded: 1 }],
    [{ participantId: 1, pointsAwarded: 4 }, { participantId: 2, pointsAwarded: 1 }]
  );

  assert.deepEqual(
    ranking.map((row) => ({ nickname: row.nickname, points: row.points })),
    [
      { nickname: 'Ana', points: 5 },
      { nickname: 'Bia', points: 3 }
    ]
  );
});

test('deriveRankingMovement keeps an existing ranking neutral before the first baseline recalculation', () => {
  assert.deepEqual(
    deriveRankingMovement({
      currentPosition: null,
      lastPosition: null,
      points: 12,
      rankingHasStarted: true
    }),
    {
      rankDelta: null,
      movement: 'unknown',
      statusChip: 'Histórico iniciando'
    }
  );
});

test('deriveRankingMovement keeps the pre-competition state while everyone has zero points', () => {
  assert.deepEqual(
    deriveRankingMovement({
      currentPosition: 1,
      lastPosition: 1,
      points: 0,
      rankingHasStarted: false
    }),
    {
      rankDelta: 0,
      movement: 'steady',
      statusChip: 'Aguardando início da copa'
    }
  );
});

test('deriveRankingMovement applies upward status thresholds', () => {
  const cases = [
    { lastPosition: 4, currentPosition: 3, statusChip: 'Em alta' },
    { lastPosition: 5, currentPosition: 3, statusChip: 'Em alta' },
    { lastPosition: 6, currentPosition: 3, statusChip: 'Arrancada' },
    { lastPosition: 7, currentPosition: 3, statusChip: 'Arrancada' },
    { lastPosition: 8, currentPosition: 3, statusChip: 'Disparou' }
  ];

  cases.forEach((entry) => {
    const movement = deriveRankingMovement({
      ...entry,
      points: 10,
      rankingHasStarted: true
    });

    assert.equal(movement.movement, 'up');
    assert.equal(movement.rankDelta, entry.lastPosition - entry.currentPosition);
    assert.equal(movement.statusChip, entry.statusChip);
  });
});

test('deriveRankingMovement applies downward, steady, and unknown states', () => {
  assert.deepEqual(
    deriveRankingMovement({
      currentPosition: 5,
      lastPosition: 3,
      points: 8,
      rankingHasStarted: true
    }),
    { rankDelta: -2, movement: 'down', statusChip: 'Em queda' }
  );
  assert.deepEqual(
    deriveRankingMovement({
      currentPosition: 7,
      lastPosition: 3,
      points: 8,
      rankingHasStarted: true
    }),
    { rankDelta: -4, movement: 'down', statusChip: 'Queda forte' }
  );
  assert.deepEqual(
    deriveRankingMovement({
      currentPosition: 2,
      lastPosition: 2,
      points: 8,
      rankingHasStarted: true
    }),
    { rankDelta: 0, movement: 'steady', statusChip: 'Estável' }
  );
});

test('calculateDenseRanking returns persisted position movement while preserving dense ties', () => {
  const ranking = calculateDenseRanking(
    [
      {
        id: 1,
        username: 'ana@example.com',
        nickname: 'Ana',
        avatarKey: 'craque',
        currentPosition: 1,
        lastPosition: 3
      },
      {
        id: 2,
        username: 'bia@example.com',
        nickname: 'Bia',
        avatarKey: 'maestro',
        currentPosition: 1,
        lastPosition: 1
      },
      {
        id: 3,
        username: 'caio@example.com',
        nickname: 'Caio',
        avatarKey: 'bruxo',
        currentPosition: 2,
        lastPosition: 1
      }
    ],
    [
      { participantId: 1, pointsAwarded: 5 },
      { participantId: 2, pointsAwarded: 5 },
      { participantId: 3, pointsAwarded: 3 }
    ]
  );

  assert.deepEqual(
    ranking.map((row) => ({
      rank: row.rank,
      currentPosition: row.currentPosition,
      lastPosition: row.lastPosition,
      movement: row.movement,
      statusChip: row.statusChip
    })),
    [
      {
        rank: 1,
        currentPosition: 1,
        lastPosition: 3,
        movement: 'up',
        statusChip: 'Em alta'
      },
      {
        rank: 1,
        currentPosition: 1,
        lastPosition: 1,
        movement: 'steady',
        statusChip: 'Estável'
      },
      {
        rank: 2,
        currentPosition: 2,
        lastPosition: 1,
        movement: 'down',
        statusChip: 'Em queda'
      }
    ]
  );
});

test('shouldPersistRankingPositions preserves movement on no-op manual recalculation', () => {
  const unchangedRanking = [
    { id: 1, rank: 1, currentPosition: 1, lastPosition: 3 },
    { id: 2, rank: 2, currentPosition: 2, lastPosition: 2 }
  ];

  assert.equal(shouldPersistRankingPositions(unchangedRanking), false);
  assert.equal(shouldPersistRankingPositions(unchangedRanking, true), true);
  assert.equal(
    shouldPersistRankingPositions([
      { id: 1, rank: 1, currentPosition: 1, lastPosition: 1 },
      { id: 2, rank: 2, currentPosition: 4, lastPosition: 4 }
    ]),
    true
  );
  assert.equal(
    shouldPersistRankingPositions([{ id: 1, rank: 1, currentPosition: null, lastPosition: null }]),
    true
  );
});

test('calculatePredictionPoints applies launch scoring rules for 90-minute match result', () => {
  assert.equal(
    calculatePredictionPoints({
      stageType: 'group',
      predictedHomeScore: 2,
      predictedAwayScore: 1,
      resultHomeScore: 2,
      resultAwayScore: 1
    }),
    3
  );

  assert.equal(
    calculatePredictionPoints({
      stageType: 'group',
      predictedHomeScore: 1,
      predictedAwayScore: 0,
      resultHomeScore: 3,
      resultAwayScore: 2
    }),
    1
  );

  assert.equal(
    calculatePredictionPoints({
      stageType: 'group',
      predictedHomeScore: 1,
      predictedAwayScore: 0,
      resultHomeScore: 0,
      resultAwayScore: 2
    }),
    0
  );
});

test('calculatePredictionPoints applies knockout scoring rules for 90-minute match result', () => {
  assert.equal(
    calculatePredictionPoints({
      stageType: 'knockout',
      predictedHomeScore: 2,
      predictedAwayScore: 1,
      resultHomeScore: 2,
      resultAwayScore: 1
    }),
    5
  );

  assert.equal(
    calculatePredictionPoints({
      stageType: 'knockout',
      predictedHomeScore: 1,
      predictedAwayScore: 0,
      resultHomeScore: 3,
      resultAwayScore: 2
    }),
    2
  );

  assert.equal(
    calculatePredictionPoints({
      stageType: 'knockout',
      predictedHomeScore: 1,
      predictedAwayScore: 1,
      resultHomeScore: 0,
      resultAwayScore: 0
    }),
    2
  );
});
