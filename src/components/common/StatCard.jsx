import React from 'react';
import { formatNumber } from '../../utils/helpers';

export default function StatCard({ icon: Icon, title, value, subtitle, color = '#4285F4', trend }) {
  return (
    <div
      className="card p-5 flex items-start gap-4"
      style={{ cursor: 'default' }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          background: `${color}22`,
          width: '48px',
          height: '48px',
          border: `1px solid ${color}44`,
        }}
      >
        {Icon && <Icon size={22} color={color} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1" style={{ color: '#8B8FA3' }}>{title}</p>
        <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className="text-xs font-semibold"
              style={{ color: trend >= 0 ? '#34A853' : '#EA4335' }}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-xs" style={{ color: '#8B8FA3' }}>geçen aya göre</span>
          </div>
        )}
      </div>
    </div>
  );
}
