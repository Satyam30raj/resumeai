import React from 'react';
import { normalizeResumeData } from './templateUtils';

export default function ExecutiveTemplate({ data }) {
  const { personalInfo, summary, education, skills, experience, projects, achievements } =
    normalizeResumeData(data);

  return (
    <div className="bg-white text-stone-900 font-serif p-8 max-w-[210mm] mx-auto text-[13px] leading-relaxed shadow-sm">
      {/* Header */}
      <div className="text-center border-b border-amber-700/40 pb-4 mb-4">
        <h1 className="text-3xl font-normal tracking-wider text-stone-900 uppercase">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xs font-sans tracking-widest text-amber-800 uppercase mt-1">
          Executive Leadership Profile
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 text-xs font-sans text-stone-500 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-stone-700 underline">
              | LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-sans font-bold tracking-widest uppercase text-amber-900 border-b border-amber-200 pb-0.5 mb-2">
            Executive Summary
          </h2>
          <p className="text-stone-800 text-xs italic leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-sans font-bold tracking-widest uppercase text-amber-900 border-b border-amber-200 pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-stone-900 text-xs">
                    {exp.position} <span className="font-normal text-stone-600">— {exp.company}</span>
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    {exp.startDate} – {exp.current || exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-stone-700 mt-0.5">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-stone-700 mt-1 space-y-0.5 font-sans">
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

      {/* Projects / Strategic Initiatives */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-sans font-bold tracking-widest uppercase text-amber-900 border-b border-amber-200 pb-0.5 mb-2">
            Key Strategic Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-stone-900 text-xs">
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="ml-2 font-normal text-amber-800 underline text-[11px]">
                        Link
                      </a>
                    )}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-xs text-stone-500 italic">
                      {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-xs text-stone-700 mt-0.5">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-stone-700 mt-1 space-y-0.5 font-sans">
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

      {/* Core Expertise / Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-sans font-bold tracking-widest uppercase text-amber-900 border-b border-amber-200 pb-0.5 mb-2">
            Areas of Expertise
          </h2>
          <div className="space-y-1 text-xs font-sans">
            {skills.map((group, idx) => {
              const catName = group.category || group.name || 'Competencies';
              const items = Array.isArray(group.items) ? group.items : group.skills || [];
              return (
                <div key={idx} className="flex">
                  <span className="font-semibold text-stone-900 w-36">{catName}:</span>
                  <span className="text-stone-700 flex-1">{items.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-sans font-bold tracking-widest uppercase text-amber-900 border-b border-amber-200 pb-0.5 mb-2">
            Education & Credentials
          </h2>
          {education.map((edu, idx) => (
            <div key={edu._id || idx} className="flex justify-between items-baseline text-xs mb-1 font-sans">
              <div>
                <span className="font-bold text-stone-900">{edu.institution}</span>
                <span className="text-stone-700">, {edu.degree} {edu.field || edu.fieldOfStudy ? `in ${edu.field || edu.fieldOfStudy}` : ''}</span>
              </div>
              <span className="text-stone-400">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xs font-sans font-bold tracking-widest uppercase text-amber-900 border-b border-amber-200 pb-0.5 mb-2">
            Distinctions & Board Roles
          </h2>
          <div className="space-y-1 text-xs text-stone-700 font-sans">
            {achievements.map((ach, idx) => (
              <div key={ach._id || idx} className="flex justify-between">
                <span>{ach.title} {ach.issuer && `— ${ach.issuer}`}</span>
                <span className="text-stone-400">{ach.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
