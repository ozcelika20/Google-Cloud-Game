import React, { useState, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import LeaderboardTable from '../components/tables/LeaderboardTable';
import SearchBar from '../components/common/SearchBar';
import CharacterCard from '../components/cards/CharacterCard';

const TEAM_FILTERS = ['Tümü', 'MSE', 'WSE', 'DCBE', 'ECBE', 'DPM'];
const VIEW_OPTIONS = [
  { label: 'Tablo', value: 'table' },
  { label: 'Kart', value: 'card' },
];

export default function Leaderboard() {
  const { leaderboard } = useCompetition();
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('Tümü');
  const [view, setView] = useState('table');

  const filtered = useMemo(() => {
    let result = leaderboard;
    if (teamFilter !== 'Tümü') {
      result = result.filter(p => p.teamId === teamFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }
    return result;
  }, [leaderboard, teamFilter, search]);

  // Top 3
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy size={24} color="#FBBC04" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Sıralama</h1>
          <p className="text-sm" style={{ color: '#8B8FA3' }}>
            {leaderboard.length} katılımcı
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {/* 2nd */}
        <div className="flex flex-col items-center justify-end">
          {top3[1] && (
            <div className="w-full">
              <div className="text-center mb-2">
                <div className="text-2xl">🥈</div>
                <p className="text-xs font-bold truncate" style={{ color: '#FFFFFF' }}>{top3[1].name}</p>
                <p className="text-xs" style={{ color: '#8B8FA3' }}>{top3[1].totalPoints} puan</p>
              </div>
              <div className="rounded-t-xl h-20 flex items-center justify-center text-2xl font-black"
                style={{ background: 'rgba(139,143,163,0.2)', border: '1px solid rgba(139,143,163,0.3)', color: '#8B8FA3' }}>
                2
              </div>
            </div>
          )}
        </div>
        {/* 1st */}
        <div className="flex flex-col items-center justify-end">
          {top3[0] && (
            <div className="w-full">
              <div className="text-center mb-2">
                <div className="text-3xl">🥇</div>
                <p className="text-xs font-bold truncate" style={{ color: '#FFFFFF' }}>{top3[0].name}</p>
                <p className="text-xs font-bold" style={{ color: '#FBBC04' }}>{top3[0].totalPoints} puan</p>
              </div>
              <div className="rounded-t-xl h-28 flex items-center justify-center text-3xl font-black"
                style={{ background: 'rgba(251,188,4,0.2)', border: '1px solid rgba(251,188,4,0.4)', color: '#FBBC04' }}>
                1
              </div>
            </div>
          )}
        </div>
        {/* 3rd */}
        <div className="flex flex-col items-center justify-end">
          {top3[2] && (
            <div className="w-full">
              <div className="text-center mb-2">
                <div className="text-2xl">🥉</div>
                <p className="text-xs font-bold truncate" style={{ color: '#FFFFFF' }}>{top3[2].name}</p>
                <p className="text-xs" style={{ color: '#8B8FA3' }}>{top3[2].totalPoints} puan</p>
              </div>
              <div className="rounded-t-xl h-16 flex items-center justify-center text-xl font-black"
                style={{ background: 'rgba(205,127,50,0.2)', border: '1px solid rgba(205,127,50,0.3)', color: '#CD7F32' }}>
                3
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Katılımcı ara..."
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {TEAM_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setTeamFilter(t)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: teamFilter === t ? '#4285F4' : '#1A1D2E',
                color: teamFilter === t ? '#FFFFFF' : '#8B8FA3',
                border: teamFilter === t ? '1px solid #4285F4' : '1px solid #2A2D3E',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg overflow-hidden" style={{ border: '1px solid #2A2D3E' }}>
          {VIEW_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setView(opt.value)}
              className="px-3 py-2 text-xs font-medium transition-all"
              style={{
                background: view === opt.value ? '#4285F4' : '#1A1D2E',
                color: view === opt.value ? '#FFFFFF' : '#8B8FA3',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm" style={{ color: '#8B8FA3' }}>
        {filtered.length} katılımcı gösteriliyor
      </p>

      {/* Table or Cards */}
      {view === 'table' ? (
        <LeaderboardTable participants={filtered} showAll />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <CharacterCard key={p.id} participant={p} rank={leaderboard.indexOf(p) + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
