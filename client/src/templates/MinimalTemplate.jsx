import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function MinimalTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-neutral-800 font-sans p-8 max-w-[210mm] mx-auto text-[12.5px] leading-relaxed shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-light tracking-wide text-neutral-900 uppercase">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-3 text-neutral-500 text-[11px] mt-1 tracking-wider uppercase">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>/ {personalInfo.phone}</span>}
          {personalInfo.location && <span>/ {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
              / LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
              / GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <p className="text-neutral-600 text-xs italic">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-2.5">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-neutral-900">
                    {exp.position} <span className="text-neutral-400 font-light">— {exp.company}</span>
                  </span>
                  <span className="text-neutral-400 text-[11px]">
                    {exp.startDate} – {exp.current || exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-[11.5px] text-neutral-600 mt-0.5">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="text-[11.5px] text-neutral-600 mt-1 space-y-0.5 pl-3 list-disc">
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
          <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-2.5">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-neutral-900">
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-neutral-500 underline ml-1.5 font-light">
                        view
                      </a>
                    )}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-neutral-400 text-[11px]">
                      {Array.isArray(proj.technologies) ? proj.technologies.join(' · ') : proj.technologies}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-[11.5px] text-neutral-600 mt-0.5">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="text-[11.5px] text-neutral-600 mt-1 space-y-0.5 pl-3 list-disc">
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
          <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-2">
            Skills
          </h2>
          <div className="space-y-1 text-xs">
            {skills.map((group, idx) => {
              const catName = group.category || group.name || 'Skills';
              const items = Array.isArray(group.items) ? group.items : group.skills || [];
              return (
                <div key={idx} className="flex gap-2">
                  <span className="text-neutral-500 min-w-[100px]">{catName}</span>
                  <span className="text-neutral-800">{items.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-2">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between text-xs mb-1">
              <div>
                <span className="font-medium text-neutral-900">{edu.institution}</span>
                <span className="text-neutral-600">, {edu.degree} {edu.field || edu.fieldOfStudy ? `in ${edu.field || edu.fieldOfStudy}` : ''}</span>
              </div>
              <span className="text-neutral-400 text-[11px]">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-2">
            Certifications & Honors
          </h2>
          <div className="space-y-1 text-xs text-neutral-600">
            {achievements.map((ach, idx) => (
              <div key={ach._id || idx} className="flex justify-between">
                <span>{ach.title} {ach.issuer && `— ${ach.issuer}`}</span>
                <span className="text-neutral-400 text-[11px]">{ach.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
