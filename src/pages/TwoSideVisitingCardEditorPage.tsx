import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  ArrowLeft,
  Building2,
  Check,
  Download,
  Eye,
  Globe,
  ImagePlus,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  QrCode,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { SEOHead } from '../components/common/SEOHead';
import { TwoSideCardCanvas } from '../components/visiting-card/TwoSideCardCanvas';
import { ScaledCardPreview } from '../components/visiting-card/common/ScaledCardPreview';
import {
  buildContactVCard,
  generateQrDataUrl,
  readFileAsDataUrl,
  waitForFonts,
  waitForImages,
} from '../components/visiting-card/common/exportUtils';
import { useToast } from '../context/ToastContext';
import { getTwoSideTemplate } from '../data/visiting-card/twoSideTemplates';
import {
  CARD_HEIGHT_IN,
  CARD_HEIGHT_PX,
  CARD_WIDTH_IN,
  CARD_WIDTH_PX,
  DEFAULT_TWO_SIDE_AHAD_DATA,
  EMPTY_TWO_SIDE_CARD_DATA,
  TwoSideCardData,
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

export const TwoSideVisitingCardEditorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const template = getTwoSideTemplate(templateId);
  const [data, setData] = useState<TwoSideCardData>(DEFAULT_TWO_SIDE_AHAD_DATA);
  const [qrSrc, setQrSrc] = useState<string>('');
  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('both');
  const [formSection, setFormSection] = useState<'front' | 'back'>('front');
  const [isExporting, setIsExporting] = useState(false);
  const [exportTask, setExportTask] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<'fit' | 'medium' | 'compact'>('fit');

  const frontCardRef = useRef<HTMLDivElement | null>(null);
  const backCardRef = useRef<HTMLDivElement | null>(null);
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

  const updateField = (key: keyof TwoSideCardData, value: any) => {
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
      addToast('Uploaded', `${field === 'photoUrl' ? 'Portrait' : 'Logo'} updated.`, 'success');
    } catch {
      addToast('Upload error', 'Could not read image file.', 'error');
    }
  };

  const renderSingleExportJpeg = async (targetNode: HTMLElement): Promise<string> => {
    const host = exportHostRef.current;
    if (!host) throw new Error('Export container not found.');

    host.innerHTML = '';
    const clone = targetNode.cloneNode(true) as HTMLElement;

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

  const cleanupExport = () => {
    if (exportHostRef.current) {
      exportHostRef.current.innerHTML = '';
      exportHostRef.current.style.display = 'none';
    }
  };

  const downloadSideJpg = async (side: 'front' | 'back') => {
    const targetRef = side === 'front' ? frontCardRef.current : backCardRef.current;
    if (!targetRef) return;

    setIsExporting(true);
    setExportTask(`${side}-jpg`);
    try {
      const dataUrl = await renderSingleExportJpeg(targetRef);
      const link = document.createElement('a');
      link.download = `ahadex-2side-${template.id}-${side}.jpg`;
      link.href = dataUrl;
      link.click();
      addToast('JPG Downloaded', `${side === 'front' ? 'Front' : 'Back'} card exported (1050 × 600 px).`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Export error', 'Failed to generate image. Please retry.', 'error');
    } finally {
      cleanupExport();
      setIsExporting(false);
      setExportTask(null);
    }
  };

  const downloadTwoPagePdf = async () => {
    const frontEl = frontCardRef.current;
    const backEl = backCardRef.current;
    if (!frontEl || !backEl) return;

    setIsExporting(true);
    setExportTask('pdf');
    try {
      const frontJpeg = await renderSingleExportJpeg(frontEl);
      const backJpeg = await renderSingleExportJpeg(backEl);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
        compress: true,
      });

      // Page 1: Front
      pdf.addImage(frontJpeg, 'JPEG', 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN, undefined, 'FAST');

      // Page 2: Back
      pdf.addPage([CARD_WIDTH_IN, CARD_HEIGHT_IN], 'landscape');
      pdf.addImage(backJpeg, 'JPEG', 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN, undefined, 'FAST');

      pdf.save(`ahadex-2side-${template.id}-${template.name.toLowerCase().replace(/\s+/g, '-')}-2page.pdf`);
      addToast('PDF Downloaded', '2-page print-ready PDF generated (Page 1: Front, Page 2: Back).', 'success');
    } catch (err) {
      console.error(err);
      addToast('Export error', 'Failed to generate 2-page PDF.', 'error');
    } finally {
      cleanupExport();
      setIsExporting(false);
      setExportTask(null);
    }
  };

  const resetToDemo = () => {
    setData(DEFAULT_TWO_SIDE_AHAD_DATA);
    addToast('Demo Loaded', 'Mohammad Ahad & AHADEX demo details restored.', 'info');
  };

  const clearForm = () => {
    setData(EMPTY_TWO_SIDE_CARD_DATA);
    addToast('Form Cleared', 'All fields cleared.', 'info');
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${template.name} 2-Side Visiting Card | AHADEX TOOLS`}
        description={`Customize both Front and Back sides of the ${template.name} business card. Export 2-page print-ready PDF or individual high-res JPGs.`}
      />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          {/* Top Navigation */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(`/tools/visiting-card-generator/two-side/template/${template.id}`)}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Template Preview
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-bold text-violet-300">
                2-SIDE FORMAT
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
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: template.accent }}>
                  2-Side Visiting Card Studio
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {template.name}
                </h1>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {template.description} Customize the Front identity side and Back corporate branding side, toggle live views, and export full 2-page print files.
            </p>
          </div>

          {/* Editor Grid */}
          <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
            {/* Form Column */}
            <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
              {/* Form Section Selector & Actions */}
              <div className="mb-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white">Card Customizer</h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetToDemo}
                      className="inline-flex items-center gap-1 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/20"
                    >
                      <Sparkles className="h-3 w-3" />
                      Demo
                    </button>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-slate-400 transition hover:bg-white/[0.08]"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Clear
                    </button>
                  </div>
                </div>

                {/* Front / Back Form Tabs */}
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.04] p-1.5">
                  <button
                    type="button"
                    onClick={() => setFormSection('front')}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      formSection === 'front'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Front Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSection('back')}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      formSection === 'back'
                        ? 'bg-violet-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Back Corporate Details
                  </button>
                </div>
              </div>

              {/* Front Details Form */}
              {formSection === 'front' ? (
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
                    label="Direct Phone Number"
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
                    label="Direct Email"
                    value={data.email}
                    onChange={(v) => updateField('email', v)}
                    placeholder="ahad@ahadex.com"
                    icon={Mail}
                  />

                  <Field
                    label="Personal / Portfolio Website"
                    value={data.website}
                    onChange={(v) => updateField('website', v)}
                    placeholder="ahadex.fun"
                    icon={Globe}
                  />

                  <Field
                    label="Location / Base"
                    value={data.address}
                    onChange={(v) => updateField('address', v)}
                    placeholder="Dubai · Dhaka · Worldwide"
                    icon={MapPin}
                  />

                  <Field
                    label="LinkedIn Handle"
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
                    label="Bio / Title Note"
                    value={data.bio}
                    onChange={(v) => updateField('bio', v)}
                    placeholder="Short executive overview..."
                    icon={Sparkles}
                    multiline
                  />
                </div>
              ) : (
                /* Back Details Form */
                <div className="space-y-4">
                  <Field
                    label="Corporate Tagline"
                    value={data.backTagline}
                    onChange={(v) => updateField('backTagline', v)}
                    placeholder="INNOVATION THROUGH PRECISION"
                    icon={Sparkles}
                  />

                  <Field
                    label="Company Overview Statement"
                    value={data.backDescription}
                    onChange={(v) => updateField('backDescription', v)}
                    placeholder="AHADEX powers next-generation digital experiences..."
                    icon={Building2}
                    multiline
                  />

                  <Field
                    label="Global Website"
                    value={data.backWebsite}
                    onChange={(v) => updateField('backWebsite', v)}
                    placeholder="ahadex.fun"
                    icon={Globe}
                  />

                  <Field
                    label="Central Inquiries Email"
                    value={data.backEmail}
                    onChange={(v) => updateField('backEmail', v)}
                    placeholder="contact@ahadex.com"
                    icon={Mail}
                  />

                  <Field
                    label="Headquarters Phone"
                    value={data.backPhone}
                    onChange={(v) => updateField('backPhone', v)}
                    placeholder="+880 1700 000000"
                    icon={Phone}
                  />

                  <Field
                    label="HQ / Office Address"
                    value={data.backAddress}
                    onChange={(v) => updateField('backAddress', v)}
                    placeholder="AHADEX HQ · Dubai Silicon Oasis & Dhaka Tech Park"
                    icon={MapPin}
                  />

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.showQrOnBack}
                      onChange={(e) => updateField('showQrOnBack', e.target.checked)}
                      className="h-4 w-4 rounded accent-cyan-400"
                    />
                    <div>
                      <p className="text-sm font-bold text-white">Include QR Code on Back</p>
                      <p className="text-xs text-slate-400">Scannable digital vCard for smartphones</p>
                    </div>
                  </label>
                </div>
              )}
            </section>

            {/* Live Preview Column */}
            <section className="min-w-0">
              <div className="sticky top-6">
                <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
                  {/* Top Bar with View Toggles and Download Buttons */}
                  <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-white">2-Side Live Preview</h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Front: 1050 × 600 px · Back: 1050 × 600 px
                      </p>
                    </div>

                    {/* View Switcher: Front, Back, Both */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center rounded-xl bg-white/[0.06] p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setActiveSide('both')}
                          className={`rounded-lg px-2.5 py-1.5 font-bold transition ${
                            activeSide === 'both'
                              ? 'bg-cyan-400 text-slate-950'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Both Sides
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSide('front')}
                          className={`rounded-lg px-2.5 py-1.5 font-bold transition ${
                            activeSide === 'front'
                              ? 'bg-cyan-400 text-slate-950'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Front
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSide('back')}
                          className={`rounded-lg px-2.5 py-1.5 font-bold transition ${
                            activeSide === 'back'
                              ? 'bg-cyan-400 text-slate-950'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Back
                        </button>
                      </div>

                      {/* Download Buttons */}
                      <button
                        type="button"
                        onClick={() => downloadSideJpg('front')}
                        disabled={isExporting}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-50"
                      >
                        {exportTask === 'front-jpg' ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Front JPG
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadSideJpg('back')}
                        disabled={isExporting}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-50"
                      >
                        {exportTask === 'back-jpg' ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Back JPG
                      </button>

                      <button
                        type="button"
                        onClick={downloadTwoPagePdf}
                        disabled={isExporting}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-3.5 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                      >
                        {exportTask === 'pdf' ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        2-Page PDF
                      </button>
                    </div>
                  </div>

                  {/* Render Area with dynamic responsive scale */}
                  <div className="space-y-6 overflow-hidden rounded-[24px] border border-white/10 bg-black/40 p-3 sm:p-5">
                    {/* Visual scaling toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
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

                    {/* Front Card Preview */}
                    {(activeSide === 'front' || activeSide === 'both') && (
                      <div className={`mx-auto w-full transition-all duration-300 ${
                        previewZoom === 'compact'
                          ? 'max-w-[640px]'
                          : previewZoom === 'medium'
                          ? 'max-w-[820px]'
                          : 'max-w-[1050px]'
                      }`}>
                        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>Side 1 · Front Identity</span>
                          <span className="text-[10px] text-cyan-400">1050 × 600 px (300 DPI)</span>
                        </div>
                        <div className="relative overflow-hidden rounded-xl shadow-2xl">
                          <ScaledCardPreview wrapperClassName="rounded-xl">
                            <TwoSideCardCanvas
                              template={template}
                              data={data}
                              side="front"
                              qrSrc={qrSrc}
                              cardRef={frontCardRef}
                            />
                          </ScaledCardPreview>
                        </div>
                      </div>
                    )}

                    {/* Back Card Preview */}
                    {(activeSide === 'back' || activeSide === 'both') && (
                      <div className={`mx-auto w-full transition-all duration-300 ${
                        previewZoom === 'compact'
                          ? 'max-w-[640px]'
                          : previewZoom === 'medium'
                          ? 'max-w-[820px]'
                          : 'max-w-[1050px]'
                      }`}>
                        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>Side 2 · Back Corporate</span>
                          <span className="text-[10px] text-violet-400">1050 × 600 px (300 DPI)</span>
                        </div>
                        <div className="relative overflow-hidden rounded-xl shadow-2xl">
                          <ScaledCardPreview wrapperClassName="rounded-xl">
                            <TwoSideCardCanvas
                              template={template}
                              data={data}
                              side="back"
                              qrSrc={qrSrc}
                              cardRef={backCardRef}
                            />
                          </ScaledCardPreview>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">2-Page PDF</p>
                      <p className="mt-1 text-[11px] text-slate-500">Page 1: Front · Page 2: Back</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">Dual JPG Downloads</p>
                      <p className="mt-1 text-[11px] text-slate-500">Separate 1050 × 600 px images</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">Dual Branding</p>
                      <p className="mt-1 text-[11px] text-slate-500">Front portrait & back corporate seal</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Hidden Export Node */}
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
