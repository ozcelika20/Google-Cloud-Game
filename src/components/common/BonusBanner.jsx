import React from 'react';
import { X } from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';

export default function BonusBanner() {
  const { bonusSettings, toggleBonus } = useCompetition();
  const { patronCildirdi, doublePoint } = bonusSettings;

  const activeBonuses = [
    patronCildirdi.active && { key: 'patronCildirdi', banner: patronCildirdi.banner, type: 'patron' },
    doublePoint.active && { key: 'doublePoint', banner: doublePoint.banner, type: 'double' },
  ].filter(Boolean);

  if (activeBonuses.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 lg:left-60">
      {activeBonuses.map(bonus => (
        <div
          key={bonus.key}
          className={`${bonus.type === 'patron' ? 'bonus-banner-patron' : 'bonus-banner-double'} flex items-center justify-between px-4 py-2.5`}
        >
          <div className="flex-1 text-center">
            <span className="font-bold text-white text-sm drop-shadow-sm">
              {bonus.banner}
            </span>
          </div>
          <button
            onClick={() => toggleBonus(bonus.key, false)}
            className="ml-3 p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <X size={14} color="white" />
          </button>
        </div>
      ))}
    </div>
  );
}
