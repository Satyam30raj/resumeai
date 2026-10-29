import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SCORE_DIMENSIONS } from '../../utils/constants';

export default function ScoreComparison({ current, previous }) {
  if (!current || !previous) return null;

  const scoreDiff = (current.score || 0) - (previous.score || 0);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Run Comparison</h3>
          <p className="text-xs text-gray-500">
            Comparing latest run against previous version ({new Date(previous.createdAt).toLocaleDateString()})
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-50 border">
          {scoreDiff > 0 ? (
            <span className="text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +{scoreDiff} pts gained
            </span>
          ) : scoreDiff < 0 ? (
            <span className="text-red-500 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> {scoreDiff} pts
            </span>
          ) : (
            <span className="text-gray-500 flex items-center gap-1">
              <Minus className="w-3.5 h-3.5" /> No change
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
        {SCORE_DIMENSIONS.map((dim) => {
          const prevVal = previous.dimensionScores?.[dim.key] ?? 0;
          const currVal = current.dimensionScores?.[dim.key] ?? 0;
          const diff = currVal - prevVal;

          return (
            <div key={dim.key} className="p-2.5 bg-gray-50 rounded-lg">
              <span className="text-[10px] font-medium text-gray-500 block truncate">
                {dim.label}
              </span>
              <div className="text-xs font-bold text-gray-900 mt-1">
                {currVal}%
                <span
                  className={`text-[10px] ml-1 font-semibold ${
                    diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {diff > 0 ? `+${diff}` : diff}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
