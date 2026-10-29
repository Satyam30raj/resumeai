/**
 * Utility helper to safely extract resume sections whether passed
 * as a nested `sections` object or as top-level fields.
 */
export function normalizeResumeData(data = {}) {
  const sections = data.sections || data;

  const personalInfo = sections.personalInfo || {};
  const summaryContent =
    typeof sections.summary === 'string'
      ? sections.summary
      : sections.summary?.content || '';

  const education = Array.isArray(sections.education) ? sections.education : [];
  const skills = Array.isArray(sections.skills) ? sections.skills : [];
  const experience = Array.isArray(sections.experience) ? sections.experience : [];
  const projects = Array.isArray(sections.projects) ? sections.projects : [];
  const achievements = Array.isArray(sections.achievements) ? sections.achievements : [];
  const imageUrl = data.imageUrl || personalInfo.imageUrl || '';

  return {
    personalInfo,
    summary: summaryContent,
    education,
    skills,
    experience,
    projects,
    achievements,
    imageUrl,
  };
}
