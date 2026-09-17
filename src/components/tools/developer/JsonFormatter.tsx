import React, { useState } from 'react';
import { Code2, Check, Copy, Download, Upload, RefreshCw, AlertCircle, Sparkles, FileCode, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

export const JsonFormatter: React.FC = () => {
  const { addToast } = useToast();
  const [inputJson, setInputJson] = useState<string>(`{\n  "appName": "AHADEX TOOLS",\n  "version": "1.0.0",\n  "features": ["100% Client-Side", "Fast", "Secure"],\n  "activeUsers": 12500,\n  "settings": {\n    "theme": "dark",\n    "privacyMode": true\n  }\n}`);
  const [formattedJson, setFormattedJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  // Validate and format JSON
  const handleFormat = (jsonText: string = inputJson, spacing: number = indent) => {
    if (!jsonText.trim()) {
      setFormattedJson('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const output = JSON.stringify(parsed, null, spacing);
      setFormattedJson(output);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      setFormattedJson('');
    }
  };

  // Minify JSON
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setFormattedJson(JSON.stringify(parsed));
      setError(null);
      addToast('JSON Minified', 'Stripped all whitespace and line breaks.', 'success');
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  // Copy output
  const handleCopy = () => {
    const textToCopy = formattedJson || inputJson;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addToast('Copied', 'JSON copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .json
  const handleDownload = () => {
    const content = formattedJson || inputJson;
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `formatted-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Downloaded', 'Saved formatted JSON file.', 'success');
  };

  // Upload file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputJson(text);
      handleFormat(text, indent);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Options Bar */}
      <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">Indent Spacing:</span>
          {[2, 4].map((spaces) => (
            <button
              key={spaces}
              type="button"
              onClick={() => {
                setIndent(spaces);
                handleFormat(inputJson, spaces);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                indent === spaces
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {spaces} Spaces
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload .json</span>
            <input type="file" accept=".json,application/json" className="hidden" onChange={handleFileUpload} />
          </label>
          <button
            type="button"
            onClick={handleMinify}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Minify</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-mono text-cyan-300 font-bold cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw Input */}
        <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300">Input JSON</span>
            <button
              type="button"
              onClick={() => {
                setInputJson('');
                setFormattedJson('');
                setError(null);
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-mono"
            >
              Clear
            </button>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              handleFormat(e.target.value, indent);
            }}
            placeholder="Paste raw JSON here..."
            rows={16}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-100 outline-none focus:border-cyan-400 resize-none leading-relaxed"
          />
        </div>

        {/* Formatted Output */}
        <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              {error ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400">Syntax Error</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Valid JSON Output</span>
                </>
              )}
            </span>
          </div>

          {error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs space-y-2">
              <p className="font-bold">JSON Parse Error:</p>
              <p className="leading-relaxed bg-slate-950 p-3 rounded-lg border border-rose-500/20 text-[11px]">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={formattedJson || inputJson}
              rows={16}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 outline-none resize-none leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
};
