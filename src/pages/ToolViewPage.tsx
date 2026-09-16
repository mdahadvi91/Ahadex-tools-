import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/animations/PageTransition';
import { TOOLS_REGISTRY, CATEGORIES } from '../tools/registry';
import { AnimatedIcon } from '../components/animations/AnimatedIcon';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/animations/Reveal';
import { ToolCard } from '../components/tools/ToolCard';
import { ToolEmptyState } from '../components/tools/ToolEmptyState';
import { ToolProcessingState } from '../components/tools/ToolProcessingState';
import { ToolSuccessState } from '../components/tools/ToolSuccessState';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Share2,
  ShieldCheck,
  Cpu,
  Lock,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Copy,
  Check,
  UploadCloud,
  FileCode,
  Info,
} from 'lucide-react';

export const ToolViewPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'workbench' | 'documentation'>('workbench');
  const [workbenchState, setWorkbenchState] = useState<'empty' | 'processing' | 'success'>('empty');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFile, setActiveFile] = useState<{ name: string; size: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tool = TOOLS_REGISTRY.find((t) => t.slug === toolSlug);

  // Dynamic SEO metadata per tool route
  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} – AHADEX TOOLS`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${tool.description} 100% In-Browser Local Execution.`);
      }
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://ahadex.fun/tools/${tool.slug}`);
      }
    }
    return () => {
      document.title = 'AHADEX TOOLS – Futuristic Web Utilities & Developer Suite';
    };
  }, [tool]);

  if (!tool) {
    return <Navigate to="/404" replace />;
  }

  const category = CATEGORIES.find((c) => c.slug === tool.categorySlug);
  const relatedTools = TOOLS_REGISTRY.filter(
    (t) => t.categorySlug === tool.categorySlug && t.id !== tool.id
  ).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Link Copied', 'Tool link copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const processFile = (file?: { name: string; size: number }) => {
    setActiveFile(file || null);
    setWorkbenchState('processing');
    setTimeout(() => {
      setWorkbenchState('success');
      addToast(
        'Computation Complete',
        `${file ? file.name : tool.name} processed successfully!`,
        'success'
      );
    }, 1500);
  };

  const handleBrowseTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    } else {
      processFile();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      processFile({ name: file.name, size: file.size });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile({ name: file.name, size: file.size });
    }
  };

  const outputFilename = activeFile
    ? `${activeFile.name.replace(/\.[^/.]+$/, '')}-processed.${tool.categorySlug === 'img' ? 'webp' : tool.categorySlug === 'pdf' ? 'pdf' : 'txt'}`
    : `${tool.slug}-result.${tool.categorySlug === 'img' ? 'webp' : tool.categorySlug === 'pdf' ? 'pdf' : 'txt'}`;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-card hover:border-cyan-400/50 text-slate-300 hover:text-white font-sans text-xs font-semibold mr-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back</span>
            </button>
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link
                  to={`/category/${category.slug}`}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-cyan-400 font-semibold truncate">{tool.name}</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-xs text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all cursor-pointer"
            aria-label="Share tool"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="font-mono text-[11px]">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Tool Header Card */}
        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-950/30">
                <AnimatedIcon name={tool.iconName} className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="cyan" withDot>
                    {tool.category}
                  </Badge>
                  {tool.badge && <Badge variant="purple">{tool.badge}</Badge>}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                    Version 1.0.0
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  {tool.name}
                </h1>
                <p className="text-sm text-slate-300/90 mt-2 max-w-2xl leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 md:text-right">
              <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>100% In-Browser Execution</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Memory Sandbox: Zero Remote Uploads
              </div>
            </div>
          </div>

          {/* Workbench Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab('workbench')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'workbench'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Workbench</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('documentation')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'documentation'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>API & Architecture Docs</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Workbench Shell */}
        {activeTab === 'workbench' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
            {/* Left Controls & Parameters Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Configuration Parameters</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => addToast('Reset', 'Settings restored to defaults.', 'info')}
                    className="text-slate-400 hover:text-white text-xs p-1"
                    title="Reset parameters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Simulated Param 1 */}
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">
                    Execution Mode
                  </label>
                  <select className="w-full h-9 px-3 rounded-xl glass-card text-xs text-slate-200 border border-white/10 outline-none focus:border-cyan-400 cursor-pointer">
                    <option className="bg-slate-900">Standard Lossless (Recommended)</option>
                    <option className="bg-slate-900">Ultra-High Compression</option>
                    <option className="bg-slate-900">Strict Compliance Mode</option>
                  </select>
                </div>

                {/* Simulated Param 2 */}
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">
                    Privacy Guarantee
                  </label>
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 leading-relaxed font-mono">
                    CLIENT_SANDBOX: Memory allocation ephemeral. No cache leaks.
                  </div>
                </div>

                {/* Primary Execute Button */}
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={workbenchState === 'processing'}
                    onClick={() => processFile()}
                    leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  >
                    {workbenchState === 'success' ? 'Re-Run Utility' : 'Execute Utility'}
                  </Button>
                </div>
              </div>

              {/* Security Blueprint Notice */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Architecture Foundation Note</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Per project instructions, this workbench defines the complete frontend UX shell
                  and parameters. The modular tool engine algorithms connect directly to this
                  surface without UI refactoring.
                </p>
              </div>
            </div>

            {/* Right Input / Output Stage Area */}
            <div className="lg:col-span-8 space-y-6">
              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl glass-panel border transition-all duration-200 p-4 sm:p-6 min-h-[420px] flex flex-col justify-between ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-400/40'
                    : 'border-white/10'
                }`}
              >
                {/* Dynamic State Machine: Empty -> Processing -> Success */}
                <div className="flex-1 flex items-center justify-center">
                  {workbenchState === 'empty' && (
                    <ToolEmptyState
                      toolSlug={tool.slug}
                      categorySlug={tool.categorySlug}
                      onBrowseClick={handleBrowseTrigger}
                    />
                  )}

                  {workbenchState === 'processing' && (
                    <ToolProcessingState
                      toolSlug={tool.slug}
                      categorySlug={tool.categorySlug}
                    />
                  )}

                  {workbenchState === 'success' && (
                    <ToolSuccessState
                      toolName={tool.name}
                      outputFilename={outputFilename}
                      onReset={() => {
                        setActiveFile(null);
                        setWorkbenchState('empty');
                      }}
                    />
                  )}
                </div>

                {/* Status Bar */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      workbenchState === 'processing'
                        ? 'bg-cyan-400 animate-ping'
                        : workbenchState === 'success'
                        ? 'bg-emerald-400'
                        : 'bg-emerald-400 animate-pulse'
                    }`} />
                    <span>
                      {workbenchState === 'processing'
                        ? 'Engine Status: Computing on-device...'
                        : workbenchState === 'success'
                        ? 'Engine Status: Process complete & verified'
                        : 'Engine Status: Operational & Ready'}
                    </span>
                  </div>
                  <span>
                    {activeFile
                      ? `Active File: ${(activeFile.size / 1024).toFixed(0)} KB`
                      : `Wasm Buffer: ${workbenchState === 'processing' ? '4,120 KB' : '0 KB'}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Documentation & Specifications */
          <div className="rounded-2xl glass-card border border-white/10 p-6 sm:p-8 mb-12 space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold text-slate-100">
              Technical Specification: {tool.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 font-mono">CATEGORY</div>
                <div className="text-sm font-bold text-slate-200 mt-1">{tool.category}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 font-mono">EXECUTION MODEL</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">Client Sandbox</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 font-mono">TAGS</div>
                <div className="text-xs text-slate-300 mt-1 flex gap-1 flex-wrap">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300/90 leading-relaxed">
              <h4 className="font-semibold text-slate-100">Privacy & Cryptographic Integrity</h4>
              <p>
                All data manipulated through this tool is processed completely inside the user&apos;s
                browser thread or a dedicated WebWorker. No payloads are sent to remote APIs,
                guaranteeing compliance with GDPR, HIPAA, and internal enterprise secrecy policies.
              </p>
            </div>
          </div>
        )}

        {/* Related Category Tools */}
        {relatedTools.length > 0 && (
          <div className="mt-12 pt-10 border-t border-white/10">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>More in {tool.category}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
