import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function TechnicalTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-gray-900 font-mono p-8 max-w-[210mm] mx-auto text-[12px] leading-relaxed shadow-sm">
      {/* Header */}
      <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
        <div className="text-xl font-bold text-gray-900">
          <span className="text-emerald-600">&gt; </span>
          {personalInfo.fullName || 'user@resumeai'}
        </div>
        <div className="flex flex-wrap gap-x-4 text-[11px] text-gray-600 mt-1">
          {personalInfo.email && <span>email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>tel: {personalInfo.phone}</span>}
          {personalInfo.location && <span>loc: {personalInfo.location}</span>}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
              gh: {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </a>
          )}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
              in: {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-800 mb-1">
            <span className="text-emerald-600">## </span>About
          </div>
          <p className="text-gray-700 text-[11.5px] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Technical Skills (Front and Center for Technical Roles) */}
      {skills.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-800 mb-1.5">
            <span className="text-emerald-600">## </span>Tech Stack & Skills
          </div>
          <div className="space-y-1">
            {skills.map((group, idx) => {
              const catName = group.category || group.name || 'skills';
              const items = Array.isArray(group.items) ? group.items : group.skills || [];
              return (
                <div key={idx} className="flex text-[11px]">
                  <span className="font-semibold text-gray-800 w-32">[{catName}]:</span>
                  <span className="text-gray-700 flex-1">{items.join(' | ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects (Crucial for Tech) */}
      {projects.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-800 mb-1.5">
            <span className="text-emerald-600">## </span>Open Source & Projects
          </div>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx} className="border-l-2 border-emerald-500 pl-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-gray-900">
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-emerald-600 underline ml-2 font-normal text-[11px]">
                        [repo]
                      </a>
                    )}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[10.5px] text-gray-500">
                      stack: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-[11px] text-gray-600 mt-0.5">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="text-[11px] text-gray-700 mt-0.5 space-y-0.5 pl-3 list-disc">
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

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-800 mb-1.5">
            <span className="text-emerald-600">## </span>Work Experience
          </div>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx} className="border-l-2 border-gray-300 pl-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-gray-900">
                    {exp.position} @ {exp.company}
                  </span>
                  <span className="text-[10.5px] text-gray-500">
                    {exp.startDate} - {exp.current || exp.isCurrent ? 'HEAD' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-[11px] text-gray-600 mt-0.5">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="text-[11px] text-gray-700 mt-0.5 space-y-0.5 pl-3 list-disc">
                    {expBulletCleaner(exp.highlights).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-800 mb-1.5">
            <span className="text-emerald-600">## </span>Education
          </div>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between text-[11px] mb-1">
              <div>
                <span className="font-bold text-gray-900">{edu.institution}</span>
                <span className="text-gray-700"> // {edu.degree} {edu.field || edu.fieldOfStudy ? `in ${edu.field || edu.fieldOfStudy}` : ''}</span>
              </div>
              <span className="text-gray-500">{edu.startDate}..{edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements / Certs */}
      {achievements.length > 0 && (
        <div>
          <div className="text-xs font-bold text-gray-800 mb-1">
            <span className="text-emerald-600">## </span>Certifications & Awards
          </div>
          <div className="space-y-0.5 text-[11px] text-gray-700">
            {achievements.map((ach, idx) => (
              <div key={ach._id || idx} className="flex justify-between">
                <span>* {ach.title} {ach.issuer && `[${ach.issuer}]`}</span>
                <span className="text-gray-400">{ach.date}</span>
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
