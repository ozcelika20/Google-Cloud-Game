import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, TrendingUp, CheckCircle } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { formatNumber } from '../../utils/helpers';

export default function TeamCard({ team, rank, maxScore }) {
  const pct = maxScore > 0 ? (team.score / maxScore) * 100 : 0;

  return (
    <Link to={`/team/${team.id}`}>
      <div
        className="card p-5 h-full"
        style={{
          borderLeft: `3px solid ${team.color}`,
          cursor: 'pointer',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: `${team.color}22`, color: team.color, border: `1px solid ${team.color}44` }}
            >
              {team.id.slice(0, 2)}
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: '#FFFFFF' }}>{team.id}</h3>
              <p className="text-xs" style={{ color: '#8B8FA3' }}>{team.memberCount} üye</p>
            </div>
          </div>
          <div
            className="text-2xl font-black"
            style={{ color: rank <= 3 ? team.color : '#8B8FA3' }}
          >
            #{rank}
          </div>
        </div>

        {/* Score */}
        <div className="mb-3">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs" style={{ color: '#8B8FA3' }}>Toplam Puan</span>
            <span className="font-bold text-lg" style={{ color: '#FFFFFF' }}>
              {formatNumber(team.score)}
            </span>
          </div>
          <ProgressBar value={pct} max={100} color={team.color} height={6} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="text-center p-2 rounded-lg" style={{ background: '#0F1117' }}>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>Ort. Puan</p>
            <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>
              {formatNumber(team.avgScore)}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: '#0F1117' }}>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>En Yüksek</p>
            <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>
              {formatNumber(team.topScore)}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {team.kusursuzBirlik && (
            <span
              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(52, 168, 83, 0.15)', color: '#34A853', border: '1px solid rgba(52,168,83,0.3)' }}
            >
              <CheckCircle size={10} /> Kusursuz Birlik
            </span>
          )}
          {team.bulutOrdusu && (
            <span
              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(66, 133, 244, 0.15)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.3)' }}
            >
              <Trophy size={10} /> Bulut Ordusu
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
