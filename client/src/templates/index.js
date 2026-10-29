import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import TechnicalTemplate from './TechnicalTemplate';
import AcademicTemplate from './AcademicTemplate';

export const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif typography with clean dividers. Timeless & ATS-proof.',
    component: ClassicTemplate,
    color: '#1f2937',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean sans-serif with subtle blue accenting and structured layout.',
    component: ModernTemplate,
    color: '#2563eb',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean monochrome with generous whitespace for maximum readability.',
    component: MinimalTemplate,
    color: '#525252',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate navy block header, structured alignment for business & engineering.',
    component: ProfessionalTemplate,
    color: '#0f172a',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Teal accent badges, modern tag pills, and dynamic visual flair.',
    component: CreativeTemplate,
    color: '#0d9488',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant serif with warm amber borders tailored for senior leadership.',
    component: ExecutiveTemplate,
    color: '#92400e',
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Developer aesthetic with monospace touches, code brackets, and git repo links.',
    component: TechnicalTemplate,
    color: '#059669',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Dense, publications-and-research-oriented CV format for higher ed & science.',
    component: AcademicTemplate,
    color: '#000000',
  },
];

export function getTemplate(id) {
  return templates.find((t) => t.id === id) || templates[0];
}

export {
  ClassicTemplate,
  ModernTemplate,
  MinimalTemplate,
  ProfessionalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  TechnicalTemplate,
  AcademicTemplate,
};
