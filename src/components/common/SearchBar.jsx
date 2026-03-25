import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Ara...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: '#8B8FA3' }}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 rounded-lg text-sm outline-none transition-colors"
        style={{
          background: '#2A2D3E',
          border: '1px solid #2A2D3E',
          color: '#FFFFFF',
          '::placeholder': { color: '#8B8FA3' },
        }}
        onFocus={e => { e.target.style.borderColor = '#4285F4'; }}
        onBlur={e => { e.target.style.borderColor = '#2A2D3E'; }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          style={{ color: '#8B8FA3' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
