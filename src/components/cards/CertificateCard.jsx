import React from 'react';
import { Award, Star } from 'lucide-react';

const LEVEL_CONFIG = {
  'Temel': { color: '#34A853', label: 'Temel Düzey', icon: '🌱' },
  'Orta': { color: '#4285F4', label: 'Orta Düzey', icon: '⚡' },
  'Profesyonel': { color: '#FBBC04', label: 'Profesyonel', icon: '🏆' },
};

export default function CertificateCard({ certificate, earnedCount, totalParticipants }) {
  const config = LEVEL_CONFIG[certificate.level] || LEVEL_CONFIG['Temel'];
  const pct = totalParticipants > 0 ? Math.round((earnedCount / totalParticipants) * 100) : 0;

  return (
    <div
      className="card p-5"
      style={{ borderTop: `2px solid ${config.color}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${config.color}22`, border: `1px solid ${config.color}44` }}
        >
          {config.icon}
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-semibold"
          style={{
            background: `${config.color}22`,
            color: config.color,
            border: `1px solid ${config.color}44`,
          }}
        >
          {config.label}
        </span>
      </div>

      <h4 className="font-semibold text-sm mb-1 leading-tight" style={{ color: '#202124' }}>
        {certificate.name}
      </h4>

      <div className="flex items-center gap-1 mb-3">
        <Star size={12} color="#FBBC04" />
        <span className="text-xs font-semibold" style={{ color: '#FBBC04' }}>
          {certificate.points} puan
        </span>
      </div>

      {earnedCount !== undefined && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#5F6368' }}>Kazananlar</span>
            <span style={{ color: '#202124' }}>{earnedCount} / {totalParticipants}</span>
          </div>
          <div
            className="rounded-full"
            style={{ background: '#DADCE0', height: '6px' }}
          >
            <div
              className="rounded-full"
              style={{
                width: `${pct}%`,
                background: config.color,
                height: '6px',
                transition: 'width 1s ease-out',
                boxShadow: `0 0 6px ${config.color}66`,
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#5F6368' }}>%{pct} tamamlama oranı</p>
        </div>
      )}
    </div>
  );
}
