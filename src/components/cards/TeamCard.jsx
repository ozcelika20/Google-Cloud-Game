import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Trophy } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

export default function TeamCard({ team }) {
  return (
    <Link to={`/team/${team.id}`}>
      <div
        className="card p-6 h-full"
        style={{ borderTop: `3px solid ${team.color}`, cursor: 'pointer' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
            style={{ background: `${team.color}22`, color: team.color, border: `1px solid ${team.color}44` }}
          >
            {team.id.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: '#202124' }}>{team.id}</h3>
            <p className="text-xs" style={{ color: '#5F6368' }}>{team.memberCount} üye</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: '#F8F9FA' }}>
            <span className="text-sm" style={{ color: '#5F6368' }}>Toplam Puan</span>
            <span className="font-bold text-lg" style={{ color: team.color }}>
              {formatNumber(team.score)}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: '#F8F9FA' }}>
            <span className="text-sm" style={{ color: '#5F6368' }}>Sertifika</span>
            <span className="font-semibold text-base" style={{ color: '#202124' }}>
              {team.certCount ?? 0}
            </span>
          </div>
        </div>

        {/* Badges */}
        {(team.kusursuzBirlik || team.bulutOrdusu) && (
          <div className="flex gap-2 mt-5 flex-wrap">
            {team.kusursuzBirlik && (
              <span
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(52,168,83,0.12)', color: '#34A853', border: '1px solid rgba(52,168,83,0.25)' }}
              >
                <CheckCircle size={10} /> Kusursuz Birlik
              </span>
            )}
            {team.bulutOrdusu && (
              <span
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(66,133,244,0.12)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.25)' }}
              >
                <Trophy size={10} /> Bulut Ordusu
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
