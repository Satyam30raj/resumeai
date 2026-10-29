import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function ModernTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements, imageUrl } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-gray-800 font-sans p-8 max-w-[210mm] mx-auto text-[13px] leading-relaxed shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-blue-600 pb-5 mb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-medium text-blue-600 mt-0.5">
            {experience[0]?.position || 'Professional'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                GitHub
              </a>
            )}
          </div>
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-sm"></span> About Me
          </h2>
          <p className="text-gray-600 text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-sm"></span> Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx} className="border-l-2 border-gray-100 pl-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900 text-xs">
                    {exp.position} <span className="text-blue-600 font-normal">@ {exp.company}</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {exp.startDate} – {exp.current || exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-gray-600 mt-0.5">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-1 space-y-0.5">
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
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-sm"></span> Featured Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx} className="border-l-2 border-gray-100 pl-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900 text-xs">
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 underline font-normal text-[11px]">
                        Demo
                      </a>
                    )}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[11px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                      {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-1 space-y-0.5">
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

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-sm"></span> Skills & Expertise
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {skills.map((group, idx) => {
              const catName = group.category || group.name || 'Category';
              const items = Array.isArray(group.items) ? group.items : group.skills || [];
              return (
                <div key={idx} className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold text-gray-800 block mb-0.5">{catName}</span>
                  <span className="text-gray-600">{items.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-sm"></span> Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between items-baseline text-xs mb-1.5">
              <div>
                <span className="font-semibold text-gray-900">{edu.institution}</span>
                <span className="text-gray-600"> — {edu.degree} {edu.field || edu.fieldOfStudy ? `in ${edu.field || edu.fieldOfStudy}` : ''}</span>
                {edu.gpa && <span className="text-gray-500 block text-[11px]">GPA: {edu.gpa}</span>}
              </div>
              <span className="text-gray-400 text-[11px]">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-sm"></span> Certifications & Honors
          </h2>
          <div className="space-y-1 text-xs text-gray-600">
            {achievements.map((ach, idx) => (
              <div key={ach._id || idx} className="flex justify-between">
                <span>
                  <strong className="text-gray-800">{ach.title}</strong>
                  {ach.issuer && <span> • {ach.issuer}</span>}
                  {ach.description && <span className="text-gray-500"> ({ach.description})</span>}
                </span>
                {ach.date && <span className="text-gray-400 text-[11px]">{ach.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
