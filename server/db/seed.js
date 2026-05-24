const { execFileSync } = require('child_process');
const path = require('path');

const { pool } = require('./pool');

function parseDateTimeToSql(dateLine) {
  const match = dateLine.match(/^(\d{2})\/(\d{2}),\s*(\d{1,2})(?:H(?:(\d{2}))?)?\s*[-,]?\s*(.*)$/);

  if (!match) {
    return {
      kickoffAt: null,
      venue: dateLine
    };
  }

  const [, day, month, hour, minute = '00', venue] = match;
  return {
    kickoffAt: `2026-${month}-${day} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`,
    venue: venue.trim()
  };
}

function slugifyTeam(teamName) {
  return String(teamName)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildGroupImportPayload() {
  const pythonCode = String.raw`
from pathlib import Path
import json
import re
import sys
import fitz

sys.stdout.reconfigure(encoding="utf-8")

pdf_path = Path(r"kb_copa_mundo/Tabela de jogos/tabelacopa20262.pdf")
doc = fitz.open(pdf_path)
page = doc.load_page(0)
text = page.get_text("text")
lines = [line.strip() for line in text.splitlines() if line.strip()]
group_start = lines.index("Grupo A")
group_lines = lines[group_start + 1:]
group_names = [chr(ord("A") + index) for index in range(12)]
groups = {}

def parse_date_line(line):
    match = re.match(r"^(\d{2})/(\d{2}),\s*(\d{1,2})(?:H(?:(\d{2}))?)?\s*[-,]?\s*(.*)$", line)
    if not match:
        return {"kickoffAt": None, "venue": line}
    day, month, hour, minute, venue = match.groups()
    minute = minute or "00"
    return {
        "kickoffAt": f"2026-{month}-{day} {hour.zfill(2)}:{minute.zfill(2)}:00",
        "venue": venue.strip(),
    }

for index, group_letter in enumerate(group_names):
    start = index * 18
    end = start + 18
    section = group_lines[start:end]
    if len(section) < 18:
        break

    matches = []
    for match_index in range(6):
        home = section[match_index]
        date_info = parse_date_line(section[6 + match_index])
        away = section[12 + match_index]
        matches.append({
            "matchOrder": match_index + 1,
            "homeTeamName": home,
            "awayTeamName": away,
            "kickoffAt": date_info["kickoffAt"],
            "venue": date_info["venue"],
        })

    groups[group_letter] = matches

print(json.dumps(groups, ensure_ascii=False))
`;

  const output = execFileSync('python', ['-c', pythonCode], {
    cwd: path.resolve(__dirname, '..', '..'),
    encoding: 'utf8'
  });

  return JSON.parse(output);
}

async function upsertGroupStagePhase() {
  await pool.query(
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
        reveal_enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        stage_type = VALUES(stage_type),
        group_code = VALUES(group_code),
        round_label = VALUES(round_label),
        sort_order = VALUES(sort_order),
        window_state = VALUES(window_state),
        deadline_at = VALUES(deadline_at),
        reveal_enabled = VALUES(reveal_enabled)
    `,
    ['group-stage', 'Fase de Grupos', 'group', null, null, 1, 'closed', '2026-06-10 23:59:00', 0]
  );

  const [rows] = await pool.query(
    `
      SELECT id
      FROM competition_phases
      WHERE code = ?
      LIMIT 1
    `,
    ['group-stage']
  );

  return Number(rows[0].id);
}

async function importGroupStageMatches() {
  const groups = buildGroupImportPayload();
  const phaseId = await upsertGroupStagePhase();
  const groupLetters = Object.keys(groups).sort();

  for (const groupLetter of groupLetters) {
    const matches = groups[groupLetter];

    for (const match of matches) {
      const matchCode = `group-${groupLetter.toLowerCase()}-${match.matchOrder}`;
      await pool.query(
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
          ON DUPLICATE KEY UPDATE
            phase_id = VALUES(phase_id),
            group_code = VALUES(group_code),
            match_order = VALUES(match_order),
            home_team_name = VALUES(home_team_name),
            away_team_name = VALUES(away_team_name),
            home_team_code = VALUES(home_team_code),
            away_team_code = VALUES(away_team_code),
            kickoff_at = VALUES(kickoff_at),
            venue = VALUES(venue),
            is_played = VALUES(is_played),
            status = VALUES(status),
            result_home_score = VALUES(result_home_score),
            result_away_score = VALUES(result_away_score)
        `,
        [
          phaseId,
          matchCode,
          groupLetter,
          match.matchOrder,
          match.homeTeamName,
          match.awayTeamName,
          slugifyTeam(match.homeTeamName),
          slugifyTeam(match.awayTeamName),
          match.kickoffAt,
          match.venue,
          0,
          'scheduled',
          null,
          null
        ]
      );
    }
  }

  console.log(`Imported ${groupLetters.length} groups into competition_match_master.`);
}

async function runSeed() {
  await importGroupStageMatches();
}

if (require.main === module) {
  runSeed()
    .then(() => pool.end())
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exitCode = 1;
    });
}

module.exports = {
  runSeed
};
