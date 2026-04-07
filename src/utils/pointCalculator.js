import { ALL_CERTIFICATES } from '../data/mockData';
import { isInTeam } from './helpers';

const CERT_MAP = {};
ALL_CERTIFICATES.forEach(c => { CERT_MAP[c.id] = c; });

const COURSE_LAB_POINTS = 20;

// Certificates earned before this date don't trigger manager/director bonus
const MANAGER_BONUS_MIN_DATE = '2026-03-01';

/**
 * Extracts the cert ID string from either the old format (string)
 * or the new format ({ id, dateCompleted }).
 */
export function getCertId(cert) {
  return typeof cert === 'string' ? cert : cert.id;
}

/**
 * Returns the active custom rules for a given date (defaults to today).
 */
export function getActiveRules(customRules, date = new Date()) {
  if (!customRules || customRules.length === 0) return [];
  return customRules.filter(rule => {
    if (!rule.active) return false;
    const start = rule.startDate ? new Date(rule.startDate) : null;
    const end   = rule.endDate   ? new Date(rule.endDate + 'T23:59:59') : null;
    if (start && date < start) return false;
    if (end   && date > end)   return false;
    return true;
  });
}

/**
 * Apply active custom rules multiplier to a base amount.
 * scope: 'course' | 'lab' | 'certificate'
 * Multipliers stack additively (e.g. two ×1.5 rules → ×2.0, not ×2.25).
 */
function applyRuleMultiplier(baseAmount, activeRules, scope) {
  if (!activeRules || activeRules.length === 0) return baseAmount;
  let bonus = 0;
  for (const rule of activeRules) {
    const scopes = rule.scopes || [];
    if (!scopes.includes(scope)) continue;
    const pct = parseFloat(rule.multiplier) || 0; // e.g. 20 means +20%
    bonus += pct / 100;
  }
  return Math.floor(baseAmount * (1 + bonus));
}

/**
 * Computes all manager/director bonus windows from participant data.
 * Returns array of bonus objects (all time, not filtered to "active today").
 *
 * Each bonus: { type, teamId, managerName, certId, startDate, endDate }
 *   type       : 'manager' | 'director'
 *   teamId     : string (manager's team) | null (director → all teams)
 *   startDate  : Date
 *   endDate    : Date (startDate + 14 days)
 *
 * Directors may appear multiple times (once per team) — deduplicated by email.
 */
export function getManagerBonuses(participants = []) {
  const bonuses = [];
  const seenDirectorEmails = new Set();

  for (const p of participants) {
    if (p.role !== 'MANAGER' && p.role !== 'DIRECTOR') continue;

    const isDirector = p.role === 'DIRECTOR';

    // Directors: deduplicate by email so the same cert isn't counted 5× (one per team)
    if (isDirector) {
      if (seenDirectorEmails.has(p.email)) continue;
      seenDirectorEmails.add(p.email);
    }

    for (const cert of (p.certificates || [])) {
      const dateStr = typeof cert === 'string' ? null : cert.dateCompleted;
      if (!dateStr || dateStr < MANAGER_BONUS_MIN_DATE) continue;
      const start = new Date(dateStr);
      const end   = new Date(dateStr);
      end.setDate(end.getDate() + 14);
      bonuses.push({
        type: isDirector ? 'director' : 'manager',
        teamId: isDirector ? null : p.teamId, // null = applies to all teams
        managerName: p.name,
        certId: getCertId(cert),
        startDate: start,
        endDate: end,
      });
    }
  }

  return bonuses;
}

/**
 * Filters manager bonuses to those active on a given date (default today).
 */
export function getActiveManagerBonuses(participants, date = new Date()) {
  return getManagerBonuses(participants).filter(b => {
    return date >= b.startDate && date <= b.endDate;
  });
}

/**
 * Returns how many manager/director bonus windows apply to a given activity date
 * for this participant. Each matching bonus counts as one ×1.5 multiplier.
 */
function countApplicableBonuses(dateStr, allManagerBonuses, participant) {
  if (participant.role === 'MANAGER' || participant.role === 'DIRECTOR') return 0;
  if (!dateStr || !allManagerBonuses || allManagerBonuses.length === 0) return 0;
  const actDate = new Date(dateStr);
  let count = 0;
  for (const b of allManagerBonuses) {
    // Check if this participant's team is covered by this bonus
    if (b.teamId !== null && !isInTeam(participant, b.teamId)) continue;
    // Check if the activity date falls within the bonus window
    if (actDate >= b.startDate && actDate <= b.endDate) count++;
  }
  return count;
}

/**
 * Apply x1.5 multiplier n times (multiplicative stacking).
 */
function applyManagerMultiplier(base, n) {
  let result = base;
  for (let i = 0; i < n; i++) result = Math.floor(result * 1.5);
  return result;
}

/**
 * Calculate total points for a single participant.
 * Requires allParticipants to compute team bonuses.
 * allManagerBonuses: output of getManagerBonuses() — ALL windows (past+present+future).
 *   The date check is done per-activity so we don't filter to "today" here.
 */
