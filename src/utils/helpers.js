/**
 * Format a number with thousands separator
 */
export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('tr-TR');
}

/**
 * Format points with unit
 */
export function formatPoints(points) {
  return `${formatNumber(points)} puan`;
}

/**
 * Get rank suffix (1st, 2nd, etc.) in Turkish
 */
export function getRankSuffix(rank) {
  return `${rank}.`;
}

/**
 * Calculate percentage
 */
export function calcPercent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Truncate text
 */
export function truncate(str, maxLen = 20) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}

/**
 * Sort participants by points descending
 */
export function sortByPoints(participants) {
  return [...participants].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return (a.name || '').localeCompare(b.name || '', 'tr');
  });
}

/**
 * Get rank position — equal points share the same rank (e.g. 1, 1, 3, 4)
 */
export function getRank(participantId, sortedParticipants) {
  const idx = sortedParticipants.findIndex(p => p.id === participantId);
  return idx === -1 ? 0 : idx + 1;
}

/**
 * Assign tied ranks to an already-sorted participant list
 * Returns array of { participant, rank }
 */
export function assignRanks(sortedParticipants) {
  return sortedParticipants.map((p, i) => ({ ...p, rank: i + 1 }));
}

/**
 * Format date
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Get certificate level label
 */
export function getCertLevelLabel(level) {
  const map = {
    'Temel': 'Temel',
    'Orta': 'Orta Düzey',
    'Profesyonel': 'Profesyonel',
    foundational: 'Temel',
    associate: 'Orta Düzey',
    professional: 'Profesyonel',
  };
  return map[level] || level;
}

/**
 * Get medal emoji for rank
 */
export function getMedalEmoji(rank) {
  if (rank === 1) return '🥇 1.';
  if (rank === 2) return '🥈 2.';
  if (rank === 3) return '🥉 3.';
  return `${rank}.`;
}

/**
 * Calculate days remaining until a date
 */
export function daysUntil(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Returns true if a participant belongs to the given team.
 * Handles both single teamId and multi-team (teamIds array) participants.
 */
export function isInTeam(p, teamId) {
  if (p.teamId && p.teamId === teamId) return true;
  if (p.teamIds && p.teamIds.includes(teamId)) return true;
  return false;
}

/**
 * Group participants by team.
 * Multi-team participants (teamIds) appear in every relevant team's list.
 */
export function groupByTeam(participants) {
  return participants.reduce((acc, p) => {
    const teams = p.teamIds || (p.teamId ? [p.teamId] : []);
    teams.forEach(teamId => {
      if (!acc[teamId]) acc[teamId] = [];
      acc[teamId].push(p);
    });
    return acc;
  }, {});
}
