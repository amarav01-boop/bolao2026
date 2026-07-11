const test = require('node:test');
const assert = require('node:assert/strict');

const { buildRevealExtras, mergePredictions } = require('../services/reveal-service');

test('buildRevealExtras exposes all participant extra predictions as read-only data', () => {
  const extras = buildRevealExtras({
    championTeamCode: 'BRA',
    championTeamName: 'Brasil',
    topScorerName: 'Vinicius Junior',
    topScorerGoals: 7,
    semiFinalist1Code: 'BRA',
    semiFinalist1Name: 'Brasil',
    semiFinalist2Code: 'FRA',
    semiFinalist2Name: 'França',
    semiFinalist3Code: 'ARG',
    semiFinalist3Name: 'Argentina',
    semiFinalist4Code: 'ESP',
    semiFinalist4Name: 'Espanha',
    pointsAwarded: 35
  });

  assert.equal(extras.champion.name, 'Brasil');
  assert.deepEqual(
    extras.semiFinalists.map((team) => team.name),
    ['Brasil', 'França', 'Argentina', 'Espanha']
  );
  assert.equal(extras.topScorer.name, 'Vinicius Junior');
  assert.equal(extras.topScorer.goals, 7);
  assert.equal(extras.pointsAwarded, 35);
});

test('buildRevealExtras returns null when the participant has no extra prediction row', () => {
  assert.equal(buildRevealExtras(null), null);
});

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
