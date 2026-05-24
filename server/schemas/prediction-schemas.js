const { z } = require('zod');

const predictionScoreSchema = z.object({
  matchId: z.coerce.number().int().positive(),
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0)
});

const extrasSchema = z.object({
  championTeamCode: z.string().trim().max(32).optional().nullable(),
  topScorerName: z.string().trim().max(120).optional().nullable(),
  topScorerGoals: z.coerce.number().int().min(0).optional().nullable(),
  semiFinalist1Code: z.string().trim().max(32).optional().nullable(),
  semiFinalist2Code: z.string().trim().max(32).optional().nullable(),
  semiFinalist3Code: z.string().trim().max(32).optional().nullable(),
  semiFinalist4Code: z.string().trim().max(32).optional().nullable()
});

const activePhasePredictionSaveSchema = z.object({
  phaseId: z.coerce.number().int().positive(),
  predictions: z.array(predictionScoreSchema).default([]),
  extras: extrasSchema.optional().nullable()
});

module.exports = {
  activePhasePredictionSaveSchema
};
