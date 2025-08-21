import { motion } from 'framer-motion';
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-blue text-white hover:bg-primary-blue/90 focus:shadow-focus',
  secondary: 'bg-primary-orange text-white hover:bg-primary-orange/90 focus:shadow-focus',
  ghost: 'bg-transparent text-primary-blue border border-primary-blue hover:bg-primary-blue/10',
  outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon: Icon, iconPosition = 'left', startIcon, endIcon, children, className = '', ...props }, ref) => {
    const { onDrag, onDragEnd, onDragStart, onDragOver, onDragEnter, onDragLeave, onDrop, onAnimationStart, onAnimationEnd, onAnimationIteration, ...restProps } = props;
    return (
      <motion.button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange shadow-card ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        whileTap={{ scale: 0.97 }}
        disabled={loading || props.disabled}
        aria-busy={loading}
        {...restProps}
      >
        {(Icon && iconPosition === 'left') || startIcon}
        {loading ? <span className="animate-pulse">...</span> : children}
        {(Icon && iconPosition === 'right') || endIcon}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
