'use client';

import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Reusable Input Component
 * Text input with label, error, and helper text support
 */
export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        className={`input ${error ? 'border-error-500 focus-visible:ring-error-500' : ''} ${className}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-error-500">
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p className="mt-1.5 text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
