const { pool } = require('../db/pool');

function mapChatMessageRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    content: row.content,
    imageUrl: row.image_url || null,
    createdAt: row.created_at,
    sender: {
      id: Number(row.participant_id),
      nickname: row.sender_nickname,
      city: row.sender_city || '',
      avatarKey: row.sender_avatar_key
    },
    mentionedParticipant: row.mentioned_participant_id
      ? {
          id: Number(row.mentioned_participant_id),
          nickname: row.mentioned_nickname
        }
      : null
  };
}

const MESSAGE_SELECT = `
  SELECT
    message.id,
    message.participant_id,
    message.mentioned_participant_id,
    message.content,
    message.image_url,
    message.created_at,
    sender.nickname AS sender_nickname,
    sender.city AS sender_city,
    sender.avatar_key AS sender_avatar_key,
    mentioned.nickname AS mentioned_nickname
  FROM chat_messages message
  INNER JOIN participants sender ON sender.id = message.participant_id
  LEFT JOIN participants mentioned ON mentioned.id = message.mentioned_participant_id
`;

async function listMessages({ limit, beforeId }) {
  const values = [];
  let cursorClause = '';

  if (beforeId) {
    cursorClause = 'WHERE message.id < ?';
    values.push(beforeId);
  }

  values.push(limit + 1);
  const [rows] = await pool.query(
    `
      ${MESSAGE_SELECT}
      ${cursorClause}
      ORDER BY message.id DESC
      LIMIT ?
    `,
    values
  );

  return rows.map(mapChatMessageRow);
}

async function findMessageById(messageId) {
  const [rows] = await pool.query(
    `
      ${MESSAGE_SELECT}
      WHERE message.id = ?
      LIMIT 1
    `,
    [messageId]
  );

  return mapChatMessageRow(rows[0]);
}

async function findLatestByParticipantId(participantId) {
  const [rows] = await pool.query(
    `
      SELECT id, created_at
      FROM chat_messages
      WHERE participant_id = ?
      ORDER BY id DESC
      LIMIT 1
    `,
    [participantId]
  );

  if (!rows[0]) {
    return null;
  }

  return {
    id: Number(rows[0].id),
    createdAt: rows[0].created_at
  };
}

async function insertMessage({ participantId, mentionedParticipantId, content, imageUrl }) {
  const [result] = await pool.query(
    `
      INSERT INTO chat_messages (
        participant_id,
        mentioned_participant_id,
        content,
        image_url
      ) VALUES (?, ?, ?, ?)
    `,
    [participantId, mentionedParticipantId || null, content, imageUrl || null]
  );

  return findMessageById(result.insertId);
}

module.exports = {
  findLatestByParticipantId,
  findMessageById,
  insertMessage,
  listMessages,
  mapChatMessageRow
};
