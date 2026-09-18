import React from 'react';
import { UserRound } from 'lucide-react';

interface ProfileVisualProps {
  photoUrl?: string | null;
  defaultPortrait: string;
  accent: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded' | 'square';
  className?: string;
}

export const ProfileVisual: React.FC<ProfileVisualProps> = ({
  photoUrl,
  defaultPortrait,
  accent,
  size = 'md',
  shape = 'circle',
  className = '',
}) => {
  const finalSrc = photoUrl || defaultPortrait;

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40',
  }[size];

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-3xl',
    square: 'rounded-xl',
  }[shape];

  return (
    <div
      className={`relative shrink-0 overflow-hidden border-2 shadow-2xl ${sizeClasses} ${shapeClasses} ${className}`}
      style={{
        borderColor: `${accent}aa`,
        boxShadow: `0 0 0 4px ${accent}22, 0 16px 36px rgba(0,0,0,0.5)`,
      }}
    >
      {finalSrc ? (
        <img
          src={finalSrc}
          alt="Profile portrait"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-800">
          <UserRound className="h-1/2 w-1/2" style={{ color: accent }} />
        </div>
      )}
    </div>
  );
};
