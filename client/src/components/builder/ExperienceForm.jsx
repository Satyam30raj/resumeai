import React from 'react';
import useResumeStore from '../../store/resumeStore';
import { Plus, Trash2, Briefcase, PlusCircle, MinusCircle } from 'lucide-react';
import { EMPTY_EXPERIENCE } from '../../utils/constants';

export default function ExperienceForm() {
  const resume = useResumeStore((state) => state.resume);
  const updateSection = useResumeStore((state) => state.updateSection);

  const experience = resume?.sections?.experience || resume?.experience || [];

  const handleAdd = () => {
    updateSection('experience', [
      ...experience,
      {
        ...EMPTY_EXPERIENCE,
        current: false,
      },
    ]);
  };

  const handleRemove = (index) => {
    const updated = experience.filter((_, i) => i !== index);
    updateSection('experience', updated);
  };

  const handleChange = (index, field, value) => {
    const updated = experience.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSection('experience', updated);
  };

  const handleAddHighlight = (expIndex) => {
    const updated = experience.map((item, i) => {
      if (i === expIndex) {
        return {
          ...item,
          highlights: [...(item.highlights || []), ''],
        };
      }
      return item;
    });
    updateSection('experience', updated);
  };

  const handleHighlightChange = (expIndex, hIndex, value) => {
    const updated = experience.map((item, i) => {
      if (i === expIndex) {
        const nextHighlights = [...(item.highlights || [])];
        nextHighlights[hIndex] = value;
        return { ...item, highlights: nextHighlights };
      }
      return item;
    });
    updateSection('experience', updated);
  };

  const handleRemoveHighlight = (expIndex, hIndex) => {
    const updated = experience.map((item, i) => {
      if (i === expIndex) {
        const nextHighlights = (item.highlights || []).filter((_, idx) => idx !== hIndex);
        return { ...item, highlights: nextHighlights };
      }
      return item;
    });
    updateSection('experience', updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
          <p className="text-xs text-gray-500">
            Showcase internships, full-time, part-time, or freelance roles with quantified accomplishments.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-2">No work experience added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs text-blue-600 font-medium underline"
          >
            Add an internship or job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((item, expIndex) => (
            <div key={item._id || expIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-700">
                  #{expIndex + 1} {item.position || 'Position'} {item.company ? `@ ${item.company}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(expIndex)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remove experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    value={item.company || ''}
                    onChange={(e) => handleChange(expIndex, 'company', e.target.value)}
                    placeholder="e.g. Google or Infosys"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Job Title / Role *</label>
                  <input
                    type="text"
                    value={item.position || ''}
                    onChange={(e) => handleChange(expIndex, 'position', e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={item.startDate || ''}
                    onChange={(e) => handleChange(expIndex, 'startDate', e.target.value)}
                    placeholder="e.g. June 2023"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-700">End Date</label>
                    <label className="text-[11px] text-gray-500 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(item.current || item.isCurrent)}
                        onChange={(e) => {
                          handleChange(expIndex, 'current', e.target.checked);
                          handleChange(expIndex, 'isCurrent', e.target.checked);
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      Current Role
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={Boolean(item.current || item.isCurrent)}
                    value={item.current || item.isCurrent ? 'Present' : item.endDate || ''}
                    onChange={(e) => handleChange(expIndex, 'endDate', e.target.value)}
                    placeholder="e.g. August 2023"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Overview Description (Optional)</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleChange(expIndex, 'description', e.target.value)}
                    placeholder="Brief description of the team and core domain..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Bullet points / Highlights */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Key Achievements & Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddHighlight(expIndex)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Bullet
                  </button>
                </div>

                <div className="space-y-2">
                  {(item.highlights || []).map((highlight, hIndex) => (
                    <div key={hIndex} className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">•</span>
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleHighlightChange(expIndex, hIndex, e.target.value)}
                        placeholder="e.g. Optimized database queries with indexing, cutting API response times by 35%."
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(expIndex, hIndex)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove bullet"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
