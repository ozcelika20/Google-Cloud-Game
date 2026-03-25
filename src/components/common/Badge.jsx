import React from 'react';
import { resolveTitle } from '../../utils/titleResolver';

export default function Badge({ points, size = 'md', showPoints = false }) {
  const tier = resolveTitle(points || 0);

  const sizeStyles = {
    sm: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px' },
    md: { fontSize: '12px', padding: '3px 10px', borderRadius: '20px' },
    lg: { fontSize: '14px', padding: '4px 14px', borderRadius: '20px' },
  };

  return (
    <span
      style={{
        background: tier.bgColor,
        color: tier.color,
        border: `1px solid ${tier.borderColor}`,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
      }}
    >
      {tier.emoji} {tier.title}
      {showPoints && <span style={{ opacity: 0.7 }}>({points})</span>}
    </span>
  );
}
