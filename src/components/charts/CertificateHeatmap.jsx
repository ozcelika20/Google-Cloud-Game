import React, { useMemo } from 'react';
import { useCompetition } from '../../hooks/useCompetition';
import { CERTIFICATES } from '../../data/mockData';

const TEAMS = ['MSE', 'WSE', 'DCBE', 'ECCBE', 'DPM'];
const TEAM_COLORS = {
  MSE: '#4285F4',
  WSE: '#34A853',
  DCBE: '#FBBC04',
  ECCBE: '#EA4335',
  DPM: '#A142F4',
};

const ALL_CERTS_FLAT = [
  ...CERTIFICATES.foundational,
  ...CERTIFICATES.associate,
  ...CERTIFICATES.professional,
];

export default function CertificateHeatmap() {
  const { participants } = useCompetition();

  const matrix = useMemo(() => {
    return ALL_CERTS_FLAT.map(cert => {
      const row = { cert };
      TEAMS.forEach(teamId => {
        const teamMembers = participants.filter(p => p.teamId === teamId);
        const count = teamMembers.filter(p => p.certificates?.includes(cert.id)).length;
        const pct = teamMembers.length > 0 ? count / teamMembers.length : 0;
        row[teamId] = { count, pct };
      });
      return row;
    });
  }, [participants]);

  return (
    <div className="card p-8 overflow-x-auto">
      <h3 className="font-semibold mb-7" style={{ color: '#202124' }}>Sertifika Tamamlama Matrisi</h3>
      <table className="w-full text-xs" style={{ minWidth: '480px' }}>
        <thead>
          <tr>
            <th className="text-left pb-2 pr-3" style={{ color: '#5F6368', fontWeight: 500, minWidth: '180px' }}>
              Sertifika
            </th>
            {TEAMS.map(t => (
              <th key={t} className="pb-2 px-2 text-center" style={{ color: TEAM_COLORS[t], fontWeight: 600 }}>
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} className="table-row-hover">
              <td className="py-1.5 pr-3 font-medium truncate" style={{ color: '#202124', maxWidth: '180px' }}>
                <div className="truncate" title={row.cert.name}>{row.cert.name}</div>
                <div style={{ color: '#5F6368', fontSize: '10px' }}>{row.cert.level}</div>
              </td>
              {TEAMS.map(t => {
                const cell = row[t];
                const opacity = Math.max(0.1, cell.pct);
                return (
                  <td key={t} className="py-1.5 px-2 text-center">
                    <div
                      className="inline-flex items-center justify-center rounded text-xs font-semibold"
                      style={{
                        background: `${TEAM_COLORS[t]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                        color: cell.pct > 0.3 ? '#FFFFFF' : '#5F6368',
                        minWidth: '36px',
                        height: '24px',
                        fontSize: '11px',
                      }}
                      title={`${cell.count} kişi (${Math.round(cell.pct * 100)}%)`}
                    >
                      {cell.count}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
