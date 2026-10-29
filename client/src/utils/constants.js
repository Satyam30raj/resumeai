/**
 * Application-wide constants for ResumeAI.
 */

/** Target role options for resume analysis */
export const TARGET_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'Product Manager',
  'Project Manager',
  'UX Designer',
  'UI Designer',
  'QA Engineer',
  'Mobile Developer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Database Administrator',
  'Systems Administrator',
  'Business Analyst',
  'Technical Writer',
  'Scrum Master',
  'Solutions Architect',
  'AI/ML Researcher',
  'Embedded Systems Engineer',
  'Blockchain Developer',
  'Game Developer',
  'IT Support Specialist',
  'Network Engineer',
  'Marketing Manager',
  'Financial Analyst',
  'Consultant',
  'Graphic Designer',
  'Content Strategist',
  'HR Manager',
  'Operations Manager',
  'Sales Engineer',
  'Other',
];

/** Template metadata for the template registry */
export const TEMPLATE_IDS = {
  CLASSIC: 'classic',
  MODERN: 'modern',
  MINIMAL: 'minimal',
  PROFESSIONAL: 'professional',
  CREATIVE: 'creative',
  EXECUTIVE: 'executive',
  TECHNICAL: 'technical',
  ACADEMIC: 'academic',
};

/** Analysis score dimension labels */
export const SCORE_DIMENSIONS = [
  { key: 'skillsMatch', label: 'Skills Match', color: '#3b82f6' },
  { key: 'experienceRelevance', label: 'Experience Relevance', color: '#8b5cf6' },
  { key: 'sectionCompleteness', label: 'Section Completeness', color: '#06b6d4' },
  { key: 'phrasingQuality', label: 'Phrasing Quality', color: '#f59e0b' },
  { key: 'quantifiedImpact', label: 'Quantified Impact', color: '#22c55e' },
];

/** Resume section keys */
export const RESUME_SECTIONS = [
  { key: 'personalInfo', label: 'Personal Info' },
  { key: 'summary', label: 'Summary' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'achievements', label: 'Achievements' },
];

/** Suggestion category colors */
export const SUGGESTION_CATEGORIES = {
  content: { label: 'Content', color: 'bg-blue-100 text-blue-800' },
  formatting: { label: 'Formatting', color: 'bg-purple-100 text-purple-800' },
  keywords: { label: 'Keywords', color: 'bg-green-100 text-green-800' },
  impact: { label: 'Impact', color: 'bg-amber-100 text-amber-800' },
  grammar: { label: 'Grammar', color: 'bg-red-100 text-red-800' },
  structure: { label: 'Structure', color: 'bg-cyan-100 text-cyan-800' },
};

/** Default empty resume structure */
export const EMPTY_RESUME = {
  title: 'Untitled Resume',
  templateId: 'classic',
  imageUrl: '',
  sections: {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: { content: '' },
    education: [],
    skills: [],
    experience: [],
    projects: [],
    achievements: [],
  },
};

/** Default education entry */
export const EMPTY_EDUCATION = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
};

/** Default experience entry */
export const EMPTY_EXPERIENCE = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  highlights: [''],
};

/** Default project entry */
export const EMPTY_PROJECT = {
  title: '',
  description: '',
  technologies: [],
  link: '',
  highlights: [''],
};

/** Default achievement entry */
export const EMPTY_ACHIEVEMENT = {
  title: '',
  issuer: '',
  date: '',
  description: '',
};

/** Default skill category */
export const EMPTY_SKILL_CATEGORY = {
  name: '',
  skills: [],
};
