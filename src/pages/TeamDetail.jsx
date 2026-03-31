import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Award, CheckCircle, TrendingUp } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import TeamMembersTable from '../components/tables/TeamMembersTable';
import { formatNumber } from '../utils/helpers';
import { hasKusursuzBirlik, hasBulutOrdusu } from '../utils/pointCalculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım'];

export default function TeamDetail() {
  const { teamId } = useParams();
  const { participants, teamScores, getTeamById } = useCompetition();

  const team = getTeamById(teamId);
  const teamMembers = useMemo(() => participants.filter(p => p.teamId === teamId), [participants, teamId]);
  const rank = teamScores.findIndex(t => t.id === teamId) + 1;

  const coursesLabsCount = useMemo(() =>
    teamMembers.filter(m => (m.coursesLabs || 0) > 0).length,
    [teamMembers]
  );

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
      <div className="p-6 text-center" style={{ color: '#5F6368' }}>
        <p>Takım bulunamadı.</p>
        <Link to="/" className="mt-4 inline-block" style={{ color: '#4285F4' }}>← Ana Sayfa</Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
        style={{ color: '#5F6368' }}
      >
        <ArrowLeft size={16} /> Ana Sayfa
      </Link>

      {/* Header + Stats — tek satır */}
      <div className="card p-5 flex flex-wrap items-center gap-4">
        {/* Takım adı */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base"
            style={{ background: `${team.color}33`, border: `2px solid ${team.color}66`, color: team.color }}
          >
            {team.id}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#202124' }}>{team.id}</h1>
            <div className="flex gap-1.5 mt-1 flex-wrap">
              {kusursuz && (
                <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold"
                  style={{ background: 'rgba(52,168,83,0.15)', color: '#34A853', border: '1px solid rgba(52,168,83,0.3)' }}>
                  <CheckCircle size={10} /> Kusursuz Birlik
                </span>
              )}
              {bulutOrdusu && (
                <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold"
                  style={{ background: 'rgba(66,133,244,0.15)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.3)' }}>
                  <Trophy size={10} /> Bulut Ordusu
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-px self-stretch hidden sm:block" style={{ background: '#DADCE0' }} />

        {/* Statlar */}
        {[
          { icon: Trophy,    label: 'Sıralama',         value: `#${rank}` },
          { icon: TrendingUp, label: 'Course/Lab Alan', value: coursesLabsCount },
          { icon: Award,     label: 'Sertifika',        value: certCount },
          { icon: Users,     label: 'Üye Sayısı',       value: teamMembers.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2 flex-1 min-w-[100px]">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${team.color}22`, border: `1px solid ${team.color}44` }}
            >
              <Icon size={15} color={team.color} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#5F6368' }}>{label}</p>
              <p className="text-base font-bold" style={{ color: '#202124' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-8">
        <h3 className="font-semibold mb-7" style={{ color: '#202124' }}>Aylık Puan Gelişimi</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DADCE0" />
            <XAxis dataKey="month" tick={{ fill: '#5F6368', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5F6368', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatNumber(v)} width={60} />
            <Tooltip
              contentStyle={{ background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '8px' }}
              labelStyle={{ color: '#202124' }}
              itemStyle={{ color: team.color }}
            />
            <Line type="monotone" dataKey="total" stroke={team.color} strokeWidth={2} dot={{ fill: team.color, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Members Table */}
      <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <h2 className="text-lg font-bold mb-7" style={{ color: '#202124' }}>
          Tüm Üyeler ({teamMembers.length})
        </h2>
        <TeamMembersTable members={teamMembers} teamColor={team.color} />
      </div>
    </div>
  );
}
