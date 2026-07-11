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

test('renderRevealExtras shows extra scoring breakdown and pending answer keys', async () => {
  const { renderRevealExtras } = await import('../../client/src/pages/reveal-page.js');
  const html = renderRevealExtras({
    pointsAwarded: 20,
    scoring: {
      totalPoints: 20,
      calculatedCategories: ['semifinalists'],
      categories: {
        semifinalists: {
          calculated: true,
          points: 20,
          maxPoints: 20,
          prediction: [
            { code: 'BRA', name: 'Brasil' },
            { code: '', name: '' },
            { code: 'ARG', name: 'Argentina' },
            { code: 'ESP', name: 'Espanha' }
          ],
          answer: [
            { code: 'BRA', name: 'Brasil' },
            { code: 'FRA', name: 'Franca' },
            { code: 'ARG', name: 'Argentina' },
            { code: 'ESP', name: 'Espanha' }
          ]
        },
        champion: { calculated: false, points: 0, maxPoints: 10, prediction: { code: 'BRA', name: 'Brasil' }, answer: null },
        topScorer: { calculated: false, points: 0, maxPoints: 10, prediction: { name: 'Vini Jr' }, answer: { name: '' } },
        topScorerGoals: { calculated: false, points: 0, maxPoints: 5, prediction: 7, answer: null }
      }
    }
  });

  assert.match(html, /Pontuação calculada: Semifinalistas/u);
  assert.match(html, /Aguardando gabarito: Campeão, Artilheiro, Número de gols/u);
  assert.match(html, /20 \/ 20 pts/u);
  assert.match(html, /Gabarito/u);
  assert.match(html, /2\. Não informado/u);
  assert.match(html, /Calculado/u);
  assert.doesNotMatch(html, /<input|<select|<textarea/u);
});

test('renderRevealExtras identifies persisted total when it differs from displayed category sum', async () => {
  const { renderRevealExtras } = await import('../../client/src/pages/reveal-page.js');
  const html = renderRevealExtras({
    pointsAwarded: 15,
    scoring: {
      totalPoints: 20,
      calculatedCategories: ['semifinalists'],
      categories: {
        semifinalists: {
          calculated: true,
          points: 20,
          maxPoints: 20,
          prediction: [],
          answer: []
        }
      }
    }
  });

  assert.match(html, /Total calculado pelas categorias exibidas: 20 pts/u);
  assert.match(html, /Total oficial persistido: 15 pts/u);
});
