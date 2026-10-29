import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  Sparkles,
  FileCheck,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Resume Builder & Analyzer
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Build. Analyze. <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Land the Job.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop guessing what recruiters want. Create ATS-friendly resumes with 8 battle-tested
            templates and receive instant role-specific scores, skill gap reports, and 5+ actionable suggestions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 text-sm transition-all flex items-center justify-center gap-2 group"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Build Your Resume Free'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={isAuthenticated ? '/builder' : '/login'}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm border border-slate-700 transition-all text-center"
            >
              {isAuthenticated ? 'New Resume' : 'Sign In'}
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 8 ATS-Friendly Templates
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Gemini AI Analysis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Export Selectable PDF
            </span>
          </div>
        </div>
      </section>

      {/* 3 Step Unified Workflow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Built for Students & Early-Career Job Seekers
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Build and review happen in one seamless loop — not across disconnected apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">1. Guided Form Builder</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Step-by-step sections with completeness indicators ensure you never face a blank page. Live preview updates under 200ms.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">2. Hybrid AI Analyzer</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Combines deterministic keyword and metrics checks with Gemini LLM judgment for 0–100 role fit scoring and 5+ concrete fixes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">3. Selectable PDF Export</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Export clean, text-selectable A4 PDFs that parse cleanly in campus placement portals and corporate ATS software.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to refine your resume?</h2>
          <p className="text-sm text-blue-100">
            Join candidates preparing for campus placements and off-campus tech roles.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/signup'}
              className="inline-block px-7 py-3 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-50 shadow-md transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
