import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useResumeStore from '../store/resumeStore';
import ResumeBuilder from '../components/builder/ResumeBuilder';
import LivePreview from '../components/preview/LivePreview';
import AnalyzerPanel from '../components/analyzer/AnalyzerPanel';
import { Eye, Edit3, ArrowLeft } from 'lucide-react';

export default function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchResume = useResumeStore((state) => state.fetchResume);
  const createResume = useResumeStore((state) => state.createResume);
  const resume = useResumeStore((state) => state.resume);
  const isLoading = useResumeStore((state) => state.isLoading);

  const [activeMobileView, setActiveMobileView] = useState('builder'); // 'builder' | 'preview'
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResume(id);
    } else {
      createResume().then((newId) => {
        if (newId) navigate(`/builder/${newId}`, { replace: true });
      });
    }
  }, [id, fetchResume, createResume, navigate]);

  if (isLoading || !resume) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-xs text-gray-500">
        Loading resume workspace...
      </div>
    );
  }

  return (
    <div className="max-w-[1700px] mx-auto px-2 sm:px-4 py-4 space-y-3">
      {/* Top back navigation & mobile view switcher */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resumes
        </button>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-gray-200 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveMobileView('builder')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeMobileView === 'builder'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Form
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileView('preview')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeMobileView === 'preview'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
          </button>
        </div>
      </div>

      {/* Split Workspace View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-140px)]">
        {/* Left: Form Builder (5 cols on lg) */}
        <div
          className={`lg:col-span-6 xl:col-span-5 h-full ${
            activeMobileView === 'builder' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResumeBuilder onOpenAnalyzer={() => setIsAnalyzerOpen(true)} />
        </div>

        {/* Right: Live Preview (7 cols on lg) */}
        <div
          className={`lg:col-span-6 xl:col-span-7 h-full ${
            activeMobileView === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <LivePreview />
        </div>
      </div>

      {/* Analyzer Modal */}
      <AnalyzerPanel
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
      />
    </div>
  );
}
