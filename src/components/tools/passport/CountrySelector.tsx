import React, { useState, useMemo } from 'react';
import { Search, Globe, Check, Sparkles } from 'lucide-react';
import { CountryPreset } from '../../../types/passport';
import { COUNTRY_PRESETS } from '../../../data/passport/countries';

interface CountrySelectorProps {
  selectedCountryCode: string;
  onSelectCountry: (country: CountryPreset) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountryCode,
  onSelectCountry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return COUNTRY_PRESETS;
    const term = searchTerm.toLowerCase();
    return COUNTRY_PRESETS.filter(
      (c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const currentCountry = COUNTRY_PRESETS.find((c) => c.code === selectedCountryCode) || COUNTRY_PRESETS[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Country & Embassy Preset</span>
        </label>
        <span className="text-xs text-slate-400">Auto-configures recommended size & background</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search country or passport authority (e.g. Bangladesh, USA, UAE)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {/* Country List Horizontal / Grid Scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        {filteredCountries.map((country) => {
          const isSelected = country.code === selectedCountryCode;
          return (
            <button
              key={country.code}
              type="button"
              onClick={() => onSelectCountry(country)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400 text-white ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-xl shrink-0">{country.flag}</span>
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{country.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {country.recommendedBg.toUpperCase()} BG • {country.recommendedSizeId.replace('in', '"')}
                  </span>
                </div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Recommended Details Banner */}
      {currentCountry && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex items-start gap-2.5 text-cyan-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-cyan-300">
              {currentCountry.name} Official Standard:
            </span>
            <p className="text-[11px] text-slate-300">{currentCountry.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};
