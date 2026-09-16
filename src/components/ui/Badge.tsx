import React from 'react';

export type BadgeVariant = 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  withDot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  withDot = false,
  className = '',
  size = 'sm',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; dot: string; text: string; border: string }> = {
    cyan: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-300',
      border: 'border-cyan-500/25',
      dot: 'bg-cyan-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      border: 'border-blue-500/25',
      dot: 'bg-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      border: 'border-purple-500/25',
      dot: 'bg-purple-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      border: 'border-emerald-500/25',
      dot: 'bg-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      border: 'border-amber-500/25',
      dot: 'bg-amber-400',
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-300',
      border: 'border-rose-500/25',
      dot: 'bg-rose-400',
    },
    slate: {
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700/80',
      dot: 'bg-slate-400',
    },
  };

  const style = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md border whitespace-nowrap select-none transition-colors ${sizeClasses} ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      {withDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`}
          />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${style.dot}`} />
        </span>
      )}
      {children}
    </span>
  );
};
