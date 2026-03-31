import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useCompetition } from '../../hooks/useCompetition';
import { formatNumber } from '../../utils/helpers';

const TEAM_COLORS = {
  MSE: '#4285F4',
  WSE: '#34A853',
  DCBE: '#FBBC04',
  ECCBE: '#EA4335',
  DPM: '#A142F4',
};

const MONTHS = ['Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-sm">
          {p.dataKey}: {formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function MonthlyProgressChart() {
  const { participants, teams } = useCompetition();

  const chartData = useMemo(() => {
    return MONTHS.map((month, idx) => {
      const entry = { month };
      teams.forEach(team => {
        const teamMembers = participants.filter(p => p.teamId === team.id);
        const totalForMonth = teamMembers.reduce((sum, p) => {
          const histEntry = p.monthlyHistory?.[idx];
          return sum + (histEntry ? histEntry.points : 0);
        }, 0);
        entry[team.id] = totalForMonth;
      });
      return entry;
    });
  }, [participants, teams]);

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-7" style={{ color: '#202124' }}>Aylık İlerleme</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DADCE0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#5F6368', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#5F6368', fontSize: 11 }}
            tickFormatter={v => formatNumber(v)}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#5F6368', fontSize: '12px' }}
          />
          {teams.map(team => (
            <Line
              key={team.id}
              type="monotone"
              dataKey={team.id}
              stroke={TEAM_COLORS[team.id]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
