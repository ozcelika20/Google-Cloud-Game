import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import { TEAMS, ALL_CERTIFICATES, COMPETITION_END_DATE } from '../data/mockData';
import {
  getParticipantsWithPoints,
  calculateTeamScore,
  hasKusursuzBirlik,
  hasBulutOrdusu,
  getActiveRules,
} from '../utils/pointCalculator';
import { sortByPoints, groupByTeam } from '../utils/helpers';
import participantsData from '../data/participants.json';

export const CompetitionContext = createContext(null);

const CUSTOM_RULES_KEY = 'goc_custom_rules';

function loadCustomRules() {
  try {
    const raw = localStorage.getItem(CUSTOM_RULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomRules(rules) {
  localStorage.setItem(CUSTOM_RULES_KEY, JSON.stringify(rules));
}

export function CompetitionProvider({ children }) {
  const [rawParticipants] = useState(() => participantsData.participants || []);
  const [customRules, setCustomRules] = useState(loadCustomRules);
  const [competitionEndDate] = useState(COMPETITION_END_DATE);

  // Persist rules to localStorage whenever they change
  useEffect(() => {
    saveCustomRules(customRules);
  }, [customRules]);

  // Computed: participants with calculated points
  const participants = useMemo(() => {
    return getParticipantsWithPoints(rawParticipants, customRules);
  }, [rawParticipants, customRules]);

  // Computed: leaderboard
  const leaderboard = useMemo(() => sortByPoints(participants), [participants]);

  // Computed: team scores
  const teamScores = useMemo(() => {
    return TEAMS.map(team => {
      const members    = participants.filter(p => p.teamId === team.id);
      const rawMembers = rawParticipants.filter(p => p.teamId === team.id);
      const score = members.reduce((sum, p) => sum + p.totalPoints, 0);
      return {
        ...team,
        score,
        memberCount: members.length,
        avgScore:    members.length > 0 ? Math.round(score / members.length) : 0,
        topScore:    members.length > 0 ? Math.max(...members.map(m => m.totalPoints)) : 0,
        certCount:   members.reduce((sum, m) => sum + (m.certificates || []).length, 0),
        kusursuzBirlik: hasKusursuzBirlik(rawMembers),
        bulutOrdusu:    hasBulutOrdusu(rawMembers),
      };
    }).sort((a, b) => b.score - a.score);
  }, [participants, rawParticipants]);

  // Computed: grouped by team
  const participantsByTeam = useMemo(() => groupByTeam(participants), [participants]);

  // Computed: stats
  const stats = useMemo(() => {
    const totalPoints     = participants.reduce((s, p) => s + p.totalPoints, 0);
    const totalCerts      = participants.reduce((s, p) => s + (p.certificates || []).length, 0);
    const totalCourseLabs = participants.reduce((s, p) => s + (p.coursesLabs || 0), 0);
    const certifiedCount  = participants.filter(p => (p.certificates || []).length > 0).length;
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
    const ranger   = participants.filter(p => p.totalPoints > 150 && p.totalPoints <= 350).length;
    const ninja    = participants.filter(p => p.totalPoints > 350 && p.totalPoints <= 750).length;
    const master   = participants.filter(p => p.totalPoints > 750).length;
    return [
      { name: 'Cloud Explorer', value: explorer, color: '#5F6368' },
      { name: 'Cloud Ranger',   value: ranger,   color: '#34A853' },
      { name: 'Cloud Ninja',    value: ninja,     color: '#FBBC04' },
      { name: 'Cloud Master',   value: master,    color: '#EA4335' },
    ];
  }, [participants]);

  // Active rules for popup
  const activeRules = useMemo(() => getActiveRules(customRules), [customRules]);

  // Rule actions
  const addCustomRule = useCallback((rule) => {
    const newRule = {
      ...rule,
      id: Date.now().toString(),
      active: true,
    };
    setCustomRules(prev => [...prev, newRule]);
    return newRule;
  }, []);

  const updateCustomRule = useCallback((id, updates) => {
    setCustomRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteCustomRule = useCallback((id) => {
    setCustomRules(prev => prev.filter(r => r.id !== id));
  }, []);

  const getParticipantById = useCallback((id) => {
    return participants.find(p => p.id === parseInt(id));
  }, [participants]);

  const getTeamById   = useCallback((id) => TEAMS.find(t => t.id === id), []);
  const getTeamMembers = useCallback((teamId) => participants.filter(p => p.teamId === teamId), [participants]);

  const value = {
    // State
    participants,
    rawParticipants,
    customRules,
    activeRules,
    competitionEndDate,
    lastUpdated: participantsData.lastUpdated,
    teams: TEAMS,
    allCertificates: ALL_CERTIFICATES,
    // Computed
    leaderboard,
    teamScores,
    participantsByTeam,
    stats,
    levelDistribution,
    // Rule actions
    addCustomRule,
    updateCustomRule,
    deleteCustomRule,
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
