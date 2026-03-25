import React, { useState } from 'react';
import { Settings, Lock, ToggleLeft, ToggleRight, UserPlus, Calendar, Users } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { TEAMS } from '../data/mockData';

const ADMIN_PASSWORD = 'admin123';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('bonuses');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    bonusSettings,
    toggleBonus,
    updateBonusSettings,
    addParticipant,
  } = useCompetition();

  // New participant form state
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    teamId: 'MSE',
    coursesLabs: 0,
    certificates: [],
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Hatalı şifre. Tekrar deneyin.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setAuthenticated(false);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    addParticipant({
      ...newParticipant,
      coursesLabs: parseInt(newParticipant.coursesLabs) || 0,
    });
    showSuccess(`${newParticipant.name} başarıyla eklendi!`);
    setNewParticipant({ name: '', teamId: 'MSE', coursesLabs: 0, certificates: [] });
  };

  if (!authenticated) {
    return (
      <div className="p-4 lg:p-6 flex items-center justify-center min-h-screen" style={{ background: '#0F1117' }}>
        <div className="card p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,67,53,0.15)', border: '1px solid rgba(234,67,53,0.3)' }}>
              <Lock size={20} color="#EA4335" />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: '#FFFFFF' }}>Yönetim Paneli</h1>
              <p className="text-xs" style={{ color: '#8B8FA3' }}>Giriş yapın</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#8B8FA3' }}>Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Şifreyi girin..."
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: '#2A2D3E',
                  border: '1px solid #2A2D3E',
                  color: '#FFFFFF',
                }}
                onFocus={e => e.target.style.borderColor = '#4285F4'}
                onBlur={e => e.target.style.borderColor = '#2A2D3E'}
              />
              {loginError && (
                <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{loginError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: '#4285F4', color: '#FFFFFF' }}
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'bonuses', label: 'Bonus Yönetimi', icon: ToggleRight },
    { id: 'participants', label: 'Katılımcı Ekle', icon: UserPlus },
    { id: 'competition', label: 'Yarışma Ayarları', icon: Calendar },
    { id: 'import', label: 'CSV İçe Aktar', icon: Users },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={24} color="#4285F4" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Yönetim Paneli</h1>
            <p className="text-sm" style={{ color: '#8B8FA3' }}>Yarışma yönetimi</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
          style={{ background: 'rgba(234,67,53,0.15)', color: '#EA4335', border: '1px solid rgba(234,67,53,0.3)' }}
        >
          Çıkış Yap
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="p-3 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(52,168,83,0.15)', color: '#34A853', border: '1px solid rgba(52,168,83,0.3)' }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? '#4285F4' : '#1A1D2E',
              color: activeTab === tab.id ? '#FFFFFF' : '#8B8FA3',
              border: activeTab === tab.id ? '1px solid #4285F4' : '1px solid #2A2D3E',
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'bonuses' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>Bonus Yönetimi</h2>

          {/* Patron Çıldırdı */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold" style={{ color: '#FFFFFF' }}>🎉 Patron Çıldırdı</h3>
                <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>Aktif dönemde tüm puan +%50 artar</p>
              </div>
              <button
                onClick={() => toggleBonus('patronCildirdi')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: bonusSettings.patronCildirdi.active ? 'rgba(52,168,83,0.2)' : 'rgba(234,67,53,0.15)',
                  color: bonusSettings.patronCildirdi.active ? '#34A853' : '#EA4335',
                  border: `1px solid ${bonusSettings.patronCildirdi.active ? 'rgba(52,168,83,0.4)' : 'rgba(234,67,53,0.3)'}`,
                }}
              >
                {bonusSettings.patronCildirdi.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {bonusSettings.patronCildirdi.active ? 'Aktif' : 'Pasif'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: '#8B8FA3' }}>Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={bonusSettings.patronCildirdi.startDate}
                  onChange={e => updateBonusSettings('patronCildirdi', { startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#8B8FA3' }}>Bitiş Tarihi</label>
                <input
                  type="date"
                  value={bonusSettings.patronCildirdi.endDate}
                  onChange={e => updateBonusSettings('patronCildirdi', { endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                />
              </div>
            </div>
          </div>

          {/* Double Point */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold" style={{ color: '#FFFFFF' }}>🔥 Çifte Puan</h3>
                <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>Aktif dönemde sertifika puanları 2 katına çıkar</p>
              </div>
              <button
                onClick={() => toggleBonus('doublePoint')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: bonusSettings.doublePoint.active ? 'rgba(52,168,83,0.2)' : 'rgba(234,67,53,0.15)',
                  color: bonusSettings.doublePoint.active ? '#34A853' : '#EA4335',
                  border: `1px solid ${bonusSettings.doublePoint.active ? 'rgba(52,168,83,0.4)' : 'rgba(234,67,53,0.3)'}`,
                }}
              >
                {bonusSettings.doublePoint.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {bonusSettings.doublePoint.active ? 'Aktif' : 'Pasif'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: '#8B8FA3' }}>Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={bonusSettings.doublePoint.startDate}
                  onChange={e => updateBonusSettings('doublePoint', { startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#8B8FA3' }}>Bitiş Tarihi</label>
                <input
                  type="date"
                  value={bonusSettings.doublePoint.endDate}
                  onChange={e => updateBonusSettings('doublePoint', { endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>Katılımcı Ekle</h2>
          <div className="card p-5">
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#8B8FA3' }}>Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={newParticipant.name}
                    onChange={e => setNewParticipant(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                    onFocus={e => e.target.style.borderColor = '#4285F4'}
                    onBlur={e => e.target.style.borderColor = '#2A2D3E'}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#8B8FA3' }}>Takım *</label>
                  <select
                    required
                    value={newParticipant.teamId}
                    onChange={e => setNewParticipant(p => ({ ...p, teamId: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                  >
                    {TEAMS.map(t => (
                      <option key={t.id} value={t.id}>{t.id} - {t.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#8B8FA3' }}>Tamamlanan Kurs/Lab</label>
                  <input
                    type="number"
                    min="0"
                    value={newParticipant.coursesLabs}
                    onChange={e => setNewParticipant(p => ({ ...p, coursesLabs: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                    onFocus={e => e.target.style.borderColor = '#4285F4'}
                    onBlur={e => e.target.style.borderColor = '#2A2D3E'}
                  />
                  <p className="text-xs mt-1" style={{ color: '#8B8FA3' }}>Her kurs/lab = 20 puan</p>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#4285F4', color: '#FFFFFF' }}
              >
                Katılımcı Ekle
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'competition' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>Yarışma Ayarları</h2>
          <div className="card p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#8B8FA3' }}>Yarışma Başlangıç Tarihi</label>
                <input
                  type="date"
                  defaultValue="2025-10-01"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#8B8FA3' }}>Yarışma Bitiş Tarihi</label>
                <input
                  type="date"
                  defaultValue="2026-04-30"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#2A2D3E', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
                />
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: '#8B8FA3' }}>
              Not: Bu demo versiyonunda tarihler kaydedilmez. Gerçek API entegrasyonu için backend bağlantısı gereklidir.
            </p>
          </div>

          {/* Team management */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>Takım Durumu</h3>
            <div className="space-y-2">
              {TEAMS.map(team => (
                <div key={team.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#0F1117' }}>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ background: team.color }} />
                    <span className="font-medium text-sm" style={{ color: '#FFFFFF' }}>{team.id}</span>
                    <span className="text-xs" style={{ color: '#8B8FA3' }}>{team.fullName}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(52,168,83,0.15)', color: '#34A853' }}>Aktif</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>CSV İçe Aktarma</h2>
          <div className="card p-8 text-center" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: '#2A2D3E' }}>
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>CSV Dosyası Yükle</h3>
            <p className="text-sm mb-4" style={{ color: '#8B8FA3' }}>
              Katılımcı verilerini CSV formatında yükleyin
            </p>
            <div className="text-xs p-3 rounded-lg mb-4 text-left" style={{ background: '#0F1117', color: '#8B8FA3' }}>
              <p className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>Beklenen CSV Formatı:</p>
              <code>ad_soyad,takim_id,kurs_lab_sayisi,sertifika_id1|sertifika_id2</code>
              <br />
              <code>Ahmet Yılmaz,MSE,3,cloud-digital-leader|cloud-engineer</code>
            </div>
            <button
              className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-not-allowed opacity-50"
              style={{ background: '#4285F4', color: '#FFFFFF' }}
              disabled
            >
              Dosya Seç (Yakında)
            </button>
            <p className="text-xs mt-2" style={{ color: '#8B8FA3' }}>Bu özellik gerçek API entegrasyonu gerektirir</p>
          </div>
        </div>
      )}
    </div>
  );
}
