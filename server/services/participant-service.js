const participantRepository = require('../repositories/participant-repository');

function mapParticipantToSession(participant) {
  if (!participant) {
    return null;
  }

  return {
    id: participant.id,
    username: participant.username,
    nickname: participant.nickname,
    city: participant.city || '',
    avatarKey: participant.avatarKey,
    isAdmin: Boolean(participant.isAdmin)
  };
}

async function getRegistrationState() {
  const settings = await participantRepository.getRegistrationSettings();

  return {
    isRegistrationOpen: settings ? settings.isRegistrationOpen : true
  };
}

async function setRegistrationState(isRegistrationOpen) {
  const settings = await participantRepository.updateRegistrationSettings(isRegistrationOpen);

  return {
    isRegistrationOpen: settings ? settings.isRegistrationOpen : Boolean(isRegistrationOpen)
  };
}

async function findDuplicateIdentity({ username, nickname }) {
  const [usernameMatch, nicknameMatch] = await Promise.all([
    participantRepository.findParticipantByUsername(username),
    participantRepository.findParticipantByNickname(nickname)
  ]);

  const issues = [];

  if (usernameMatch) {
    issues.push({
      path: ['username'],
      code: 'not_unique',
      message: 'Este e-mail já está em uso.'
    });
  }

  if (nicknameMatch) {
    issues.push({
      path: ['nickname'],
      code: 'not_unique',
      message: 'Este apelido já está em uso.'
    });
  }

  return issues;
}

async function findParticipantByUsername(username) {
  return participantRepository.findParticipantByUsername(username);
}

async function createParticipantRegistration({ username, passwordHash, nickname, city, avatarKey }) {
  return participantRepository.createParticipant({
    username,
    passwordHash,
    nickname,
    city,
    avatarKey
  });
}

async function listPublicParticipants() {
  const participants = await participantRepository.listPublicParticipants();
  return participants.map(mapParticipantToSession);
}

function getSessionParticipant(session) {
  if (!session || !session.user || session.user.isAdmin) {
    return null;
  }

  return session.user;
}

module.exports = {
  createParticipantRegistration,
  findDuplicateIdentity,
  findParticipantByUsername,
  getRegistrationState,
  getSessionParticipant,
  listPublicParticipants,
  mapParticipantToSession,
  setRegistrationState
};
