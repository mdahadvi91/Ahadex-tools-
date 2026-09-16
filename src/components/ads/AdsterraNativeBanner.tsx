import React, { useEffect, useRef, useState } from 'react';

interface AdsterraNativeBannerProps {
  className?: string;
  slotId?: string;
}

export const AdsterraNativeBanner: React.FC<AdsterraNativeBannerProps> = ({
  className = '',
  slotId = 'adsterra-slot',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const container = containerRef.current;
    if (!container) return;

    // Remove any stale scripts inside container if remounted
    const existingScript = container.querySelector('script[src*="profitableratecpmnetwork.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create script element with exact required attributes
    const script = document.createElement('script');
    script.src = 'https://pl31374906.profitableratecpmnetwork.com/754e14aa954e128c62cd2d9cf86b805c/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    container.appendChild(script);

    return () => {
      if (container) {
        const s = container.querySelector('script[src*="profitableratecpmnetwork.com"]');
        if (s) s.remove();
      }
    };
  }, [isVisible, slotId]);

  return (
    <div ref={wrapperRef} className={`w-full max-w-5xl mx-auto my-6 px-4 sm:px-6 ${className}`}>
      <div className="relative rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md p-3 sm:p-4 overflow-hidden shadow-xl text-center">
        {/* Subtle Advertisement Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[10px] font-mono tracking-widest text-slate-500 uppercase select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
            <span>Sponsored Content</span>
          </span>
          <span>ADVERTISEMENT</span>
        </div>

        {/* Adsterra Exact Container */}
        <div
          ref={containerRef}
          className="w-full flex justify-center items-center min-h-[90px] overflow-hidden"
        >
          {isVisible ? (
            <div id="container-754e14aa954e128c62cd2d9cf86b805c" className="w-full flex justify-center" />
          ) : (
            <div className="w-full h-[90px] flex items-center justify-center text-slate-600/50 text-xs font-mono">
              <span>Loading advertisement...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
