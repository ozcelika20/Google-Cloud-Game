import React, { useState, useMemo } from 'react';
import { Trophy, Calendar, LayoutList } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import LeaderboardTable from '../components/tables/LeaderboardTable';
import SearchBar from '../components/common/SearchBar';

const TEAM_FILTERS = ['Tümü', 'MSE', 'WSE', 'DCBE', 'ECCBE', 'DPM'];

const MONTHS = [
  { key: '2026-01', label: 'Ocak 2026' },
  { key: '2026-02', label: 'Şubat 2026' },
  { key: '2026-03', label: 'Mart 2026' },
  { key: '2026-04', label: 'Nisan 2026' },
  { key: '2026-05', label: 'Mayıs 2026' },
  { key: '2026-06', label: 'Haziran 2026' },
  { key: '2026-07', label: 'Temmuz 2026' },
  { key: '2026-08', label: 'Ağustos 2026' },
  { key: '2026-09', label: 'Eylül 2026' },
  { key: '2026-10', label: 'Ekim 2026' },
  { key: '2026-11', label: 'Kasım 2026' },
];

export default function Leaderboard() {
  const { leaderboard, rawParticipants } = useCompetition();
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('Tümü');
  const [dateMode, setDateMode] = useState('all'); // 'all' | 'monthly'

  // Find months that have any data
  const availableMonths = useMemo(() => {
    const monthSet = new Set();
    rawParticipants.forEach(p => {
      (p.monthlyHistory || []).forEach(h => {
        if (h.points > 0) monthSet.add(h.month);
      });
    });
    return MONTHS.filter(m => monthSet.has(m.key));
  }, [rawParticipants]);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    // default: last available month
    return null;
  });

  // When switching to monthly mode, auto-select the latest available month
  const handleDateMode = (mode) => {
    setDateMode(mode);
    if (mode === 'monthly' && !selectedMonth && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[availableMonths.length - 1].key);
    }
  };

  // Build the ranked list based on mode
  const rankedList = useMemo(() => {
    if (dateMode === 'monthly' && selectedMonth) {
      // Rank by monthlyHistory points for the selected month
      return rawParticipants
        .map(p => {
          const entry = (p.monthlyHistory || []).find(h => h.month === selectedMonth);
          return { ...p, totalPoints: entry ? entry.points : 0 };
        })
        .sort((a, b) => b.totalPoints - a.totalPoints);
    }
    return leaderboard;
  }, [dateMode, selectedMonth, leaderboard, rawParticipants]);

  const filtered = useMemo(() => {
    let result = rankedList;
    if (teamFilter !== 'Tümü') {
      result = result.filter(p => p.teamId === teamFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }
    return result;
  }, [rankedList, teamFilter, search]);

  // Top 3 from unfiltered ranked list (ignore team/search filter for podium)
  const top3 = rankedList.slice(0, 3);

  const selectedMonthLabel = MONTHS.find(m => m.key === selectedMonth)?.label || '';

  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy size={24} color="#FBBC04" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#202124' }}>Sıralama</h1>
          <p className="text-sm" style={{ color: '#5F6368' }}>
            {leaderboard.length} katılımcı
            {dateMode === 'monthly' && selectedMonth && (
              <span> · {selectedMonthLabel}</span>
            )}
          </p>
        </div>
      </div>

      {/* Date Mode Toggle */}
      <div className="flex items-center gap-4 flex-wrap">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: '#F1F3F4', border: '1px solid #DADCE0' }}
        >
          <button
            onClick={() => handleDateMode('all')}
            className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: dateMode === 'all' ? '#FFFFFF' : 'transparent',
              color: dateMode === 'all' ? '#34A853' : '#5F6368',
              boxShadow: dateMode === 'all' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              border: dateMode === 'all' ? '1px solid rgba(52,168,83,0.25)' : '1px solid transparent',
            }}
          >
            <LayoutList size={15} />
            Tümü
          </button>
          <button
            onClick={() => handleDateMode('monthly')}
            className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: dateMode === 'monthly' ? '#FFFFFF' : 'transparent',
              color: dateMode === 'monthly' ? '#4285F4' : '#5F6368',
              boxShadow: dateMode === 'monthly' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              border: dateMode === 'monthly' ? '1px solid rgba(66,133,244,0.25)' : '1px solid transparent',
            }}
          >
            <Calendar size={15} />
            Aylık
          </button>
        </div>

        {dateMode === 'monthly' && (
          <select
            value={selectedMonth || ''}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: '#FFFFFF',
              color: '#202124',
              border: '1px solid rgba(66,133,244,0.4)',
              outline: 'none',
              boxShadow: '0 1px 4px rgba(66,133,244,0.1)',
            }}
          >
            {availableMonths.length === 0 ? (
              <option value="">Veri yok</option>
            ) : (
              availableMonths.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))
            )}
          </select>
        )}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {/* 2nd */}
        <div className="flex flex-col items-center justify-end">
          {top3[1] && (
            <div className="w-full">
              <div className="text-center mb-2">
                <div className="text-2xl">🥈</div>
                <p className="text-xs font-bold truncate" style={{ color: '#202124' }}>{top3[1].name}</p>
                <p className="text-xs" style={{ color: '#5F6368' }}>{top3[1].totalPoints} puan</p>
              </div>
              <div className="rounded-t-xl h-20 flex items-center justify-center text-2xl font-black"
                style={{ background: 'rgba(139,143,163,0.2)', border: '1px solid rgba(139,143,163,0.3)', color: '#5F6368' }}>
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
                <p className="text-xs font-bold truncate" style={{ color: '#202124' }}>{top3[0].name}</p>
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
                <p className="text-xs font-bold truncate" style={{ color: '#202124' }}>{top3[2].name}</p>
                <p className="text-xs" style={{ color: '#5F6368' }}>{top3[2].totalPoints} puan</p>
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
      <div className="flex flex-col sm:flex-row gap-3 items-center">
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
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: teamFilter === t ? '#4285F4' : '#FFFFFF',
                color: teamFilter === t ? '#FFFFFF' : '#5F6368',
                border: teamFilter === t ? '1px solid #4285F4' : '1px solid #DADCE0',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm" style={{ color: '#5F6368' }}>
        {filtered.length} katılımcı gösteriliyor
      </p>

      {/* Table */}
      <LeaderboardTable participants={filtered} showAll />
    </div>
  );
}
