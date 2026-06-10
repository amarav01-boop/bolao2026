const { z } = require('zod');

const chatMessageCreateSchema = z.object({
  content: z.string(),
  mentionedParticipantId: z.coerce.number().int().positive().nullable().optional()
});

const chatMessageListSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(30),
  beforeId: z.coerce.number().int().positive().optional()
});

module.exports = {
  chatMessageCreateSchema,
  chatMessageListSchema
};
