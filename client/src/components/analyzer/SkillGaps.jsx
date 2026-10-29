import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SkillGaps({ skillGaps = [], strengths = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Identified Strengths */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Key Strengths Found
        </h3>
        {strengths.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No specific strengths captured.</p>
        ) : (
          <ul className="space-y-2">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Identified Skill Gaps */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Missing Skills & Keyword Gaps
        </h3>
        {skillGaps.length === 0 ? (
          <p className="text-xs text-emerald-600 font-medium">
            Outstanding! No critical skill gaps detected for this role.
          </p>
        ) : (
          <div className="space-y-2.5">
            {skillGaps.map((gap, idx) => {
              const skillName = typeof gap === 'string' ? gap : gap.skill;
              const importance = typeof gap === 'object' ? gap.importance || 'high' : 'high';

              const badgeColor =
                importance === 'high'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : importance === 'medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-100 bg-gray-50/60"
                >
                  <span className="text-xs font-semibold text-gray-800">{skillName}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                    {importance} priority
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
