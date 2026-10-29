import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function CreativeTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements, imageUrl } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-gray-800 font-sans p-8 max-w-[210mm] mx-auto text-[13px] leading-relaxed shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-teal-500 pb-4 mb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-x-3 text-xs text-teal-700 font-medium mt-1.5">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>✦ {personalInfo.phone}</span>}
            {personalInfo.location && <span>✦ {personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="underline">
                LinkedIn
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="underline">
                Portfolio
              </a>
            )}
          </div>
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
          />
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5 bg-teal-50/60 p-3 rounded-lg border-l-4 border-teal-500">
          <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2.5 flex items-center gap-1.5">
            <span className="text-teal-500">◆</span> Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx} className="relative pl-3 border-l-2 border-teal-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900 text-xs">
                    {exp.position} <span className="font-normal text-teal-700">· {exp.company}</span>
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2.5 flex items-center gap-1.5">
            <span className="text-teal-500">◆</span> Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx} className="pl-3 border-l-2 border-teal-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-teal-600 underline ml-2 font-normal text-[11px]">
                        Live Demo
                      </a>
                    )}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2.5 flex items-center gap-1.5">
            <span className="text-teal-500">◆</span> Skills
          </h2>
          <div className="space-y-2 text-xs">
            {skills.map((group, idx) => {
              const catName = group.category || group.name || 'Skills';
              const items = Array.isArray(group.items) ? group.items : group.skills || [];
              return (
                <div key={idx} className="flex items-baseline flex-wrap gap-1.5">
                  <span className="font-bold text-gray-800 mr-1 min-w-[90px]">{catName}:</span>
                  {items.map((skill, sIdx) => (
                    <span key={sIdx} className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[11px]">
                      {skill}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 flex items-center gap-1.5">
            <span className="text-teal-500">◆</span> Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between items-baseline text-xs mb-1">
              <div>
                <span className="font-bold text-gray-900">{edu.institution}</span>
                <span className="text-gray-600"> — {edu.degree} {edu.field || edu.fieldOfStudy ? `in ${edu.field || edu.fieldOfStudy}` : ''}</span>
              </div>
              <span className="text-gray-400 text-[11px]">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 flex items-center gap-1.5">
            <span className="text-teal-500">◆</span> Certifications & Awards
          </h2>
          <div className="space-y-1 text-xs text-gray-700">
            {achievements.map((ach, idx) => (
              <div key={ach._id || idx} className="flex justify-between">
                <span>{ach.title} {ach.issuer && `(${ach.issuer})`}</span>
                <span className="text-gray-400 text-[11px]">{ach.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
