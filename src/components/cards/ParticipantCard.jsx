import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { formatNumber } from '../../utils/helpers';
import { TEAMS } from '../../data/mockData';
import { getNextTierInfo } from '../../utils/titleResolver';

export default function ParticipantCard({ participant, rank }) {
  const team = TEAMS.find(t => t.id === participant.teamId);
  const nextTier = getNextTierInfo(participant.totalPoints);

  return (
    <Link to={`/participant/${participant.id}`}>
      <div className="card p-4 h-full" style={{ cursor: 'pointer' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          {rank && (
            <span
              className="text-lg font-black w-8 text-center flex-shrink-0"
              style={{ color: rank <= 3 ? '#FBBC04' : '#8B8FA3' }}
            >
              {rank}
            </span>
          )}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: `${team?.color}33`, color: team?.color }}
          >
            {participant.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: '#FFFFFF' }}>
              {participant.name}
            </p>
            <p className="text-xs" style={{ color: team?.color }}>{participant.teamId}</p>
          </div>
        </div>

        {/* Badge */}
        <div className="mb-3">
          <Badge points={participant.totalPoints} size="sm" />
        </div>

        {/* Points */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs" style={{ color: '#8B8FA3' }}>Toplam Puan</span>
          <span className="font-bold" style={{ color: '#FFFFFF' }}>
            {formatNumber(participant.totalPoints)}
          </span>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div>
            <ProgressBar
              value={nextTier.progressPercent}
              max={100}
              color={team?.color || '#4285F4'}
              height={4}
            />
            <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>
              {nextTier.nextTier.emoji} {nextTier.nextTier.title} için {formatNumber(nextTier.pointsNeeded)} puan kaldı
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-3 mt-3">
          <div className="text-center">
            <p className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>{participant.certificates?.length || 0}</p>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>Sertifika</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>{participant.coursesLabs || 0}</p>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>Kurs/Lab</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
