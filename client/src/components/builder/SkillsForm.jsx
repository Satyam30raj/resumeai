import React, { useState } from 'react';
import useResumeStore from '../../store/resumeStore';
import { Plus, Trash2, X, Wrench } from 'lucide-react';

const COMMON_PRESETS = [
  { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL', 'C++'] },
  { category: 'Frameworks & Libraries', items: ['React', 'Node.js', 'Express', 'TailwindCSS', 'Next.js'] },
  { category: 'Cloud & DevOps', items: ['Docker', 'AWS', 'Git', 'GitHub Actions', 'CI/CD', 'Linux'] },
  { category: 'Databases', items: ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'] },
];

export default function SkillsForm() {
  const resume = useResumeStore((state) => state.resume);
  const updateSection = useResumeStore((state) => state.updateSection);

  const skills = resume?.sections?.skills || resume?.skills || [];
  const [newSkillInput, setNewSkillInput] = useState({});

  const handleAddCategory = (categoryName = 'New Category', defaultItems = []) => {
    updateSection('skills', [
      ...skills,
      {
        category: categoryName,
        items: defaultItems,
      },
    ]);
  };

  const handleRemoveCategory = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    updateSection('skills', updated);
  };

  const handleCategoryNameChange = (index, newName) => {
    const updated = skills.map((cat, i) => {
      if (i === index) {
        return { ...cat, category: newName, name: newName };
      }
      return cat;
    });
    updateSection('skills', updated);
  };

  const handleAddSkillItem = (index) => {
    const text = newSkillInput[index]?.trim();
    if (!text) return;

    const targetCat = skills[index];
    const currentItems = targetCat.items || targetCat.skills || [];
    if (currentItems.includes(text)) return;

    const updated = skills.map((cat, i) => {
      if (i === index) {
        const nextItems = [...currentItems, text];
        return { ...cat, items: nextItems, skills: nextItems };
      }
      return cat;
    });

    updateSection('skills', updated);
    setNewSkillInput({ ...newSkillInput, [index]: '' });
  };

  const handleRemoveSkillItem = (catIndex, skillIndex) => {
    const targetCat = skills[catIndex];
    const currentItems = targetCat.items || targetCat.skills || [];
    const nextItems = currentItems.filter((_, i) => i !== skillIndex);

    const updated = skills.map((cat, i) => {
      if (i === catIndex) {
        return { ...cat, items: nextItems, skills: nextItems };
      }
      return cat;
    });

    updateSection('skills', updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Technical Skills</h2>
          <p className="text-xs text-gray-500">Group skills by category for ATS keyword matching and fast scanning.</p>
        </div>
        <button
          type="button"
          onClick={() => handleAddCategory('Category', [])}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Preset Starters */}
      {skills.length === 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-blue-500" /> Quick Add Common Categories:
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddCategory(preset.category, preset.items)}
                className="text-xs px-2.5 py-1 bg-white border border-gray-300 rounded hover:border-blue-500 text-gray-700 hover:text-blue-600 font-medium"
              >
                + {preset.category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {skills.map((group, catIdx) => {
          const catName = group.category || group.name || 'Category';
          const items = Array.isArray(group.items) ? group.items : group.skills || [];

          return (
            <div key={group._id || catIdx} className="p-3.5 border border-gray-200 rounded-lg bg-gray-50/50 space-y-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => handleCategoryNameChange(catIdx, e.target.value)}
                  placeholder="e.g. Programming Languages"
                  className="font-semibold text-xs text-gray-800 bg-white border border-gray-300 rounded px-2.5 py-1 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(catIdx)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remove category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Skill Pill Badges */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {items.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded shadow-2xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillItem(catIdx, sIdx)}
                      className="text-gray-400 hover:text-red-500 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add item input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput[catIdx] || ''}
                  onChange={(e) => setNewSkillInput({ ...newSkillInput, [catIdx]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkillItem(catIdx);
                    }
                  }}
                  placeholder="Type a skill and press Enter or click Add"
                  className="flex-1 text-xs px-2.5 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkillItem(catIdx)}
                  className="text-xs px-3 py-1 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
