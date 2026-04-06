import { ALL_CERTIFICATES } from '../data/mockData';

const CERT_MAP = {};
ALL_CERTIFICATES.forEach(c => { CERT_MAP[c.id] = c; });

const COURSE_LAB_POINTS = 20;

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
 * Calculate total points for a single participant.
 * Requires allParticipants to compute team bonuses.
 */
export function calculateParticipantPoints(participant, customRules, allParticipants) {
  const activeRules = getActiveRules(customRules);

  // 1. Course points
  const rawCoursePoints = (participant.courses || 0) * COURSE_LAB_POINTS;
  const coursePoints    = applyRuleMultiplier(rawCoursePoints, activeRules, 'course');

  // 2. Lab points
  const rawLabPoints = (participant.labs || 0) * COURSE_LAB_POINTS;
  const labPoints    = applyRuleMultiplier(rawLabPoints, activeRules, 'lab');

  // 3. Certificate points
  let rawCertPoints = 0;
  (participant.certificates || []).forEach(certId => {
    if (CERT_MAP[certId]) rawCertPoints += CERT_MAP[certId].points;
  });
  const certPoints = applyRuleMultiplier(rawCertPoints, activeRules, 'certificate');

  let total = coursePoints + labPoints + certPoints;

  // 4. İstikrar Puanı: previous month → current month ≥ +50% → ×1.2
  // Only applies when the two entries are consecutive months.
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
      total = Math.floor(total * 1.2);
    }
  }

  // 5. Team bonuses (requires allParticipants)
  const teamMembers = allParticipants
    ? allParticipants.filter(p => p.teamId === participant.teamId)
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

export function calculateTeamScore(teamId, participants, customRules) {
  const teamMembers = participants.filter(p => p.teamId === teamId);
  return teamMembers.reduce((sum, p) => {
    return sum + calculateParticipantPoints(p, customRules, participants);
  }, 0);
}

export function getParticipantsWithPoints(participants, customRules) {
  return participants.map(p => ({
    ...p,
    totalPoints: calculateParticipantPoints(p, customRules, participants),
  }));
}
