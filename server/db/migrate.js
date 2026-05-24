const fs = require('fs/promises');
const path = require('path');

const { pool } = require('./pool');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(191) NOT NULL PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function runMigrations() {
  const migrationsDir = path.resolve(__dirname, 'migrations');
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort();

  await ensureMigrationsTable();

  const [appliedRows] = await pool.query('SELECT filename FROM schema_migrations');
  const applied = new Set(appliedRows.map((row) => row.filename));

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    if (sql.trim()) {
      const client = await pool.getConnection();
      try {
        await client.beginTransaction();
        const statements = sql
          .split(/;\s*(?:\r?\n|$)/)
          .map((statement) => statement.trim())
          .filter(Boolean);

        for (const statement of statements) {
          await client.query(statement);
        }

        await client.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
        await client.commit();
        console.log(`Applied migration: ${file}`);
      } catch (error) {
        await client.rollback();
        throw error;
      } finally {
        client.release();
      }
    }
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations complete.');
      return pool.end();
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exitCode = 1;
    });
}

module.exports = {
  runMigrations
};
