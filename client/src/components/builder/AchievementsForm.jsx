import React from 'react';
import useResumeStore from '../../store/resumeStore';
import { Plus, Trash2, Award } from 'lucide-react';
import { EMPTY_ACHIEVEMENT } from '../../utils/constants';

export default function AchievementsForm() {
  const resume = useResumeStore((state) => state.resume);
  const updateSection = useResumeStore((state) => state.updateSection);

  const achievements = resume?.sections?.achievements || resume?.achievements || [];

  const handleAdd = () => {
    updateSection('achievements', [
      ...achievements,
      {
        ...EMPTY_ACHIEVEMENT,
      },
    ]);
  };

  const handleRemove = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    updateSection('achievements', updated);
  };

  const handleChange = (index, field, value) => {
    const updated = achievements.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSection('achievements', updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Achievements & Certifications</h2>
          <p className="text-xs text-gray-500">
            List honors, hackathon wins, professional certifications (AWS, GCP, Coursera), or notable awards.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-2">No achievements or certifications added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs text-blue-600 font-medium underline"
          >
            Add a certification or honor
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((item, index) => (
            <div key={item._id || index} className="p-3.5 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-700">
                  #{index + 1} {item.title || 'Certification / Award'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title / Name *</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect or Smart India Hackathon Winner"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={item.date || ''}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    placeholder="e.g. Nov 2023"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Issuer / Organization</label>
                  <input
                    type="text"
                    value={item.issuer || ''}
                    onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description / Details</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    placeholder="Ranked 1st among 250+ teams developing real-time anomaly detection."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
