'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { SelectOption } from '../../types';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'error';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    helpText, 
    options, 
    placeholder,
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
          <select
            ref={ref}
            className={clsx(
              'input appearance-none pr-10',
              {
                'input-error': hasError,
              },
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.icon && `${option.icon} `}{option.label}
              </option>
            ))}
          </select>
          
          {/* Custom arrow */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
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

Select.displayName = 'Select';

export default Select;