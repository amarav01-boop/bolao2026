const bcrypt = require('bcrypt');

const { AVATAR_KEYS } = require('../constants/avatar-options');
const { loadEnv } = require('../config/env');
const participantService = require('./participant-service');

const env = loadEnv();

function createServiceError(status, code, message, details) {
  const error = new Error(message);
  error.status = status;
  error.code = code;

  if (details) {
    error.details = details;
  }

  return error;
}

function mapUniqueConstraintToRegistrationError(error) {
  const constraint = `${error.constraint || ''} ${error.key || ''} ${error.sqlMessage || error.message || ''}`.toLowerCase();
  const issues = [];

  if (constraint.includes('username')) {
    issues.push({
      path: ['username'],
      code: 'not_unique',
      message: 'Este e-mail já está em uso.'
    });
  }

  if (constraint.includes('nickname')) {
    issues.push({
      path: ['nickname'],
      code: 'not_unique',
      message: 'Este apelido já está em uso.'
    });
  }

  return createServiceError(409, 'DUPLICATE_PARTICIPANT', 'A identidade do participante já existe.', {
    issues
  });
}

async function getRegistrationState() {
  return participantService.getRegistrationState();
}

async function getCurrentSessionParticipant(session) {
  return participantService.getSessionParticipant(session);
}

async function loginParticipant(input) {
  const participant = await participantService.findParticipantByUsername(input.username);

  if (!participant) {
    throw createServiceError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
  }

  const passwordMatches = await bcrypt.compare(input.password, participant.passwordHash);

  if (!passwordMatches) {
    throw createServiceError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
  }

  return {
    participant: participantService.mapParticipantToSession(participant)
  };
}

async function registerParticipant(input) {
  const registrationState = await participantService.getRegistrationState();

  if (!registrationState.isRegistrationOpen) {
    throw createServiceError(403, 'REGISTRATION_CLOSED', 'O cadastro está temporariamente fechado.');
  }

  if (!AVATAR_KEYS.includes(input.avatarKey)) {
    throw createServiceError(400, 'INVALID_AVATAR', 'O avatar selecionado não está disponível.', {
      issues: [
        {
          path: ['avatarKey'],
          code: 'invalid_option',
          message: 'Escolha um dos avatares disponíveis.'
        }
      ]
    });
  }

  const duplicateIssues = await participantService.findDuplicateIdentity(input);

  if (duplicateIssues.length > 0) {
    throw createServiceError(409, 'DUPLICATE_PARTICIPANT', 'A identidade do participante já existe.', {
      issues: duplicateIssues
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const participant = await participantService.createParticipantRegistration({
      username: input.username,
      passwordHash,
      nickname: input.nickname,
      city: input.city,
      avatarKey: input.avatarKey
    });

    return {
      participant: participantService.mapParticipantToSession(participant),
      registrationOpen: registrationState.isRegistrationOpen
    };
  } catch (error) {
    if (error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)) {
      throw mapUniqueConstraintToRegistrationError(error);
    }

    throw error;
  }
}

function getAdminCredentials() {
  return {
    username: env.ADMIN_USERNAME.toLowerCase(),
    password: env.ADMIN_PASSWORD
  };
}

function mapAdminSession() {
  return {
    id: 0,
    username: env.ADMIN_USERNAME,
    nickname: 'Administrador',
    avatarKey: 'craque',
    isAdmin: true
  };
}

async function loginAdmin(input) {
  const credentials = getAdminCredentials();
  const username = String(input.username || '').trim().toLowerCase();
  const password = String(input.password || '');

  if (username !== credentials.username || password !== credentials.password) {
    throw createServiceError(401, 'INVALID_ADMIN_CREDENTIALS', 'Usuário ou senha de administrador inválidos.');
  }

  return {
    admin: mapAdminSession()
  };
}

function getAdminSession(session) {
  if (!session || !session.user || !session.user.isAdmin) {
    return null;
  }

  return session.user;
}

module.exports = {
  getAdminCredentials,
  getAdminSession,
  getCurrentSessionParticipant,
  getRegistrationState,
  loginAdmin,
  loginParticipant,
  registerParticipant
};
