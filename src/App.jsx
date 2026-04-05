import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CompetitionProvider } from './context/CompetitionContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import TeamDetail from './pages/TeamDetail';
import ParticipantProfile from './pages/ParticipantProfile';
import Certificates from './pages/Certificates';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter basename="/">
      <CompetitionProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="team/:teamId" element={<TeamDetail />} />
            <Route path="participant/:id" element={<ParticipantProfile />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </CompetitionProvider>
    </BrowserRouter>
  );
}
