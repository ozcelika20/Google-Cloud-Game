import React from 'react';
import { Bell, Menu } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import { useCompetition } from '../../hooks/useCompetition';

export default function Header({ onMenuToggle }) {
  const { activeRules } = useCompetition();
  const activeBonus = activeRules.length > 0;

  return (
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
      style={{ background: '#FFFFFF', borderBottom: '1px solid #DADCE0' }}
    >
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        style={{ color: '#5F6368' }}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <span className="font-bold text-sm" style={{ color: '#4285F4' }}>Game Of Clouds</span>
        {activeBonus && (
          <span className="text-xs px-2 py-0.5 rounded-full animate-pulse" style={{ background: 'rgba(234,67,53,0.2)', color: '#EA4335' }}>
            Bonus Aktif!
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <CountdownTimer compact />
        <button className="p-2 rounded-lg hover:bg-black/5 transition-colors" style={{ color: '#5F6368' }}>
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
