import React from 'react';
import {
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TwoSideCardData, TwoSideTemplate } from '../../types/visitingCard';
import { CardFrame } from './common/CardFrame';
import { ContactItem } from './common/ContactItem';
import { LogoVisual } from './common/LogoVisual';
import { ProfileVisual } from './common/ProfileVisual';
import { QrVisual } from './common/QrVisual';
import { getInitials } from './common/exportUtils';

interface TwoSideCardCanvasProps {
  template: TwoSideTemplate;
  data: TwoSideCardData;
  side: 'front' | 'back';
  qrSrc?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export const TwoSideCardCanvas: React.FC<TwoSideCardCanvasProps> = ({
  template,
  data,
  side,
  qrSrc,
  cardRef,
}) => {
  const fullName = data.fullName || 'Mohammad Ahad';
  const jobTitle = data.jobTitle || 'Founder & CEO';
  const companyName = data.companyName || 'AHADEX';
  const tagline = data.backTagline || 'INNOVATION THROUGH PRECISION';
  const description =
    data.backDescription ||
    'AHADEX powers next-generation digital experiences, high-performance privacy-first tools, and developer technologies.';
  const backWebsite = data.backWebsite || data.website || 'ahadex.fun';
  const backEmail = data.backEmail || data.email || 'contact@ahadex.com';
  const backPhone = data.backPhone || data.phone || '+880 1700 000000';
  const backAddress =
    data.backAddress || data.address || 'AHADEX HQ · Dubai Silicon Oasis & Dhaka Tech Park';
  const initials = getInitials(fullName);

  const backBg = template.backBackground || template.background;
  const backFg = template.backForeground || template.foreground;

  // ===================== FRONT SIDE =====================
  if (side === 'front') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
        dataExportCard="two-side-front"
      >
        {/* Subtle decorative background glow */}
        <div
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl opacity-25"
          style={{ background: template.accent }}
        />
        <div
          className="absolute left-0 bottom-0 h-40 w-40 rounded-full blur-2xl opacity-15"
          style={{ background: template.accent }}
        />

        {/* Top Header Bar */}
        <div className="absolute left-12 right-12 top-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={companyName}
              accent={template.accent}
              size="sm"
            />
            <div>
              <p
                className="text-[12px] font-black uppercase tracking-[0.35em]"
                style={{ color: template.accent }}
              >
                {companyName}
              </p>
              <p className="text-[10px] tracking-widest text-slate-400">
                OFFICIAL IDENTITY CARD
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: `${template.accentSoft}99`,
              color: template.accent,
              border: `1px solid ${template.accent}40`,
            }}
          >
            <ShieldCheck className="h-3 w-3" />
            Verified Profile
          </div>
        </div>

        {/* Center Main Identity with Human Portrait */}
        <div className="absolute left-12 right-12 top-28 flex items-center gap-8">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="xl"
            shape="rounded"
          />

          <div className="min-w-0">
            <h1 className="text-[54px] font-black leading-[0.9] tracking-[-0.055em]">
              {fullName}
            </h1>
            <p
              className="mt-3 text-[20px] font-bold uppercase tracking-[0.18em]"
              style={{ color: template.accent }}
            >
              {jobTitle}
            </p>
            {data.bio && (
              <p className="mt-2.5 max-w-[550px] text-[13px] leading-relaxed text-slate-400 line-clamp-2">
                {data.bio}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Contact Details Footer */}
        <div
          className="absolute bottom-9 left-12 right-12 flex items-center justify-between border-t pt-4"
          style={{ borderColor: `${template.accent}30` }}
        >
          <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            {data.whatsapp && (
              <ContactItem icon={MessageCircle} value={data.whatsapp} accent={template.accent} />
            )}
            {data.linkedin && (
              <ContactItem icon={Linkedin} value={data.linkedin} accent={template.accent} />
            )}
            {data.instagram && (
              <ContactItem icon={Instagram} value={data.instagram} accent={template.accent} />
            )}
          </div>

          <div className="text-right">
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              CARD HOLDER
            </p>
            <p
              className="text-xs font-black tracking-wider"
              style={{ color: template.accent }}
            >
              {initials}-9984
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  // ===================== BACK SIDE =====================
  return (
    <CardFrame
      background={backBg}
      foreground={backFg}
      cardRef={cardRef}
      dataExportCard="two-side-back"
    >
      {/* Outer Border Frame */}
      <div
        className="absolute inset-5 rounded-2xl border"
        style={{ borderColor: `${template.accent}35` }}
      />
      <div
        className="absolute inset-8 rounded-xl border"
        style={{ borderColor: `${template.accent}18` }}
      />

      {/* Decorative center watermarks / geometric circles */}
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-20 pointer-events-none"
        style={{ borderColor: template.accent }}
      />

      <div className="relative flex h-full flex-col justify-between p-14">
        {/* Top Company Logo & Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={companyName}
              accent={template.accent}
              size="lg"
            />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-[0.25em]">
                {companyName}
              </h2>
              <p
                className="mt-0.5 text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: template.accent }}
              >
                {tagline}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
              style={{
                background: `${template.accent}18`,
                color: template.accent,
                border: `1px solid ${template.accent}40`,
              }}
            >
              <Sparkles className="h-3 w-3" />
              Corporate Headquarters
            </span>
          </div>
        </div>

        {/* Center Content / Description & QR */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-10">
          <div className="max-w-[560px]">
            <p className="text-[15px] leading-relaxed text-slate-300 font-medium">
              {description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold tracking-wider">
              <span
                className="rounded-lg px-3 py-1.5"
                style={{
                  background: `${template.accent}15`,
                  color: template.accent,
                }}
              >
                WEB & MOBILE UTILITIES
              </span>
              <span
                className="rounded-lg px-3 py-1.5"
                style={{
                  background: `${template.accent}15`,
                  color: template.accent,
                }}
              >
                PRIVACY FIRST
              </span>
              <span
                className="rounded-lg px-3 py-1.5"
                style={{
                  background: `${template.accent}15`,
                  color: template.accent,
                }}
              >
                HIGH PERFORMANCE
              </span>
            </div>
          </div>

          {data.showQrOnBack && qrSrc && (
            <div className="flex flex-col items-center">
              <QrVisual src={qrSrc} size={110} />
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                SCAN TO CONNECT
              </p>
            </div>
          )}
        </div>

        {/* Bottom Corporate Footnotes & Coordinates */}
        <div
          className="flex items-center justify-between border-t pt-4 text-[13px]"
          style={{ borderColor: `${template.accent}30` }}
        >
          <div className="flex items-center gap-6">
            <ContactItem icon={MapPin} value={backAddress} accent={template.accent} />
            <ContactItem icon={Globe} value={backWebsite} accent={template.accent} />
            <ContactItem icon={Mail} value={backEmail} accent={template.accent} />
          </div>

          <p className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
            © {new Date().getFullYear()} {companyName} CORP
          </p>
        </div>
      </div>
    </CardFrame>
  );
};
