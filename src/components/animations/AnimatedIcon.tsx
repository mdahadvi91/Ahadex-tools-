import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface AnimatedIconProps extends LucideProps {
  name: string;
  className?: string;
  animateOnHover?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  name,
  className = '',
  animateOnHover = true,
  ...props
}) => {
  // Safe lookup in lucide-react exports
  const IconComponent = (Icons as unknown as Record<string, React.FC<LucideProps>>)[name] || Icons.Cpu;

  return (
    <div
      className={`inline-flex items-center justify-center transition-transform duration-300 ${
        animateOnHover ? 'group-hover:scale-110 group-hover:rotate-3' : ''
      }`}
    >
      <IconComponent className={className} {...props} />
    </div>
  );
};
