import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

/**
 * SectionIndicator badge that shows whether a section has content.
 */
export default function SectionIndicator({ isComplete }) {
  if (isComplete) {
    return (
      <span className="inline-flex items-center text-emerald-600 text-xs font-medium ml-auto" title="Section complete">
        <CheckCircle2 className="w-3.5 h-3.5" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-amber-500 text-xs font-medium ml-auto" title="Incomplete">
      <Circle className="w-3 h-3" />
    </span>
  );
}
