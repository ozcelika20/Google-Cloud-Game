import React, { createContext, useState, useMemo, useCallback } from 'react';
import { MOCK_PARTICIPANTS, TEAMS, ALL_CERTIFICATES, INITIAL_BONUS_SETTINGS, COMPETITION_END_DATE } from '../data/mockData';
import { getParticipantsWithPoints, calculateTeamScore, hasKusursuzBirlik, hasBulutOrdusu } from '../utils/pointCalculator';
import { sortByPoints, groupByTeam } from '../utils/helpers';

export const CompetitionContext = createContext(null);

export function CompetitionProvider({ children }) {
  const [rawParticipants, setRawParticipants] = useState(MOCK_PARTICIPANTS);
  const [bonusSettings, setBonusSettings] = useState(INITIAL_BONUS_SETTINGS);
  const [competitionEndDate] = useState(COMPETITION_END_DATE);

  // Computed: participants with calculated points
  const participants = useMemo(() => {
    return getParticipantsWithPoints(rawParticipants, bonusSettings);
  }, [rawParticipants, bonusSettings]);

  // Computed: leaderboard (sorted by points)
  const leaderboard = useMemo(() => {
    return sortByPoints(participants);
  }, [participants]);

  // Computed: team scores
  const teamScores = useMemo(() => {
    return TEAMS.map(team => {
      const members = participants.filter(p => p.teamId === team.id);
      const score = members.reduce((sum, p) => sum + p.totalPoints, 0);
      const rawMembers = rawParticipants.filter(p => p.teamId === team.id);
      return {
        ...team,
        score,
        memberCount: members.length,
        avgScore: members.length > 0 ? Math.round(score / members.length) : 0,
        topScore: members.length > 0 ? Math.max(...members.map(m => m.totalPoints)) : 0,
        kusursuzBirlik: hasKusursuzBirlik(rawMembers),
        bulutOrdusu: hasBulutOrdusu(rawMembers),
      };
    }).sort((a, b) => b.score - a.score);
  }, [participants, rawParticipants]);

  // Computed: grouped by team
  const participantsByTeam = useMemo(() => {
    return groupByTeam(participants);
  }, [participants]);

  // Computed: stats
  const stats = useMemo(() => {
    const totalPoints = participants.reduce((s, p) => s + p.totalPoints, 0);
    const totalCerts = participants.reduce((s, p) => s + (p.certificates || []).length, 0);
    const totalCourseLabs = participants.reduce((s, p) => s + (p.coursesLabs || 0), 0);
    const certifiedCount = participants.filter(p => (p.certificates || []).length > 0).length;
    return {
      totalParticipants: participants.length,
      totalPoints,
      totalCerts,
      totalCourseLabs,
      certifiedCount,
      avgPoints: participants.length > 0 ? Math.round(totalPoints / participants.length) : 0,
    };
  }, [participants]);

  // Computed: level distribution
  const levelDistribution = useMemo(() => {
    const explorer = participants.filter(p => p.totalPoints <= 150).length;
    const ranger = participants.filter(p => p.totalPoints > 150 && p.totalPoints <= 350).length;
    const ninja = participants.filter(p => p.totalPoints > 350 && p.totalPoints <= 750).length;
    const master = participants.filter(p => p.totalPoints > 750).length;
    return [
      { name: 'Cloud Explorer', value: explorer, color: '#8B8FA3' },
      { name: 'Cloud Ranger', value: ranger, color: '#34A853' },
      { name: 'Cloud Ninja', value: ninja, color: '#FBBC04' },
      { name: 'Cloud Master', value: master, color: '#EA4335' },
    ];
  }, [participants]);

  // Actions
  const toggleBonus = useCallback((bonusKey, value) => {
    setBonusSettings(prev => ({
      ...prev,
      [bonusKey]: {
        ...prev[bonusKey],
        active: value !== undefined ? value : !prev[bonusKey].active,
      },
    }));
  }, []);

  const updateBonusSettings = useCallback((bonusKey, updates) => {
    setBonusSettings(prev => ({
      ...prev,
      [bonusKey]: {
        ...prev[bonusKey],
        ...updates,
      },
    }));
  }, []);

  const updateParticipant = useCallback((id, data) => {
    setRawParticipants(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data } : p))
    );
  }, []);

  const addParticipant = useCallback((data) => {
    const newId = Math.max(...rawParticipants.map(p => p.id)) + 1;
    const newParticipant = {
      id: newId,
      certificates: [],
      coursesLabs: 0,
      basePoints: 0,
      totalPoints: 0,
      monthlyHistory: [],
      joinDate: new Date().toISOString().split('T')[0],
      ...data,
    };
    setRawParticipants(prev => [...prev, newParticipant]);
    return newParticipant;
  }, [rawParticipants]);

  const getParticipantById = useCallback((id) => {
    return participants.find(p => p.id === parseInt(id));
  }, [participants]);

  const getTeamById = useCallback((id) => {
    return TEAMS.find(t => t.id === id);
  }, []);

  const getTeamMembers = useCallback((teamId) => {
    return participants.filter(p => p.teamId === teamId);
  }, [participants]);

  const value = {
    // State
    participants,
    rawParticipants,
    bonusSettings,
    competitionEndDate,
    teams: TEAMS,
    allCertificates: ALL_CERTIFICATES,
    // Computed
    leaderboard,
    teamScores,
    participantsByTeam,
    stats,
    levelDistribution,
    // Actions
    toggleBonus,
    updateBonusSettings,
    updateParticipant,
    addParticipant,
    // Helpers
    getParticipantById,
    getTeamById,
    getTeamMembers,
  };

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
}
