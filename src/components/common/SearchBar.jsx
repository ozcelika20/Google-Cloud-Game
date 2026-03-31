import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Ara...', className = '' }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${className}`}
      style={{ background: '#DADCE0', border: '1px solid #DADCE0' }}
    >
      <Search size={16} className="flex-shrink-0 pointer-events-none" style={{ color: '#5F6368' }} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm min-w-0"
        style={{ color: '#202124' }}
        onFocus={e => { e.target.closest('div').style.borderColor = '#4285F4'; }}
        onBlur={e => { e.target.closest('div').style.borderColor = '#DADCE0'; }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          style={{ color: '#5F6368' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
