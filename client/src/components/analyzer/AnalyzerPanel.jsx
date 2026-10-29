import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAnalysisStore from '../../store/analysisStore';
import useResumeStore from '../../store/resumeStore';
import { TARGET_ROLES } from '../../utils/constants';
import { Sparkles, X, Target, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalyzerPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const resume = useResumeStore((state) => state.resume);
  const saveResume = useResumeStore((state) => state.saveResume);
  const isAnalyzing = useAnalysisStore((state) => state.isAnalyzing);
  const analyzeResume = useAnalysisStore((state) => state.analyzeResume);

  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setErrorMsg('');
    try {
      if (resume) {
        await saveResume();
      }

      const currentResumeId = resume?._id;
      if (!currentResumeId) {
        setErrorMsg('Please make sure your resume is saved before scanning.');
        return;
      }

      const roleToAnalyze =
        selectedRole === 'Other' && customRole.trim()
          ? customRole.trim()
          : selectedRole;

      const analysisId = await analyzeResume(currentResumeId, roleToAnalyze);
      if (analysisId) {
        onClose();
        navigate(`/analysis/${analysisId}`);
      } else {
        setErrorMsg(
          'Analysis could not be completed. Please ensure your resume has content in experience, skills, or projects.'
        );
      }
    } catch (err) {
      setErrorMsg(err.message || 'Analysis failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Run AI Analysis</h2>
              <p className="text-xs text-gray-500">Evaluate fit against industry expectations</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              Target Job Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {selectedRole === 'Other' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enter Custom Job Title
              </label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. Site Reliability Engineer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg text-xs text-gray-600 space-y-1">
            <span className="font-semibold text-gray-800 block">What will be evaluated:</span>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600 text-[11.5px]">
              <li>Role keyword coverage against industry taxonomies</li>
              <li>Quantified achievements and metrics density</li>
              <li>Weak, passive, or missing action verbs</li>
              <li>Section completeness and chronological flow</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing (5-10s)...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start Scan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
