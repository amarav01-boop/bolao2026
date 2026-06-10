const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createChatService,
  normalizeMessageContent,
  mapMessageForParticipant
} = require('../services/chat-service');

test('normalizeMessageContent preserves emojis and counts Unicode code points', () => {
  const result = normalizeMessageContent(`Vai Brasil! ${'⚽'.repeat(228)}`);

  assert.equal(Array.from(result.content).length, 240);
  assert.equal(result.imageUrl, null);
});

test('normalizeMessageContent extracts one exact HTTPS image reference', () => {
  const result = normalizeMessageContent(
    'Olha isso <img src="https://images.example.com/copa.jpg">'
  );

  assert.equal(result.content, 'Olha isso');
  assert.equal(result.imageUrl, 'https://images.example.com/copa.jpg');
});

test('normalizeMessageContent accepts an image-only message', () => {
  const result = normalizeMessageContent('<img src="https://images.example.com/copa.jpg">');

  assert.equal(result.content, '');
  assert.equal(result.imageUrl, 'https://images.example.com/copa.jpg');
});

test('normalizeMessageContent rejects content longer than 240 Unicode characters', () => {
  assert.throws(
    () => normalizeMessageContent('⚽'.repeat(241)),
    (error) => error.status === 400 && error.code === 'CHAT_MESSAGE_TOO_LONG'
  );
});

test('normalizeMessageContent rejects unsafe or unsupported markup', () => {
  const invalidMessages = [
    '<script>alert(1)</script>',
    '<img src="http://images.example.com/copa.jpg">',
    '<img src="javascript:alert(1)">',
    '<img src="data:image/png;base64,abc">',
    '<img src="https://images.example.com/copa.jpg" onerror="alert(1)">',
    '<img src="https://one.example/a.jpg"><img src="https://two.example/b.jpg">',
    '<strong>Brasil</strong>'
  ];

  invalidMessages.forEach((message) => {
    assert.throws(
      () => normalizeMessageContent(message),
      (error) => error.status === 400 && error.code === 'CHAT_INVALID_MARKUP'
    );
  });
});

test('mapMessageForParticipant highlights only a trusted mentioned participant id', () => {
  const mapped = mapMessageForParticipant(
    {
      id: 9,
      content: '@Nego Veio veja isso',
      imageUrl: null,
      createdAt: new Date('2026-06-09T15:00:00.000Z'),
      sender: { id: 3, nickname: 'Maestro', city: 'Campinas', avatarKey: 'maestro' },
      mentionedParticipant: { id: 4, nickname: 'Nego Veio' }
    },
    4
  );

  assert.equal(mapped.isDirectedToCurrentParticipant, true);
  assert.equal(mapped.mentionedParticipant.id, 4);
});

test('createChatService rejects an invalid mention before inserting a row', async () => {
  let insertCalls = 0;
  const service = createChatService({
    chatRepository: {
      findLatestByParticipantId: async () => null,
      insertMessage: async () => {
        insertCalls += 1;
      }
    },
    participantService: {
      getSessionParticipant: () => ({ id: 2, nickname: 'Craque', isAdmin: false }),
      findParticipantById: async () => ({ id: 8, nickname: 'Admin', isAdmin: true })
    }
  });

  await assert.rejects(
    () =>
      service.createMessage(
        { user: { id: 2, nickname: 'Craque', isAdmin: false } },
        { content: '@Admin teste', mentionedParticipantId: 8 }
      ),
    (error) => error.status === 400 && error.code === 'CHAT_INVALID_MENTION'
  );
  assert.equal(insertCalls, 0);
});

test('createChatService enforces the database-backed two-second anti-flood rule', async () => {
  const service = createChatService({
    chatRepository: {
      findLatestByParticipantId: async () => ({
        createdAt: new Date(Date.now() - 1000)
      })
    },
    participantService: {
      getSessionParticipant: () => ({ id: 2, nickname: 'Craque', isAdmin: false })
    }
  });

  await assert.rejects(
    () =>
      service.createMessage(
        { user: { id: 2, nickname: 'Craque', isAdmin: false } },
        { content: 'Segunda mensagem', mentionedParticipantId: null }
      ),
    (error) => error.status === 429 && error.code === 'CHAT_RATE_LIMITED'
  );
});

test('createChatService returns newest-first pages with a cursor', async () => {
  const service = createChatService({
    chatRepository: {
      listMessages: async () => [
        {
          id: 12,
          content: 'Mais nova',
          createdAt: new Date('2026-06-09T15:00:02.000Z'),
          sender: { id: 2, nickname: 'Craque', city: '', avatarKey: 'craque' },
          mentionedParticipant: null
        },
        {
          id: 11,
          content: 'Anterior',
          createdAt: new Date('2026-06-09T15:00:01.000Z'),
          sender: { id: 3, nickname: 'Maestro', city: '', avatarKey: 'maestro' },
          mentionedParticipant: null
        },
        {
          id: 10,
          content: 'Cursor',
          createdAt: new Date('2026-06-09T15:00:00.000Z'),
          sender: { id: 4, nickname: 'Zebra', city: '', avatarKey: 'zebra' },
          mentionedParticipant: null
        }
      ]
    },
    participantService: {
      getSessionParticipant: () => ({ id: 2, nickname: 'Craque', isAdmin: false })
    }
  });

  const page = await service.listMessages(
    { user: { id: 2, nickname: 'Craque', isAdmin: false } },
    { limit: 2 }
  );

  assert.deepEqual(page.messages.map((message) => message.id), [12, 11]);
  assert.equal(page.hasMore, true);
  assert.equal(page.nextBeforeId, 11);
});
