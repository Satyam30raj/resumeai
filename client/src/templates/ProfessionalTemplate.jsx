import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function ProfessionalTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-gray-800 font-sans p-8 max-w-[210mm] mx-auto text-[13px] leading-relaxed shadow-sm">
      {/* Header with Dark Navy accent */}
      <div className="bg-slate-900 text-white p-5 rounded-md mb-5">
        <h1 className="text-2xl font-bold tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-gray-700 text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">
                    {exp.position} <span className="font-normal text-slate-700">| {exp.company}</span>
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {exp.startDate} – {exp.current || exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-gray-700 mt-0.5">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
                    {exp.highlights.filter(Boolean).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Key Initiatives & Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="ml-2 font-normal text-slate-600 underline text-[11px]">
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
                    {proj.highlights.filter(Boolean).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Competencies / Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Core Competencies
          </h2>
          <div className="space-y-1 text-xs">
            {skills.map((group, idx) => {
              const catName = group.category || group.name || 'Competencies';
              const items = Array.isArray(group.items) ? group.items : group.skills || [];
              return (
                <div key={idx} className="flex">
                  <span className="font-semibold text-gray-900 w-36">{catName}:</span>
                  <span className="text-gray-700 flex-1">{items.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between items-baseline text-xs mb-1">
              <div>
                <span className="font-bold text-gray-900">{edu.institution}</span>
                <span className="text-gray-700"> — {edu.degree} {edu.field || edu.fieldOfStudy ? `in ${edu.field || edu.fieldOfStudy}` : ''}</span>
                {edu.gpa && <span className="text-gray-500 block text-[11px]">GPA: {edu.gpa}</span>}
              </div>
              <span className="text-gray-500 font-medium">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Honors & Credentials
          </h2>
          <div className="space-y-1 text-xs text-gray-700">
            {achievements.map((ach, idx) => (
              <div key={ach._id || idx} className="flex justify-between">
                <span>
                  <strong>{ach.title}</strong>
                  {ach.issuer && <span>, {ach.issuer}</span>}
                  {ach.description && <span className="text-gray-600"> ({ach.description})</span>}
                </span>
                <span className="text-gray-500 text-[11px]">{ach.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