export function calculateParticipantPoints(participant, customRules, allParticipants, allManagerBonuses = []) {
  const activeRules = getActiveRules(customRules);

  // 1. Course points — date-aware manager bonus per activity
  let coursePoints = 0;
  const courses = participant.courses || [];
  if (Array.isArray(courses)) {
    for (const c of courses) {
      const base    = applyRuleMultiplier(COURSE_LAB_POINTS, activeRules, 'course');
      const n       = countApplicableBonuses(c.dateCompleted, allManagerBonuses, participant);
      coursePoints += applyManagerMultiplier(base, n);
    }
  } else {
    // Legacy integer format fallback
    coursePoints = applyRuleMultiplier(courses * COURSE_LAB_POINTS, activeRules, 'course');
  }

  // 2. Lab points — date-aware manager bonus per activity
  let labPoints = 0;
  const labs = participant.labs || [];
  if (Array.isArray(labs)) {
    for (const l of labs) {
      const base  = applyRuleMultiplier(COURSE_LAB_POINTS, activeRules, 'lab');
      const n     = countApplicableBonuses(l.dateCompleted, allManagerBonuses, participant);
      labPoints += applyManagerMultiplier(base, n);
    }
  } else {
    // Legacy integer format fallback
    labPoints = applyRuleMultiplier(labs * COURSE_LAB_POINTS, activeRules, 'lab');
  }

  // 3. Certificate points — date-aware manager bonus per certificate
  let certPoints = 0;
  (participant.certificates || []).forEach(cert => {
    const certId = getCertId(cert);
    if (!CERT_MAP[certId]) return;
    const base  = applyRuleMultiplier(CERT_MAP[certId].points, activeRules, 'certificate');
    const dateStr = typeof cert === 'string' ? null : cert.dateCompleted;
    const n     = countApplicableBonuses(dateStr, allManagerBonuses, participant);
    certPoints += applyManagerMultiplier(base, n);
  });

  let total = coursePoints + labPoints + certPoints;

  // 4. İstikrar Puanı: previous month → current month ≥ +50% → ×1.2
  // Only applies when the two entries are consecutive months.
  // The ×1.2 multiplier applies only to activities completed in the month
  // immediately following the last history entry (not the full total).
  const history = participant.monthlyHistory || [];
  if (history.length >= 2) {
    const prevEntry = history[history.length - 2];
    const currEntry = history[history.length - 1];
    const [prevYear, prevMonth] = prevEntry.month.split('-').map(Number);
    const [currYear, currMonth] = currEntry.month.split('-').map(Number);
    const isConsecutive =
      (currYear === prevYear && currMonth === prevMonth + 1) ||
      (currYear === prevYear + 1 && prevMonth === 12 && currMonth === 1);
    if (isConsecutive && prevEntry.points > 0 && currEntry.points >= prevEntry.points * 1.5) {
      // Bonus month is the current (latest) history entry month
      const bonusMonth = currEntry.month;

      // Sum points for activities completed in the bonus month only
      let bonusMonthPoints = 0;
      if (Array.isArray(courses)) {
        for (const c of courses) {
          if (!c.dateCompleted || !c.dateCompleted.startsWith(bonusMonth)) continue;
          const base = applyRuleMultiplier(COURSE_LAB_POINTS, activeRules, 'course');
          const n = countApplicableBonuses(c.dateCompleted, allManagerBonuses, participant);
          bonusMonthPoints += applyManagerMultiplier(base, n);
        }
      }
      if (Array.isArray(labs)) {
        for (const l of labs) {
          if (!l.dateCompleted || !l.dateCompleted.startsWith(bonusMonth)) continue;
          const base = applyRuleMultiplier(COURSE_LAB_POINTS, activeRules, 'lab');
          const n = countApplicableBonuses(l.dateCompleted, allManagerBonuses, participant);
          bonusMonthPoints += applyManagerMultiplier(base, n);
        }
      }
      for (const cert of (participant.certificates || [])) {
        const certId = getCertId(cert);
        if (!CERT_MAP[certId]) continue;
        const dateStr = typeof cert === 'string' ? null : cert.dateCompleted;
        if (!dateStr || !dateStr.startsWith(bonusMonth)) continue;
        const base = applyRuleMultiplier(CERT_MAP[certId].points, activeRules, 'certificate');
        const n = countApplicableBonuses(dateStr, allManagerBonuses, participant);
        bonusMonthPoints += applyManagerMultiplier(base, n);
      }

      // Add the 20% bonus on top of already-included bonusMonthPoints
      total += Math.floor(bonusMonthPoints * 0.2);
    }
  }

  // 5. Team bonuses (requires allParticipants)
  // Directors (teamId: null) don't get team bonuses to avoid double-counting
  const teamMembers = (allParticipants && participant.teamId)
    ? allParticipants.filter(p => isInTeam(p, participant.teamId))
    : [];

  if (teamMembers.length > 0) {
    // Kusursuz Birlik: every member has ≥1 course or lab → +25
    const allHaveActivity = teamMembers.every(m => (m.coursesLabs || 0) >= 1);
    if (allHaveActivity) total += 25;

    // Bulut Ordusu: every member has ≥1 certificate → +100
    const allHaveCert = teamMembers.every(m => (m.certificates || []).length >= 1);
    if (allHaveCert) total += 100;
  }

  return total;
}

export function hasKusursuzBirlik(teamMembers) {
  if (!teamMembers || teamMembers.length === 0) return false;
  return teamMembers.every(m => (m.coursesLabs || 0) >= 1);
}

export function hasBulutOrdusu(teamMembers) {
  if (!teamMembers || teamMembers.length === 0) return false;
  return teamMembers.every(m => (m.certificates || []).length >= 1);
}

export function calculateTeamScore(teamId, participants, customRules, allManagerBonuses = []) {
  const teamMembers = participants.filter(p => p.teamId === teamId);
  return teamMembers.reduce((sum, p) => {
    return sum + calculateParticipantPoints(p, customRules, participants, allManagerBonuses);
  }, 0);
}

export function getParticipantsWithPoints(participants, customRules, allManagerBonuses = []) {
  return participants.map(p => ({
    ...p,
    totalPoints: calculateParticipantPoints(p, customRules, participants, allManagerBonuses),
  }));
}
