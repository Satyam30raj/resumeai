import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { SUGGESTION_CATEGORIES } from '../../utils/constants';

export default function SuggestionList({ suggestions = [] }) {
  const [feedback, setFeedback] = useState({});

  const handleFeedback = (index, type) => {
    setFeedback((prev) => ({
      ...prev,
      [index]: type,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Actionable Recommendations ({suggestions.length})
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Concrete changes to optimize phrasing, add measurable results, and boost role fit.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((item, idx) => {
          const categoryKey = (item.category || 'content').toLowerCase();
          const categoryBadge = SUGGESTION_CATEGORIES[categoryKey] || {
            label: item.category || 'General',
            color: 'bg-gray-100 text-gray-800',
          };

          const userFeedback = feedback[idx];

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 hover:border-blue-200 transition-colors space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryBadge.color}`}>
                    {categoryBadge.label}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    Location: <strong className="text-gray-700">{item.location || 'General'}</strong>
                  </span>
                </div>

                {/* Pilot Feedback Thumbs */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="text-[11px]">Helpful?</span>
                  <button
                    type="button"
                    onClick={() => handleFeedback(idx, 'up')}
                    className={`p-1 rounded hover:bg-gray-200 ${
                      userFeedback === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400'
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback(idx, 'down')}
                    className={`p-1 rounded hover:bg-gray-200 ${
                      userFeedback === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400'
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Before / After comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {item.current && (
                  <div className="p-3 bg-red-50/60 border border-red-200/60 rounded-lg">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block mb-1">
                      Current Phrasing / Observation
                    </span>
                    <p className="text-gray-700">{item.current}</p>
                  </div>
                )}

                <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-lg">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Recommended Change
                  </span>
                  <p className="text-gray-800 font-medium">{item.recommended}</p>
                </div>
              </div>

              {item.impact && (
                <div className="text-[11px] text-gray-500 italic flex items-center gap-1.5">
                  <span className="font-semibold text-gray-700 not-italic">Why it matters:</span>
                  <span>{item.impact}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
