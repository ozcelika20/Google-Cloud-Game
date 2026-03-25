import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, Award, Settings, Cloud, Pin } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Genel Bakış', icon: LayoutDashboard, exact: true },
  { path: '/leaderboard', label: 'Sıralama', icon: Trophy },
  { path: '/certificates', label: 'Sertifikalar', icon: Award },
  { path: '/admin', label: 'Yönetim Paneli', icon: Settings },
];

const TEAM_LINKS = [
  { id: 'MSE', color: '#4285F4' },
  { id: 'WSE', color: '#34A853' },
  { id: 'DCBE', color: '#FBBC04' },
  { id: 'ECBE', color: '#EA4335' },
  { id: 'DPM', color: '#A142F4' },
];

export default function Sidebar({ isPinned, onPinToggle, onHoverChange }) {
  const [hovered, setHovered] = useState(false);
  const expanded = isPinned || hovered;

  function handleMouseEnter() {
    setHovered(true);
    onHoverChange?.(true);
  }
  function handleMouseLeave() {
    setHovered(false);
    onHoverChange?.(false);
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-50 transition-[width] duration-200 ease-out"
      style={{
        width: expanded ? '240px' : '64px',
        background: '#1A1D2E',
        borderRight: '1px solid #2A2D3E',
        overflowX: 'hidden',
        overflowY: 'hidden',
        /* shadow only when hovering as overlay (not pinned) */
        boxShadow: hovered && !isPinned ? '4px 0 24px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      {/* ── Logo row ── */}
      <div
        className="flex items-center flex-shrink-0"
        style={{ borderBottom: '1px solid #2A2D3E', height: '64px', padding: '0 14px', gap: '10px' }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: '#4285F4', width: '36px', height: '36px' }}
        >
          <Cloud size={20} color="white" />
        </div>

        {/* Title — slides in */}
        <div
          className="flex-1 overflow-hidden transition-all duration-200"
          style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, whiteSpace: 'nowrap' }}
        >
          <div className="font-bold text-sm" style={{ color: '#fff' }}>GCP Yarışması</div>
          <div className="text-xs" style={{ color: '#8B8FA3' }}>2025-2026</div>
        </div>

        {/* Pin button — visible only when expanded */}
        <button
          onClick={onPinToggle}
          className="flex-shrink-0 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
          style={{
            width: '28px', height: '28px',
            color: isPinned ? '#4285F4' : '#8B8FA3',
            opacity: expanded ? 1 : 0,
            pointerEvents: expanded ? 'auto' : 'none',
            transition: 'opacity 0.15s, color 0.15s',
            transform: isPinned ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          title={isPinned ? 'Sabitlemeyi kaldır' : 'Menüyü sabitle'}
        >
          <Pin size={15} />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {/* Section label */}
        <div style={{ height: '28px', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
          <span
            className="text-xs font-semibold uppercase tracking-wider transition-opacity duration-200"
            style={{ color: '#8B8FA3', opacity: expanded ? 1 : 0, whiteSpace: 'nowrap' }}
          >
            Ana Menü
          </span>
        </div>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            title={!expanded ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              margin: '2px 8px',
              padding: expanded ? '8px 10px' : '8px',
              justifyContent: expanded ? 'flex-start' : 'center',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: isActive ? '#fff' : '#8B8FA3',
              background: isActive ? 'rgba(66,133,244,0.15)' : 'transparent',
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              gap: '12px',
            })}
            className={({ isActive }) => isActive ? '' : 'hover:bg-white/5'}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} color={isActive ? '#4285F4' : '#8B8FA3'} style={{ flexShrink: 0 }} />
                <span
                  className="transition-all duration-200"
                  style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  {item.label}
                </span>
                {isActive && expanded && (
                  <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#4285F4', flexShrink: 0 }} />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Teams section */}
        <div style={{ height: '28px', padding: '8px 16px 0', display: 'flex', alignItems: 'flex-end' }}>
          <span
            className="text-xs font-semibold uppercase tracking-wider transition-opacity duration-200"
            style={{ color: '#8B8FA3', opacity: expanded ? 1 : 0, whiteSpace: 'nowrap' }}
          >
            Takımlar
          </span>
        </div>

        {TEAM_LINKS.map((team) => (
          <NavLink
            key={team.id}
            to={`/team/${team.id}`}
            title={!expanded ? team.id : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              margin: '2px 8px',
              padding: expanded ? '7px 10px' : '7px',
              justifyContent: expanded ? 'flex-start' : 'center',
              borderRadius: '8px',
              fontSize: '14px',
              color: isActive ? '#fff' : '#8B8FA3',
              background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              gap: '12px',
            })}
            className={({ isActive }) => isActive ? '' : 'hover:bg-white/5'}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: team.color, flexShrink: 0 }} />
            <span
              className="transition-all duration-200"
              style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 500 }}
            >
              {team.id}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div style={{ borderTop: '1px solid #2A2D3E', padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34A853', boxShadow: '0 0 6px #34A853', flexShrink: 0 }} />
          <div
            className="transition-all duration-200 overflow-hidden"
            style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, whiteSpace: 'nowrap' }}
          >
            <div className="text-xs" style={{ color: '#8B8FA3' }}>Yarışma Aktif</div>
            <div className="text-xs" style={{ color: '#8B8FA3' }}>Bitiş: 30 Kasım 2026</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
