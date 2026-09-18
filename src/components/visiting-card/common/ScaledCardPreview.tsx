import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';

interface ScaledCardPreviewProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  cardWidth?: number;
  cardHeight?: number;
  interactive?: boolean;
}

export const ScaledCardPreview: React.FC<ScaledCardPreviewProps> = ({
  children,
  className = '',
  wrapperClassName = '',
  cardWidth = 1050,
  cardHeight = 600,
  interactive = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 640) return 0.32;
      if (w < 1024) return 0.48;
      return 0.58;
    }
    return 0.5;
  });

  const updateScale = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    if (width > 0) {
      setScale(width / cardWidth);
    }
  };

  useLayoutEffect(() => {
    updateScale();
  }, [cardWidth]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScale();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setScale(width / cardWidth);
        }
      }
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [cardWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${wrapperClassName}`}
      style={{
        aspectRatio: `${cardWidth} / ${cardHeight}`,
      }}
    >
      <div
        className={`absolute left-0 top-0 origin-top-left ${
          interactive ? '' : 'pointer-events-none'
        } ${className}`}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          transform: `scale(${scale})`,
          WebkitTransform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
