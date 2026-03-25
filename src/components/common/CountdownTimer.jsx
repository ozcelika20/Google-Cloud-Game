import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function CountdownTimer({ compact = false }) {
  const { competitionEndDate } = useCompetition();
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    function calculate() {
      const now = new Date();
      const diff = new Date(competitionEndDate) - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, ended: false });
    }
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [competitionEndDate]);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#FBBC04' }}>
        <Timer size={14} />
        <span className="font-mono font-semibold">
          {timeLeft.ended ? 'Bitti' : `${timeLeft.days}g ${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
        </span>
      </div>
    );
  }

  return (
    <div
      className="card p-5"
      style={{ background: 'rgba(251, 188, 4, 0.05)', border: '1px solid rgba(251, 188, 4, 0.3)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Timer size={16} color="#FBBC04" />
        <span className="text-sm font-semibold" style={{ color: '#FBBC04' }}>Yarışma Bitimine Kalan</span>
      </div>
      {timeLeft.ended ? (
        <p className="text-lg font-bold" style={{ color: '#EA4335' }}>Yarışma Sona Erdi</p>
      ) : (
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Gün', value: timeLeft.days },
            { label: 'Saat', value: pad(timeLeft.hours) },
            { label: 'Dakika', value: pad(timeLeft.minutes) },
            { label: 'Saniye', value: pad(timeLeft.seconds) },
          ].map(item => (
            <div key={item.label}>
              <div
                className="text-2xl font-bold font-mono"
                style={{ color: '#FBBC04' }}
              >
                {item.value}
              </div>
              <div className="text-xs" style={{ color: '#8B8FA3' }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
