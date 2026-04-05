import React from 'react';
import { NavLink } from 'react-router-dom';
import { Award } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import StatCard from '../components/common/StatCard';
import CountdownTimer from '../components/common/CountdownTimer';
import TeamCard from '../components/cards/TeamCard';
import TeamScoreChart from '../components/charts/TeamScoreChart';
import LevelDistributionChart from '../components/charts/LevelDistributionChart';
import LeaderboardTable from '../components/tables/LeaderboardTable';
import { REWARDS, REWARD_CONDITIONS } from '../data/mockData';

export default function Home() {
  const { stats, teamScores, leaderboard, activeRules } = useCompetition();

  return (
    <div className="p-8 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#202124' }}>
            ☁️ Game Of Clouds
          </h1>
          <p className="text-sm mt-2" style={{ color: '#5F6368' }}>
            Google Cloud Sertifikasyon Yarışması 2025-2026
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {activeRules.map(rule => (
            <span key={rule.id} className="text-xs px-3 py-1.5 rounded-full font-semibold pulse-animation"
              style={{ background: 'rgba(66,133,244,0.12)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.3)' }}>
              🎉 {rule.name} Aktif
            </span>
          ))}
        </div>
      </div>

      {/* Stats Row: Toplam Sertifika + Geri Sayım */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          icon={Award}
          title="Toplam Sertifika"
          value={stats.totalCerts}
          subtitle={`${stats.certifiedCount} kişi sertifikalı`}
          color="#FBBC04"
        />
        <CountdownTimer />
      </div>

      {/* Charts yan yana */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamScoreChart />
        <LevelDistributionChart />
      </div>

      {/* Team Cards */}
      <div>
        <h2 className="text-xl font-bold mb-7" style={{ color: '#202124' }}>Takım Sıralaması</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {teamScores.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>

      {/* Top 10 Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold" style={{ color: '#202124' }}>🏆 İlk 10 Sıralama</h2>
          <NavLink
            to="/leaderboard"
            style={{ color: '#4285F4' }}
            className="text-sm font-semibold"
          >
            Tümünü Gör →
          </NavLink>
        </div>
        <LeaderboardTable participants={leaderboard} showAll={false} />
      </div>


    </div>
  );
}
