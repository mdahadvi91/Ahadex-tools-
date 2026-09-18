import React from 'react';

interface ContactItemProps {
  icon: React.ElementType;
  value?: string;
  accent: string;
  className?: string;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  icon: Icon,
  value,
  accent,
  className = '',
}) => {
  if (!value || !value.trim()) return null;

  return (
    <div className={`flex min-w-0 items-center gap-2 text-[14px] ${className}`}>
      <Icon className="h-4 w-4 shrink-0" style={{ color: accent }} />
      <span className="truncate">{value}</span>
    </div>
  );
};
