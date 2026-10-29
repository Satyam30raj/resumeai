import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../../store/resumeStore';
import ResumeCard from './ResumeCard';
import AnalyzerPanel from '../analyzer/AnalyzerPanel';
import { Plus, Search, FileText } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const resumes = useResumeStore((state) => state.resumes);
  const fetchResumes = useResumeStore((state) => state.fetchResumes);
  const createResume = useResumeStore((state) => state.createResume);
  const isLoading = useResumeStore((state) => state.isLoading);

  const [search, setSearch] = useState('');
  const [analyzingResume, setAnalyzingResume] = useState(null);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    const newId = await createResume();
    if (newId) {
      navigate(`/builder/${newId}`);
    }
  };

  const handleOpenAnalyzer = (resume) => {
    // Set active resume in store so analyzer can analyze it
    useResumeStore.setState({ resume });
    setAnalyzingResume(resume);
    setIsAnalyzerOpen(true);
  };

  const filtered = resumes.filter((r) =>
    (r.title || 'Untitled').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Resumes</h1>
          <p className="text-xs text-gray-500 mt-1">
            Build, optimize, and evaluate role-fit scores in one unified workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Resume
        </button>
      </div>

      {/* Search Bar */}
      {resumes.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resumes..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          />
        </div>
      )}

      {/* Grid of Resumes */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-gray-400">Loading your resumes...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <button
            type="button"
            onClick={handleCreate}
            className="h-48 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:text-blue-600 hover:bg-blue-50/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
              <Plus className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
            </div>
            <span className="font-semibold text-xs text-gray-800 group-hover:text-blue-600">
              Create New Resume
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">Start with a blank ATS template</span>
          </button>

          {/* User Resume Cards */}
          {filtered.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onAnalyze={handleOpenAnalyzer}
            />
          ))}
        </div>
      )}

      {/* Empty State when no results match search */}
      {resumes.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-xs text-gray-500">
          No resumes found matching "{search}".
        </div>
      )}

      {/* Analyzer Modal */}
      <AnalyzerPanel
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
      />
    </div>
  );
}
