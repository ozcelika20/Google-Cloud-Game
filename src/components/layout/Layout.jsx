import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import BonusBanner from '../common/BonusBanner';

export default function Layout() {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sidebarWidth = isPinned || isHovered ? 240 : 64;

  return (
    <div className="min-h-screen" style={{ background: '#0F1117' }}>
      <Sidebar
        isPinned={isPinned}
        onPinToggle={() => setIsPinned((p) => !p)}
        onHoverChange={setIsHovered}
      />

      <Header />

      {/* Single Outlet render — margin controlled via CSS var + .sidebar-offset class */}
      <main
        className="sidebar-offset pt-14 lg:pt-0 pb-20 lg:pb-0"
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <BonusBanner />
        <Outlet />
      </main>

      <MobileNav />
    </div>
  );
}
