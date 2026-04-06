#!/usr/bin/env node
/**
 * syncExcel.js
 * Reads the latest .xlsx file from DATA_DIR and writes src/data/participants.json
 *
 * Usage:  node syncExcel.js
 *
 * Sheet1 columns expected:
 *   Member | FUNCTION | DIVISION | Activity | Activity Type | Passed | ... | Date completed | ...
 *   Activity Type values used: Course, Lab, Certificate  (Quiz is ignored)
 *   Passed must be "true" (case-insensitive)
 *
 * Sheet2 columns expected:
 *   Ekip Üyesi | Mail Adresi | Ekibi | ROLE
 *   ROLE values: MANAGER → marks that participant as a manager (bonus for their team)
 *                DIRECTOR → tracked in specialRoles (bonus for all teams), not in leaderboard
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

// ── Config ───────────────────────────────────────────────────────────────────
const DATA_DIR   = '/Users/ayse/Desktop/All In One/GAMEOFCLOUDS/DATA';
const OUTPUT     = path.join(__dirname, 'src/data/participants.json');

// ── Certificate mapping ───────────────────────────────────────────────────────
// Lowercase activity name → cert id (must match CERTIFICATES in mockData.js)
const CERT_NAME_TO_ID = {
  'cloud digital leader':            'cloud-digital-leader',
  'generative ai leader':            'gen-ai-leader',
  'cloud engineer':                  'cloud-engineer',
  'google workspace administrator':  'workspace-admin',
  'data practitioner':               'data-practitioner',
  'cloud architect':                 'cloud-architect',
  'cloud database engineer':         'cloud-db-engineer',
  'cloud developer':                 'cloud-developer',
  'data engineer':                   'data-engineer',
  'cloud devops engineer':           'cloud-devops',
  'cloud security engineer':         'cloud-security',
  'cloud network engineer':          'cloud-network',
  'machine learning engineer':       'ml-engineer',
  'security operations engineer':    'security-ops',
};

// cert id → base points (for monthly history calculation)
const CERT_POINTS = {
  'cloud-digital-leader': 150,
  'gen-ai-leader':        150,
  'cloud-engineer':       150,
  'workspace-admin':      150,
  'data-practitioner':    150,
  'cloud-architect':      500,
  'cloud-db-engineer':    500,
  'cloud-developer':      500,
  'data-engineer':        500,
  'cloud-devops':         500,
  'cloud-security':       500,
  'cloud-network':        500,
  'ml-engineer':          500,
  'security-ops':         500,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLatestExcel(dir) {
  const files = fs.readdirSync(dir)
    .filter(f => /\.(xlsx|xls)$/i.test(f))
    .map(f => ({ f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (files.length === 0) throw new Error('No Excel files found in ' + dir);
  return path.join(dir, files[0].f);
}

function excelDateToJs(val) {
  if (!val) return null;
  const d = new Date(typeof val === 'number' ? Math.round((val - 25569) * 86400 * 1000) : val);
  return isNaN(d.getTime()) ? null : d;
}

function toYearMonth(val) {
  const d = excelDateToJs(val);
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function toISODate(val) {
  const d = excelDateToJs(val);
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const excelPath = getLatestExcel(DATA_DIR);
  console.log(`Reading: ${excelPath}`);

  const wb = XLSX.readFile(excelPath);

  // ── Sheet2: email → { name, teamId, role } ─────────────────────────────────
  const s2rows = XLSX.utils.sheet_to_json(wb.Sheets['Sheet2'] || wb.Sheets[wb.SheetNames[1]]);
  const emailToMember = {};  // regular participants (non-directors): email → { name, teamId, role }
  const directorTeams = {};  // directors: email → { name, teams: [teamId, ...] }

  for (const row of s2rows) {
    const email  = String(row['Mail Adresi'] || '').trim().toLowerCase();
    const name   = String(row['Ekip Üyesi'] || '').trim();
    const teamId = String(row['Ekibi'] || '').trim();
    const role   = String(row['ROLE'] || '').trim().toUpperCase();
    if (!email || !name || !teamId) continue;

    if (role === 'DIRECTOR') {
      // Directors appear in multiple teams — collect all team entries
      if (!directorTeams[email]) directorTeams[email] = { name, teams: [] };
      if (!directorTeams[email].teams.includes(teamId)) {
        directorTeams[email].teams.push(teamId);
      }
    } else {
      // MANAGER or regular member — goes into leaderboard
      emailToMember[email] = { name, teamId, role: role || null };
    }
  }
  const directorCount = Object.keys(directorTeams).length;
  const directorEntries = Object.values(directorTeams).reduce((s, d) => s + d.teams.length, 0);
  console.log(`Sheet2: ${Object.keys(emailToMember).length} members, ${directorCount} directors (${directorEntries} team entries)`);

  // ── Sheet1: accumulate per-email stats ──────────────────────────────────────
  const s1rows = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1'] || wb.Sheets[wb.SheetNames[0]]);
  // emailStats[email] = { courses: [{dateCompleted}], labs: [{dateCompleted}], certs: Map<certId, dateCompleted>, monthly: { 'YYYY-MM': {...} } }
  const emailStats = {};

  for (const row of s1rows) {
    const email  = String(row['Member'] || '').trim().toLowerCase();
    const atype  = String(row['Activity Type'] || '').trim();
    const passed = String(row['Passed'] || '').trim().toLowerCase() === 'true';
    const act    = String(row['Activity'] || '').trim();
    const doneAt = row['Date completed'];

    if (!email || !passed) continue;
    if (!['Course', 'Lab', 'Certificate'].includes(atype)) continue;

    if (!emailStats[email]) {
      emailStats[email] = { courses: [], labs: [], certs: new Map(), monthly: {} };
    }

    const month = toYearMonth(doneAt);
    if (month && !emailStats[email].monthly[month]) {
      emailStats[email].monthly[month] = { courses: 0, labs: 0, certPoints: 0 };
    }

    if (atype === 'Course') {
      const dateStr = toISODate(doneAt);
      emailStats[email].courses.push({ dateCompleted: dateStr });
      if (month) emailStats[email].monthly[month].courses++;
    } else if (atype === 'Lab') {
      const dateStr = toISODate(doneAt);
      emailStats[email].labs.push({ dateCompleted: dateStr });
      if (month) emailStats[email].monthly[month].labs++;
    } else if (atype === 'Certificate') {
      const certId = CERT_NAME_TO_ID[act.toLowerCase()];
      if (certId) {
        const isNew = !emailStats[email].certs.has(certId);
        if (isNew) {
          // Store certId → dateCompleted (ISO string or null)
          const dateStr = toISODate(doneAt);
          emailStats[email].certs.set(certId, dateStr);
          if (month) {
            emailStats[email].monthly[month].certPoints += CERT_POINTS[certId] || 0;
          }
        }
      } else {
        console.warn(`  ⚠ Unknown certificate: "${act}"`);
      }
    }
  }

  // ── Build participants array ─────────────────────────────────────────────────
  let id = 1;
  const participants = [];

  for (const [email, member] of Object.entries(emailToMember)) {
    const stats = emailStats[email] || { courses: [], labs: [], certs: new Map(), monthly: {} };

    // certificates: [{ id, dateCompleted }]
    const certificates = Array.from(stats.certs.entries()).map(([certId, dateCompleted]) => ({
      id: certId,
      dateCompleted,
    }));

    // Monthly history sorted chronologically
    const monthlyHistory = Object.entries(stats.monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({
        month,
        points: (d.courses + d.labs) * 20 + d.certPoints,
      }));

    const parts     = member.name.trim().split(/\s+/);
    const lastName  = parts[parts.length - 1];
    const firstName = parts.slice(0, parts.length - 1).join(' ') || lastName;

    const entry = {
      id: id++,
      name: member.name,
      firstName,
      lastName,
      email,
      teamId: member.teamId,
      courses: stats.courses,
      labs: stats.labs,
      coursesLabs: stats.courses.length + stats.labs.length,
      certificates,
      monthlyHistory,
      joinDate: '2025-10-01',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName + lastName)}&backgroundColor=1A1D2E&textColor=ffffff`,
    };

    if (member.role === 'MANAGER') entry.role = 'MANAGER';
    participants.push(entry);
  }

  // ── Director entries: ONE participant per director, with teamIds array ────────
  for (const [email, info] of Object.entries(directorTeams)) {
    const stats = emailStats[email] || { courses: [], labs: [], certs: new Map(), monthly: {} };

    const certificates = Array.from(stats.certs.entries()).map(([certId, dateCompleted]) => ({
      id: certId,
      dateCompleted,
    }));

    const monthlyHistory = Object.entries(stats.monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({
        month,
        points: (d.courses + d.labs) * 20 + d.certPoints,
      }));

    const parts     = info.name.trim().split(/\s+/);
    const lastName  = parts[parts.length - 1];
    const firstName = parts.slice(0, parts.length - 1).join(' ') || lastName;

    // Single record — teamIds contains all teams this director belongs to
    participants.push({
      id: id++,
      name: info.name,
      firstName,
      lastName,
      email,
      teamId: null,
      teamIds: info.teams,
      role: 'DIRECTOR',
      courses: stats.courses,
      labs: stats.labs,
      coursesLabs: stats.courses.length + stats.labs.length,
      certificates,
      monthlyHistory,
      joinDate: '2025-10-01',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName + lastName)}&backgroundColor=1A1D2E&textColor=ffffff`,
    });
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    participants,
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf8');

  console.log(`\n✅ ${participants.length} katılımcı yazıldı → ${OUTPUT}`);

  // Quick stats
  const withActivity = participants.filter(p => p.coursesLabs > 0 || p.certificates.length > 0);
  const withCerts    = participants.filter(p => p.certificates.length > 0);
  console.log(`   Aktif katılımcı: ${withActivity.length}`);
  console.log(`   Sertifikalı:     ${withCerts.length}`);
}

main();
