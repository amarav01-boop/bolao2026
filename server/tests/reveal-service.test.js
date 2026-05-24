const test = require('node:test');
const assert = require('node:assert/strict');

const { mergePredictions } = require('../services/reveal-service');

test('mergePredictions keeps explicit predictions distinct from defaulted missing rows', () => {
  const rows = mergePredictions(
    [
      { id: 10, phaseId: 1, groupCode: 'A', matchCode: 'a1', matchOrder: 1, homeTeamName: 'Brasil', awayTeamName: 'Japão' },
      { id: 11, phaseId: 1, groupCode: 'A', matchCode: 'a2', matchOrder: 2, homeTeamName: 'França', awayTeamName: 'EUA' }
    ],
    [
      { matchId: 10, predictedHomeScore: 2, predictedAwayScore: 1, isDefaulted: false, pointsAwarded: null }
    ]
  );

  assert.equal(rows[0].predictionHomeScore, 2);
  assert.equal(rows[0].predictionAwayScore, 1);
  assert.equal(rows[0].predictionIsDefaulted, false);
  assert.equal(rows[1].predictionHomeScore, 0);
  assert.equal(rows[1].predictionAwayScore, 0);
  assert.equal(rows[1].predictionIsDefaulted, true);
});
