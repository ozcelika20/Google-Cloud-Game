import { ALL_CERTIFICATES } from '../data/mockData';

/**
 * Calculate total points for a participant based on their data and active bonuses.
 */
export function calculateParticipantPoints(participant, bonusSettings, allParticipants) {
  const certMap = {};
  ALL_CERTIFICATES.forEach(c => { certMap[c.id] = c; });

  // 1. Base points: courses/labs * 20
  const coursePoints = (participant.coursesLabs || 0) * 20;

  // 2. Certificate points
  let certPoints = 0;
  (participant.certificates || []).forEach(certId => {
    if (certMap[certId]) {
      certPoints += certMap[certId].points;
    }
  });

  // 3. Double Point bonus: 2x cert points
  let finalCertPoints = certPoints;
  if (bonusSettings?.doublePoint?.active) {
    finalCertPoints = certPoints * 2;
  }

  let total = coursePoints + finalCertPoints;

  // 4. Patron Çıldırdı bonus: +50% for active period
  if (bonusSettings?.patronCildirdi?.active) {
    total = Math.floor(total * 1.5);
  }

  // 5. İstikrar Puanı: if current month >= 150% of previous month, multiply by 1.2x
  const history = participant.monthlyHistory || [];
  if (history.length >= 2) {
    const prev = history[history.length - 2].points;
    const curr = history[history.length - 1].points;
    if (prev > 0 && curr >= prev * 1.5) {
      total = Math.floor(total * 1.2);
    }
  }

  // 6. Team bonuses (computed at team level, added per participant)
  const teamMembers = allParticipants
    ? allParticipants.filter(p => p.teamId === participant.teamId)
    : [];

  // Kusursuz Birlik: all team members have >= 1 course/lab
  if (teamMembers.length > 0) {
    const allHaveCourseOrLab = teamMembers.every(
      m => (m.coursesLabs || 0) >= 1 || (m.certificates || []).length >= 1
    );
    if (allHaveCourseOrLab) {
      total += 25;
    }

    // Bulut Ordusu: all team members have >= 1 certificate
    const allHaveCert = teamMembers.every(m => (m.certificates || []).length >= 1);
    if (allHaveCert) {
      total += 100;
    }
  }

  return total;
}

/**
 * Check if a team has Kusursuz Birlik bonus
 */
export function hasKusursuzBirlik(teamMembers) {
  if (!teamMembers || teamMembers.length === 0) return false;
  return teamMembers.every(
    m => (m.coursesLabs || 0) >= 1 || (m.certificates || []).length >= 1
  );
}

/**
 * Check if a team has Bulut Ordusu bonus
 */
export function hasBulutOrdusu(teamMembers) {
  if (!teamMembers || teamMembers.length === 0) return false;
  return teamMembers.every(m => (m.certificates || []).length >= 1);
}

/**
 * Calculate team total score
 */
export function calculateTeamScore(teamId, participants, bonusSettings) {
  const teamMembers = participants.filter(p => p.teamId === teamId);
  return teamMembers.reduce((sum, p) => {
    return sum + calculateParticipantPoints(p, bonusSettings, participants);
  }, 0);
}

/**
 * Get all participants with calculated points
 */
export function getParticipantsWithPoints(participants, bonusSettings) {
  return participants.map(p => ({
    ...p,
    totalPoints: calculateParticipantPoints(p, bonusSettings, participants),
  }));
}
