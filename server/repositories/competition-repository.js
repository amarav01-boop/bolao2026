const { pool } = require('../db/pool');

function asBoolean(value) {
  return value === true || value === 1 || value === '1';
}

function mapPhaseRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    code: row.code,
    name: row.name,
    stageType: row.stage_type,
    groupCode: row.group_code,
    roundLabel: row.round_label,
    sortOrder: Number(row.sort_order),
    windowState: row.window_state,
    deadlineAt: row.deadline_at,
    matchCount: row.match_count === null || row.match_count === undefined ? null : Number(row.match_count),
    revealEnabled: asBoolean(row.reveal_enabled),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapMatchRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    phaseId: Number(row.phase_id),
    phaseCode: row.phase_code,
    phaseName: row.phase_name,
    stageType: row.stage_type,
    phaseWindowState: row.phase_window_state,
    phaseRevealEnabled: asBoolean(row.phase_reveal_enabled),
    groupCode: row.group_code,
    matchCode: row.match_code,
    matchOrder: Number(row.match_order),
    homeTeamName: row.home_team_name,
    awayTeamName: row.away_team_name,
    homeTeamCode: row.home_team_code,
    awayTeamCode: row.away_team_code,
    kickoffAt: row.kickoff_at,
    venue: row.venue,
    status: row.status,
    isPlayed: asBoolean(row.is_played),
    resultHomeScore: row.result_home_score,
    resultAwayScore: row.result_away_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findActiveCompetitionPhase() {
  const [rows] = await pool.query(
    `
      SELECT id, code, name, stage_type, group_code, round_label, sort_order, window_state, deadline_at, match_count, reveal_enabled, created_at, updated_at
      FROM competition_phases
      WHERE window_state = 'open'
      ORDER BY sort_order ASC, id ASC
      LIMIT 1
    `
  );

  return mapPhaseRow(rows[0]);
}

async function findCurrentCompetitionPhase() {
  const [rows] = await pool.query(
    `
      SELECT id, code, name, stage_type, group_code, round_label, sort_order, window_state, deadline_at, match_count, reveal_enabled, created_at, updated_at
      FROM competition_phases
      ORDER BY
        CASE window_state
          WHEN 'open' THEN 0
          WHEN 'locked' THEN 1
          WHEN 'closed' THEN 2
          ELSE 3
        END,
        sort_order ASC,
        id ASC
      LIMIT 1
    `
  );

  return mapPhaseRow(rows[0]);
}

function normalizeDateTime(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    const pad = (input) => String(input).padStart(2, '0');
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  if (text.includes('T')) {
    return text.replace('T', ' ') + (text.length === 16 ? ':00' : '');
  }

  return text;
}

async function listCompetitionPhases() {
  const [rows] = await pool.query(
    `
      SELECT id, code, name, stage_type, group_code, round_label, sort_order, window_state, deadline_at, match_count, reveal_enabled, created_at, updated_at
      FROM competition_phases
      ORDER BY sort_order ASC, id ASC
    `
  );

  return rows.map(mapPhaseRow);
}

async function findCompetitionPhaseById(phaseId) {
  const [rows] = await pool.query(
    `
      SELECT id, code, name, stage_type, group_code, round_label, sort_order, window_state, deadline_at, reveal_enabled, created_at, updated_at
      FROM competition_phases
      WHERE id = ?
      LIMIT 1
    `,
    [phaseId]
  );

  return mapPhaseRow(rows[0]);
}

