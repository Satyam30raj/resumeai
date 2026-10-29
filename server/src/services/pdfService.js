/**
 * @file services/pdfService.js
 * @description Renders a resume to PDF using Puppeteer.
 *
 * Flow: build an HTML string from resume data → launch headless Chromium →
 * render → return a Buffer containing the PDF bytes.
 */

const puppeteer = require('puppeteer');

/**
 * Generates a PDF buffer from resume data.
 *
 * @param {Object} resume - Full resume document (with `sections` and `templateId`).
 * @returns {Promise<Buffer>} PDF file buffer.
 */
async function generatePDF(resume) {
  const html = buildResumeHTML(resume);

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/* ──────────────────────────────────────────────────────────────────
 *  HTML Template Builder
 * ────────────────────────────────────────────────────────────────── */

/**
 * Builds a complete HTML document string from resume data.
 * Uses inline styles so the PDF renders correctly without external resources.
 *
 * @param {Object} resume - Resume document.
 * @returns {string} Full HTML string.
 */
function buildResumeHTML(resume) {
  const s = resume.sections || {};
  const pi = s.personalInfo || {};
  const templateColors = getTemplateColors(resume.templateId);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    /* ── Reset & Base ──────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #1a1a1a;
      background: #fff;
    }
    .container { max-width: 760px; margin: 0 auto; padding: 20px 0; }

    /* ── Header ────────────────────────────────────── */
    .header {
      text-align: center;
      padding-bottom: 14px;
      margin-bottom: 18px;
      border-bottom: 2px solid ${templateColors.accent};
    }
    .header h1 { font-size: 22pt; color: ${templateColors.primary}; margin-bottom: 4px; }
    .header .contact { font-size: 9pt; color: #555; }
    .header .contact span { margin: 0 6px; }

    /* ── Section ───────────────────────────────────── */
    .section { margin-bottom: 16px; }
    .section-title {
      font-size: 12pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${templateColors.primary};
      border-bottom: 1px solid ${templateColors.accent};
      padding-bottom: 3px;
      margin-bottom: 8px;
    }

    /* ── Experience / Education entries ─────────────── */
    .entry { margin-bottom: 10px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
    .entry-title { font-weight: 600; font-size: 10.5pt; }
    .entry-date { font-size: 9pt; color: #666; white-space: nowrap; }
    .entry-sub { font-style: italic; font-size: 9.5pt; color: #444; margin-bottom: 3px; }
    .entry-desc { font-size: 9.5pt; margin-bottom: 3px; }

    /* ── Lists ──────────────────────────────────────── */
    ul { padding-left: 18px; }
    ul li { font-size: 9.5pt; margin-bottom: 2px; }

    /* ── Skills ─────────────────────────────────────── */
    .skill-group { margin-bottom: 5px; }
    .skill-group strong { font-size: 9.5pt; }
    .skill-group span { font-size: 9.5pt; }

    /* ── Links ──────────────────────────────────────── */
    a { color: ${templateColors.primary}; text-decoration: none; }
  </style>
</head>
<body>
<div class="container">

  <!-- Header / Personal Info -->
  <div class="header">
    <h1>${escapeHtml(pi.fullName || 'Your Name')}</h1>
    <div class="contact">
      ${pi.email ? `<span>${escapeHtml(pi.email)}</span>` : ''}
      ${pi.phone ? `<span>| ${escapeHtml(pi.phone)}</span>` : ''}
      ${pi.location ? `<span>| ${escapeHtml(pi.location)}</span>` : ''}
      ${pi.linkedin ? `<span>| <a href="${escapeHtml(pi.linkedin)}">LinkedIn</a></span>` : ''}
      ${pi.github ? `<span>| <a href="${escapeHtml(pi.github)}">GitHub</a></span>` : ''}
      ${pi.portfolio ? `<span>| <a href="${escapeHtml(pi.portfolio)}">Portfolio</a></span>` : ''}
    </div>
  </div>

  ${renderSummary(s.summary)}
  ${renderExperience(s.experience)}
  ${renderProjects(s.projects)}
  ${renderSkills(s.skills)}
  ${renderEducation(s.education)}
  ${renderAchievements(s.achievements)}

</div>
</body>
</html>`;
}

/* ── Section renderers ─────────────────────────────────────────── */

/**
 * @param {{ content?: string }} summary
 * @returns {string}
 */
function renderSummary(summary) {
  if (!summary || !summary.content || !summary.content.trim()) return '';
  return `
  <div class="section">
    <div class="section-title">Summary</div>
    <p class="entry-desc">${escapeHtml(summary.content)}</p>
  </div>`;
}

/**
 * @param {Array} entries
 * @returns {string}
 */
function renderExperience(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return '';
  const items = entries.map((e) => {
    const dateRange = [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ');
    const highlights = Array.isArray(e.highlights) && e.highlights.length
      ? `<ul>${e.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
      : '';
    return `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${escapeHtml(e.position || '')}</span>
        <span class="entry-date">${escapeHtml(dateRange)}</span>
      </div>
      <div class="entry-sub">${escapeHtml(e.company || '')}</div>
      ${e.description ? `<p class="entry-desc">${escapeHtml(e.description)}</p>` : ''}
      ${highlights}
    </div>`;
  }).join('');

  return `
  <div class="section">
    <div class="section-title">Experience</div>
    ${items}
  </div>`;
}

/**
 * @param {Array} projects
 * @returns {string}
 */
function renderProjects(projects) {
  if (!Array.isArray(projects) || projects.length === 0) return '';
  const items = projects.map((p) => {
    const tech = Array.isArray(p.technologies) && p.technologies.length
      ? ` <em>(${p.technologies.map(escapeHtml).join(', ')})</em>`
      : '';
    const highlights = Array.isArray(p.highlights) && p.highlights.length
      ? `<ul>${p.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
      : '';
    return `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${escapeHtml(p.title || '')}${tech}</span>
        ${p.link ? `<span class="entry-date"><a href="${escapeHtml(p.link)}">Link</a></span>` : ''}
      </div>
      ${p.description ? `<p class="entry-desc">${escapeHtml(p.description)}</p>` : ''}
      ${highlights}
    </div>`;
  }).join('');

  return `
  <div class="section">
    <div class="section-title">Projects</div>
    ${items}
  </div>`;
}

/**
 * @param {Array} skills
 * @returns {string}
 */
function renderSkills(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return '';
  const groups = skills.map((s) => {
    const items = Array.isArray(s.items) ? s.items.map(escapeHtml).join(', ') : '';
    return `<div class="skill-group"><strong>${escapeHtml(s.category || 'General')}:</strong> <span>${items}</span></div>`;
  }).join('');

  return `
  <div class="section">
    <div class="section-title">Skills</div>
    ${groups}
  </div>`;
}

/**
 * @param {Array} entries
 * @returns {string}
 */
function renderEducation(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return '';
  const items = entries.map((e) => {
    const dateRange = [e.startDate, e.endDate].filter(Boolean).join(' – ');
    const degree = [e.degree, e.field].filter(Boolean).join(' in ');
    return `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${escapeHtml(e.institution || '')}</span>
        <span class="entry-date">${escapeHtml(dateRange)}</span>
      </div>
      <div class="entry-sub">${escapeHtml(degree)}${e.gpa ? ` — GPA: ${escapeHtml(e.gpa)}` : ''}</div>
      ${e.description ? `<p class="entry-desc">${escapeHtml(e.description)}</p>` : ''}
    </div>`;
  }).join('');

  return `
  <div class="section">
    <div class="section-title">Education</div>
    ${items}
  </div>`;
}

/**
 * @param {Array} achievements
 * @returns {string}
 */
function renderAchievements(achievements) {
  if (!Array.isArray(achievements) || achievements.length === 0) return '';
  const items = achievements.map((a) => {
    return `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${escapeHtml(a.title || '')}</span>
        <span class="entry-date">${escapeHtml(a.date || '')}</span>
      </div>
      ${a.issuer ? `<div class="entry-sub">${escapeHtml(a.issuer)}</div>` : ''}
      ${a.description ? `<p class="entry-desc">${escapeHtml(a.description)}</p>` : ''}
    </div>`;
  }).join('');

  return `
  <div class="section">
    <div class="section-title">Achievements</div>
    ${items}
  </div>`;
}

/* ── Helpers ───────────────────────────────────────────────────── */

/**
 * Returns colour tokens for a given template id.
 * @param {string} templateId
 * @returns {{ primary: string, accent: string }}
 */
function getTemplateColors(templateId) {
  const palettes = {
    classic: { primary: '#1a1a1a', accent: '#333' },
    modern: { primary: '#2563eb', accent: '#93c5fd' },
    minimal: { primary: '#374151', accent: '#d1d5db' },
    professional: { primary: '#0f172a', accent: '#475569' },
    creative: { primary: '#7c3aed', accent: '#c4b5fd' },
  };
  return palettes[templateId] || palettes.classic;
}

/**
 * Escapes HTML special characters to prevent XSS in the generated PDF.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { generatePDF };
