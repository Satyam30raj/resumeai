import React, { useRef, useState } from 'react';
import useResumeStore from '../../store/resumeStore';
import { getTemplate } from '../../templates';
import TemplateSwitcher from './TemplateSwitcher';
import { Download, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LivePreview() {
  const resume = useResumeStore((state) => state.resume);
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate);
  const [zoom, setZoom] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef(null);

  const activeTemplateDef = getTemplate(selectedTemplate);
  const TemplateComponent = activeTemplateDef.component;

    const handleDownloadPDF = async () => {
    if (!resume?._id) {
      toast.error('Please save your resume first before exporting.');
      return;
    }

    setIsExporting(true);
    toast.loading('Generating PDF...', { id: 'pdf-toast' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/resumes/${resume._id}/export?format=pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Server PDF export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${(resume.title || 'resume').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded!', { id: 'pdf-toast' });
    } catch {
      // Clean fallback: browser native print targeting the resume element
      toast.dismiss('pdf-toast');
      handleBrowserPrint();
    } finally {
      setIsExporting(false);
    }
  };

  const handleBrowserPrint = () => {
    const oldTitle = document.title;
    const cleanTitle = (resume?.title || resume?.sections?.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_');
    document.title = cleanTitle;
    window.print();
    setTimeout(() => {
      document.title = oldTitle;
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl border border-gray-200 overflow-hidden print:border-none print:bg-white print:overflow-visible">
      {/* Template Switcher Bar */}
      <div className="no-print">
        <TemplateSwitcher />
      </div>

      {/* Control Bar: Zoom & Actions */}
      <div className="bg-white/80 backdrop-blur px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600 no-print">
        {/* ... buttons ... */}
      </div>

      {/* Scaled Preview Canvas */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-slate-200/60 print:bg-white print:p-0 print:overflow-visible">
        <div
          ref={printRef}
          id="resume-print-area"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
          }}
          className="shadow-2xl rounded-sm print:shadow-none print:transform-none"
        >
          <TemplateComponent data={resume || {}} />
        </div>
      </div>
    </div>
  );
}
