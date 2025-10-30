'use client';

import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

/**
 * Reusable Card Component
 * Container component with consistent styling
 */
export function Card({
  title,
  description,
  footer,
  children,
  className = '',
  hoverable = false,
}: CardProps) {
  const hoverClass = hoverable ? 'hover:shadow-md transition-shadow duration-base cursor-pointer' : '';
  
  return (
    <div className={`card ${hoverClass} ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div>{children}</div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  );
}
