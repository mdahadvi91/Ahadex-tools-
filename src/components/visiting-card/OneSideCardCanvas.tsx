import React from 'react';
import {
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import { OneSideCardData, OneSideTemplate } from '../../types/visitingCard';
import { CardFrame } from './common/CardFrame';
import { ContactItem } from './common/ContactItem';
import { LogoVisual } from './common/LogoVisual';
import { ProfileVisual } from './common/ProfileVisual';
import { QrVisual } from './common/QrVisual';
import { getInitials } from './common/exportUtils';

interface OneSideCardCanvasProps {
  template: OneSideTemplate;
  data: OneSideCardData;
  qrSrc?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export const OneSideCardCanvas: React.FC<OneSideCardCanvasProps> = ({
  template,
  data,
  qrSrc,
  cardRef,
}) => {
  const fullName = data.fullName || 'Mohammad Ahad';
  const jobTitle = data.jobTitle || 'Founder & CEO';
  const companyName = data.companyName || 'AHADEX';
  const initials = getInitials(fullName);

  // Layout 1: Executive Portrait (prominent portrait column on the left)
  if (template.layout === 'portrait') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div className="absolute inset-y-0 left-0 w-[38%] overflow-hidden">
          <img
            src={data.photoUrl || template.demoPortrait}
            alt={fullName}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 40%, ${template.background} 100%)`,
            }}
          />
          <div
            className="absolute left-6 bottom-6 flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md"
            style={{
              background: `${template.accentSoft}cc`,
              color: template.accent,
              border: `1px solid ${template.accent}40`,
            }}
          >
            <Sparkles className="h-3 w-3" />
            Executive ID
          </div>
        </div>

        <div className="absolute left-[42%] right-12 top-10 flex items-start justify-between">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.32em]"
              style={{ color: template.accent }}
            >
              {companyName}
            </p>
            <h1 className="mt-2 text-[52px] font-black leading-[0.92] tracking-[-0.055em]">
              {fullName}
            </h1>
            <p
              className="mt-2.5 text-[17px] font-semibold"
              style={{ color: template.muted }}
            >
              {jobTitle}
            </p>
          </div>
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
        </div>

        <div className="absolute bottom-10 left-[42%] right-12 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
            {data.whatsapp && (
              <ContactItem icon={MessageCircle} value={data.whatsapp} accent={template.accent} />
            )}
            {data.linkedin && (
              <ContactItem icon={Linkedin} value={data.linkedin} accent={template.accent} />
            )}
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={84} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 2: Obsidian Monogram (Circular gold geometry, gold portrait ring, prestige identity)
  if (template.layout === 'monogram') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute inset-5 rounded-sm border"
          style={{ borderColor: `${template.accent}44` }}
        />
        <div
          className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full border-[2px]"
          style={{ borderColor: `${template.accent}20` }}
        />
        <div
          className="absolute left-10 top-10 h-32 w-32 rounded-full border"
          style={{ borderColor: `${template.accent}30` }}
        />

        <div className="absolute left-12 top-12 flex items-center gap-4">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="md"
            shape="circle"
          />
          <div>
            <p
              className="text-[12px] font-black uppercase tracking-[0.38em]"
              style={{ color: template.accent }}
            >
              {companyName}
            </p>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500">
              PRESTIGE IDENTITY
            </p>
          </div>
        </div>

        <div className="absolute right-12 top-12">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
        </div>

        <div className="absolute left-14 top-44 max-w-[620px]">
          <h1 className="text-[58px] font-black leading-[0.92] tracking-[-0.05em]">
            {fullName}
          </h1>
          <p
            className="mt-3 text-[18px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: template.accent }}
          >
            {jobTitle}
          </p>
          {data.bio && (
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-400 line-clamp-2">
              {data.bio}
            </p>
          )}
        </div>

        <div className="absolute bottom-10 left-14 right-14 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={84} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 3: Editorial Rose (Clean high-contrast editorial, asymmetric color pillar, portrait medallion)
  if (template.layout === 'editorial') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute left-0 top-0 h-full w-[32%]"
          style={{ background: template.accentSoft }}
        />
        <div
          className="absolute left-[32%] top-0 h-full w-[3px]"
          style={{ background: template.accent }}
        />

        <div className="absolute left-10 top-12">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="lg"
            shape="rounded"
          />
          <div className="mt-6">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={companyName}
              accent={template.accent}
              size="sm"
            />
          </div>
        </div>

        <div className="absolute left-[37%] right-12 top-12">
          <p
            className="text-[12px] font-black uppercase tracking-[0.32em]"
            style={{ color: template.accent }}
          >
            {companyName}
          </p>
          <h1 className="mt-4 text-[56px] font-black leading-[0.88] tracking-[-0.06em]">
            {fullName}
          </h1>
          <p
            className="mt-3 text-[18px] font-medium"
            style={{ color: template.muted }}
          >
            {jobTitle}
          </p>
        </div>

        <div className="absolute bottom-10 left-[37%] right-12 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={Instagram} value={data.instagram} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={84} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 4: Swiss Minimal (Immense typographic discipline, clean rules, portrait box)
  if (template.layout === 'minimal') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div className="absolute left-12 top-12 flex items-center gap-6">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="md"
            shape="square"
          />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
              {companyName}
            </p>
            <h1 className="mt-2 text-[52px] font-black leading-none tracking-[-0.065em]">
              {fullName}
            </h1>
            <p className="mt-2 text-[16px] font-semibold text-slate-500">
              {jobTitle}
            </p>
          </div>
        </div>

        <div className="absolute right-12 top-12">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
        </div>

        <div
          className="absolute bottom-24 left-12 right-12 h-px"
          style={{ background: template.accentSoft }}
        />

        <div className="absolute bottom-8 left-12 right-12 flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-8">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={64} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 5: Cyber Prism (Futuristic grid lines, neon cyan prism angles, tech badges)
  if (template.layout === 'prism') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(${template.accent}15 1px, transparent 1px),
              linear-gradient(90deg, ${template.accent}15 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <div
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{ background: template.accent }}
        />

        <div className="absolute left-12 top-10 flex items-center justify-between right-12">
          <div className="flex items-center gap-4">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={companyName}
              accent={template.accent}
              size="sm"
            />
            <div>
              <p
                className="text-[12px] font-black uppercase tracking-[0.32em]"
                style={{ color: template.accent }}
              >
                {companyName}
              </p>
              <p className="text-[10px] tracking-widest text-cyan-400/70">
                SYSTEM IDENTIFIER // 01
              </p>
            </div>
          </div>

          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="md"
            shape="rounded"
          />
        </div>

        <div className="absolute left-12 top-40 max-w-[620px]">
          <h1 className="text-[58px] font-black leading-[0.9] tracking-[-0.06em]">
            {fullName}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wider"
              style={{
                background: `${template.accent}20`,
                color: template.accent,
                border: `1px solid ${template.accent}40`,
              }}
            >
              {jobTitle}
            </span>
          </div>
          {data.bio && (
            <p className="mt-4 text-[13px] leading-relaxed text-slate-400 line-clamp-2">
              {data.bio}
            </p>
          )}
        </div>

        <div className="absolute bottom-10 left-12 right-12 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={80} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 6: Architect Grid (Blueprint coordinate grid, modular enclosures)
  if (template.layout === 'grid') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(${template.accent}20 1px, transparent 1px),
              linear-gradient(90deg, ${template.accent}20 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="absolute left-10 top-10 flex items-center gap-4">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="md"
            shape="rounded"
          />
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.25em]"
              style={{ color: template.accent }}
            >
              {companyName}
            </p>
            <p className="text-[10px] text-blue-300/60 uppercase tracking-widest">
              ARCHITECTURAL RECORD
            </p>
          </div>
        </div>

        <div className="absolute right-10 top-10">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
        </div>

        <div className="absolute left-10 bottom-12 max-w-[500px]">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: template.accent }}
          >
            {jobTitle}
          </p>
          <h1 className="mt-2 text-[52px] font-black leading-none tracking-[-0.055em]">
            {fullName}
          </h1>
        </div>

        <div className="absolute right-10 bottom-10 w-[360px] rounded-2xl border p-4 backdrop-blur-md"
          style={{
            borderColor: `${template.accent}33`,
            background: `${template.accentSoft}55`,
          }}
        >
          <div className="grid grid-cols-1 gap-2 text-[12px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
        </div>

        {qrSrc && (
          <div className="absolute left-[520px] bottom-10">
            <QrVisual src={qrSrc} size={70} />
          </div>
        )}
      </CardFrame>
    );
  }

  // Layout 7: Creative Offset (Angled asymmetric color shields, emerald flair)
  if (template.layout === 'asymmetric') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute -right-16 -top-24 h-[500px] w-[500px] rotate-12 rounded-3xl"
          style={{ background: `${template.accent}12` }}
        />

        <div className="absolute left-12 top-12 flex items-center gap-5">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="lg"
            shape="rounded"
          />
          <div>
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={companyName}
              accent={template.accent}
              size="sm"
            />
            <p
              className="mt-3 text-[11px] font-bold uppercase tracking-[0.32em]"
              style={{ color: template.accent }}
            >
              {companyName}
            </p>
          </div>
        </div>

        <div className="absolute left-12 top-48">
          <h1 className="text-[58px] font-black leading-[0.9] tracking-[-0.06em]">
            {fullName}
          </h1>
          <p
            className="mt-3 text-[18px] font-bold uppercase tracking-[0.18em]"
            style={{ color: template.accent }}
          >
            {jobTitle}
          </p>
        </div>

        <div className="absolute bottom-10 left-12 right-12 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={84} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 8: Brutalist (Heavy structural rules, stark typography, portrait box)
  if (template.layout === 'brutalist') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute left-0 top-0 h-full w-[16px]"
          style={{ background: template.accent }}
        />
        <div
          className="absolute right-0 top-0 h-full w-[8px]"
          style={{ background: template.accent }}
        />

        <div className="absolute left-14 top-10 flex items-center justify-between right-14">
          <div className="flex items-center gap-4">
            <ProfileVisual
              photoUrl={data.photoUrl}
              defaultPortrait={template.demoPortrait}
              accent={template.accent}
              size="md"
              shape="square"
            />
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                CORPORATE SPECIFICATION
              </p>
              <p className="text-sm font-black uppercase text-white">
                {companyName}
              </p>
            </div>
          </div>
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
        </div>

        <div className="absolute left-14 top-40 max-w-[680px]">
          <h1 className="text-[64px] font-black uppercase leading-[0.84] tracking-[-0.07em]">
            {fullName}
          </h1>
          <p
            className="mt-4 inline-block px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em]"
            style={{
              background: template.accent,
              color: '#09090b',
            }}
          >
            {jobTitle}
          </p>
        </div>

        <div className="absolute bottom-10 left-14 right-14 flex items-end justify-between border-t border-zinc-800 pt-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[12px] font-mono">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={76} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 9, 11, 16: Frame (Double inset border, refined corporate symmetry)
  if (template.layout === 'frame') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute inset-6 rounded-lg border"
          style={{ borderColor: `${template.accent}40` }}
        />
        <div
          className="absolute inset-9 rounded-md border"
          style={{ borderColor: `${template.accent}20` }}
        />

        <div className="absolute left-14 top-14 flex items-center gap-5">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="lg"
            shape="circle"
          />
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.32em]"
              style={{ color: template.accent }}
            >
              {companyName}
            </p>
            <h1 className="mt-1 text-[48px] font-black leading-[0.95] tracking-[-0.05em]">
              {fullName}
            </h1>
            <p
              className="mt-1.5 text-[16px] font-semibold"
              style={{ color: template.muted }}
            >
              {jobTitle}
            </p>
          </div>
        </div>

        <div className="absolute right-14 top-14">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
        </div>

        <div className="absolute bottom-14 left-14 right-14 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={80} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 13: Signature (Watermark monogram initials, VIP gold border, medallion)
  if (template.layout === 'signature') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div
          className="absolute inset-6 border"
          style={{ borderColor: `${template.accent}44` }}
        />
        <div
          className="absolute right-10 top-6 text-[180px] font-black leading-none opacity-10 select-none pointer-events-none"
          style={{ color: template.accent }}
        >
          {initials}
        </div>

        <div className="absolute left-14 top-14 flex items-center gap-5">
          <ProfileVisual
            photoUrl={data.photoUrl}
            defaultPortrait={template.demoPortrait}
            accent={template.accent}
            size="lg"
            shape="circle"
          />
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.38em]"
              style={{ color: template.accent }}
            >
              {companyName}
            </p>
            <p className="text-[11px] uppercase tracking-widest text-amber-200/50">
              VIP PRIVATE SIGNATURE
            </p>
          </div>
        </div>

        <div className="absolute left-14 bottom-14 max-w-[560px]">
          <h1 className="text-[56px] font-black tracking-[-0.05em]">
            {fullName}
          </h1>
          <p
            className="mt-2 text-[18px] uppercase tracking-[0.2em]"
            style={{ color: template.accent }}
          >
            {jobTitle}
          </p>
          <div className="mt-6 flex gap-6 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
          </div>
        </div>

        <div className="absolute bottom-14 right-14 flex items-center gap-4">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
          {qrSrc && <QrVisual src={qrSrc} size={84} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 14: Bold (Solar electric gold typography, high-impact portrait pill)
  if (template.layout === 'bold') {
    return (
      <CardFrame
        background={template.background}
        foreground={template.foreground}
        cardRef={cardRef}
      >
        <div className="absolute left-12 top-12 flex items-center justify-between right-12">
          <div className="flex items-center gap-5">
            <ProfileVisual
              photoUrl={data.photoUrl}
              defaultPortrait={template.demoPortrait}
              accent={template.accent}
              size="lg"
              shape="rounded"
            />
            <div>
              <p
                className="text-[13px] font-black uppercase tracking-[0.35em]"
                style={{ color: template.accent }}
              >
                {companyName}
              </p>
              <h1 className="mt-1 text-[58px] font-black leading-[0.88] tracking-[-0.06em]">
                {fullName}
              </h1>
            </div>
          </div>
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="md"
          />
        </div>

        <div className="absolute left-12 top-48">
          <p
            className="inline-block px-4 py-1.5 text-base font-black uppercase tracking-[0.2em] rounded-md"
            style={{
              background: template.accent,
              color: '#1c1917',
            }}
          >
            {jobTitle}
          </p>
        </div>

        <div className="absolute bottom-10 left-12 right-12 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-[13px]">
            <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
            <ContactItem icon={Mail} value={data.email} accent={template.accent} />
            <ContactItem icon={Globe} value={data.website} accent={template.accent} />
            <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
          </div>
          {qrSrc && <QrVisual src={qrSrc} size={84} />}
        </div>
      </CardFrame>
    );
  }

  // Layout 15 / split: (Ocean Studio / Dual-tone split panel)
  // Default fallback for any remaining layout type
  return (
    <CardFrame
      background={template.background}
      foreground={template.foreground}
      cardRef={cardRef}
    >
      <div
        className="absolute left-0 top-0 h-full w-[36%]"
        style={{ background: template.accentSoft }}
      />
      <div
        className="absolute left-[36%] top-0 h-full w-[3px]"
        style={{ background: template.accent }}
      />

      <div className="absolute left-10 top-12 flex flex-col items-center text-center">
        <ProfileVisual
          photoUrl={data.photoUrl}
          defaultPortrait={template.demoPortrait}
          accent={template.accent}
          size="xl"
          shape="circle"
        />
        <p
          className="mt-6 text-[12px] font-black uppercase tracking-[0.3em]"
          style={{ color: template.accent }}
        >
          {companyName}
        </p>
        <div className="mt-4">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={companyName}
            accent={template.accent}
            size="sm"
          />
        </div>
      </div>

      <div className="absolute left-[40%] right-12 top-14">
        <h1 className="text-[54px] font-black leading-[0.92] tracking-[-0.055em]">
          {fullName}
        </h1>
        <p
          className="mt-3 text-[18px] font-semibold uppercase tracking-wider"
          style={{ color: template.accent }}
        >
          {jobTitle}
        </p>
        {data.bio && (
          <p className="mt-4 max-w-[500px] text-[13px] leading-relaxed text-slate-300 line-clamp-2">
            {data.bio}
          </p>
        )}
      </div>

      <div className="absolute bottom-10 left-[40%] right-12 flex items-end justify-between">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[13px]">
          <ContactItem icon={Phone} value={data.phone} accent={template.accent} />
          <ContactItem icon={Mail} value={data.email} accent={template.accent} />
          <ContactItem icon={Globe} value={data.website} accent={template.accent} />
          <ContactItem icon={MapPin} value={data.address} accent={template.accent} />
        </div>
        {qrSrc && <QrVisual src={qrSrc} size={84} />}
      </div>
    </CardFrame>
  );
};
