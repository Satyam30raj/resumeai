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
      // In development or when server puppeteer is available, we can trigger the endpoint:
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
      // Fallback: browser native window.print for immediate client export
      toast.dismiss('pdf-toast');
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl border border-gray-200 overflow-hidden">
      {/* Template Switcher Bar */}
      <TemplateSwitcher />

      {/* Control Bar: Zoom & Actions */}
      <div className="bg-white/80 backdrop-blur px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Preview:</span>
          <span className="text-gray-500">{activeTemplateDef.name} Template</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1 hover:bg-white rounded text-gray-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] px-2 font-mono">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}
              className="p-1 hover:bg-white rounded text-gray-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleBrowserPrint}
            className="p-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded text-gray-700"
            title="Print"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Scaled Preview Canvas */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-slate-200/60">
        <div
          ref={printRef}
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
