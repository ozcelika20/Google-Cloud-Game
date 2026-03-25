/**
 * Abstract data service layer for future real API integration.
 * Currently uses mock data.
 */

import { MOCK_PARTICIPANTS, TEAMS, ALL_CERTIFICATES, INITIAL_BONUS_SETTINGS } from '../data/mockData';
import { getParticipantsWithPoints, calculateTeamScore } from '../utils/pointCalculator';

// Simulate async API delay
function delay(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const api = {
  /**
   * Fetch all participants
   */
  async getParticipants(bonusSettings = INITIAL_BONUS_SETTINGS) {
    await delay(50);
    return getParticipantsWithPoints(MOCK_PARTICIPANTS, bonusSettings);
  },

  /**
   * Fetch a single participant by ID
   */
  async getParticipant(id, bonusSettings = INITIAL_BONUS_SETTINGS) {
    await delay(30);
    const participant = MOCK_PARTICIPANTS.find(p => p.id === parseInt(id));
    if (!participant) throw new Error('Katılımcı bulunamadı');
    const withPoints = getParticipantsWithPoints([participant], bonusSettings);
    return withPoints[0];
  },

  /**
   * Fetch all teams
   */
  async getTeams() {
    await delay(30);
    return TEAMS;
  },

  /**
   * Fetch team score
   */
  async getTeamScore(teamId, bonusSettings = INITIAL_BONUS_SETTINGS) {
    await delay(30);
    return calculateTeamScore(teamId, MOCK_PARTICIPANTS, bonusSettings);
  },

  /**
   * Fetch all team scores
   */
  async getAllTeamScores(bonusSettings = INITIAL_BONUS_SETTINGS) {
    await delay(50);
    return TEAMS.map(team => ({
      ...team,
      score: calculateTeamScore(team.id, MOCK_PARTICIPANTS, bonusSettings),
      memberCount: MOCK_PARTICIPANTS.filter(p => p.teamId === team.id).length,
    }));
  },

  /**
   * Fetch all certificates
   */
  async getCertificates() {
    await delay(20);
    return ALL_CERTIFICATES;
  },

  /**
   * Fetch bonus settings
   */
  async getBonusSettings() {
    await delay(20);
    return INITIAL_BONUS_SETTINGS;
  },

  /**
   * Update bonus settings (mock - in real app would call API)
   */
  async updateBonusSettings(settings) {
    await delay(50);
    return settings;
  },

  /**
   * Add a participant (mock)
   */
  async addParticipant(data) {
    await delay(100);
    const newId = MOCK_PARTICIPANTS.length + 1;
    const newParticipant = {
      id: newId,
      ...data,
      basePoints: (data.coursesLabs || 0) * 20,
      totalPoints: (data.coursesLabs || 0) * 20,
      monthlyHistory: [],
      joinDate: new Date().toISOString().split('T')[0],
    };
    MOCK_PARTICIPANTS.push(newParticipant);
    return newParticipant;
  },

  /**
   * Update a participant (mock)
   */
  async updateParticipant(id, data) {
    await delay(50);
    const index = MOCK_PARTICIPANTS.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Katılımcı bulunamadı');
    MOCK_PARTICIPANTS[index] = { ...MOCK_PARTICIPANTS[index], ...data };
    return MOCK_PARTICIPANTS[index];
  },
};

export default api;
