import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function CenteredTag({ children, className, style }: Props) {
  return (
    <span
      className={cn(
        // Layout-based centering (not padding-based)
        'inline-grid place-items-center',
        // Fixed height for consistent rendering
        'h-7 px-3',
        // Eliminate line-height ambiguity
        'leading-none align-middle',
        // Default rounded corners
        'rounded',
        // Prevent splitting across pages
        'no-break inline-block',
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
