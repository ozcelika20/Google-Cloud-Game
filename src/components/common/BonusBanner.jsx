import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';

export default function BonusBanner() {
  const { activeRules } = useCompetition();
  const [dismissed, setDismissed] = useState({});

  // When a new rule becomes active, reset its dismissed state
  useEffect(() => {
    setDismissed(prev => {
      const next = { ...prev };
      activeRules.forEach(r => {
        if (next[r.id] === undefined) next[r.id] = false;
      });
      return next;
    });
  }, [activeRules]);

  const visible = activeRules.filter(r => !dismissed[r.id]);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 lg:left-60">
      {visible.map((rule, i) => (
        <div
          key={rule.id}
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            background: i % 2 === 0
              ? 'linear-gradient(90deg,#4285F4,#34A853)'
              : 'linear-gradient(90deg,#EA4335,#FBBC04)',
          }}
        >
          <div className="flex-1 text-center">
            <span className="font-bold text-white text-sm drop-shadow-sm">
              🎉 <strong>{rule.name}</strong> dönemi başladı!
              {rule.description && (
                <span className="font-normal ml-2 opacity-90">— {rule.description}</span>
              )}
            </span>
          </div>
          <button
            onClick={() => setDismissed(prev => ({ ...prev, [rule.id]: true }))}
            className="ml-3 p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <X size={14} color="white" />
          </button>
        </div>
      ))}
    </div>
  );
}