async function createCompetitionPhase(input) {
  const [result] = await pool.query(
    `
      INSERT INTO competition_phases (
        code,
        name,
        stage_type,
        group_code,
        round_label,
        sort_order,
        window_state,
        deadline_at,
        match_count,
        reveal_enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.code,
      input.name,
      input.stageType,
      input.groupCode || null,
      input.roundLabel || null,
      Number(input.sortOrder || 0),
      input.windowState || 'closed',
      normalizeDateTime(input.deadlineAt),
      input.matchCount === undefined || input.matchCount === null || input.matchCount === '' ? null : Number(input.matchCount),
      input.revealEnabled ? 1 : 0
    ]
  );

  return findCompetitionPhaseById(result.insertId);
}

async function updateCompetitionPhase(phaseId, input) {
  await pool.query(
    `
      UPDATE competition_phases
      SET
        code = ?,
        name = ?,
        stage_type = ?,
        group_code = ?,
        round_label = ?,
        sort_order = ?,
        window_state = ?,
        deadline_at = ?,
        match_count = ?,
        reveal_enabled = ?
      WHERE id = ?
    `,
    [
      input.code,
      input.name,
      input.stageType,
      input.groupCode || null,
      input.roundLabel || null,
      Number(input.sortOrder || 0),
      input.windowState || 'closed',
      normalizeDateTime(input.deadlineAt),
      input.matchCount === undefined || input.matchCount === null || input.matchCount === '' ? null : Number(input.matchCount),
      input.revealEnabled ? 1 : 0,
      phaseId
    ]
  );

  return findCompetitionPhaseById(phaseId);
}

async function listCompetitionMatches() {
  const [rows] = await pool.query(
    `
      SELECT
        m.id,
        m.phase_id,
        p.code AS phase_code,
        p.name AS phase_name,
        p.stage_type,
        p.window_state AS phase_window_state,
        p.reveal_enabled AS phase_reveal_enabled,
        m.group_code,
        m.match_code,
        m.match_order,
        m.home_team_name,
        m.away_team_name,
        m.home_team_code,
        m.away_team_code,
        m.kickoff_at,
        m.venue,
        m.is_played,
        m.status,
        m.result_home_score,
        m.result_away_score,
        m.created_at,
        m.updated_at
      FROM competition_match_master m
      INNER JOIN competition_phases p ON p.id = m.phase_id
      ORDER BY p.sort_order ASC, m.match_order ASC, m.kickoff_at ASC, m.id ASC
    `
  );

  return rows.map(mapMatchRow);
}

async function listCompetitionMatchesByPhaseId(phaseId) {
  const [rows] = await pool.query(
    `
      SELECT
        m.id,
        m.phase_id,
        p.code AS phase_code,
        p.name AS phase_name,
        p.stage_type,
        p.window_state AS phase_window_state,
        p.reveal_enabled AS phase_reveal_enabled,
        m.group_code,
        m.match_code,
        m.match_order,
        m.home_team_name,
        m.away_team_name,
        m.home_team_code,
        m.away_team_code,
        m.kickoff_at,
        m.venue,
        m.is_played,
        m.status,
        m.result_home_score,
        m.result_away_score,
        m.created_at,
        m.updated_at
      FROM competition_match_master m
      INNER JOIN competition_phases p ON p.id = m.phase_id
      WHERE m.phase_id = ?
      ORDER BY p.sort_order ASC, m.match_order ASC, m.kickoff_at ASC, m.id ASC
    `,
    [phaseId]
  );

  return rows.map(mapMatchRow);
}

async function listPlayedCompetitionMatches() {
  const [rows] = await pool.query(
    `
      SELECT
        m.id,
        m.phase_id,
        p.code AS phase_code,
        p.name AS phase_name,
        p.stage_type,
        p.window_state AS phase_window_state,
        p.reveal_enabled AS phase_reveal_enabled,
        m.group_code,
        m.match_code,
        m.match_order,
        m.home_team_name,
        m.away_team_name,
        m.home_team_code,
        m.away_team_code,
        m.kickoff_at,
        m.venue,
        m.is_played,
        m.status,
        m.result_home_score,
        m.result_away_score,
        m.created_at,
        m.updated_at
      FROM competition_match_master m
      INNER JOIN competition_phases p ON p.id = m.phase_id
      WHERE m.is_played = 1
        AND m.result_home_score IS NOT NULL
        AND m.result_away_score IS NOT NULL
      ORDER BY p.sort_order ASC, m.match_order ASC, m.kickoff_at ASC, m.id ASC
    `
  );

  return rows.map(mapMatchRow);
}

async function findCompetitionMatchById(matchId) {
  const [rows] = await pool.query(
    `
      SELECT
        m.id,
        m.phase_id,
        p.code AS phase_code,
        p.name AS phase_name,
        p.stage_type,
        p.window_state AS phase_window_state,
        p.reveal_enabled AS phase_reveal_enabled,
        m.group_code,
        m.match_code,
        m.match_order,
        m.home_team_name,
        m.away_team_name,
        m.home_team_code,
        m.away_team_code,
        m.kickoff_at,
        m.venue,
        m.is_played,
        m.status,
        m.result_home_score,
        m.result_away_score,
        m.created_at,
        m.updated_at
      FROM competition_match_master m
      INNER JOIN competition_phases p ON p.id = m.phase_id
      WHERE m.id = ?
      LIMIT 1
    `,
    [matchId]
  );

  return mapMatchRow(rows[0]);
}

async function createCompetitionMatch(input) {
  const [result] = await pool.query(
    `
      INSERT INTO competition_match_master (
        phase_id,
        match_code,
        group_code,
        match_order,
        home_team_name,
        away_team_name,
        home_team_code,
        away_team_code,
        kickoff_at,
        venue,
        is_played,
        status,
        result_home_score,
        result_away_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.phaseId,
      input.matchCode,
      input.groupCode || null,
      Number(input.matchOrder || 0),
      input.homeTeamName,
      input.awayTeamName,
      input.homeTeamCode || null,
      input.awayTeamCode || null,
      normalizeDateTime(input.kickoffAt),
      input.venue || null,
      input.isPlayed ? 1 : 0,
      input.status || 'scheduled',
      input.resultHomeScore ?? null,
      input.resultAwayScore ?? null
    ]
  );

  return findCompetitionMatchById(result.insertId);
}

async function updateCompetitionMatch(matchId, input) {
  await pool.query(
    `
      UPDATE competition_match_master
      SET
        phase_id = ?,
        match_code = ?,
        group_code = ?,
        match_order = ?,
        home_team_name = ?,
        away_team_name = ?,
        home_team_code = ?,
        away_team_code = ?,
        kickoff_at = ?,
        venue = ?,
        is_played = ?,
        status = ?,
        result_home_score = ?,
        result_away_score = ?
      WHERE id = ?
    `,
    [
      input.phaseId,
      input.matchCode,
      input.groupCode || null,
      Number(input.matchOrder || 0),
      input.homeTeamName,
      input.awayTeamName,
      input.homeTeamCode || null,
      input.awayTeamCode || null,
      normalizeDateTime(input.kickoffAt),
      input.venue || null,
      input.isPlayed ? 1 : 0,
      input.status || 'scheduled',
      input.resultHomeScore ?? null,
      input.resultAwayScore ?? null,
      matchId
    ]
  );

  return findCompetitionMatchById(matchId);
}

module.exports = {
  createCompetitionMatch,
  createCompetitionPhase,
  findActiveCompetitionPhase,
  findCurrentCompetitionPhase,
  findCompetitionMatchById,
  findCompetitionPhaseById,
  listCompetitionMatches,
  listCompetitionMatchesByPhaseId,
  listPlayedCompetitionMatches,
  listCompetitionPhases,
  mapMatchRow,
  mapPhaseRow,
  updateCompetitionMatch,
  updateCompetitionPhase
};
