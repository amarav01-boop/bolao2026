const test = require('node:test');
const assert = require('node:assert/strict');

test('renderHomeChat renders newest-first safe messages and directed highlight', async () => {
  const { renderHomeChat } = await import('../../client/src/pages/home-page.js');
  const html = renderHomeChat({
    draft: '',
    messages: [
      {
        id: 2,
        content: '<script>alert(1)</script>',
        createdAt: '2026-06-09T15:01:00.000Z',
        imageUrl: 'https://images.example.com/copa.jpg',
        isDirectedToCurrentParticipant: true,
        sender: {
          nickname: 'Maestro',
          city: 'Campinas',
          avatarKey: 'maestro'
        }
      },
      {
        id: 1,
        content: 'Mensagem anterior',
        createdAt: '2026-06-09T15:00:00.000Z',
        imageUrl: null,
        isDirectedToCurrentParticipant: false,
        sender: {
          nickname: 'Craque',
          city: 'São Paulo',
          avatarKey: 'craque'
        }
      }
    ]
  });

  assert.ok(html.indexOf('Maestro') < html.indexOf('Craque'));
  assert.match(html, /chat-message--directed/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /chat-message__thumbnail/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /referrerpolicy="no-referrer"/);
});
