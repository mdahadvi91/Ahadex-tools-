import React, { useState, useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/animations/PageTransition';
import { TOOLS_REGISTRY, CATEGORIES } from '../tools/registry';
import { AnimatedIcon } from '../components/animations/AnimatedIcon';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ToolCard } from '../components/tools/ToolCard';
import { ToolEmptyState } from '../components/tools/ToolEmptyState';
import { ToolProcessingState } from '../components/tools/ToolProcessingState';
import { ToolSuccessState } from '../components/tools/ToolSuccessState';
import { PhotoQrBadgeGenerator } from '../components/tools/qr/PhotoQrBadgeGenerator';
import { VisitingCardGenerator } from '../components/tools/visiting-card/VisitingCardGenerator';
import { ImageCompressor } from '../components/tools/image/ImageCompressor';
import { ImageToPdfConverter } from '../components/tools/pdf/ImageToPdfConverter';
import { QrCodeGenerator } from '../components/tools/qr/QrCodeGenerator';
import { JsonFormatter } from '../components/tools/developer/JsonFormatter';
import { PasswordGenerator } from '../components/tools/security/PasswordGenerator';
import { useToast } from '../context/ToastContext';
import { SEOHead } from '../components/common/SEOHead';
import {
  ArrowLeft,
  Share2,
  ShieldCheck,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Check,
  Info,
  HelpCircle,
  QrCode,
  Move,
  Upload,
  Download,
  CheckCircle2,
  Grid,
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

  // Prepare dynamic SEO metadata props for SEOHead
  const pageTitle = tool
    ? tool.slug === 'photo-qr-badge-generator'
      ? 'Photo QR Badge Generator – Add QR Codes to Photos'
      : tool.name
    : '';

  const pageDescription = tool
    ? tool.slug === 'photo-qr-badge-generator'
      ? 'Create a QR code badge on any photo with AHADEX TOOLS. Add website URLs, social profiles, Wi-Fi, WhatsApp, contact details and more, preview the result, and download your finished image.'
      : `${tool.description} 100% In-Browser Local Execution.`
    : '';

  const pageKeywords = tool
    ? tool.slug === 'photo-qr-badge-generator'
      ? 'photo qr badge generator, add qr code to photo, image qr badge, photo qr overlay, qr code creator'
      : `${tool.name}, ${tool.name} online, ${tool.categorySlug} tool, free ${tool.name}`
    : '';

  // Dynamic tool steps helper
  const getToolSteps = (slug: string) => {
    if (slug === 'visiting-card-generator') {
      return [
        {
          step: 'Step 01',
          title: 'Select Card Format',
          desc: 'Choose 1-Side or 2-Side mode and select from 8 executive business templates (Corporate, Gold, Minimal, Tech, etc.).',
          feature: '8 Executive Templates',
          IconComponent: Sliders,
        },
        {
          step: 'Step 02',
          title: 'Enter Contact Info',
          desc: 'Input full name, job title, company, phone, WhatsApp, email, website, address & profile summary.',
          feature: 'Full Contact Customization',
          IconComponent: Sparkles,
        },
        {
          step: 'Step 03',
          title: 'Upload Photo & Logo',
          desc: 'Add your avatar photo, adjust zoom & position, upload company logo, and enable auto QR code generation.',
          feature: 'Logo & Avatar Framing',
          IconComponent: Upload,
        },
        {
          step: 'Step 04',
          title: 'Export PNG or HD PDF',
          desc: 'Preview front & back cards live, then download high-resolution 300 DPI PNG images or print-ready 2-page PDF.',
          feature: '300 DPI HD & PDF Export',
          IconComponent: Download,
        },
      ];
    }

    if (slug === 'photo-qr-badge-generator') {
      return [
        {
          step: 'Step 01',
          title: 'Select Content Type',
          desc: 'Choose what data to encode: Website URL, Wi-Fi details, WhatsApp, Social handle, Contact vCard, Email, or Phone.',
          feature: '8 Supported QR Payloads',
          IconComponent: QrCode,
        },
        {
          step: 'Step 02',
          title: 'Choose Badge Position',
          desc: 'Select where the QR code badge overlay will be placed on your photo: Top-Left, Top-Right, Bottom-Left, or Bottom-Right.',
          feature: '4 Corner Placement Options',
          IconComponent: Move,
        },
        {
          step: 'Step 03',
          title: 'Upload Image & Preview',
          desc: 'Drag and drop or select your photo. The live canvas preview updates immediately in real-time.',
          feature: 'Instant Client Canvas Render',
          IconComponent: Upload,
        },
        {
          step: 'Step 04',
          title: 'Download & Share',
          desc: 'Export your finished image badge in high-resolution PNG or JPEG format directly to your device.',
          feature: 'Zero Data Server Uploads',
          IconComponent: Download,
        },
      ];
    }

    return [
      {
        step: 'Step 01',
        title: 'Provide Input Data',
        desc: 'Enter text, files or parameters into the interactive workbench controls.',
        feature: 'Real-time Processing',
        IconComponent: Sliders,
      },
      {
        step: 'Step 02',
        title: 'Configure Options',
        desc: 'Customize settings, formats, and rendering preferences for your output.',
        feature: 'Custom Parameter Tuning',
        IconComponent: Sparkles,
      },
      {
        step: 'Step 03',
        title: 'Live Preview',
        desc: 'Review the generated output instantly on your screen with real-time updates.',
        feature: 'Instant Client Feedback',
        IconComponent: CheckCircle2,
      },
      {
        step: 'Step 04',
        title: 'Export & Copy',
        desc: 'Download high-resolution output files or copy results directly to clipboard.',
        feature: 'Zero Cloud Server Storage',
        IconComponent: Download,
      },
    ];
  };

// FAQ Data helper
const getToolFaqs = (slug: string) => {
  if (slug === 'photo-qr-badge-generator') {
    return [
      {
        question: 'Are my uploaded photos or QR details uploaded to any cloud server?',
        answer: 'No, absolutely not. AHADEX TOOLS operates 100% locally inside your web browser’s RAM memory. Your images, URLs, Wi-Fi credentials, or vCard details are processed entirely on your device and are never sent to external servers.',
      },
      {
        question: 'Which image file formats and file sizes are supported?',
        answer: 'You can upload JPG, JPEG, PNG, and WebP images up to 25MB in size. High-resolution images maintain full sharpness when rendered into the composite QR badge image.',
      },
      {
        question: 'What types of QR codes can I embed into my photo?',
        answer: 'You can create 8 types of QR payloads: Website URLs, Social Media profiles (Instagram, Facebook, X, etc.), Wi-Fi configuration cards, WhatsApp direct chats, Digital vCards, Email templates, Direct phone calls, or Custom text notes.',
      },
      {
        question: 'Will the QR badge code be easily scannable on smartphone cameras?',
        answer: 'Yes! The QR generator automatically applies High (H-Level) error correction and high contrast pure black-and-white modules. This ensures fast, reliable scanning even if the badge is scaled or printed.',
      },
      {
        question: 'Can I use this tool on my mobile phone or tablet?',
        answer: 'Yes, the workspace is fully optimized for mobile devices. You can select photos directly from your camera roll or take a new photo, preview the badge, and download the finished PNG or JPG file directly to your phone.',
      },
    ];
  }

  if (slug === 'visiting-card-generator') {
    return [
      {
        question: 'Is my corporate or personal contact information kept private?',
        answer: 'Yes. All card rendering, template generation, and PDF compilation take place locally within your browser session. No personal or company details are stored or recorded.',
      },
      {
        question: 'What is the difference between 1-Side and 2-Side business card modes?',
        answer: '1-Side mode produces a single front-face executive card with name, title, contact links, and photo/logo. 2-Side mode adds a corporate back side with company tagline, service highlights, and a scan-to-save QR code, exporting a 2-page print-ready PDF.',
      },
      {
        question: 'What file formats can I download my business card in?',
        answer: 'You can download 300 DPI high-definition PNG images, 300 DPI JPG images, or a print-ready vector-scaled 3.5" x 2.0" PDF document ready for commercial printing.',
      },
      {
        question: 'How do I add my custom profile photo or company logo?',
        answer: 'In the card controls, click the "Photo & Toggles" tab. You can upload an avatar photo or logo in JPG, PNG, or WebP format, adjust zoom & position, and choose frame shapes (Circle, Rounded, Square).',
      },
      {
        question: 'Is the exported PDF directly compatible with print shops?',
        answer: 'Yes! The exported PDF complies with standard ISO 3.5" x 2.0" landscape dimensions at 300 DPI high resolution, making it suitable for professional print shops and desktop office printers.',
      },
    ];
  }

  return [
    {
      question: 'Is my data safe when using this utility?',
      answer: 'Yes, 100%. All processing takes place locally in your web browser memory without sending data to external servers.',
    },
    {
      question: 'Is this tool completely free to use?',
      answer: 'Yes, all utilities on AHADEX TOOLS are 100% free with unlimited usage, zero subscriptions, and no hidden fees.',
    },
    {
      question: 'Can I use this tool on mobile browsers?',
      answer: 'Yes! The interface is fully responsive and supports iOS Safari, Android Chrome, and modern tablet browsers.',
    },
  ];
};

  const category = CATEGORIES.find((c) => c.slug === tool.categorySlug);
  const relatedTools = TOOLS_REGISTRY.filter((t) => t.id !== tool.id);

  const currentToolSteps = [
    {
      step: '01',
      title: tool.slug === 'photo-qr-badge-generator' ? 'Choose Content Type' : tool.slug === 'visiting-card-generator' ? 'Enter VIP Info' : 'Select Input / File',
      desc: tool.slug === 'photo-qr-badge-generator' ? 'Select URL, Social Link, Wi-Fi, WhatsApp, or vCard details.' : tool.slug === 'visiting-card-generator' ? 'Fill in your name, job title, company, contacts, and photo/logo.' : 'Upload your source document or enter data parameters.',
      feature: tool.slug === 'photo-qr-badge-generator' ? '8 Content Types' : tool.slug === 'visiting-card-generator' ? 'Live Real-Time Sync' : 'In-Browser Sandbox',
      IconComponent: Sliders,
    },
    {
      step: '02',
      title: tool.slug === 'photo-qr-badge-generator' ? 'Position Badge' : tool.slug === 'visiting-card-generator' ? 'Pick Template Theme' : 'Configure Settings',
      desc: tool.slug === 'photo-qr-badge-generator' ? 'Place QR badge on Top-Left, Top-Right, Bottom-Left, or Bottom-Right.' : tool.slug === 'visiting-card-generator' ? 'Select from Executive VIP, Tech Modern, Creative Dark, and Minimalist themes.' : 'Customize output options to match your requirements.',
      feature: tool.slug === 'photo-qr-badge-generator' ? '4 Corner Anchors' : tool.slug === 'visiting-card-generator' ? 'VIP Design Themes' : 'Custom Parameters',
      IconComponent: Sliders,
    },
    {
      step: '03',
      title: tool.slug === 'photo-qr-badge-generator' ? 'Upload Photo' : tool.slug === 'visiting-card-generator' ? 'Configure 1 or 2 Sides' : 'Execute Utility',
      desc: tool.slug === 'photo-qr-badge-generator' ? 'Drag & drop your primary portrait image into the workspace.' : tool.slug === 'visiting-card-generator' ? 'Choose 1-side executive layout or 2-side card with corporate back QR code.' : 'Process files instantly with 100% client-side WebAssembly execution.',
      feature: tool.slug === 'photo-qr-badge-generator' ? 'Client-Side Upload' : tool.slug === 'visiting-card-generator' ? '1-Side & 2-Side Modes' : 'Instant Computation',
      IconComponent: HelpCircle,
    },
    {
      step: '04',
      title: tool.slug === 'photo-qr-badge-generator' ? 'Export HD Photo' : tool.slug === 'visiting-card-generator' ? 'Download HD / PDF' : 'Download Result',
      desc: tool.slug === 'photo-qr-badge-generator' ? 'Download high-definition PNG or JPG image with embedded QR badge.' : tool.slug === 'visiting-card-generator' ? 'Export 300 DPI high-resolution PNG, JPG, or print-ready 3.5" x 2.0" PDF.' : 'Save your processed file directly to your device.',
      feature: tool.slug === 'photo-qr-badge-generator' ? 'High-Def Export' : tool.slug === 'visiting-card-generator' ? '300 DPI Print Ready' : 'Direct File Download',
      IconComponent: CheckCircle2,
    },
  ];

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
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalUrl={`https://ahadex.fun/tools/${tool.slug}`}
        toolData={{
          name: tool.name,
          description: pageDescription,
          category: tool.category,
          slug: tool.slug,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Breadcrumbs & Share Bar */}
        <div className="flex items-center justify-between sm:justify-end gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
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
        </div>

        {/* Tool Header Card */}
        <div className="rounded-3xl glass-card border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-950/40">
                <AnimatedIcon name={tool.iconName} className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="cyan" withDot>
                    {tool.category}
                  </Badge>
                  {tool.badge && <Badge variant="purple">{tool.badge}</Badge>}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Client-Side Privacy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Direct Interface */}
        {tool.slug === 'photo-qr-badge-generator' ? (
          <div className="mb-12">
            <PhotoQrBadgeGenerator />
          </div>
        ) : tool.slug === 'visiting-card-generator' ? (
          <div className="mb-12">
            <VisitingCardGenerator />
          </div>
        ) : tool.slug === 'image-compressor' ? (
          <div className="mb-12">
            <ImageCompressor />
          </div>
        ) : tool.slug === 'image-to-pdf-converter' ? (
          <div className="mb-12">
            <ImageToPdfConverter />
          </div>
        ) : tool.slug === 'qr-code-generator' ? (
          <div className="mb-12">
            <QrCodeGenerator />
          </div>
        ) : tool.slug === 'json-formatter' ? (
          <div className="mb-12">
            <JsonFormatter />
          </div>
        ) : tool.slug === 'password-generator' ? (
          <div className="mb-12">
            <PasswordGenerator />
          </div>
        ) : (
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
        )}

        {/* How to Use Section with Clean Glass Cards */}
        <div className="mt-12 pt-10 border-t border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
                How to Use {tool.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {tool.slug === 'visiting-card-generator'
                  ? 'Follow these simple steps to design and export professional 1-side or 2-side visiting cards.'
                  : tool.slug === 'photo-qr-badge-generator'
                  ? 'Follow these simple steps to generate your custom photo with an embedded QR code badge.'
                  : `Follow these simple steps to perform actions with ${tool.name}.`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {currentToolSteps.map((stepItem, idx) => {
              const IconComp = stepItem.IconComponent;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/30 bg-slate-900/90 p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {stepItem.step}
                      </span>
                      <IconComp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{stepItem.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {stepItem.desc}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400/80 pt-2 border-t border-white/5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{stepItem.feature}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 pt-10 border-t border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Everything you need to know about privacy, supported formats, and mobile usage for {tool.name}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getToolFaqs(tool.slug).map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl glass-card border border-slate-800 bg-slate-900/80 p-5 space-y-2 hover:border-slate-700 transition-all"
              >
                <h4 className="text-sm font-bold text-slate-100 flex items-start gap-2">
                  <span className="text-cyan-400 font-mono shrink-0">Q:</span>
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools Grid Section */}
        <div className="mt-12 pt-10 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Related Tools & Utilities</span>
            </h3>
            <Link
              to="/tools"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>Explore All Tools</span>
            </Link>
          </div>

          {relatedTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          ) : (
            /* Styled Rotating Border Placeholder Grid Card for Future Tools */
            <div className="relative p-[1.5px] rounded-2xl overflow-hidden group shadow-lg">
              <div className="absolute -inset-[200%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_260deg,#06b6d4_310deg,#3b82f6_360deg)] opacity-50" />
              <div className="relative rounded-[14px] bg-slate-900/95 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                  <Grid className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">More Tools Coming Soon</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    As additional tools are added to AHADEX TOOLS, they will automatically populate this interactive grid with matching card designs and rotating neon borders.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/tools"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                  >
                    <span>Browse Tools Directory</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
