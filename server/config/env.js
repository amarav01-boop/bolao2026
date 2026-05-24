const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

let cachedEnv = null;

function loadEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const candidates = [path.resolve(__dirname, '..', '..', '.env'), path.resolve(__dirname, '..', '.env')];
  candidates.forEach((candidate) => {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
    }
  });

  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z
      .string()
      .trim()
      .default('mysql://root@127.0.0.1:3306/bolao2026'),
    SESSION_COOKIE_NAME: z.string().trim().min(1).default('bolao2026.sid'),
    SESSION_SECRET: z.string().trim().optional(),
    VITE_API_BASE_URL: z.string().trim().optional(),
    ADMIN_USERNAME: z.string().trim().optional(),
    ADMIN_PASSWORD: z.string().trim().optional()
  });

  const parsed = schema.parse(process.env);

  const sessionSecret =
    parsed.SESSION_SECRET ||
    (parsed.NODE_ENV === 'production' ? null : 'dev-session-secret-change-me');
  const adminUsername =
    parsed.ADMIN_USERNAME ||
    (parsed.NODE_ENV === 'production' ? null : 'admin@bolao.local');
  const adminPassword =
    parsed.ADMIN_PASSWORD ||
    (parsed.NODE_ENV === 'production' ? null : 'Brasil@2026');

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET is required in production.');
  }

  if (!adminUsername || !adminPassword) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD are required in production.');
  }

  cachedEnv = Object.freeze({
    ...parsed,
    SESSION_SECRET: sessionSecret,
    ADMIN_USERNAME: adminUsername,
    ADMIN_PASSWORD: adminPassword
  });

  return cachedEnv;
}

module.exports = {
  loadEnv
};
