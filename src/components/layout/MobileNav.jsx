import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, Users, Award, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Genel', icon: LayoutDashboard, exact: true },
  { path: '/leaderboard', label: 'Sıralama', icon: Trophy },
  { path: '/team/MSE', label: 'Takımlar', icon: Users },
  { path: '/certificates', label: 'Sertifika', icon: Award },
  { path: '/admin', label: 'Yönetim', icon: Settings },
];

export default function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center"
      style={{ background: '#1A1D2E', borderTop: '1px solid #2A2D3E', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.exact}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all text-xs ${
              isActive ? 'mobile-nav-active' : ''
            }`
          }
          style={({ isActive }) => ({
            color: isActive ? '#4285F4' : '#8B8FA3',
          })}
        >
          {({ isActive }) => (
            <>
              <item.icon size={20} color={isActive ? '#4285F4' : '#8B8FA3'} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
