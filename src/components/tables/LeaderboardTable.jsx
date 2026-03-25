import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatNumber, getMedalEmoji } from '../../utils/helpers';
import { TEAMS } from '../../data/mockData';

const TEAM_COLORS = {
  MSE: '#4285F4',
  WSE: '#34A853',
  DCBE: '#FBBC04',
  ECBE: '#EA4335',
  DPM: '#A142F4',
};

export default function LeaderboardTable({ participants, showAll = false }) {
  const data = showAll ? participants : participants.slice(0, 10);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2D3E' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B8FA3', width: '60px' }}>Sıra</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B8FA3' }}>Katılımcı</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#8B8FA3' }}>Takım</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: '#8B8FA3' }}>Unvan</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B8FA3' }}>Puan</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#8B8FA3' }}>Sertifika</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#8B8FA3' }}>Kurs/Lab</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => {
              const rank = i + 1;
              const teamColor = TEAM_COLORS[p.teamId];
              return (
                <tr
                  key={p.id}
                  className="table-row-hover transition-colors"
                  style={{ borderBottom: '1px solid #1A1D2E' }}
                >
                  <td className="px-4 py-3 text-center">
                    <span
                      className="text-base font-bold"
                      style={{ color: rank <= 3 ? '#FBBC04' : '#8B8FA3' }}
                    >
                      {getMedalEmoji(rank)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/participant/${p.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ background: `${teamColor}33`, color: teamColor }}
                      >
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm" style={{ color: '#FFFFFF' }}>{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-md"
                      style={{ background: `${teamColor}22`, color: teamColor }}
                    >
                      {p.teamId}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge points={p.totalPoints} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-sm" style={{ color: '#FFFFFF' }}>
                      {formatNumber(p.totalPoints)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-sm" style={{ color: '#8B8FA3' }}>
                      {p.certificates?.length || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-sm" style={{ color: '#8B8FA3' }}>
                      {p.coursesLabs || 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
