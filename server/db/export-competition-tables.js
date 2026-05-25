const fs = require('fs');
const path = require('path');

const { pool } = require('./pool');

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDateTime(value) {
  if (value == null) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate())
  ].join('-') + ` ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function sqlString(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function sqlValue(value) {
  if (value == null) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'NULL';
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  if (value instanceof Date) {
    return sqlString(formatDateTime(value));
  }

  if (typeof value === 'object') {
    return sqlString(formatDateTime(value));
  }

  return sqlString(value);
}

function buildInsert(tableName, columns, rows) {
  if (!rows.length) {
    return `-- No rows found for ${tableName}`;
  }

  const lines = rows.map((row) => `  (${row.map(sqlValue).join(', ')})`);

  return [
    `INSERT INTO ${tableName} (${columns.join(', ')})`,
    'VALUES',
    lines.join(',\n'),
    ';'
  ].join('\n');
}

async function exportCompetitionTables() {
  const [phases] = await pool.query(
    `
      SELECT id, code, name, stage_type, group_code, round_label, sort_order, window_state, deadline_at, reveal_enabled, created_at, updated_at
      FROM competition_phases
      ORDER BY id ASC
    `
  );

  const [matches] = await pool.query(
    `
      SELECT id, phase_id, match_code, group_code, match_order, home_team_name, away_team_name, home_team_code, away_team_code, kickoff_at, venue, is_played, status, result_home_score, result_away_score, created_at, updated_at
      FROM competition_match_master
      ORDER BY phase_id ASC, group_code IS NULL, group_code ASC, match_order ASC, id ASC
    `
  );

  const sql = [
    '-- Auto-generated export of competition_phases and competition_match_master',
    '-- Source: local MariaDB database',
    '-- To import on a fresh database:',
    '--   mysql -u root -p bolao2026 < server/db/exports/competition-tables.sql',
    '',
    'SET FOREIGN_KEY_CHECKS = 0;',
    'START TRANSACTION;',
    '',
    'DELETE FROM competition_match_master;',
    'DELETE FROM competition_phases;',
    '',
    buildInsert(
      'competition_phases',
      [
        'id',
        'code',
        'name',
        'stage_type',
        'group_code',
        'round_label',
        'sort_order',
        'window_state',
        'deadline_at',
        'reveal_enabled',
        'created_at',
        'updated_at'
      ],
      phases.map((phase) => [
        phase.id,
        phase.code,
        phase.name,
        phase.stage_type,
        phase.group_code,
        phase.round_label,
        phase.sort_order,
        phase.window_state,
        formatDateTime(phase.deadline_at),
        phase.reveal_enabled,
        formatDateTime(phase.created_at),
        formatDateTime(phase.updated_at)
      ])
    ),
    '',
    buildInsert(
      'competition_match_master',
      [
        'id',
        'phase_id',
        'match_code',
        'group_code',
        'match_order',
        'home_team_name',
        'away_team_name',
        'home_team_code',
        'away_team_code',
        'kickoff_at',
        'venue',
        'is_played',
        'status',
        'result_home_score',
        'result_away_score',
        'created_at',
        'updated_at'
      ],
      matches.map((match) => [
        match.id,
        match.phase_id,
        match.match_code,
        match.group_code,
        match.match_order,
        match.home_team_name,
        match.away_team_name,
        match.home_team_code,
        match.away_team_code,
        formatDateTime(match.kickoff_at),
        match.venue,
        match.is_played,
        match.status,
        match.result_home_score,
        match.result_away_score,
        formatDateTime(match.created_at),
        formatDateTime(match.updated_at)
      ])
    ),
    '',
    'COMMIT;',
    'SET FOREIGN_KEY_CHECKS = 1;',
    ''
  ].join('\n');

  const outputPath = path.resolve(__dirname, 'exports', 'competition-tables.sql');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`Exported ${phases.length} phases and ${matches.length} matches to ${outputPath}`);
}

if (require.main === module) {
  exportCompetitionTables()
    .then(() => pool.end())
    .catch(async (error) => {
      console.error('Export failed:', error);
      process.exitCode = 1;
      try {
        await pool.end();
      } catch (closeError) {
        console.error('Failed to close pool:', closeError);
      }
    });
}

module.exports = {
  exportCompetitionTables
};
