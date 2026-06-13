const { pool } = require('../db/pool');

function mapParticipantRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    username: row.username,
    passwordHash: row.password_hash,
    nickname: row.nickname,
    city: row.city,
    avatarKey: row.avatar_key,
    currentPosition:
      row.current_position === null || row.current_position === undefined
        ? null
        : Number(row.current_position),
    lastPosition:
      row.last_position === null || row.last_position === undefined
        ? null
        : Number(row.last_position),
    isAdmin: Boolean(row.is_admin),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapRegistrationSettingsRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    isRegistrationOpen: Boolean(row.is_registration_open),
    updatedAt: row.updated_at
  };
}

async function getRegistrationSettings() {
  const [rows] = await pool.query(
    `
      SELECT id, is_registration_open, updated_at
      FROM registration_settings
      ORDER BY id ASC
      LIMIT 1
    `
  );

  return mapRegistrationSettingsRow(rows[0]);
}

async function updateRegistrationSettings(isRegistrationOpen) {
  await pool.query(
    `
      INSERT INTO registration_settings (id, is_registration_open)
      VALUES (1, ?)
      ON DUPLICATE KEY UPDATE
        is_registration_open = VALUES(is_registration_open)
    `,
    [isRegistrationOpen ? 1 : 0]
  );

  return getRegistrationSettings();
}

async function findParticipantByUsername(username) {
  const [rows] = await pool.query(
    `
      SELECT id, username, password_hash, nickname, city, avatar_key, current_position, last_position,
        is_admin, created_at, updated_at
      FROM participants
      WHERE username = ?
      LIMIT 1
    `,
    [username]
  );

  return mapParticipantRow(rows[0]);
}

async function findParticipantByNickname(nickname) {
  const [rows] = await pool.query(
    `
      SELECT id, username, password_hash, nickname, city, avatar_key, current_position, last_position,
        is_admin, created_at, updated_at
      FROM participants
      WHERE nickname = ?
      LIMIT 1
    `,
    [nickname]
  );

  return mapParticipantRow(rows[0]);
}

async function findParticipantById(participantId) {
  const [rows] = await pool.query(
    `
      SELECT id, username, password_hash, nickname, city, avatar_key, current_position, last_position,
        is_admin, created_at, updated_at
      FROM participants
      WHERE id = ?
      LIMIT 1
    `,
    [participantId]
  );

  return mapParticipantRow(rows[0]);
}

async function listPublicParticipants() {
  const [rows] = await pool.query(
    `
      SELECT id, username, password_hash, nickname, city, avatar_key, current_position, last_position,
        is_admin, created_at, updated_at
      FROM participants
      WHERE is_admin = 0
      ORDER BY nickname ASC, id ASC
    `
  );

  return rows.map(mapParticipantRow);
}

async function updateParticipantPasswordHash(participantId, passwordHash) {
  await pool.query(
    `
      UPDATE participants
      SET password_hash = ?
      WHERE id = ? AND is_admin = 0
    `,
    [passwordHash, participantId]
  );

  return findParticipantById(participantId);
}

async function updateRankingPositions(ranking = []) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const participant of ranking) {
      await connection.query(
        `
          UPDATE participants
          SET
            last_position = CASE
              WHEN current_position IS NULL THEN ?
              ELSE current_position
            END,
            current_position = ?
          WHERE id = ? AND is_admin = 0
        `,
        [participant.rank, participant.rank, participant.id]
      );
    }

    await connection.commit();
    return ranking.length;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function createParticipant({ username, passwordHash, nickname, city, avatarKey }) {
  const [result] = await pool.query(
    `
      INSERT INTO participants (
        username,
        password_hash,
        nickname,
        city,
        avatar_key
      ) VALUES (?, ?, ?, ?, ?)
    `,
    [username, passwordHash, nickname, city, avatarKey]
  );

  return mapParticipantRow({
    id: result.insertId,
    username,
    password_hash: passwordHash,
    nickname,
    city,
    avatar_key: avatarKey,
    current_position: null,
    last_position: null,
    is_admin: 0,
    created_at: new Date(),
    updated_at: new Date()
  });
}

module.exports = {
  createParticipant,
  findParticipantById,
  findParticipantByNickname,
  findParticipantByUsername,
  getRegistrationSettings,
  listPublicParticipants,
  updateParticipantPasswordHash,
  updateRankingPositions,
  updateRegistrationSettings,
  mapParticipantRow,
  mapRegistrationSettingsRow
};
