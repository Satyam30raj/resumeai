import React, { useState } from 'react';
import useResumeStore from '../../store/resumeStore';
import SectionIndicator from './SectionIndicator';
import PersonalInfoForm from './PersonalInfoForm';
import SummaryForm from './SummaryForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ExperienceForm from './ExperienceForm';
import ProjectsForm from './ProjectsForm';
import AchievementsForm from './AchievementsForm';
import {
  User,
  FileText,
  GraduationCap,
  Wrench,
  Briefcase,
  FolderGit2,
  Award,
  Save,
  Sparkles,
} from 'lucide-react';

const TABS = [
  { id: 'personalInfo', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'achievements', label: 'Achievements', icon: Award },
];

export default function ResumeBuilder({ onOpenAnalyzer }) {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const resume = useResumeStore((state) => state.resume);
  const isSaving = useResumeStore((state) => state.isSaving);
  const autosaveStatus = useResumeStore((state) => state.autosaveStatus);
  const saveResume = useResumeStore((state) => state.saveResume);
  const setTitle = useResumeStore((state) => state.setTitle);

  const sections = resume?.sections || resume || {};

  // Completeness checks
  const isComplete = {
    personalInfo: Boolean(
      (sections.personalInfo?.fullName || resume?.personalInfo?.fullName) &&
      (sections.personalInfo?.email || resume?.personalInfo?.email)
    ),
    summary: Boolean(
      (typeof sections.summary === 'string' && sections.summary.trim().length > 20) ||
      (sections.summary?.content && sections.summary.content.trim().length > 20)
    ),
    education: (sections.education?.length || 0) > 0,
    skills: (sections.skills?.length || 0) > 0,
    experience: (sections.experience?.length || 0) > 0,
    projects: (sections.projects?.length || 0) > 0,
    achievements: (sections.achievements?.length || 0) > 0,
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'personalInfo':
        return <PersonalInfoForm />;
      case 'summary':
        return <SummaryForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'achievements':
        return <AchievementsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Top Bar with Title and Status */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={resume?.title || ''}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Resume"
            className="text-base font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 rounded transition-colors w-full"
          />
          <div className="text-[11px] text-gray-400 mt-0.5 px-1">
            {autosaveStatus === 'saving' && 'Saving changes...'}
            {autosaveStatus === 'saved' && 'All changes saved to cloud'}
            {autosaveStatus === 'error' && 'Failed to autosave. Click manual save.'}
            {autosaveStatus === 'idle' && 'Draft ready'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={saveResume}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 shadow-2xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={onOpenAnalyzer}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze with AI
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white scrollbar-none px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <SectionIndicator isComplete={isComplete[tab.id]} />
            </button>
          );
        })}
      </div>

      {/* Active Form Content */}
       <div className="p-6 pb-24 overflow-y-auto flex-1 min-h-0">
        {renderActiveSection()}
      </div>
    </div>
  );
}
