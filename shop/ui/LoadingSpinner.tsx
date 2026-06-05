/**
 * Sam's Hardware Loading Spinner Component
 * 
 * A minimalist loading spinner with Teenage Engineering styling.
 */

'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border-te-grey/30 border-t-te-yellow animate-spin`}
        style={{ borderTopWidth: size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px' }}
      />
      {text && (
        <p className="text-sm text-te-grey animate-pulse">{text}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;

