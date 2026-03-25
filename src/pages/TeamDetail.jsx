import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Award, CheckCircle, TrendingUp } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import TeamMembersTable from '../components/tables/TeamMembersTable';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import { formatNumber, sortByPoints } from '../utils/helpers';
import { hasKusursuzBirlik, hasBulutOrdusu } from '../utils/pointCalculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MONTHS = ['Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart'];

export default function TeamDetail() {
  const { teamId } = useParams();
  const { participants, teamScores, getTeamById } = useCompetition();

  const team = getTeamById(teamId);
  const teamMembers = useMemo(() => participants.filter(p => p.teamId === teamId), [participants, teamId]);
  const teamScore = teamScores.find(t => t.id === teamId);
  const rank = teamScores.findIndex(t => t.id === teamId) + 1;

  const topMember = useMemo(() => sortByPoints(teamMembers)[0], [teamMembers]);

  const monthlyData = useMemo(() => {
    return MONTHS.map((month, idx) => {
      const total = teamMembers.reduce((sum, m) => {
        return sum + (m.monthlyHistory?.[idx]?.points || 0);
      }, 0);
      return { month, total };
    });
  }, [teamMembers]);

  const certCount = useMemo(() =>
    teamMembers.reduce((sum, m) => sum + (m.certificates?.length || 0), 0),
    [teamMembers]
  );

  const kusursuz = hasKusursuzBirlik(teamMembers);
  const bulutOrdusu = hasBulutOrdusu(teamMembers);

  if (!team) {
    return (
      <div className="p-6 text-center" style={{ color: '#8B8FA3' }}>
        <p>Takım bulunamadı.</p>
        <Link to="/" className="mt-4 inline-block" style={{ color: '#4285F4' }}>← Ana Sayfa</Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
        style={{ color: '#8B8FA3' }}
      >
        <ArrowLeft size={16} /> Ana Sayfa
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg"
            style={{ background: `${team.color}33`, border: `2px solid ${team.color}66`, color: team.color }}
          >
            {team.id}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{team.id}</h1>
            <p className="text-sm" style={{ color: '#8B8FA3' }}>{team.fullName}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {kusursuz && (
            <span className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold"
              style={{ background: 'rgba(52,168,83,0.15)', color: '#34A853', border: '1px solid rgba(52,168,83,0.3)' }}>
              <CheckCircle size={12} /> Kusursuz Birlik +25 puan
            </span>
          )}
          {bulutOrdusu && (
            <span className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold"
              style={{ background: 'rgba(66,133,244,0.15)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.3)' }}>
              <Trophy size={12} /> Bulut Ordusu +100 puan
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Trophy}
          title="Sıralama"
          value={`#${rank}`}
          subtitle="Genel sıralaması"
          color={team.color}
        />
        <StatCard
          icon={TrendingUp}
          title="Toplam Puan"
          value={teamScore?.score || 0}
          color={team.color}
        />
        <StatCard
          icon={Users}
          title="Üye Sayısı"
          value={teamMembers.length}
          color={team.color}
        />
        <StatCard
          icon={Award}
          title="Sertifika"
          value={certCount}
          subtitle={`${teamScore?.avgScore || 0} ort.`}
          color={team.color}
        />
      </div>

      {/* Top Member & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold mb-4" style={{ color: '#FFFFFF' }}>Aylık Puan Gelişimi</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" />
              <XAxis dataKey="month" tick={{ fill: '#8B8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B8FA3', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatNumber(v)} width={60} />
              <Tooltip
                contentStyle={{ background: '#1A1D2E', border: '1px solid #2A2D3E', borderRadius: '8px' }}
                labelStyle={{ color: '#FFFFFF' }}
                itemStyle={{ color: team.color }}
              />
              <Line type="monotone" dataKey="total" stroke={team.color} strokeWidth={2} dot={{ fill: team.color, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Member */}
        {topMember && (
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: '#FFFFFF' }}>🥇 En İyi Üye</h3>
            <Link to={`/participant/${topMember.id}`} className="hover:opacity-80 transition-opacity">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-3"
                  style={{ background: `${team.color}33`, border: `2px solid ${team.color}66`, color: team.color }}
                >
                  {topMember.name.slice(0, 1)}
                </div>
                <p className="font-bold" style={{ color: '#FFFFFF' }}>{topMember.name}</p>
                <Badge points={topMember.totalPoints} size="sm" />
                <p className="text-xl font-black mt-2" style={{ color: team.color }}>
                  {formatNumber(topMember.totalPoints)} puan
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3 w-full">
                  <div className="rounded-lg p-2" style={{ background: '#0F1117' }}>
                    <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>{topMember.certificates?.length || 0}</p>
                    <p className="text-xs" style={{ color: '#8B8FA3' }}>Sertifika</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ background: '#0F1117' }}>
                    <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>{topMember.coursesLabs || 0}</p>
                    <p className="text-xs" style={{ color: '#8B8FA3' }}>Kurs/Lab</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Members Table */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#FFFFFF' }}>
          Tüm Üyeler ({teamMembers.length})
        </h2>
        <TeamMembersTable members={teamMembers} teamColor={team.color} />
      </div>
    </div>
  );
}
