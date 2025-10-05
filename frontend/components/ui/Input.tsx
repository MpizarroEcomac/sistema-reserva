'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'error';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helpText, 
    icon, 
    variant = 'default',
    className, 
    ...props 
  }, ref) => {
    const hasError = variant === 'error' || !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={clsx(
              'input',
              {
                'input-error': hasError,
                'pl-10': icon,
              },
              className
            )}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-error-600">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="mt-2 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;