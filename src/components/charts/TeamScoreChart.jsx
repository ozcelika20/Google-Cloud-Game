import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useCompetition } from '../../hooks/useCompetition';
import { formatNumber } from '../../utils/helpers';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-semibold mb-1">{label}</p>
      <p style={{ color: payload[0]?.color }}>
        {formatNumber(payload[0]?.value)} puan
      </p>
    </div>
  );
}

export default function TeamScoreChart() {
  const { teamScores } = useCompetition();

  const data = teamScores.map(t => ({
    name: t.id,
    puan: t.score,
    color: t.color,
    fullName: t.fullName,
  }));

  return (
    <div className="card p-5">
      <h3 className="font-semibold mb-4" style={{ color: '#FFFFFF' }}>Takım Puanları</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={36} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8B8FA3', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8B8FA3', fontSize: 11 }}
            tickFormatter={v => formatNumber(v)}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="puan" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
