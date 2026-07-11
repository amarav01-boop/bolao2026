const test = require('node:test');
const assert = require('node:assert/strict');

const {
  generateTemporaryPassword,
  hasScoringRelevantMatchChange,
  saveSemifinalAnswerKey
} = require('../services/admin-service');
const semifinalAnswerKeyService = require('../services/semifinal-answer-key-service');
const rankingService = require('../services/ranking-service');

test('generateTemporaryPassword returns a city name followed by three digits', () => {
  const generatedPasswords = Array.from({ length: 100 }, () => generateTemporaryPassword());

  generatedPasswords.forEach((password) => {
    assert.match(password, /^[A-Za-z]+[0-9]{3}$/);
  });
});

test('hasScoringRelevantMatchChange detects completed result updates only', () => {
  const scheduled = {
    isPlayed: false,
    resultHomeScore: null,
    resultAwayScore: null
  };
  const completed = {
    isPlayed: true,
    resultHomeScore: 2,
    resultAwayScore: 1
  };

  assert.equal(hasScoringRelevantMatchChange(scheduled, completed), true);
  assert.equal(
    hasScoringRelevantMatchChange(completed, {
      ...completed,
      venue: 'Outro estádio'
    }),
    false
  );
  assert.equal(
    hasScoringRelevantMatchChange(completed, {
      ...completed,
      resultAwayScore: 2
    }),
    true
  );
});

test('saveSemifinalAnswerKey saves complete extras before forcing ranking recalculation', async () => {
  const originalSave = semifinalAnswerKeyService.saveSemifinalAnswerKey;
  const originalRecalculate = rankingService.recalculateRankingPositions;
  const calls = [];
  const input = {
    championTeamCode: 'BRA',
    teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
    topScorerName: 'Vinicius Junior',
    topScorerGoals: 7
  };

  semifinalAnswerKeyService.saveSemifinalAnswerKey = async (payload) => {
    calls.push(['save', payload]);
    return { answerKey: payload, updatedPredictions: 12 };
  };
  rankingService.recalculateRankingPositions = async (options) => {
    calls.push(['ranking', options]);
    return { updatedParticipants: 12 };
  };

  try {
    const result = await saveSemifinalAnswerKey(input);
    assert.deepEqual(calls, [
      ['save', input],
      ['ranking', { forceSnapshot: true }]
    ]);
    assert.equal(result.updatedPredictions, 12);
    assert.equal(result.updatedParticipants, 12);
  } finally {
    semifinalAnswerKeyService.saveSemifinalAnswerKey = originalSave;
    rankingService.recalculateRankingPositions = originalRecalculate;
  }
});
