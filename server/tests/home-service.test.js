const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildAttentionMessage,
  buildDailyPredictionDistribution,
  buildExactHitHighlights
} = require('../services/home-service');

test('buildAttentionMessage prioritizes missing predictions before deadline', () => {
  const message = buildAttentionMessage({
    phase: { windowState: 'open' },
    summary: { missingPredictions: 4 }
  });

  assert.equal(message.tone, 'danger');
  assert.match(message.title, /pendentes/i);
  assert.match(message.body, /4 jogos/i);
});

test('buildAttentionMessage shows neutral waiting state when phase is not open', () => {
  const message = buildAttentionMessage({
    phase: { windowState: 'locked' },
    summary: { missingPredictions: 0 }
  });

  assert.equal(message.tone, 'neutral');
  assert.match(message.title, /aguardando/i);
});

test('buildDailyPredictionDistribution counts regular and defaulted predictions', () => {
  const distribution = buildDailyPredictionDistribution({
    now: new Date('2026-06-11T15:00:00-03:00'),
    matches: [
      {
        id: 10,
        homeTeamName: 'Brasil',
        awayTeamName: 'Canadá',
        kickoffAt: new Date('2026-06-11T19:00:00-03:00'),
        phaseWindowState: 'locked',
        phaseRevealEnabled: true,
        isPlayed: false
      }
    ],
    predictionsByMatch: new Map([
      [
        10,
        [
          { predictedHomeScore: 2, predictedAwayScore: 0, isDefaulted: false },
          { predictedHomeScore: 1, predictedAwayScore: 0, isDefaulted: false },
          { predictedHomeScore: 0, predictedAwayScore: 0, isDefaulted: true },
          { predictedHomeScore: 0, predictedAwayScore: 1, isDefaulted: false }
        ]
      ]
    ])
  });

  assert.equal(distribution.available, true);
  assert.equal(distribution.matches.length, 1);
  assert.deepEqual(distribution.matches[0].counts, { homeWin: 2, draw: 1, awayWin: 1, total: 4 });
  assert.deepEqual(distribution.matches[0].percentages, { homeWin: 50, draw: 25, awayWin: 25 });
});

test('buildDailyPredictionDistribution hides matches whose predictions are not revealed', () => {
  const distribution = buildDailyPredictionDistribution({
    now: new Date('2026-06-11T15:00:00-03:00'),
    matches: [
      {
        id: 10,
        kickoffAt: new Date('2026-06-11T19:00:00-03:00'),
        phaseWindowState: 'locked',
        phaseRevealEnabled: false,
        isPlayed: false
      }
    ],
    predictionsByMatch: new Map([[10, [{ predictedHomeScore: 1, predictedAwayScore: 0 }]]])
  });

  assert.equal(distribution.available, false);
  assert.deepEqual(distribution.matches, []);
});

test('buildDailyPredictionDistribution excludes matches already played today', () => {
  const distribution = buildDailyPredictionDistribution({
    now: new Date('2026-06-11T20:00:00-03:00'),
    matches: [
      {
        id: 10,
        kickoffAt: new Date('2026-06-11T15:00:00-03:00'),
        phaseWindowState: 'locked',
        phaseRevealEnabled: true,
        isPlayed: true
      }
    ],
    predictionsByMatch: new Map([[10, [{ predictedHomeScore: 2, predictedAwayScore: 0 }]]])
  });

  assert.equal(distribution.available, false);
  assert.deepEqual(distribution.matches, []);
});

test('buildExactHitHighlights returns participants with exact scores for revealed completed matches', () => {
  const highlights = buildExactHitHighlights({
    matches: [
      {
        id: 21,
        homeTeamName: 'Brasil',
        awayTeamName: 'Japão',
        kickoffAt: new Date('2026-06-20T16:00:00-03:00'),
        isPlayed: true,
        resultHomeScore: 3,
        resultAwayScore: 1,
        phaseRevealEnabled: true
      }
    ],
    predictionsByMatch: new Map([
      [
        21,
        [
          { participantId: 7, predictedHomeScore: 3, predictedAwayScore: 1 },
          { participantId: 8, predictedHomeScore: 2, predictedAwayScore: 1 }
        ]
      ]
    ]),
    participantsById: new Map([
      [7, { id: 7, nickname: 'Nego Veio', city: 'São Paulo', avatarKey: 'craque' }],
      [8, { id: 8, nickname: 'Maestro', city: 'Campinas', avatarKey: 'maestro' }]
    ])
  });

  assert.equal(highlights.length, 1);
  assert.equal(highlights[0].participants.length, 1);
  assert.equal(highlights[0].participants[0].nickname, 'Nego Veio');
  assert.deepEqual(highlights[0].score, { home: 3, away: 1 });
});

test('buildExactHitHighlights ignores unrevealed matches and returns an empty state', () => {
  const highlights = buildExactHitHighlights({
    matches: [
      {
        id: 21,
        isPlayed: true,
        resultHomeScore: 0,
        resultAwayScore: 0,
        phaseRevealEnabled: false
      }
    ],
    predictionsByMatch: new Map([
      [21, [{ participantId: 7, predictedHomeScore: 0, predictedAwayScore: 0, isDefaulted: true }]]
    ]),
    participantsById: new Map([[7, { id: 7, nickname: 'Nego Veio' }]])
  });

  assert.deepEqual(highlights, []);
});
