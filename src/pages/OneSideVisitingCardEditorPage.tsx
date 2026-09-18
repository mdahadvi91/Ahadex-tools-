import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  ArrowLeft,
  Building2,
  Check,
  Download,
  Globe,
  ImagePlus,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { SEOHead } from '../components/common/SEOHead';
import { OneSideCardCanvas } from '../components/visiting-card/OneSideCardCanvas';
import { ScaledCardPreview } from '../components/visiting-card/common/ScaledCardPreview';
import {
  buildContactVCard,
  generateQrDataUrl,
  readFileAsDataUrl,
  waitForFonts,
  waitForImages,
} from '../components/visiting-card/common/exportUtils';
import { useToast } from '../context/ToastContext';
import { getOneSideTemplate } from '../data/visiting-card/oneSideTemplates';
import {
  CARD_HEIGHT_IN,
  CARD_HEIGHT_PX,
  CARD_WIDTH_IN,
  CARD_WIDTH_PX,
  DEFAULT_AHAD_DATA,
  EMPTY_ONE_SIDE_CARD_DATA,
  OneSideCardData,
} from '../types/visitingCard';

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  multiline?: boolean;
}) => {
  const common =
    'w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/[0.065]';

  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Icon className="h-3.5 w-3.5 text-cyan-300" />
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${common} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={common}
        />
      )}
    </label>
  );
};

const UploadBox = ({
  label,
  description,
  icon: Icon,
  onChange,
  accept,
  preview,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  preview: string | null;
}) => (
  <label className="group block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.035] p-4 transition hover:border-cyan-400/40 hover:bg-white/[0.055]">
    <input type="file" accept={accept} onChange={onChange} className="sr-only" />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cyan-400/10 text-cyan-300">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <Upload className="ml-auto h-4 w-4 text-slate-500 transition group-hover:text-cyan-300" />
    </div>
  </label>
);

export const OneSideVisitingCardEditorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const template = getOneSideTemplate(templateId);
  const [data, setData] = useState<OneSideCardData>(DEFAULT_AHAD_DATA);
  const [qrSrc, setQrSrc] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'jpg' | 'pdf' | null>(null);
  const [previewZoom, setPreviewZoom] = useState<'fit' | 'medium' | 'compact'>('fit');

  const cardRef = useRef<HTMLDivElement | null>(null);
  const exportHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const vcard = buildContactVCard({
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      phone: data.phone,
      email: data.email,
      website: data.website,
    });

    generateQrDataUrl(vcard).then((src) => {
      if (!isCancelled) {
        setQrSrc(src);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [data.fullName, data.jobTitle, data.companyName, data.phone, data.email, data.website]);

  const updateField = (key: keyof OneSideCardData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateFile = (field: 'photoUrl' | 'logoUrl') => async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setData((prev) => ({ ...prev, [field]: dataUrl }));
      addToast('Asset uploaded', `${field === 'photoUrl' ? 'Photo' : 'Logo'} updated successfully.`, 'success');
    } catch {
      addToast('Upload failed', 'Unable to process image file.', 'error');
    }
  };

  const renderExportJpeg = async (): Promise<string> => {
    const original = cardRef.current;
    const host = exportHostRef.current;
    if (!original || !host) {
      throw new Error('Export target is not available.');
    }

    host.innerHTML = '';
    const clone = original.cloneNode(true) as HTMLElement;

    clone.style.width = `${CARD_WIDTH_PX}px`;
    clone.style.height = `${CARD_HEIGHT_PX}px`;
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.position = 'relative';

    host.style.display = 'block';
    host.style.position = 'fixed';
    host.style.left = '-10000px';
    host.style.top = '0';
    host.style.zIndex = '-1';
    host.style.overflow = 'hidden';
    host.appendChild(clone);

    await waitForFonts();
    await waitForImages(clone);

    return await toJpeg(clone, {
      quality: 0.98,
      width: CARD_WIDTH_PX,
      height: CARD_HEIGHT_PX,
      pixelRatio: 2,
    });
  };

  const cleanupExportSurface = () => {
    if (exportHostRef.current) {
      exportHostRef.current.innerHTML = '';
      exportHostRef.current.style.display = 'none';
    }
  };

  const downloadJpg = async () => {
    setIsExporting(true);
    setExportType('jpg');
    try {
      const dataUrl = await renderExportJpeg();
      const link = document.createElement('a');
      link.download = `ahadex-1side-${template.id}-${template.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      link.href = dataUrl;
      link.click();
      addToast('JPG Downloaded', 'High-resolution 1050 × 600 px card downloaded.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Export error', 'Could not export card. Please retry.', 'error');
    } finally {
      cleanupExportSurface();
      setIsExporting(false);
      setExportType(null);
    }
  };

  const downloadPdf = async () => {
    setIsExporting(true);
    setExportType('pdf');
    try {
      const dataUrl = await renderExportJpeg();
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
        compress: true,
      });

      pdf.addImage(dataUrl, 'JPEG', 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN, undefined, 'FAST');
      pdf.save(`ahadex-1side-${template.id}-${template.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      addToast('PDF Downloaded', 'Exact 3.5 × 2 inch print-ready PDF downloaded.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Export error', 'Could not generate PDF. Please retry.', 'error');
    } finally {
      cleanupExportSurface();
      setIsExporting(false);
      setExportType(null);
    }
  };

  const resetToDemo = () => {
    setData(DEFAULT_AHAD_DATA);
    addToast('Loaded Demo', 'Mohammad Ahad & AHADEX demo details restored.', 'info');
  };

  const clearForm = () => {
    setData(EMPTY_ONE_SIDE_CARD_DATA);
    addToast('Cleared', 'Form fields emptied for custom data.', 'info');
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${template.name} 1-Side Visiting Card | AHADEX TOOLS`}
        description={`Customize and download the ${template.name} 1-side visiting card. Print-ready 1050 × 600 px JPG and 3.5 × 2 inch PDF.`}
      />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          {/* Top navigation */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate('/tools/visiting-card-generator/one-side')}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to 1-Side Templates
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                1-SIDE FORMAT
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400">
                Template #{template.id} · {template.name}
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg"
                style={{
                  background: `${template.accent}20`,
                  color: template.accent,
                  border: `1px solid ${template.accent}40`,
                }}
              >
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: template.accent }}>
                  1-Side Visiting Card Editor
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {template.name}
                </h1>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {template.description} Edit personal information, upload your portrait and logo, review the live preview, and download your card.
            </p>
          </div>

          {/* Editor Grid: Controls on left, Live preview on right */}
          <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
            {/* Form Section */}
            <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Card Information</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Personal & business details</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetToDemo}
                    title="Fill with Mohammad Ahad demo"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Demo
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    title="Clear all fields"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.08]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <UploadBox
                  label="Profile Portrait Photo"
                  description="JPG, PNG or WebP headshot"
                  icon={ImagePlus}
                  accept="image/*"
                  preview={data.photoUrl || template.demoPortrait}
                  onChange={updateFile('photoUrl')}
                />

                <UploadBox
                  label="Company Logo"
                  description="Transparent PNG recommended"
                  icon={Building2}
                  accept="image/*"
                  preview={data.logoUrl}
                  onChange={updateFile('logoUrl')}
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <Field
                    label="Full Name"
                    value={data.fullName}
                    onChange={(v) => updateField('fullName', v)}
                    placeholder="Mohammad Ahad"
                    icon={UserRound}
                  />

                  <Field
                    label="Job Title"
                    value={data.jobTitle}
                    onChange={(v) => updateField('jobTitle', v)}
                    placeholder="Founder & CEO"
                    icon={Sparkles}
                  />

                  <Field
                    label="Company Name"
                    value={data.companyName}
                    onChange={(v) => updateField('companyName', v)}
                    placeholder="AHADEX"
                    icon={Building2}
                  />

                  <Field
                    label="Phone Number"
                    value={data.phone}
                    onChange={(v) => updateField('phone', v)}
                    placeholder="+880 1700 000000"
                    icon={Phone}
                  />

                  <Field
                    label="WhatsApp"
                    value={data.whatsapp}
                    onChange={(v) => updateField('whatsapp', v)}
                    placeholder="+880 1700 000000"
                    icon={MessageCircle}
                  />

                  <Field
                    label="Email Address"
                    value={data.email}
                    onChange={(v) => updateField('email', v)}
                    placeholder="ahad@ahadex.com"
                    icon={Mail}
                  />

                  <Field
                    label="Website URL"
                    value={data.website}
                    onChange={(v) => updateField('website', v)}
                    placeholder="ahadex.fun"
                    icon={Globe}
                  />

                  <Field
                    label="Office Location"
                    value={data.address}
                    onChange={(v) => updateField('address', v)}
                    placeholder="Dubai · Dhaka · Worldwide"
                    icon={MapPin}
                  />

                  <Field
                    label="LinkedIn Profile"
                    value={data.linkedin}
                    onChange={(v) => updateField('linkedin', v)}
                    placeholder="linkedin.com/in/mohammadahad"
                    icon={Linkedin}
                  />

                  <Field
                    label="Instagram"
                    value={data.instagram}
                    onChange={(v) => updateField('instagram', v)}
                    placeholder="@mohammadahad"
                    icon={Instagram}
                  />

                  <Field
                    label="Short Professional Bio"
                    value={data.bio}
                    onChange={(v) => updateField('bio', v)}
                    placeholder="Short introduction or company motto..."
                    icon={Sparkles}
                    multiline
                  />
                </div>
              </div>
            </section>

            {/* Live Preview Section */}
            <section className="min-w-0">
              <div className="sticky top-6">
                <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-white">Live Card Preview</h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Exact 1050 × 600 px (3.5 × 2 in print standard)
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadJpg}
                        disabled={isExporting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {exportType === 'jpg' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Download JPG
                      </button>

                      <button
                        type="button"
                        onClick={downloadPdf}
                        disabled={isExporting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {exportType === 'pdf' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Card Rendering Container with dynamic scale and size adjustment */}
                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/40 p-3 sm:p-5">
                    {/* Visual scaling toolbar */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-bold text-slate-200">
                          Live View Preview (Fit-to-Screen)
                        </span>
                        <span className="hidden text-[11px] text-slate-500 sm:inline">
                          · Downloads at 1050 × 600 px (300 DPI)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 mr-1 hidden sm:inline">Preview Size:</span>
                        <button
                          type="button"
                          onClick={() => setPreviewZoom('compact')}
                          className={`rounded-lg px-2.5 py-1 font-bold transition ${
                            previewZoom === 'compact'
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-white/[0.05] text-slate-400 hover:text-white'
                          }`}
                        >
                          Compact
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewZoom('medium')}
                          className={`rounded-lg px-2.5 py-1 font-bold transition ${
                            previewZoom === 'medium'
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-white/[0.05] text-slate-400 hover:text-white'
                          }`}
                        >
                          Balanced
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewZoom('fit')}
                          className={`rounded-lg px-2.5 py-1 font-bold transition ${
                            previewZoom === 'fit'
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-white/[0.05] text-slate-400 hover:text-white'
                          }`}
                        >
                          Full Fit
                        </button>
                      </div>
                    </div>

                    <div className={`mx-auto w-full transition-all duration-300 ${
                      previewZoom === 'compact'
                        ? 'max-w-[640px]'
                        : previewZoom === 'medium'
                        ? 'max-w-[820px]'
                        : 'max-w-[1050px]'
                    }`}>
                      <div className="relative overflow-hidden rounded-xl shadow-2xl">
                        <ScaledCardPreview wrapperClassName="rounded-xl">
                          <OneSideCardCanvas
                            template={template}
                            data={data}
                            qrSrc={qrSrc}
                            cardRef={cardRef}
                          />
                        </ScaledCardPreview>
                      </div>
                    </div>
                  </div>

                  {/* Quality feature badges */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">Print-Ready JPG</p>
                      <p className="mt-1 text-[11px] text-slate-500">1050 × 600 px @ 300 DPI</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">Vector PDF</p>
                      <p className="mt-1 text-[11px] text-slate-500">Standard 3.5 × 2 inches</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">Interactive vCard QR</p>
                      <p className="mt-1 text-[11px] text-slate-500">Direct phone contact scan</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Hidden offscreen node for pixel-perfect export capture */}
        <div
          ref={exportHostRef}
          aria-hidden="true"
          style={{
            display: 'none',
            width: `${CARD_WIDTH_PX}px`,
            height: `${CARD_HEIGHT_PX}px`,
          }}
        />
      </main>
    </PageTransition>
  );
};
