/**
 * @file utils/roleCatalog.js
 * @description Defines 8 target role profiles used for resume scoring and analysis.
 *
 * Each role includes:
 * - id / title — identifiers
 * - requiredSkills — must-have technical skills
 * - preferredSkills — nice-to-have skills
 * - expectedSections — resume sections that should be present
 * - sectionWeights — relative importance of each section (sum = 1)
 * - keywords — action verbs and terms expected in bullet points
 */

/** @type {Record<string, RoleProfile>} */
const ROLE_CATALOG = Object.freeze({
  'software-engineer': {
    id: 'software-engineer',
    title: 'Software Engineer',
    requiredSkills: [
      'JavaScript', 'Python', 'Java', 'Data Structures',
      'Algorithms', 'Git', 'SQL', 'REST APIs',
    ],
    preferredSkills: [
      'React', 'Node.js', 'Docker', 'AWS',
      'System Design', 'CI/CD',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.25, experience: 0.30, projects: 0.25, education: 0.15, summary: 0.05 },
    keywords: ['developed', 'implemented', 'optimized', 'scaled', 'architected', 'debugged'],
  },

  'frontend-developer': {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    requiredSkills: [
      'HTML', 'CSS', 'JavaScript', 'TypeScript',
      'React', 'Responsive Design', 'Git', 'REST APIs',
    ],
    preferredSkills: [
      'Next.js', 'Vue.js', 'Tailwind CSS', 'Webpack',
      'Accessibility (a11y)', 'Performance Optimization',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.25, experience: 0.25, projects: 0.30, education: 0.10, summary: 0.10 },
    keywords: ['built', 'designed', 'styled', 'rendered', 'optimized', 'integrated', 'responsive'],
  },

  'backend-developer': {
    id: 'backend-developer',
    title: 'Backend Developer',
    requiredSkills: [
      'Node.js', 'Python', 'Java', 'SQL',
      'REST APIs', 'Git', 'Database Design', 'Authentication',
    ],
    preferredSkills: [
      'GraphQL', 'Docker', 'Kubernetes', 'Redis',
      'Message Queues', 'Microservices',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.25, experience: 0.35, projects: 0.20, education: 0.10, summary: 0.10 },
    keywords: ['architected', 'developed', 'deployed', 'optimized', 'secured', 'scaled', 'migrated'],
  },

  'data-analyst': {
    id: 'data-analyst',
    title: 'Data Analyst',
    requiredSkills: [
      'SQL', 'Excel', 'Python', 'Data Visualization',
      'Statistics', 'Tableau', 'Power BI', 'ETL',
    ],
    preferredSkills: [
      'R', 'Pandas', 'NumPy', 'Google Analytics',
      'A/B Testing', 'Machine Learning Basics',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.25, experience: 0.30, projects: 0.20, education: 0.20, summary: 0.05 },
    keywords: ['analyzed', 'visualized', 'reported', 'modeled', 'queried', 'automated', 'insights'],
  },

  'ml-engineer': {
    id: 'ml-engineer',
    title: 'ML Engineer',
    requiredSkills: [
      'Python', 'Machine Learning', 'TensorFlow', 'PyTorch',
      'Statistics', 'SQL', 'Data Preprocessing', 'Model Evaluation',
    ],
    preferredSkills: [
      'MLOps', 'Docker', 'AWS SageMaker', 'NLP',
      'Computer Vision', 'Feature Engineering',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.25, experience: 0.25, projects: 0.30, education: 0.15, summary: 0.05 },
    keywords: ['trained', 'deployed', 'fine-tuned', 'evaluated', 'optimized', 'predicted', 'classified'],
  },

  'devops-engineer': {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    requiredSkills: [
      'Linux', 'Docker', 'Kubernetes', 'CI/CD',
      'AWS', 'Terraform', 'Git', 'Bash/Shell Scripting',
    ],
    preferredSkills: [
      'Ansible', 'Prometheus', 'Grafana', 'Jenkins',
      'Helm', 'Service Mesh',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.30, experience: 0.35, projects: 0.20, education: 0.10, summary: 0.05 },
    keywords: ['automated', 'provisioned', 'deployed', 'monitored', 'containerized', 'orchestrated', 'migrated'],
  },

  'product-analyst': {
    id: 'product-analyst',
    title: 'Product Analyst',
    requiredSkills: [
      'SQL', 'Product Metrics', 'A/B Testing', 'Excel',
      'Data Visualization', 'User Research', 'Python', 'Cohort Analysis',
    ],
    preferredSkills: [
      'Mixpanel', 'Amplitude', 'Looker', 'Tableau',
      'Statistical Testing', 'Funnel Analysis',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.20, experience: 0.35, projects: 0.20, education: 0.15, summary: 0.10 },
    keywords: ['analyzed', 'measured', 'optimized', 'segmented', 'forecasted', 'recommended', 'improved'],
  },

  'qa-engineer': {
    id: 'qa-engineer',
    title: 'QA Engineer',
    requiredSkills: [
      'Test Planning', 'Manual Testing', 'Automation Testing', 'Selenium',
      'JIRA', 'API Testing', 'Git', 'SQL',
    ],
    preferredSkills: [
      'Cypress', 'Playwright', 'Performance Testing', 'CI/CD',
      'BDD/TDD', 'Load Testing',
    ],
    expectedSections: ['summary', 'skills', 'experience', 'projects', 'education'],
    sectionWeights: { skills: 0.25, experience: 0.35, projects: 0.20, education: 0.10, summary: 0.10 },
    keywords: ['tested', 'automated', 'validated', 'reported', 'identified', 'debugged', 'verified'],
  },
});

/**
 * Returns the role profile for the given role identifier.
 * Falls back to 'software-engineer' if the id is unknown.
 * @param {string} roleId - Slug-style role identifier.
 * @returns {Object} Role profile object.
 */
function getRoleProfile(roleId) {
  const normalised = (roleId || '').toLowerCase().replace(/\s+/g, '-');
  return ROLE_CATALOG[normalised] || ROLE_CATALOG['software-engineer'];
}

/**
 * Returns a list of all available role IDs and titles.
 * @returns {{ id: string, title: string }[]}
 */
function listRoles() {
  return Object.values(ROLE_CATALOG).map((r) => ({ id: r.id, title: r.title }));
}

module.exports = { ROLE_CATALOG, getRoleProfile, listRoles };
