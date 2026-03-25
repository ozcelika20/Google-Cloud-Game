import React from 'react';
import { Link } from 'react-router-dom';
import { resolveTitle, getNextTierInfo } from '../../utils/titleResolver';
import { TEAMS } from '../../data/mockData';
import { formatNumber } from '../../utils/helpers';
import ProgressBar from '../common/ProgressBar';

const RANK_FRAMES = {
  'Cloud Explorer': { gradient: 'linear-gradient(135deg, #3A3D4E, #2A2D3E)', border: '#8B8FA3' },
  'Cloud Ranger': { gradient: 'linear-gradient(135deg, #1A2E20, #1A2D22)', border: '#34A853' },
  'Cloud Ninja': { gradient: 'linear-gradient(135deg, #2E2A1A, #2D2A18)', border: '#FBBC04' },
  'Cloud Master': { gradient: 'linear-gradient(135deg, #2E1A1A, #2D1A1A)', border: '#EA4335' },
};

export default function CharacterCard({ participant, rank }) {
  const team = TEAMS.find(t => t.id === participant.teamId);
  const tier = resolveTitle(participant.totalPoints);
  const nextTier = getNextTierInfo(participant.totalPoints);
  const frame = RANK_FRAMES[tier.title];

  const certCount = participant.certificates?.length || 0;
  const courseCount = participant.coursesLabs || 0;

  return (
    <Link to={`/participant/${participant.id}`}>
      <div
        className="rounded-2xl p-1 cursor-pointer transition-all hover:scale-105"
        style={{
          background: frame.gradient,
          border: `2px solid ${frame.border}`,
          boxShadow: `0 0 20px ${frame.border}33`,
        }}
      >
        <div className="rounded-xl p-4" style={{ background: '#1A1D2E' }}>
          {/* Rank badge */}
          {rank && (
            <div className="flex justify-between items-start mb-3">
              <span
                className="text-2xl font-black"
                style={{ color: rank <= 3 ? '#FBBC04' : frame.border }}
              >
                #{rank}
              </span>
              <span className="text-2xl">{tier.emoji}</span>
            </div>
          )}

          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-2"
              style={{
                background: `${team?.color}33`,
                border: `2px solid ${team?.color}66`,
              }}
            >
              {participant.name.slice(0, 1)}
            </div>
            <h3 className="font-bold text-center text-sm leading-tight" style={{ color: '#FFFFFF' }}>
              {participant.name}
            </h3>
            <span className="text-xs font-semibold" style={{ color: team?.color }}>
              {participant.teamId}
            </span>
          </div>

          {/* Title */}
          <div
            className="text-center py-1 px-3 rounded-lg mb-3 text-xs font-bold"
            style={{
              background: tier.bgColor,
              color: tier.color,
              border: `1px solid ${tier.borderColor}`,
            }}
          >
            {tier.emoji} {tier.title}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-1 mb-3 text-center">
            <div className="rounded-lg p-1.5" style={{ background: '#0F1117' }}>
              <p className="text-sm font-bold" style={{ color: '#FBBC04' }}>{formatNumber(participant.totalPoints)}</p>
              <p className="text-xs" style={{ color: '#8B8FA3' }}>Puan</p>
            </div>
            <div className="rounded-lg p-1.5" style={{ background: '#0F1117' }}>
              <p className="text-sm font-bold" style={{ color: '#34A853' }}>{certCount}</p>
              <p className="text-xs" style={{ color: '#8B8FA3' }}>Sert.</p>
            </div>
            <div className="rounded-lg p-1.5" style={{ background: '#0F1117' }}>
              <p className="text-sm font-bold" style={{ color: '#4285F4' }}>{courseCount}</p>
              <p className="text-xs" style={{ color: '#8B8FA3' }}>Kurs</p>
            </div>
          </div>

          {/* Progress to next level */}
          {nextTier && (
            <div>
              <ProgressBar
                value={nextTier.progressPercent}
                max={100}
                color={nextTier.nextTier.color}
                height={5}
              />
              <p className="text-xs mt-1 text-center" style={{ color: '#8B8FA3' }}>
                {formatNumber(nextTier.pointsNeeded)} → {nextTier.nextTier.emoji}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
