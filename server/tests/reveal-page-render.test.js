const test = require('node:test');
const assert = require('node:assert/strict');

test('renderRevealExtras shows all extras without editable controls', async () => {
  const { renderRevealExtras } = await import('../../client/src/pages/reveal-page.js');
  const html = renderRevealExtras({
    champion: { code: 'BRA', name: 'Brasil' },
    semiFinalists: [
      { code: 'BRA', name: 'Brasil' },
      { code: 'FRA', name: 'França' },
      { code: 'ARG', name: 'Argentina' },
      { code: 'ESP', name: 'Espanha' }
    ],
    topScorer: { name: 'Vinicius Junior', goals: 7 },
    pointsAwarded: 35
  });

  assert.match(html, /Campeão da Copa/u);
  assert.match(html, /Semifinalistas/u);
  assert.match(html, /Artilheiro/u);
  assert.match(html, /Número de gols/u);
  assert.match(html, /Vinicius Junior/u);
  assert.match(html, /35 pts nos extras/u);
  assert.doesNotMatch(html, /<input|<select|<textarea/u);
});
