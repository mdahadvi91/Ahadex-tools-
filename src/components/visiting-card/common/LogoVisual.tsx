import React from 'react';
import { AHADEX_LOGO_DATA_URL } from '../../../data/visiting-card/demoPortraits';
import { getInitials } from './exportUtils';

interface LogoVisualProps {
  logoUrl?: string | null;
  companyName?: string;
  accent: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LogoVisual: React.FC<LogoVisualProps> = ({
  logoUrl,
  companyName = 'AHADEX',
  accent,
  size = 'md',
  className = '',
}) => {
  const isAhadex = !companyName || companyName.toUpperCase().includes('AHADEX');
  const finalLogo = logoUrl || (isAhadex ? AHADEX_LOGO_DATA_URL : null);

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  }[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border ${sizeClasses} ${className}`}
      style={{
        borderColor: `${accent}44`,
        background: `${accent}15`,
      }}
    >
      {finalLogo ? (
        <img
          src={finalLogo}
          alt={companyName || 'Company Logo'}
          className="h-full w-full object-contain p-2"
        />
      ) : (
        <span
          className="text-base font-black tracking-tight"
          style={{ color: accent }}
        >
          {getInitials(companyName)}
        </span>
      )}
    </div>
  );
};
