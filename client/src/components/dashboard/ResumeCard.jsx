import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../../store/resumeStore';
import {
  FileText,
  Edit3,
  Sparkles,
  Copy,
  Trash2,
  Download,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeCard({ resume, onAnalyze }) {
  const navigate = useNavigate();
  const deleteResume = useResumeStore((state) => state.deleteResume);
  const duplicateResume = useResumeStore((state) => state.duplicateResume);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/builder/${resume._id}`);
  };

  const handleDuplicate = async () => {
    await duplicateResume(resume._id);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${resume.title || 'Untitled'}"?`)) {
      setIsDeleting(true);
      await deleteResume(resume._id);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/resumes/${resume._id}/export?format=pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${(resume.title || 'resume').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloaded PDF');
    } catch {
      toast.error('Could not download PDF. Open in builder to preview and print.');
    }
  };

  const updatedAtStr = resume.updatedAt
    ? new Date(resume.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const templateName = resume.templateId || resume.template || 'classic';

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Preview Card */}
      <div className="p-5 border-b border-gray-100 flex-1 cursor-pointer" onClick={handleEdit}>
        <div className="flex items-start justify-between gap-2">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
            {templateName}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm mt-3 truncate group-hover:text-blue-600 transition-colors">
          {resume.title || 'Untitled Resume'}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Edited {updatedAtStr}</span>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="bg-gray-50/60 p-2.5 px-4 flex items-center justify-between text-xs text-gray-600 border-t border-gray-100">
        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium"
          title="Edit Resume"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>

        <button
          type="button"
          onClick={() => onAnalyze(resume)}
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
          title="Run AI Analysis"
        >
          <Sparkles className="w-3.5 h-3.5" /> Analyze
        </button>

        <button
          type="button"
          onClick={handleDuplicate}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800"
          title="Duplicate"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-600"
          title="Download PDF"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-1 text-gray-400 hover:text-red-500"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
