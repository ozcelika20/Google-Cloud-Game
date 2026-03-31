import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, TrendingUp, Star } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { formatNumber, getRank } from '../utils/helpers';
import { resolveTitle, getNextTierInfo, TITLES } from '../utils/titleResolver';
import { ALL_CERTIFICATES, TEAMS } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ParticipantProfile() {
  const { id } = useParams();
  const { getParticipantById, leaderboard } = useCompetition();
  const participant = getParticipantById(id);

  if (!participant) {
    return (
      <div className="p-6 text-center" style={{ color: '#5F6368' }}>
        <p>Katılımcı bulunamadı.</p>
        <Link to="/leaderboard" className="mt-4 inline-block" style={{ color: '#4285F4' }}>← Sıralama</Link>
      </div>
    );
  }

  const team = TEAMS.find(t => t.id === participant.teamId);
  const rank = getRank(participant.id, leaderboard);
  const tier = resolveTitle(participant.totalPoints);
  const nextTier = getNextTierInfo(participant.totalPoints);

  const earnedCerts = ALL_CERTIFICATES.filter(c => participant.certificates?.includes(c.id));
  const certMap = {};
  ALL_CERTIFICATES.forEach(c => { certMap[c.id] = c; });

  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Back */}
      <Link
        to="/leaderboard"
        className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
        style={{ color: '#5F6368' }}
      >
        <ArrowLeft size={16} /> Sıralama
      </Link>

      {/* Profile Header */}
      <div
        className="card p-6"
        style={{ borderLeft: `3px solid ${team?.color || '#4285F4'}` }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
            style={{
              background: `${team?.color || '#4285F4'}33`,
              border: `2px solid ${team?.color || '#4285F4'}66`,
              color: team?.color || '#4285F4',
            }}
          >
            {participant.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#202124' }}>{participant.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    to={`/team/${participant.teamId}`}
                    className="text-sm font-semibold hover:underline"
                    style={{ color: team?.color }}
                  >
                    {participant.teamId}
                  </Link>
                  <span style={{ color: '#DADCE0' }}>•</span>
                  <Badge points={participant.totalPoints} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: '#202124' }}>
                  {formatNumber(participant.totalPoints)}
                </p>
                <p className="text-sm" style={{ color: '#5F6368' }}>toplam puan</p>
                <p className="text-sm font-semibold mt-1" style={{ color: '#FBBC04' }}>
                  Genel Sıra: #{rank}
                </p>
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#5F6368' }}>{tier.emoji} {tier.title}</span>
                  <span style={{ color: '#5F6368' }}>
                    {formatNumber(nextTier.pointsNeeded)} puan → {nextTier.nextTier.emoji} {nextTier.nextTier.title}
                  </span>
                </div>
                <ProgressBar
                  value={nextTier.progressPercent}
                  max={100}
                  color={nextTier.nextTier.color}
                  height={8}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <TrendingUp size={22} color="#4285F4" className="mx-auto mb-2" />
          <p className="text-2xl font-black" style={{ color: '#202124' }}>{formatNumber(participant.totalPoints)}</p>
          <p className="text-xs" style={{ color: '#5F6368' }}>Toplam Puan</p>
        </div>
        <div className="card p-4 text-center">
          <Award size={22} color="#34A853" className="mx-auto mb-2" />
          <p className="text-2xl font-black" style={{ color: '#202124' }}>{earnedCerts.length}</p>
          <p className="text-xs" style={{ color: '#5F6368' }}>Sertifika</p>
        </div>
        <div className="card p-4 text-center">
          <BookOpen size={22} color="#FBBC04" className="mx-auto mb-2" />
          <p className="text-2xl font-black" style={{ color: '#202124' }}>{participant.coursesLabs || 0}</p>
          <p className="text-xs" style={{ color: '#5F6368' }}>Kurs / Lab</p>
        </div>
        <div className="card p-4 text-center">
          <Star size={22} color="#FBBC04" className="mx-auto mb-2" />
          <p className="text-2xl font-black" style={{ color: '#FBBC04' }}>#{rank}</p>
          <p className="text-xs" style={{ color: '#5F6368' }}>Genel Sıra</p>
        </div>
      </div>

      {/* Monthly Progress Chart */}
      {participant.monthlyHistory?.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-4" style={{ color: '#202124' }}>Aylık Puan Gelişimi</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={participant.monthlyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DADCE0" />
              <XAxis dataKey="month" tick={{ fill: '#5F6368', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5F6368', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatNumber(v)} width={50} />
              <Tooltip
                contentStyle={{ background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '8px' }}
                labelStyle={{ color: '#202124' }}
                itemStyle={{ color: team?.color || '#4285F4' }}
              />
              <Line type="monotone" dataKey="points" stroke={team?.color || '#4285F4'} strokeWidth={2} dot={{ fill: team?.color || '#4285F4', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Certificates */}
      {earnedCerts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#202124' }}>
            Kazanılan Sertifikalar ({earnedCerts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {earnedCerts.map(cert => {
              const levelConfig = {
                'Temel': { color: '#34A853', icon: '🌱' },
                'Orta': { color: '#4285F4', icon: '⚡' },
                'Profesyonel': { color: '#FBBC04', icon: '🏆' },
              };
              const lc = levelConfig[cert.level] || levelConfig['Temel'];
              return (
                <div
                  key={cert.id}
                  className="card p-4 flex items-center gap-3"
                  style={{ borderLeft: `2px solid ${lc.color}` }}
                >
                  <span className="text-2xl">{lc.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#202124' }}>{cert.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: lc.color }}>{cert.level}</span>
                      <span className="text-xs" style={{ color: '#FBBC04' }}>+{cert.points} puan</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Title Journey */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#202124' }}>Unvan Yolculuğu</h2>
        <div className="card p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TITLES.map(t => {
              const achieved = participant.totalPoints >= t.min;
              const isCurrent = participant.totalPoints >= t.min && participant.totalPoints <= t.max;
              return (
                <div
                  key={t.title}
                  className="text-center p-3 rounded-xl transition-all"
                  style={{
                    background: achieved ? t.bgColor : '#F8F9FA',
                    border: `1px solid ${achieved ? t.borderColor : '#DADCE0'}`,
                    opacity: achieved ? 1 : 0.4,
                  }}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="text-xs font-semibold mt-1" style={{ color: achieved ? t.color : '#5F6368' }}>
                    {t.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#5F6368' }}>
                    {t.min === 0 ? '0' : `${t.min}+`} puan
                  </p>
                  {isCurrent && (
                    <span className="text-xs font-bold mt-1 block" style={{ color: t.color }}>← Şu an</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
