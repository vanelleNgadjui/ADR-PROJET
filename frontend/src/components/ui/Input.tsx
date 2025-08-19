import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = '', ...props }, ref) => (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-neutral-black/80 mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-neutral-black/60 pointer-events-none z-10">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full py-2 px-3 ${icon ? 'pl-10' : 'pl-3'} rounded-lg border border-neutral-black/10 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300 outline-none bg-neutral-white text-body`}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
      </div>
      {error && <span id={`${props.id}-error`} className="text-xs text-primary-orange mt-1">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input'; 