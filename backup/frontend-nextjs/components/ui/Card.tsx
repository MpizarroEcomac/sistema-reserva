'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  children,
  className,
  header,
  footer,
  padding = true,
}) => {
  return (
    <div className={clsx('card', className)}>
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      
      <div className={clsx(padding ? 'card-body' : '')}>
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;