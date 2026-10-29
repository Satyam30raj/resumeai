import React from 'react';
import { SCORE_DIMENSIONS } from '../../utils/constants';

export default function ScoreDisplay({ score = 0, dimensionScores = {} }) {
  // Score color calculation
  const getScoreColor = (val) => {
    if (val >= 75) return { stroke: '#10b981', text: 'text-emerald-600', label: 'Strong Fit' };
    if (val >= 60) return { stroke: '#3b82f6', text: 'text-blue-600', label: 'Good Match' };
    if (val >= 45) return { stroke: '#f59e0b', text: 'text-amber-500', label: 'Needs Improvement' };
    return { stroke: '#ef4444', text: 'text-red-500', label: 'Significant Gaps' };
  };

  const status = getScoreColor(score);
  const strokeDashoffset = 283 - (283 * Math.min(100, Math.max(0, score))) / 100;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
      {/* Circular Gauge */}
      <div className="relative flex flex-col items-center justify-center shrink-0">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke="#f3f4f6"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke={status.stroke}
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold ${status.text}`}>{score}</span>
          <span className="text-[11px] text-gray-400 font-medium">/ 100</span>
        </div>
        <span className={`text-xs font-semibold mt-2 ${status.text}`}>{status.label}</span>
      </div>

      {/* 5 Dimension Progress Bars */}
      <div className="flex-1 w-full space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Scoring Dimensions Breakdown
        </h3>
        <div className="space-y-2.5">
          {SCORE_DIMENSIONS.map((dim) => {
            const val = dimensionScores[dim.key] ?? 50;
            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-700">{dim.label}</span>
                  <span className="font-semibold text-gray-900">{val}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${val}%`,
                      backgroundColor: dim.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
