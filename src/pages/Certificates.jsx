import React, { useMemo, useState } from 'react';
import { Award } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import CertificateCard from '../components/cards/CertificateCard';
import CertificateHeatmap from '../components/charts/CertificateHeatmap';
import { CERTIFICATES } from '../data/mockData';

const FILTER_OPTIONS = [
  { label: 'Tümü', value: 'all' },
  { label: 'Temel', value: 'Temel' },
  { label: 'Orta', value: 'Orta' },
  { label: 'Profesyonel', value: 'Profesyonel' },
];

export default function Certificates() {
  const { participants } = useCompetition();
  const [filter, setFilter] = useState('all');

  const certStats = useMemo(() => {
    const stats = {};
    [...CERTIFICATES.foundational, ...CERTIFICATES.associate, ...CERTIFICATES.professional].forEach(cert => {
      stats[cert.id] = participants.filter(p => p.certificates?.includes(cert.id)).length;
    });
    return stats;
  }, [participants]);

  const totalCerts = useMemo(() =>
    Object.values(certStats).reduce((sum, count) => sum + count, 0),
    [certStats]
  );

  const allCerts = [
    ...CERTIFICATES.foundational,
    ...CERTIFICATES.associate,
    ...CERTIFICATES.professional,
  ];

  const filteredCerts = filter === 'all' ? allCerts : allCerts.filter(c => c.level === filter);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Award size={24} color="#34A853" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Sertifikalar</h1>
          <p className="text-sm" style={{ color: '#8B8FA3' }}>
            Toplam {totalCerts} sertifika kazanıldı
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-black" style={{ color: '#34A853' }}>
            {CERTIFICATES.foundational.length}
          </p>
          <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>Temel Sertifika</p>
          <p className="text-xs font-semibold" style={{ color: '#34A853' }}>150 puan/adet</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-black" style={{ color: '#4285F4' }}>
            {CERTIFICATES.associate.length}
          </p>
          <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>Orta Düzey</p>
          <p className="text-xs font-semibold" style={{ color: '#4285F4' }}>150 puan/adet</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-black" style={{ color: '#FBBC04' }}>
            {CERTIFICATES.professional.length}
          </p>
          <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>Profesyonel</p>
          <p className="text-xs font-semibold" style={{ color: '#FBBC04' }}>500 puan/adet</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filter === opt.value ? '#4285F4' : '#1A1D2E',
              color: filter === opt.value ? '#FFFFFF' : '#8B8FA3',
              border: filter === opt.value ? '1px solid #4285F4' : '1px solid #2A2D3E',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Certificate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCerts.map(cert => (
          <CertificateCard
            key={cert.id}
            certificate={cert}
            earnedCount={certStats[cert.id] || 0}
            totalParticipants={participants.length}
          />
        ))}
      </div>

      {/* Heatmap */}
      <CertificateHeatmap />
    </div>
  );
}
