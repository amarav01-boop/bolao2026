const { z } = require('zod');

const { AVATAR_KEYS } = require('../constants/avatar-options');

const usernameSchema = z
  .string()
  .trim()
  .min(5, 'Informe um e-mail válido.')
  .max(191, 'O e-mail deve ter no máximo 191 caracteres.')
  .email('Informe um e-mail válido.')
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .max(72, 'A senha deve ter no máximo 72 caracteres.');

const nicknameSchema = z
  .string()
  .trim()
  .min(2, 'O apelido deve ter pelo menos 2 caracteres.')
  .max(24, 'O apelido deve ter no máximo 24 caracteres.')
  .refine((value) => value.replace(/\s+/g, '').length > 0, {
    message: 'O apelido não pode ficar em branco.'
  });

const avatarKeySchema = z
  .string()
  .trim()
  .refine((value) => AVATAR_KEYS.includes(value), {
    message: 'Escolha um dos avatares disponíveis.'
  });

const registrationSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  nickname: nicknameSchema,
  avatarKey: avatarKeySchema
});

const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
});

module.exports = {
  avatarKeySchema,
  loginSchema,
  nicknameSchema,
  passwordSchema,
  registrationSchema,
  usernameSchema
};
