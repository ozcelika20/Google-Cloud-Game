import React, { useState } from 'react';
import { Settings, Lock, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';

const ADMIN_PASSWORD = 'Adminayse123';

const MULTIPLIER_OPTIONS = [
  { label: '%20',  value: '20'  },
  { label: '%50',  value: '50'  },
  { label: '%100', value: '100' },
  { label: '%200', value: '200' },
];

const SCOPE_OPTIONS = [
  { value: 'course',      label: 'Course' },
  { value: 'lab',         label: 'Lab' },
  { value: 'certificate', label: 'Sertifika' },
];

const EMPTY_FORM = {
  name:        '',
  description: '',
  startDate:   '',
  endDate:     '',
  scopes:      [],
  multiplier:  '20',
};

function ScopeCheckbox({ value, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(value, e.target.checked)}
        className="w-4 h-4 rounded"
        style={{ accentColor: '#4285F4' }}
      />
      <span className="text-sm" style={{ color: '#202124' }}>{label}</span>
    </label>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('adminAuth') === 'true'
  );
  const [password, setPassword]     = useState('');
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Rule form state
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editingId, setEditingId]   = useState(null);
  const [formError, setFormError]   = useState('');

  const { customRules, addCustomRule, updateCustomRule, deleteCustomRule, lastUpdated } = useCompetition();

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

  const handleScopeChange = (value, checked) => {
    setForm(prev => ({
      ...prev,
      scopes: checked
        ? [...prev.scopes, value]
        : prev.scopes.filter(s => s !== value),
    }));
  };

  const validateForm = () => {
    if (!form.name.trim())         return 'Kural ismi zorunludur.';
    if (!form.startDate)           return 'Başlangıç tarihi zorunludur.';
    if (!form.endDate)             return 'Bitiş tarihi zorunludur.';
    if (form.startDate > form.endDate) return 'Başlangıç tarihi bitiş tarihinden önce olmalıdır.';
    if (form.scopes.length === 0)  return 'En az bir kapsam seçilmelidir.';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setFormError('');

    if (editingId) {
      updateCustomRule(editingId, form);
      showSuccess('Kural güncellendi.');
      setEditingId(null);
    } else {
      addCustomRule(form);
      showSuccess('Kural eklendi.');
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleEdit = (rule) => {
    setForm({
      name:        rule.name,
      description: rule.description || '',
      startDate:   rule.startDate,
      endDate:     rule.endDate,
      scopes:      rule.scopes || [],
      multiplier:  rule.multiplier,
    });
    setEditingId(rule.id);
    setShowForm(true);
    setFormError('');
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setFormError('');
  };

  const handleDelete = (id) => {
    deleteCustomRule(id);
    showSuccess('Kural silindi.');
  };

  const handleToggle = (rule) => {
    updateCustomRule(rule.id, { active: !rule.active });
  };

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="p-4 lg:p-6 flex items-center justify-center min-h-screen" style={{ background: '#F8F9FA' }}>
        <div className="card p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(234,67,53,0.15)', border: '1px solid rgba(234,67,53,0.3)' }}>
              <Lock size={20} color="#EA4335" />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: '#202124' }}>Yönetim Paneli</h1>
              <p className="text-xs" style={{ color: '#5F6368' }}>Giriş yapın</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#5F6368' }}>Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Şifreyi girin..."
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#DADCE0', border: '1px solid #DADCE0', color: '#202124' }}
                onFocus={e => e.target.style.borderColor = '#4285F4'}
                onBlur={e => e.target.style.borderColor = '#DADCE0'}
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

  // ── Admin panel ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={24} color="#4285F4" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#202124' }}>Yönetim Paneli</h1>
            {lastUpdated && (
              <p className="text-xs" style={{ color: '#5F6368' }}>
                Son veri güncellemesi: {new Date(lastUpdated).toLocaleString('tr-TR')}
              </p>
            )}
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

      {/* Add rule button */}
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: '#4285F4', color: '#FFFFFF' }}
        >
          <Plus size={16} />
          Yeni Kural Ekle
        </button>
      )}

      {/* Rule form */}
      {showForm && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-lg" style={{ color: '#202124' }}>
            {editingId ? 'Kuralı Düzenle' : 'Yeni Kural Ekle'}
          </h2>

          {formError && (
            <p className="text-sm px-3 py-2 rounded-lg"
              style={{ background: 'rgba(234,67,53,0.1)', color: '#EA4335' }}>
              {formError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm mb-1" style={{ color: '#5F6368' }}>Kural İsmi *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="örn. Yaz Fırtınası"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#DADCE0', border: '1px solid #DADCE0', color: '#202124' }}
                onFocus={e => e.target.style.borderColor = '#4285F4'}
                onBlur={e => e.target.style.borderColor = '#DADCE0'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-1" style={{ color: '#5F6368' }}>Kural Açıklama</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Bu dönemde kurs puanları artırıldı..."
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                style={{ background: '#DADCE0', border: '1px solid #DADCE0', color: '#202124' }}
                onFocus={e => e.target.style.borderColor = '#4285F4'}
                onBlur={e => e.target.style.borderColor = '#DADCE0'}
              />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: '#5F6368' }}>Başlangıç Tarihi *</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#DADCE0', border: '1px solid #DADCE0', color: '#202124' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#5F6368' }}>Bitiş Tarihi *</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#DADCE0', border: '1px solid #DADCE0', color: '#202124' }}
                />
              </div>
            </div>

            {/* Scopes */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#5F6368' }}>Kapsam * (biri ya da birden fazlası)</label>
              <div className="flex flex-wrap gap-4">
                {SCOPE_OPTIONS.map(opt => (
                  <ScopeCheckbox
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    checked={form.scopes.includes(opt.value)}
                    onChange={handleScopeChange}
                  />
                ))}
              </div>
            </div>

            {/* Multiplier */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#5F6368' }}>Çarpan</label>
              <div className="flex flex-wrap gap-2">
                {MULTIPLIER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, multiplier: opt.value }))}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: form.multiplier === opt.value ? '#4285F4' : '#DADCE0',
                      color:      form.multiplier === opt.value ? '#FFFFFF' : '#202124',
                    }}
                  >
                    +{opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: '#5F6368' }}>
                Seçilen kapsam puanları bu oran kadar artırılır.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#34A853', color: '#FFFFFF' }}
              >
                <Check size={15} />
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
                style={{ background: '#DADCE0', color: '#5F6368' }}
              >
                <X size={15} />
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules list */}
      <div className="space-y-3">
        <h2 className="font-bold text-base" style={{ color: '#202124' }}>
          Mevcut Kurallar ({customRules.length})
        </h2>

        {customRules.length === 0 && (
          <div className="card p-8 text-center" style={{ color: '#5F6368' }}>
            <p className="text-sm">Henüz kural eklenmemiş.</p>
          </div>
        )}

        {customRules.map(rule => {
          const today     = new Date().toISOString().slice(0, 10);
          const isActive  = rule.active && rule.startDate <= today && rule.endDate >= today;
          const isPending = rule.active && rule.startDate > today;
          const isExpired = rule.endDate < today;

          let statusLabel = 'Pasif';
          let statusColor = '#5F6368';
          let statusBg    = 'rgba(95,99,104,0.1)';
          if (isExpired)       { statusLabel = 'Süresi Doldu'; statusColor = '#EA4335'; statusBg = 'rgba(234,67,53,0.1)'; }
          else if (isActive)   { statusLabel = 'Aktif';        statusColor = '#34A853'; statusBg = 'rgba(52,168,83,0.15)'; }
          else if (isPending)  { statusLabel = 'Beklemede';    statusColor = '#FBBC04'; statusBg = 'rgba(251,188,4,0.15)'; }

          const scopeLabels = (rule.scopes || [])
            .map(s => SCOPE_OPTIONS.find(o => o.value === s)?.label || s)
            .join(', ');

          return (
            <div key={rule.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm" style={{ color: '#202124' }}>{rule.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: statusBg, color: statusColor }}>
                      {statusLabel}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(66,133,244,0.12)', color: '#4285F4' }}>
                      +{rule.multiplier}%
                    </span>
                  </div>
                  {rule.description && (
                    <p className="text-xs mb-2" style={{ color: '#5F6368' }}>{rule.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#5F6368' }}>
                    <span>📅 {rule.startDate} – {rule.endDate}</span>
                    <span>🎯 {scopeLabels}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggle(rule)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: rule.active ? 'rgba(52,168,83,0.15)' : 'rgba(234,67,53,0.1)',
                      color:      rule.active ? '#34A853' : '#EA4335',
                    }}
                  >
                    {rule.active ? 'Aktif' : 'Pasif'}
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: 'rgba(66,133,244,0.1)', color: '#4285F4' }}
                  >
                    <Edit2 size={14} />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: 'rgba(234,67,53,0.1)', color: '#EA4335' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
