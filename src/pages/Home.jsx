import React from 'react';
import { Users, Trophy, Award, BookOpen, TrendingUp } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import StatCard from '../components/common/StatCard';
import CountdownTimer from '../components/common/CountdownTimer';
import TeamCard from '../components/cards/TeamCard';
import TeamScoreChart from '../components/charts/TeamScoreChart';
import MonthlyProgressChart from '../components/charts/MonthlyProgressChart';
import LevelDistributionChart from '../components/charts/LevelDistributionChart';
import LeaderboardTable from '../components/tables/LeaderboardTable';
import { REWARDS, REWARD_CONDITIONS } from '../data/mockData';
import { formatNumber } from '../utils/helpers';

export default function Home() {
  const { stats, teamScores, leaderboard, bonusSettings } = useCompetition();
  const maxScore = teamScores.length > 0 ? teamScores[0].score : 1;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
            ☁️ GCP Yarışması Panosu
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8B8FA3' }}>
            Google Cloud Sertifikasyon Yarışması 2025-2026
          </p>
        </div>
        {/* Active bonuses pill */}
        <div className="flex gap-2 flex-wrap">
          {bonusSettings.patronCildirdi.active && (
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold pulse-animation"
              style={{ background: 'rgba(52,168,83,0.2)', color: '#34A853', border: '1px solid rgba(52,168,83,0.4)' }}>
              🎉 Patron Çıldırdı Aktif
            </span>
          )}
          {bonusSettings.doublePoint.active && (
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold pulse-animation"
              style={{ background: 'rgba(234,67,53,0.2)', color: '#EA4335', border: '1px solid rgba(234,67,53,0.4)' }}>
              🔥 Çifte Puan Aktif
            </span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Toplam Katılımcı"
          value={stats.totalParticipants}
          subtitle="5 takım"
          color="#4285F4"
        />
        <StatCard
          icon={TrendingUp}
          title="Toplam Puan"
          value={stats.totalPoints}
          subtitle={`Ort. ${formatNumber(stats.avgPoints)}`}
          color="#34A853"
        />
        <StatCard
          icon={Award}
          title="Toplam Sertifika"
          value={stats.totalCerts}
          subtitle={`${stats.certifiedCount} kişi sertifikalı`}
          color="#FBBC04"
        />
        <StatCard
          icon={BookOpen}
          title="Kurs & Lab"
          value={stats.totalCourseLabs}
          subtitle="Tamamlanan"
          color="#A142F4"
        />
      </div>

      {/* Countdown + Team Scores Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TeamScoreChart />
        </div>
        <div>
          <CountdownTimer />
        </div>
      </div>

      {/* Team Cards */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#FFFFFF' }}>Takım Sıralaması</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {teamScores.map((team, i) => (
            <TeamCard key={team.id} team={team} rank={i + 1} maxScore={maxScore} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyProgressChart />
        <LevelDistributionChart />
      </div>

      {/* Top 10 Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>🏆 İlk 10 Sıralama</h2>
          <a href="/leaderboard" className="text-sm font-semibold" style={{ color: '#4285F4' }}>
            Tümünü Gör →
          </a>
        </div>
        <LeaderboardTable participants={leaderboard} showAll={false} />
      </div>

      {/* Rewards Section */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#FFFFFF' }}>🎁 Ödüller</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REWARDS.map((reward, i) => (
            <div
              key={i}
              className="card p-5"
              style={{ borderLeft: `3px solid ${reward.color}` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{reward.icon}</span>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: reward.color }}>
                    {reward.rank}
                  </p>
                  <p className="font-semibold" style={{ color: '#FFFFFF' }}>{reward.reward}</p>
                  <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>{reward.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div className="mt-3 card p-4">
          <p className="text-sm font-semibold mb-2" style={{ color: '#8B8FA3' }}>Ödül Koşulları</p>
          <div className="space-y-1">
            {REWARD_CONDITIONS.map((c, i) => (
              <p key={i} className="text-sm" style={{ color: '#8B8FA3' }}>
                {c.icon} {c.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
