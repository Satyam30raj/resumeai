import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function AcademicTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-gray-900 font-serif p-8 max-w-[210mm] mx-auto text-[12px] leading-relaxed shadow-sm">
      {/* Header */}
      <div className="text-center pb-3 mb-3 border-b border-black">
        <h1 className="text-2xl font-bold tracking-normal uppercase text-black">
          {personalInfo.fullName || 'Curriculum Vitae'}
        </h1>
        <div className="text-[11px] text-gray-700 mt-1 space-x-2">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Research / Academic Summary */}
      {summary && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            Research Interests & Summary
          </h2>
          <p className="text-gray-800 text-[11.5px] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Education (Primary in Academic CV) */}
      {education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between items-baseline mb-1">
              <div>
                <span className="font-bold text-black">{edu.degree} in {edu.field || edu.fieldOfStudy || 'Discipline'}</span>
                <span className="text-gray-800">, {edu.institution}</span>
                {edu.gpa && <span className="text-gray-600 block text-[10.5px]">GPA: {edu.gpa}</span>}
                {edu.description && <p className="text-[10.5px] text-gray-600 italic">{edu.description}</p>}
              </div>
              <span className="text-[11px] text-gray-600">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Academic Experience / Teaching / Industry */}
      {experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            Appointments & Experience
          </h2>
          <div className="space-y-2">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-black text-[11.5px]">
                    {exp.position}, <span className="font-normal italic">{exp.company}</span>
                  </span>
                  <span className="text-[10.5px] text-gray-600">
                    {exp.startDate} – {exp.current || exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-[11px] text-gray-700 mt-0.5">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-gray-700 mt-0.5 space-y-0.5">
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

      {/* Research Projects & Publications */}
      {projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            Research Projects & Working Papers
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-black text-[11.5px]">
                    "{proj.title}"
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="ml-1 text-blue-800 underline text-[10.5px] font-normal">
                        [DOI/URL]
                      </a>
                    )}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[10.5px] text-gray-600">
                      Methods: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-[11px] text-gray-700 mt-0.5">{proj.description}</p>}
                {proj.highlights && expBulletCleaner(proj.highlights).length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-gray-700 mt-0.5 space-y-0.5">
                    {expBulletCleaner(proj.highlights).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scholarly Skills */}
      {skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            Methodologies & Technical Competencies
          </h2>
          <div className="space-y-1 text-[11px]">
            {skills.map((group, idx) => {
              const catName = group.category || group.name || 'Competencies';
              const items = Array.isArray(group.items) ? group.items : group.skills || [];
              return (
                <div key={idx} className="flex">
                  <span className="font-bold text-black w-36">{catName}:</span>
                  <span className="text-gray-800 flex-1">{items.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Honors, Awards & Grants */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1.5">
            Fellowships, Grants & Honors
          </h2>
          <div className="space-y-1 text-[11px] text-gray-800">
            {achievements.map((ach, idx) => (
              <div key={ach._id || idx} className="flex justify-between">
                <span>
                  <strong>{ach.title}</strong>
                  {ach.issuer && <span>, {ach.issuer}</span>}
                  {ach.description && <span className="text-gray-600"> ({ach.description})</span>}
                </span>
                <span className="text-gray-600">{ach.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function expBulletCleaner(highlights) {
  return highlights.filter(Boolean);
}
