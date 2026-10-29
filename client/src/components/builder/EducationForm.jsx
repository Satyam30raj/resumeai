import React from 'react';
import useResumeStore from '../../store/resumeStore';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { EMPTY_EDUCATION } from '../../utils/constants';

export default function EducationForm() {
  const resume = useResumeStore((state) => state.resume);
  const updateSection = useResumeStore((state) => state.updateSection);

  const education = resume?.sections?.education || resume?.education || [];

  const handleAdd = () => {
    updateSection('education', [
      ...education,
      {
        ...EMPTY_EDUCATION,
        field: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    const updated = education.filter((_, i) => i !== index);
    updateSection('education', updated);
  };

  const handleChange = (index, field, value) => {
    const updated = education.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSection('education', updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Education</h2>
          <p className="text-xs text-gray-500">List degrees, diplomas, or certifications in reverse chronological order.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-2">No education entries added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs text-blue-600 font-medium underline"
          >
            Add your degree or university
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item, index) => (
            <div key={item._id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-700">
                  #{index + 1} {item.institution || 'Degree'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remove entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Institution / University *</label>
                  <input
                    type="text"
                    value={item.institution || ''}
                    onChange={(e) => handleChange(index, 'institution', e.target.value)}
                    placeholder="e.g. Stanford University or Delhi Technological University"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Degree *</label>
                  <input
                    type="text"
                    value={item.degree || ''}
                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Technology (B.Tech)"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={item.field || item.fieldOfStudy || ''}
                    onChange={(e) => {
                      handleChange(index, 'field', e.target.value);
                      handleChange(index, 'fieldOfStudy', e.target.value);
                    }}
                    placeholder="e.g. Computer Science & Technology"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={item.startDate || ''}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    placeholder="e.g. Aug 2020"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date (or Expected)</label>
                  <input
                    type="text"
                    value={item.endDate || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    placeholder="e.g. May 2024"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">GPA / Score (Optional)</label>
                  <input
                    type="text"
                    value={item.gpa || ''}
                    onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                    placeholder="e.g. 3.8 / 4.0 or 8.9 CGPA"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Relevant Coursework / Honors</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    placeholder="e.g. Data Structures, Distributed Systems, Database Management"
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
