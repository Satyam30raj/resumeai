import React from 'react';
import useResumeStore from '../../store/resumeStore';
import { Plus, Trash2, FolderGit2, PlusCircle, MinusCircle } from 'lucide-react';
import { EMPTY_PROJECT } from '../../utils/constants';

export default function ProjectsForm() {
  const resume = useResumeStore((state) => state.resume);
  const updateSection = useResumeStore((state) => state.updateSection);

  const projects = resume?.sections?.projects || resume?.projects || [];

  const handleAdd = () => {
    updateSection('projects', [
      ...projects,
      {
        ...EMPTY_PROJECT,
      },
    ]);
  };

  const handleRemove = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    updateSection('projects', updated);
  };

  const handleChange = (index, field, value) => {
    const updated = projects.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSection('projects', updated);
  };

  const handleTechChange = (index, str) => {
    const techArray = str.split(',').map((t) => t.trim()).filter(Boolean);
    handleChange(index, 'technologies', techArray);
  };

  const handleAddHighlight = (projIndex) => {
    const updated = projects.map((item, i) => {
      if (i === projIndex) {
        return {
          ...item,
          highlights: [...(item.highlights || []), ''],
        };
      }
      return item;
    });
    updateSection('projects', updated);
  };

  const handleHighlightChange = (projIndex, hIndex, value) => {
    const updated = projects.map((item, i) => {
      if (i === projIndex) {
        const nextHighlights = [...(item.highlights || [])];
        nextHighlights[hIndex] = value;
        return { ...item, highlights: nextHighlights };
      }
      return item;
    });
    updateSection('projects', updated);
  };

  const handleRemoveHighlight = (projIndex, hIndex) => {
    const updated = projects.map((item, i) => {
      if (i === projIndex) {
        const nextHighlights = (item.highlights || []).filter((_, idx) => idx !== hIndex);
        return { ...item, highlights: nextHighlights };
      }
      return item;
    });
    updateSection('projects', updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
          <p className="text-xs text-gray-500">
            Showcase personal, academic, or open-source software projects and tech demos.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <FolderGit2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-2">No projects added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs text-blue-600 font-medium underline"
          >
            Add your best project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, projIndex) => {
            const techString = Array.isArray(proj.technologies)
              ? proj.technologies.join(', ')
              : proj.technologies || '';

            return (
              <div key={proj._id || projIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-gray-700">
                    #{projIndex + 1} {proj.title || 'Project'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(projIndex)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Project Title *</label>
                    <input
                      type="text"
                      value={proj.title || ''}
                      onChange={(e) => handleChange(projIndex, 'title', e.target.value)}
                      placeholder="e.g. ResumeAI — AI Resume Builder"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Project / Demo Link</label>
                    <input
                      type="url"
                      value={proj.link || ''}
                      onChange={(e) => handleChange(projIndex, 'link', e.target.value)}
                      placeholder="https://github.com/user/project or https://live.app"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      value={techString}
                      onChange={(e) => handleTechChange(projIndex, e.target.value)}
                      placeholder="e.g. React, Node.js, Express, MongoDB, TailwindCSS"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={proj.description || ''}
                      onChange={(e) => handleChange(projIndex, 'description', e.target.value)}
                      placeholder="Full-stack web application designed for streamlined resume authoring and role-specific analysis."
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Highlights */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-gray-700">
                      Key Highlights & Features
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddHighlight(projIndex)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Highlight
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(proj.highlights || []).map((highlight, hIndex) => (
                      <div key={hIndex} className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">•</span>
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleHighlightChange(projIndex, hIndex, e.target.value)}
                          placeholder="e.g. Integrated Gemini API to automate ATS scoring across 5 evaluation dimensions."
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(projIndex, hIndex)}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
