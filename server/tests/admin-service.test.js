const test = require('node:test');
const assert = require('node:assert/strict');

const {
  generateTemporaryPassword,
  hasScoringRelevantMatchChange
} = require('../services/admin-service');

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
