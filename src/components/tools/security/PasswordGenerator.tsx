import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, Sliders, Lock, Zap, Download, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

export const PasswordGenerator: React.FC = () => {
  const { addToast } = useToast();

  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(true);
  const [count, setCount] = useState<number>(1);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const AMBIGUOUS = '1lI0O';

  // Generate Passwords
  const generate = () => {
    let charSet = '';
    if (includeUpper) charSet += UPPER;
    if (includeLower) charSet += LOWER;
    if (includeNumbers) charSet += NUMBERS;
    if (includeSymbols) charSet += SYMBOLS;

    if (excludeAmbiguous) {
      charSet = charSet.split('').filter((c) => !AMBIGUOUS.includes(c)).join('');
    }

    if (!charSet) {
      addToast('Character Selection Error', 'Please select at least one character type.', 'error');
      return;
    }

    const generatedList: string[] = [];
    const array = new Uint32Array(length);

    for (let i = 0; i < count; i++) {
      crypto.getRandomValues(array);
      let pwd = '';
      for (let j = 0; j < length; j++) {
        pwd += charSet[array[j] % charSet.length];
      }
      generatedList.push(pwd);
    }

    setPasswords(generatedList);
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, count]);

  // Entropy Calculation
  const calculateEntropy = () => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 26;
    if (excludeAmbiguous) poolSize -= 5;
    if (poolSize <= 0) return { bits: 0, label: 'Weak', color: 'text-rose-400', bg: 'bg-rose-500' };

    const bits = Math.round(length * Math.log2(poolSize));
    if (bits < 40) return { bits, label: 'Weak', color: 'text-rose-400', bg: 'bg-rose-500' };
    if (bits < 60) return { bits, label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (bits < 80) return { bits, label: 'Strong', color: 'text-cyan-400', bg: 'bg-cyan-500' };
    return { bits, label: 'Unbreakable', color: 'text-emerald-400', bg: 'bg-emerald-500' };
  };

  const entropy = calculateEntropy();

  const handleCopy = (pwd: string, index: number) => {
    navigator.clipboard.writeText(pwd);
    setCopiedIndex(index);
    addToast('Copied', 'Password copied to clipboard!', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportTxt = () => {
    const text = passwords.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `passwords-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Exported', 'Saved passwords to TXT file.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Password Options</span>
              </h4>
              <button
                type="button"
                onClick={generate}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>

            {/* Length Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-300">Password Length</span>
                <span className="font-mono text-cyan-400 font-bold">{length} characters</span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Character Set Toggles */}
            <div className="space-y-2.5">
              <label className="text-xs text-slate-300 font-medium block">Character Sets</label>

              {[
                { label: 'Uppercase Letters (A-Z)', state: includeUpper, setter: setIncludeUpper },
                { label: 'Lowercase Letters (a-z)', state: includeLower, setter: setIncludeLower },
                { label: 'Numbers (0-9)', state: includeNumbers, setter: setIncludeNumbers },
                { label: 'Special Symbols (!@#$%)', state: includeSymbols, setter: setIncludeSymbols },
                { label: 'Exclude Ambiguous Characters (1, l, O, 0)', state: excludeAmbiguous, setter: setExcludeAmbiguous },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-300">Batch Passwords Quantity</span>
                <span className="font-mono text-cyan-400 font-bold">{count} password(s)</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Strength Meter Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Security Score:</span>
                <span className={`font-bold ${entropy.color}`}>{entropy.label} ({entropy.bits} bits)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${entropy.bg}`}
                  style={{ width: `${Math.min(100, (entropy.bits / 128) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Generated Passwords ({passwords.length})</span>
              </h4>

              {passwords.length > 1 && (
                <button
                  type="button"
                  onClick={handleExportTxt}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export All TXT</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {passwords.map((pwd, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 group hover:border-cyan-500/40 transition-all"
                >
                  <span className="font-mono text-sm text-cyan-200 tracking-wider break-all select-all">
                    {pwd}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(pwd, idx)}
                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 cursor-pointer transition-all"
                    title="Copy Password"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Generated using standard Browser Web Crypto API (CS-PRNG)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
