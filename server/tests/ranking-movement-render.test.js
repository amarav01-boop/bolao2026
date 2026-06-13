const test = require('node:test');
const assert = require('node:assert/strict');

test('renderRankingMovement communicates direction without relying only on color', async () => {
  const { renderRankingMovement } = await import('../../client/src/components/ranking-row.js');

  assert.match(
    renderRankingMovement({ movement: 'up', rankDelta: 3 }),
    /↑.*3.*Subiu 3 posições/su
  );
  assert.match(
    renderRankingMovement({ movement: 'down', rankDelta: -2 }),
    /↓.*2.*Caiu 2 posições/su
  );
  assert.match(
    renderRankingMovement({ movement: 'steady', rankDelta: 0 }),
    /•.*Manteve a posição/su
  );
  assert.match(
    renderRankingMovement({ movement: 'unknown', rankDelta: null }),
    /–.*Histórico de posição ainda não iniciado/su
  );
});

test('getRankingStatusChipClass assigns distinct tones to ranking states', async () => {
  const { getRankingStatusChipClass } = await import('../../client/src/components/ranking-row.js');

  assert.equal(getRankingStatusChipClass('Disparou'), 'chip--accent');
  assert.equal(getRankingStatusChipClass('Em queda'), 'chip--danger');
  assert.equal(getRankingStatusChipClass('Histórico iniciando'), 'chip--muted');
  assert.equal(getRankingStatusChipClass('Estável'), 'chip--muted');
});

test('Home and full Ranking render the same backend movement and status', async () => {
  const [{ renderRankingQuickCard }, { renderRankingTable }] = await Promise.all([
    import('../../client/src/pages/home-page.js'),
    import('../../client/src/pages/ranking-page.js')
  ]);
  const participant = {
    id: 7,
    nickname: 'Maestro',
    city: 'São Paulo',
    username: 'maestro@example.com',
    avatarKey: 'maestro',
    rank: 2,
    points: 15,
    currentPosition: 2,
    lastPosition: 5,
    rankDelta: 3,
    movement: 'up',
    statusChip: 'Arrancada'
  };

  const homeHtml = renderRankingQuickCard({
    rankingSnapshot: { currentParticipant: participant }
  });
  const rankingHtml = renderRankingTable([participant], participant.id);

  for (const expected of ['↑', '>3<', 'Subiu 3 posições', 'Arrancada']) {
    assert.ok(homeHtml.includes(expected), `Home should include ${expected}`);
    assert.ok(rankingHtml.includes(expected), `Ranking should include ${expected}`);
  }
});
