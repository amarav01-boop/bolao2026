const test = require('node:test');
const assert = require('node:assert/strict');

test('knockout simulator remains disabled for participants', async () => {
  const {
    KNOCKOUT_SIMULATOR_ENABLED,
    renderKnockoutSimulation
  } = await import('../../client/src/pages/home-page.js');

  assert.equal(KNOCKOUT_SIMULATOR_ENABLED, false);
  assert.equal(
    renderKnockoutSimulation({
      activePrediction: {
        canEdit: true,
        groups: []
      }
    }),
    ''
  );
});
