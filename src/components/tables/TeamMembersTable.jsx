import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatNumber, getMedalEmoji } from '../../utils/helpers';
import { sortByPoints } from '../../utils/helpers';

export default function TeamMembersTable({ members, teamColor }) {
  const sorted = sortByPoints(members);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2D3E' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B8FA3', width: '60px' }}>Sıra</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B8FA3' }}>Üye</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: '#8B8FA3' }}>Unvan</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B8FA3' }}>Puan</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#8B8FA3' }}>Sertifika</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#8B8FA3' }}>Kurs/Lab</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((member, i) => (
              <tr
                key={member.id}
                className="table-row-hover transition-colors"
                style={{ borderBottom: '1px solid #1A1D2E' }}
              >
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-bold" style={{ color: i < 3 ? '#FBBC04' : '#8B8FA3' }}>
                    {getMedalEmoji(i + 1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/participant/${member.id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{ background: `${teamColor}33`, color: teamColor }}
                    >
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm" style={{ color: '#FFFFFF' }}>{member.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge points={member.totalPoints} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-bold text-sm" style={{ color: '#FFFFFF' }}>
                    {formatNumber(member.totalPoints)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <span className="text-sm" style={{ color: '#8B8FA3' }}>
                    {member.certificates?.length || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <span className="text-sm" style={{ color: '#8B8FA3' }}>
                    {member.coursesLabs || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
