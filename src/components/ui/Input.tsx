import React, { forwardRef } from 'react';
import { X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  isFocused?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', leftIcon, rightIcon, onClear, value, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full group">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          value={value}
          className={`w-full h-11 px-4 text-sm rounded-xl glass-input placeholder-slate-400/70 transition-all duration-200 outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon || (onClear && value) ? 'pr-10' : ''} ${className}`}
          {...props}
        />

        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {rightIcon && !onClear && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
