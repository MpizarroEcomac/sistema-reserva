'use client';

import React from 'react';
import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className,
  color = 'text-primary-600'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={clsx(
        'inline-block border-2 border-current border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        color,
        className
      )}
    />
  );
};

export default Spinner;