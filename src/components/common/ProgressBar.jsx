import React, { useEffect, useRef, useState } from 'react';

export default function ProgressBar({
  value,
  max = 100,
  color = '#4285F4',
  height = 8,
  showLabel = false,
  animated = true,
  label = '',
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (animated) {
        requestAnimationFrame(() => setWidth(percent));
      } else {
        setWidth(percent);
      }
    } else {
      setWidth(percent);
    }
  }, [percent, animated]);

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color: '#8B8FA3' }}>{label}</span>
          <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>{Math.round(percent)}%</span>
        </div>
      )}
      <div
        className="rounded-full overflow-hidden"
        style={{
          background: '#2A2D3E',
          height: `${height}px`,
          borderRadius: `${height}px`,
        }}
      >
        <div
          style={{
            width: `${width}%`,
            background: color,
            height: '100%',
            borderRadius: `${height}px`,
            transition: animated ? 'width 1s ease-out' : 'none',
            boxShadow: `0 0 6px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
