const defaultChatRepository = require('../repositories/chat-repository');
const defaultParticipantService = require('./participant-service');

const MAX_MESSAGE_LENGTH = 240;
const ANTI_FLOOD_INTERVAL_MS = 2000;
const STRICT_IMAGE_TAG = /^<img src="([^"]+)">$/;

function createServiceError(status, code, message, details) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.details = details;
  return error;
}

function normalizeMessageContent(value) {
  const normalized = String(value ?? '').replace(/\r\n?/g, '\n').trim();

  if (Array.from(normalized).length > MAX_MESSAGE_LENGTH) {
    throw createServiceError(
      400,
      'CHAT_MESSAGE_TOO_LONG',
      'A mensagem deve ter no máximo 240 caracteres.'
    );
  }

  const markupCandidates = normalized.match(/<[^<>]*>/g) || [];
  let imageUrl = null;
  let content = normalized;

  if (markupCandidates.length) {
    if (markupCandidates.length !== 1) {
      throw createServiceError(
        400,
        'CHAT_INVALID_MARKUP',
        'A mensagem aceita somente uma imagem HTTPS no formato permitido.'
      );
    }

    const imageMatch = markupCandidates[0].match(STRICT_IMAGE_TAG);
    if (!imageMatch) {
      throw createServiceError(
        400,
        'CHAT_INVALID_MARKUP',
        'HTML não permitido. Use apenas <img src="https://..."> para imagens.'
      );
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(imageMatch[1]);
    } catch {
      throw createServiceError(400, 'CHAT_INVALID_MARKUP', 'A URL da imagem é inválida.');
    }

    if (parsedUrl.protocol !== 'https:') {
      throw createServiceError(400, 'CHAT_INVALID_MARKUP', 'A imagem deve usar uma URL HTTPS.');
    }

    imageUrl = parsedUrl.href;
    content = normalized.replace(markupCandidates[0], '').trim();
  }

  if (content.includes('<') || content.includes('>')) {
    throw createServiceError(
      400,
      'CHAT_INVALID_MARKUP',
      'A mensagem contém marcação HTML não permitida.'
    );
  }

  if (!content && !imageUrl) {
    throw createServiceError(400, 'CHAT_EMPTY_MESSAGE', 'Digite uma mensagem antes de enviar.');
  }

  return {
    content,
    imageUrl
  };
}

function mapMessageForParticipant(message, currentParticipantId) {
  return {
    ...message,
    id: Number(message.id),
    imageUrl: message.imageUrl || null,
    mentionedParticipant: message.mentionedParticipant || null,
    isDirectedToCurrentParticipant:
      Number(message.mentionedParticipant?.id || 0) === Number(currentParticipantId)
  };
}

function createChatService({
  chatRepository = defaultChatRepository,
  participantService = defaultParticipantService
} = {}) {
  function requireParticipant(session) {
    const participant = participantService.getSessionParticipant(session);

    if (!participant) {
      throw createServiceError(
        403,
        'CHAT_PARTICIPANT_REQUIRED',
        'O chat está disponível somente para participantes.'
      );
    }

    return participant;
  }

  async function listMessages(session, { limit = 30, beforeId } = {}) {
    const participant = requireParticipant(session);
    const rows = await chatRepository.listMessages({
      limit,
      beforeId
    });
    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;
    const messages = pageRows.map((message) =>
      mapMessageForParticipant(message, participant.id)
    );

    return {
      messages,
      nextBeforeId: hasMore && messages.length ? messages[messages.length - 1].id : null,
      hasMore
    };
  }

  async function listParticipants(session) {
    requireParticipant(session);
    const participants = await participantService.listPublicParticipants();

    return {
      participants: participants
        .filter((participant) => !participant.isAdmin)
        .map((participant) => ({
          id: Number(participant.id),
          nickname: participant.nickname,
          avatarKey: participant.avatarKey
        }))
    };
  }

  async function createMessage(session, input) {
    const participant = requireParticipant(session);
    const { content, imageUrl } = normalizeMessageContent(input.content);
    let mentionedParticipantId = null;

    if (input.mentionedParticipantId) {
      const mentionedParticipant = await participantService.findParticipantById(
        input.mentionedParticipantId
      );

      if (!mentionedParticipant || mentionedParticipant.isAdmin) {
        throw createServiceError(
          400,
          'CHAT_INVALID_MENTION',
          'O participante mencionado não é válido.'
        );
      }

      mentionedParticipantId = Number(mentionedParticipant.id);
    }

    const latestMessage = await chatRepository.findLatestByParticipantId(participant.id);
    if (
      latestMessage &&
      Date.now() - new Date(latestMessage.createdAt).getTime() < ANTI_FLOOD_INTERVAL_MS
    ) {
      throw createServiceError(
        429,
        'CHAT_RATE_LIMITED',
        'Aguarde dois segundos antes de enviar outra mensagem.'
      );
    }

    const createdMessage = await chatRepository.insertMessage({
      participantId: participant.id,
      mentionedParticipantId,
      content,
      imageUrl
    });

    return {
      message: mapMessageForParticipant(createdMessage, participant.id)
    };
  }

  return {
    createMessage,
    listMessages,
    listParticipants
  };
}

const chatService = createChatService();

module.exports = {
  ANTI_FLOOD_INTERVAL_MS,
  MAX_MESSAGE_LENGTH,
  createChatService,
  createMessage: chatService.createMessage,
  listMessages: chatService.listMessages,
  listParticipants: chatService.listParticipants,
  mapMessageForParticipant,
  normalizeMessageContent
};
