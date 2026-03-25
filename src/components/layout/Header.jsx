import React from 'react';
import { Bell, Menu } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import { useCompetition } from '../../hooks/useCompetition';

export default function Header({ onMenuToggle }) {
  const { bonusSettings } = useCompetition();
  const activeBonus = bonusSettings.patronCildirdi.active || bonusSettings.doublePoint.active;

  return (
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
      style={{ background: '#1A1D2E', borderBottom: '1px solid #2A2D3E' }}
    >
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        style={{ color: '#8B8FA3' }}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <span className="font-bold text-sm" style={{ color: '#4285F4' }}>GCP Yarışması</span>
        {activeBonus && (
          <span className="text-xs px-2 py-0.5 rounded-full animate-pulse" style={{ background: 'rgba(234,67,53,0.2)', color: '#EA4335' }}>
            Bonus Aktif!
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <CountdownTimer compact />
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: '#8B8FA3' }}>
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
