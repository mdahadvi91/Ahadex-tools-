import React from 'react';

interface CardFrameProps {
  background: string;
  foreground: string;
  children: React.ReactNode;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  dataExportCard?: string;
}

export const CardFrame: React.FC<CardFrameProps> = ({
  background,
  foreground,
  children,
  cardRef,
  className = '',
  dataExportCard = 'visiting-card',
}) => (
  <div
    ref={cardRef}
    data-export-card={dataExportCard}
    className={`relative h-[600px] w-[1050px] overflow-hidden select-none ${className}`}
    style={{
      background,
      color: foreground,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);
