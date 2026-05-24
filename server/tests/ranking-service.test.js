const test = require('node:test');
const assert = require('node:assert/strict');

const { calculateDenseRanking } = require('../services/ranking-service');
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
