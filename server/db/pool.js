const mysql = require('mysql2/promise');

const { loadEnv } = require('../config/env');

const env = loadEnv();

function parseDatabaseUrl(databaseUrl) {
  const url = new URL(databaseUrl);

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username || 'root'),
    password: decodeURIComponent(url.password || ''),
    database: url.pathname ? url.pathname.replace(/^\//, '') : undefined
  };
}

const pool = mysql.createPool({
  ...parseDatabaseUrl(env.DATABASE_URL),
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  namedPlaceholders: false,
  timezone: 'Z'
});

module.exports = {
  pool
};
