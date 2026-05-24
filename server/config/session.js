const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const { loadEnv } = require('./env');
const { pool } = require('../db/pool');

function createSessionMiddleware() {
  const env = loadEnv();

  const store = new MySQLStore(
    {
      createDatabaseTable: true,
      clearExpired: true,
      checkExpirationInterval: 1000 * 60 * 15,
      expiration: 1000 * 60 * 60 * 24 * 14,
      schema: {
        tableName: 'session'
      }
    },
    pool
  );

  return session({
    name: env.SESSION_COOKIE_NAME,
    secret: env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    proxy: env.NODE_ENV === 'production',
    rolling: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 14
    }
  });
}

module.exports = {
  createSessionMiddleware
};
