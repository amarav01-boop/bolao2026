const test = require('node:test');
const assert = require('node:assert/strict');

test('renderHomeChat renders a continuous text-only room with history before composer', async () => {
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
  assert.ok(html.indexOf('data-chat-message-list') < html.indexOf('data-chat-form'));
  assert.match(html, /class="chat-room"/);
  assert.doesNotMatch(html, /participant-badge/);
  assert.match(html, /chat-message__sender/);
  assert.match(html, /chat-message--directed/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /chat-message__thumbnail/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /referrerpolicy="no-referrer"/);
  assert.match(html, /data-chat-emoji="⚽"/u);
  assert.match(html, /data-chat-emoji="😂"/u);
});
