const { z } = require('zod');

const adminLoginSchema = z.object({
  username: z.string().trim().min(1, 'Informe o usuário de administrador.'),
  password: z.string().trim().min(1, 'Informe a senha de administrador.')
});

const registrationStateSchema = z.object({
  isRegistrationOpen: z.coerce.boolean()
});

const semifinalAnswerKeySchema = z.object({
  championTeamCode: z.string().trim().min(1, 'Selecione o campeao.').max(32).transform((code) => code.toUpperCase()),
  teamCodes: z
    .array(z.string().trim().min(1).max(32).transform((code) => code.toUpperCase()))
    .length(4, 'Selecione as quatro selecoes semifinalistas.')
    .refine((codes) => new Set(codes).size === codes.length, 'As quatro selecoes devem ser diferentes.'),
  topScorerName: z.string().trim().min(2, 'Informe o artilheiro.').max(120),
  topScorerGoals: z.preprocess(
    (value) => value === '' || value === null ? undefined : value,
    z.coerce.number().int().min(0).max(99)
  )
}).refine(
  (value) => value.teamCodes.includes(value.championTeamCode),
  { path: ['championTeamCode'], message: 'O campeao deve estar entre os semifinalistas.' }
);

const phaseBaseSchema = z.object({
  code: z.string().trim().min(1, 'Informe o código da fase.').max(80),
  name: z.string().trim().min(1, 'Informe o nome da fase.').max(120),
  stageType: z.enum(['group', 'knockout']),
  groupCode: z.string().trim().max(16).optional().nullable(),
  roundLabel: z.string().trim().max(80).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  windowState: z.enum(['closed', 'open', 'locked']).default('closed'),
  deadlineAt: z.string().trim().optional().nullable(),
  matchCount: z.coerce.number().int().min(0).optional().nullable(),
  revealEnabled: z.coerce.boolean().default(false)
});

const phaseUpdateSchema = phaseBaseSchema.partial();

const matchFieldsSchema = z.object({
  phaseId: z.coerce.number().int().positive(),
  matchCode: z.string().trim().min(1, 'Informe o código do jogo.').max(80),
  groupCode: z.string().trim().max(16).optional().nullable(),
  matchOrder: z.coerce.number().int().min(0).default(0),
  homeTeamName: z.string().trim().min(1, 'Informe o time da casa.').max(120),
  awayTeamName: z.string().trim().min(1, 'Informe o time visitante.').max(120),
  homeTeamCode: z.string().trim().max(32).optional().nullable(),
  awayTeamCode: z.string().trim().max(32).optional().nullable(),
  kickoffAt: z.string().trim().min(1, 'Informe a data do jogo.'),
  venue: z.string().trim().max(120).optional().nullable(),
  status: z.enum(['scheduled', 'locked', 'completed']).default('scheduled'),
  isPlayed: z.coerce.boolean().default(false),
  resultHomeScore: z.coerce.number().int().min(0).optional().nullable(),
  resultAwayScore: z.coerce.number().int().min(0).optional().nullable()
});

function requireResultWhenPlayed(value, context) {
  if (value.isPlayed && (value.resultHomeScore === null || value.resultAwayScore === null)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['resultHomeScore'],
      message: 'Informe o placar do jogo realizado.'
    });
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['resultAwayScore'],
      message: 'Informe o placar do jogo realizado.'
    });
  }
}

const matchBaseSchema = matchFieldsSchema.superRefine(requireResultWhenPlayed);

const matchUpdateSchema = matchFieldsSchema.partial().superRefine(requireResultWhenPlayed);

module.exports = {
  adminLoginSchema,
  matchBaseSchema,
  matchUpdateSchema,
  phaseBaseSchema,
  phaseUpdateSchema,
  registrationStateSchema,
  semifinalAnswerKeySchema
};
