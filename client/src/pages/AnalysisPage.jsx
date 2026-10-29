import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAnalysisStore from '../store/analysisStore';
import useResumeStore from '../store/resumeStore';
import ScoreDisplay from '../components/analyzer/ScoreDisplay';
import SkillGaps from '../components/analyzer/SkillGaps';
import SuggestionList from '../components/analyzer/SuggestionList';
import ScoreComparison from '../components/analyzer/ScoreComparison';
import AnalysisHistory from '../components/analyzer/AnalysisHistory';
import AnalyzerPanel from '../components/analyzer/AnalyzerPanel';
import {
  ArrowLeft,
  Sparkles,
  Edit3,
  RefreshCw,
  Target,
  Calendar,
} from 'lucide-react';

export default function AnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentAnalysis = useAnalysisStore((state) => state.currentAnalysis);
  const analyses = useAnalysisStore((state) => state.analyses);
  const fetchAnalysis = useAnalysisStore((state) => state.fetchAnalysis);
  const fetchAnalyses = useAnalysisStore((state) => state.fetchAnalyses);
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const fetchResume = useResumeStore((state) => state.fetchResume);

  const [isReanalyzeOpen, setIsReanalyzeOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAnalysis(id);
    }
  }, [id, fetchAnalysis]);

  useEffect(() => {
    if (currentAnalysis?.resumeId) {
      fetchAnalyses(currentAnalysis.resumeId);
      fetchResume(currentAnalysis.resumeId);
    }
  }, [currentAnalysis?.resumeId, fetchAnalyses, fetchResume]);

  if (isLoading || !currentAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-xs text-gray-500">
        Loading AI analysis report...
      </div>
    );
  }

  // Find previous run for comparison
  const previousRun = analyses.find((a) => a._id !== currentAnalysis._id);

  const handleSelectHistoryItem = (item) => {
    navigate(`/analysis/${item._id}`);
  };

  const handleReturnToBuilder = () => {
    if (currentAnalysis.resumeId) {
      navigate(`/builder/${currentAnalysis.resumeId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation & Role Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <button
            type="button"
            onClick={handleReturnToBuilder}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Resume Editor
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Role Fit Analysis
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              <Target className="w-3.5 h-3.5" />
              {currentAnalysis.targetRole || 'Software Engineer'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Scanned on {new Date(currentAnalysis.createdAt).toLocaleString()}
            </span>
            <span>• Model: {currentAnalysis.modelVersion || 'Gemini 1.5 Flash'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReturnToBuilder}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 shadow-2xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Resume to Fix Gaps
          </button>

          <button
            type="button"
            onClick={() => setIsReanalyzeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-Analyze
          </button>
        </div>
      </div>

      {/* Main Grid: Left side report + Right side history */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Analysis Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Circular Score Gauge & 5 Dimension Bars */}
          <ScoreDisplay
            score={currentAnalysis.score || 0}
            dimensionScores={currentAnalysis.dimensionScores || {}}
          />

          {/* Comparison with previous run if exists */}
          {previousRun && (
            <ScoreComparison current={currentAnalysis} previous={previousRun} />
          )}

          {/* Strengths & Missing Skills */}
          <SkillGaps
            skillGaps={currentAnalysis.skillGaps || []}
            strengths={currentAnalysis.strengths || []}
          />

          {/* 5+ Actionable Improvement Suggestions */}
          <SuggestionList suggestions={currentAnalysis.suggestions || []} />
        </div>

        {/* Right 1 Column: History & Tips */}
        <div className="space-y-6">
          <AnalysisHistory
            analyses={analyses}
            onSelectAnalysis={handleSelectHistoryItem}
            selectedId={currentAnalysis._id}
          />

          {/* Placement Cell / Recruiter Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Fast Improvement Loop
            </h3>
            <p className="text-xs text-indigo-950/80 leading-relaxed">
              Target a score above <strong>75</strong> before submitting to campus placement drives.
              Address the high-priority missing skills in your projects and add numerical metrics
              to your experience bullets.
            </p>
            <button
              type="button"
              onClick={handleReturnToBuilder}
              className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Open Editor Now
            </button>
          </div>
        </div>
      </div>

      {/* Re-analyze Modal */}
      <AnalyzerPanel
        isOpen={isReanalyzeOpen}
        onClose={() => setIsReanalyzeOpen(false)}
      />
    </div>
  );
}
