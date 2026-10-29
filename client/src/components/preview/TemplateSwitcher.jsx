import React from 'react';
import useResumeStore from '../../store/resumeStore';
import { templates } from '../../templates';
import { Check } from 'lucide-react';

export default function TemplateSwitcher() {
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate);
  const setTemplate = useResumeStore((state) => state.setTemplate);

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Templates ({templates.length})
        </span>
        <span className="text-[11px] text-gray-400">ATS-Optimized & Printable</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {templates.map((tpl) => {
          const isSelected = (selectedTemplate || 'classic').toLowerCase() === tpl.id.toLowerCase();
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setTemplate(tpl.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-500'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: tpl.color }}
              />
              <span>{tpl.name}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
