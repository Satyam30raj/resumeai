import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function ClassicTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-gray-900 font-serif p-8 max-w-[210mm] mx-auto text-[13px] leading-relaxed shadow-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-wide uppercase text-gray-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 text-xs text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <span>• <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="underline">LinkedIn</a></span>
          )}
          {personalInfo.github && (
            <span>• <a href={personalInfo.github} target="_blank" rel="noreferrer" className="underline">GitHub</a></span>
          )}
          {personalInfo.portfolio && (
            <span>• <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="underline">Portfolio</a></span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Work Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp._id || idx} className="mb-3">
              <div className="flex justify-between items-baseline font-semibold text-gray-800">
                <span>{exp.position || 'Position'} — <span className="font-normal italic">{exp.company || 'Company'}</span></span>
                <span className="text-xs text-gray-500">
                  {exp.startDate} - {exp.current || exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && <p className="text-gray-700 text-xs mt-0.5">{exp.description}</p>}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
                  {exp.highlights.filter(Boolean).map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Key Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj._id || idx} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-800">
                  {proj.title || 'Project Title'}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-700 ml-2 font-normal underline">
                      Link
                    </a>
                  )}
                </span>
                {proj.technologies && proj.technologies.length > 0 && (
                  <span className="text-xs text-gray-500 italic">
                    {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                  </span>
                )}
              </div>
              {proj.description && <p className="text-xs text-gray-700 mt-0.5">{proj.description}</p>}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
                  {proj.highlights.filter(Boolean).map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between items-baseline mb-2">
              <div>
                <span className="font-semibold text-gray-800">{edu.institution || 'University'}</span>
                <span className="text-gray-700">, {edu.degree || 'Degree'} {edu.field || edu.fieldOfStudy ? `in ${edu.field || edu.fieldOfStudy}` : ''}</span>
                {edu.gpa && <span className="text-xs text-gray-600 block">GPA: {edu.gpa}</span>}
              </div>
              <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Technical & Professional Skills
          </h2>
          <div className="space-y-1 text-xs">
            {skills.map((skillGroup, idx) => {
              const catName = skillGroup.category || skillGroup.name || 'Skills';
              const items = Array.isArray(skillGroup.items)
                ? skillGroup.items
                : Array.isArray(skillGroup.skills)
                ? skillGroup.skills
                : [];
              return (
                <div key={idx} className="flex gap-2">
                  <span className="font-semibold text-gray-800 min-w-[120px]">{catName}:</span>
                  <span className="text-gray-700">{items.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Achievements & Certifications
          </h2>
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
            {achievements.map((ach, idx) => (
              <li key={ach._id || idx}>
                <span className="font-semibold">{ach.title}</span>
                {ach.issuer && <span> — {ach.issuer}</span>}
                {ach.date && <span className="text-gray-500"> ({ach.date})</span>}
                {ach.description && <span className="text-gray-600">: {ach.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
