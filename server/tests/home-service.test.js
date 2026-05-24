const test = require('node:test');
const assert = require('node:assert/strict');

const { buildAttentionMessage } = require('../services/home-service');

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
