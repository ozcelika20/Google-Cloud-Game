import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatNumber, getMedalEmoji, assignRanks } from '../../utils/helpers';
import { TEAMS } from '../../data/mockData';

const TEAM_COLORS = {
  MSE: '#4285F4',
  WSE: '#34A853',
  DCBE: '#FBBC04',
  ECCBE: '#EA4335',
  DPM: '#A142F4',
};

export default function LeaderboardTable({ participants, showAll = false }) {
  const ranked = assignRanks(showAll ? participants : participants.slice(0, 10));

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #DADCE0' }}>
              <th className="text-left px-4 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5F6368', width: '60px' }}>Sıra</th>
              <th className="text-left px-4 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5F6368' }}>Katılımcı</th>
              <th className="text-left px-4 py-1 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#5F6368' }}>Takım</th>
              <th className="text-left px-4 py-1 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: '#5F6368' }}>Unvan</th>
              <th className="text-right px-4 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5F6368' }}>Puan</th>
              <th className="text-right px-4 py-1 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#5F6368' }}>Sertifika</th>
              <th className="text-right px-4 py-1 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#5F6368' }}>Kurs/Lab</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((p, i) => {
              const rank = p.rank;
              const teamColor = TEAM_COLORS[p.teamId];
              return (
                <tr
                  key={p.id}
                  className="table-row-hover transition-colors"
                  style={{ borderBottom: '1px solid #FFFFFF', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8F9FA' }}
                >
                  <td className="px-4 py-1 text-center">
                    <span
                      className="text-base font-bold"
                      style={{ color: rank <= 3 ? '#FBBC04' : '#5F6368' }}
                    >
                      {getMedalEmoji(rank)}
                    </span>
                  </td>
                  <td className="px-4 py-1">
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
                      <span className="font-medium text-sm" style={{ color: '#202124' }}>{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-1 hidden md:table-cell">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-md"
                      style={{ background: `${teamColor}22`, color: teamColor }}
                    >
                      {p.teamId}
                    </span>
                  </td>
                  <td className="px-4 py-1 hidden sm:table-cell">
                    <Badge points={p.totalPoints} size="sm" />
                  </td>
                  <td className="px-4 py-1 text-right">
                    <span className="font-bold text-sm" style={{ color: '#202124' }}>
                      {formatNumber(p.totalPoints)}
                    </span>
                  </td>
                  <td className="px-4 py-1 text-right hidden lg:table-cell">
                    <span className="text-sm" style={{ color: '#5F6368' }}>
                      {p.certificates?.length || 0}
                    </span>
                  </td>
                  <td className="px-4 py-1 text-right hidden lg:table-cell">
                    <span className="text-sm" style={{ color: '#5F6368' }}>
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
