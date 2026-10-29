import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable loading spinner component.
 * @param {{ size?: number, text?: string, className?: string, fullPage?: boolean }} props
 */
function LoadingSpinner({ size = 24, text = '', className = '', fullPage = false }) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="animate-spin text-primary-600" style={{ width: size, height: size }} />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
