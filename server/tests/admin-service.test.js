const test = require('node:test');
const assert = require('node:assert/strict');

const { generateTemporaryPassword } = require('../services/admin-service');

test('generateTemporaryPassword returns a city name followed by three digits', () => {
  const generatedPasswords = Array.from({ length: 100 }, () => generateTemporaryPassword());

  generatedPasswords.forEach((password) => {
    assert.match(password, /^[A-Za-z]+[0-9]{3}$/);
  });
});
