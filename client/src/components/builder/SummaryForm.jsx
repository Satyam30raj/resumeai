import React from 'react';
import useResumeStore from '../../store/resumeStore';
import { Sparkles } from 'lucide-react';

export default function SummaryForm() {
  const resume = useResumeStore((state) => state.resume);
  const updateSection = useResumeStore((state) => state.updateSection);

  const summaryData = resume?.sections?.summary || resume?.summary;
  const content = typeof summaryData === 'string' ? summaryData : summaryData?.content || '';

  const handleChange = (e) => {
    const newContent = e.target.value;
    updateSection('summary', { content: newContent });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Professional Summary</h2>
        <p className="text-xs text-gray-500">
          A concise 2–4 sentence overview highlighting your background, core specialties, and unique value.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">ATS Tip:</span> Mention your target role title, years of experience, and 2–3 key technical tools in the first sentence.
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-gray-700">Summary Statement</label>
          <span className="text-[11px] text-gray-400">
            {wordCount} words • {content.length} characters
          </span>
        </div>
        <textarea
          rows={6}
          value={content}
          onChange={handleChange}
          placeholder="Results-oriented Software Engineer with a solid foundation in React, Node.js, and cloud systems. Proven track record of developing scalable web applications and collaborating effectively in agile teams..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
