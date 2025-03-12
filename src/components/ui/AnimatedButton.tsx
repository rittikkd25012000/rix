'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function AnimatedButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseStyles = 'relative overflow-hidden rounded-lg font-medium transition-all duration-200 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
        }}
        animate={!disabled && !isLoading ? {
          opacity: [0, 1, 0],
          x: ['-100%', '100%', '100%'],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />

      {/* Loading spinner */}
      {isLoading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      )}

      {/* Content */}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </motion.button>
  );
} 