import React from 'react';
import { RefreshCw } from 'lucide-react';

interface QrVisualProps {
  src?: string;
  size?: number;
  className?: string;
}

export const QrVisual: React.FC<QrVisualProps> = ({
  src,
  size = 80,
  className = '',
}) => {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-white/90 shadow-lg ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <RefreshCw className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white p-1.5 shadow-xl ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={src}
        alt="Contact QR code"
        className="h-full w-full object-contain"
      />
    </div>
  );
};
