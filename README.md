# ResumeAI — AI-Powered Resume Builder & Analyzer

A full-stack web application that lets users build resumes through a guided form with live preview, then get AI-powered analysis against a chosen job role with scoring, skill gap identification, and actionable improvement suggestions.

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, Zustand, React Router
- **Backend:** Node.js, Express.js, Mongoose, JWT
- **Database:** MongoDB
- **AI:** Google Gemini API
- **Media:** ImageKit
- **PDF Export:** Puppeteer (server-side)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key
- ImageKit account (optional, for profile images)

### 1. Clone and install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment

```bash
# Copy and edit the env files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Run development servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

### 4. Open in browser
Visit `http://localhost:5173`

## Features

- ✅ Guided resume builder with 7 sections
- ✅ Live preview as you type
- ✅ 8 ATS-friendly templates (Classic, Modern, Minimal, Professional, Creative, Executive, Technical, Academic)
- ✅ AI analysis with role-fit scoring (0-100)
- ✅ Skill gap identification and 5+ actionable suggestions
- ✅ Edit → Re-analyze loop with score comparison
- ✅ PDF export with selectable text
- ✅ User authentication (JWT)
- ✅ Dashboard with resume management
- ✅ Analysis history per resume

## Project Structure

```
resumeai/
├── client/          # React frontend (Vite)
├── server/          # Express backend
└── README.md
```

## License

MIT
