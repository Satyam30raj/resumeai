import React from 'react';
import { History, Award } from 'lucide-react';

export default function AnalysisHistory({ analyses = [], onSelectAnalysis, selectedId }) {
  if (analyses.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center text-xs text-gray-400">
        No past analyses found.
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
        <History className="w-3.5 h-3.5 text-blue-600" /> Analysis History ({analyses.length})
      </h3>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {analyses.map((item) => {
          const isSelected = item._id === selectedId;
          const score = item.score ?? 0;
          const scoreColor =
            score >= 75
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : score >= 60
              ? 'text-blue-700 bg-blue-50 border-blue-200'
              : 'text-amber-700 bg-amber-50 border-amber-200';

          return (
            <button
              key={item._id}
              type="button"
              onClick={() => onSelectAnalysis(item)}
              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div>
                <span className="font-semibold text-gray-800 block truncate max-w-[160px]">
                  {item.targetRole || 'Target Role'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${scoreColor}`}>
                {score}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
