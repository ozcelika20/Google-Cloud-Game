import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, Users, Award, HelpCircle } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Genel', icon: LayoutDashboard, exact: true },
  { path: '/leaderboard', label: 'Sıralama', icon: Trophy },
  { path: '/team/MSE', label: 'Takımlar', icon: Users },
  { path: '/certificates', label: 'Sertifika', icon: Award },
  { path: '/faq', label: 'SSS', icon: HelpCircle },
];

export default function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center"
      style={{ background: '#FFFFFF', borderTop: '1px solid #DADCE0', paddingBottom: 'env(safe-area-inset-bottom)' }}
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
            color: isActive ? '#4285F4' : '#5F6368',
          })}
        >
          {({ isActive }) => (
            <>
              <item.icon size={20} color={isActive ? '#4285F4' : '#5F6368'} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
