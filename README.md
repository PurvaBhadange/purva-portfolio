<div align="center">

# ✨ Purva Bhadange — Engineering Portfolio

### *AI / Machine Learning Engineer & Full-Stack Systems Builder*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebGL](https://img.shields.io/badge/WebGL-Interactive_3D-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)](https://purva-portfolio.vercel.app/)

<p align="center">
  <a href="https://github.com/PurvaBhadange/purva-portfolio"><strong>Explore Repository »</strong></a>
  &nbsp;•&nbsp;
  <a href="https://www.linkedin.com/in/purva-b-660982259/"><strong>LinkedIn Profile</strong></a>
  &nbsp;•&nbsp;
  <a href="mailto:purvabhadange06@gmail.com"><strong>Get in Touch</strong></a>
</p>

</div>

---

## • Overview

This repository powers the official personal portfolio and interactive engineering showcase for **Purva Manishrao Bhadange** — a 3rd-year B.Tech AI & ML student at PES Modern College of Engineering, Pune (CGPA: 9.31). 

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Motion**, and a custom **WebGL 3D dynamic physics engine**, this portfolio blends interactive creative computing with production-grade AI/ML and full-stack systems engineering.

### • Key Highlights
- **The Living Portrait**: A custom GPU-accelerated WebGL head simulation featuring 59 pixel-aligned facial captures, real-time directional pupil & gaze tracking, anatomical bone stiffness, elastic dough stretch physics, and idle gesture loops.
- **Production AI/ML Showcases**: Deep technical breakdowns, interactive architecture diagrams, live demos, and source links for multilingual RAG assistants, multi-agent research pipelines, and government procurement platforms.
- **Engineered for High Performance**: 60+ FPS animations, sub-70ms seamless crossfades, strict zero-folding untangle algorithms, and 100% responsive fluid typography.

---

## • The Living Portrait (Interactive 3D WebGL)

The hero section features a real-time, interactive living portrait that behaves like an authentic responsive digital presence rather than a static image.

```
                  ┌────────────────────────────────────────┐
                  │          Pointer / Touch Event         │
                  └───────────────────┬────────────────────┘
                                      │
                         [ Clamped Radial Falloff ]
                          (Active within ~300px)
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   ┌───────────────────────┐                       ┌─────────────────────┐
   │  Vertex Mesh Shader   │                       │   Fragment Shader   │
   ├───────────────────────┤                       ├─────────────────────┤
   │ • 32x32 Spring Grid   │                       │ • Directional Gaze  │
   │ • 1/240s Physics Step │                       │ • Cheek Pucker/Puff │
   │ • Row/Col Untangle    │                       │ • Rosy Cheek Blush  │
   │ • Anatomical Rigidity │                       │ • Directional Sheen │
   │ • Hair Wind Dynamics  │                       │ • Crossfade Mix     │
   └───────────────────────┘                       └─────────────────────┘
```

### Technical Specs & Features
- **Real-Time Cursor Eye Tracking**: In-shader procedural UV displacement follows the user's cursor across 16 gaze directions inside the active interaction radius with cosine-weighted falloff.
- **Physics Simulation (1/240s)**: A damped wave equation runs on a 32×32 vertex grid with fixed sub-stepping to guarantee stability and prevent triangular folding or spikes regardless of monitor refresh rate.
- **Natural Likeness Preservation**: Anatomical bone stiffness weights keep the nose bridge and eye sockets structurally intact while allowing cheeks and hair to stretch and rebound elastically.
- **Idle Acts & Gestures**:
  - **Interaction**: Gentle hover nods, click-and-drag dough elasticity, and tap-triggered winks and sneezes.
  - **Idle Engine**: 360° eye rolls, subtle breathing cycles, natural blinking (every 2.2–5.6s), and sleepy yawns after visitor inactivity.

---

## • Featured Engineering Projects

| # | Project | Category | Core Stack | Live Demo |
|---|---|---|---|:---:|
| **01** | **[EchoSeek](https://echo-seek-voice-assistant.vercel.app/)** | Voice-Enabled Multilingual RAG | `FastAPI` `React` `Sarvam AI` `Gemini` `FAISS` `Multilingual E5` | [Explore ↗](https://echo-seek-voice-assistant.vercel.app/) |
| **02** | **[SANKALP](https://sankalp-jade-zeta.vercel.app/)** | Government Procurement Platform | `Next.js` `TypeScript` `FastAPI` `PostgreSQL` `Docker` `RBAC` | [Explore ↗](https://sankalp-jade-zeta.vercel.app/) |
| **03** | **[ResearchMind](https://multi-agent-research-system-using-python.streamlit.app/)** | Multi-Agent Research System | `Python` `LangChain` `Mistral AI` `Tavily` `Streamlit` | [Explore ↗](https://multi-agent-research-system-using-python.streamlit.app/) |
| **04** | **[Revamp AI](https://revamp-ai-ac5n-4hgdur7bs-purvabhadanges-projects.vercel.app)** | Cybersecurity Intelligence Platform | `LangGraph` `LangChain` `Qdrant` `Ollama` `Celery` `Redis` | [Explore ↗](https://revamp-ai-ac5n-4hgdur7bs-purvabhadanges-projects.vercel.app) |
| **05** | **SYNQ** *(In Progress)* | Multi-Agent Orchestration & Memory | `Next.js` `FastAPI` `FalkorDB` `WebSockets` `Bedrock` `Docker` | *Building* |

<details>
<summary><strong>🔍 Click to expand in-depth architectural details for each project</strong></summary>

<br />

### 01 · EchoSeek — Multilingual Voice RAG
- **Architecture**: Streams microphone audio to FastAPI $\rightarrow$ Sarvam AI STT & language detection $\rightarrow$ Dense semantic retrieval with FAISS over MSMARCO-XI $\rightarrow$ Grounded synthesis via Google Gemini with citation provenance.
- **Capabilities**: Full code-switching support between English and Indic languages, low-latency audio streaming, and factual hallucination guardrails.

### 02 · SANKALP — Innovation-Procurement Engine
- **Architecture**: Multi-tenant Next.js portal backed by FastAPI and PostgreSQL with containerized Docker deployment.
- **Capabilities**: 4-role RBAC (Government Officers, Startups, Domain Experts, Admins), milestone-based pilot verification, and immutable audit logging.

### 03 · ResearchMind — 4-Agent Autonomous Research Graph
- **Architecture**: LangChain state graph orchestrating 4 specialized agents:
  1. *Search Agent*: Web discovery via Tavily API.
  2. *Reader Agent*: Clean HTML parsing & noise reduction with BeautifulSoup.
  3. *Writer Agent*: Structured technical drafting via Mistral AI.
  4. *Critic Agent*: Iterative claim verification and automated fact-checking loop.
- **UI**: Streamlit dashboard with real-time token/node status and Markdown report export.

### 04 · Revamp AI — Multimodal Cybersecurity Content Engine
- **Architecture**: Ingests multimodal PDFs, audio, video, and URLs into a canonical Intermediate Context Object (ICO), indexed in Qdrant with Sentence Transformers over MITRE ATT&CK & NIST.
- **Capabilities**: Asynchronous processing queue with Celery & Redis, preventing hallucination through strict ICO schema verification.

</details>

---

## • Tech Stack & Tooling

```
Frontend Architecture       Backend & APIs              AI / ML & Data
├── React 19                ├── Node.js / Express       ├── LangChain & LangGraph
├── TypeScript              ├── Python 3.11+            ├── Google Gemini API
├── Tailwind CSS v4         ├── FastAPI                 ├── FAISS & Qdrant Vector DBs
├── Motion (Framer)         ├── RESTful API Design      ├── Sentence Transformers
└── WebGL (Custom Shaders)  └── WebSockets & Celery     └── Scikit-Learn, Pandas, NumPy
```

---

## • Project Structure

```text
purva-portfolio/
├── public/                 # Static assets, fallback media & web manifests
│   └── _redirects          # SPA client-side routing rules (Netlify/Cloudflare)
├── src/
│   ├── assets/             # Photography captures, 3D face textures & icons
│   ├── components/         # Modular React components
│   │   ├── HeroSection.tsx # Hero stage with WebGL living portrait integration
│   │   ├── ProjectsSection.tsx # Filterable portfolio grid & architecture views
│   │   ├── AboutSection.tsx    # Academic journey, statistics & experience
│   │   ├── ServicesSection.tsx # Capabilities & engineering offerings
│   │   ├── Modals.tsx          # Interactive project modals & PDF resume viewer
│   │   └── Navbar.tsx          # Dynamic responsive navigation bar
│   ├── App.tsx             # Main application orchestrator
│   ├── index.css           # Tailwind CSS v4 styling & typography rules
│   └── main.tsx            # Application entrypoint
├── index.html              # Custom WebGL living portrait engine & shaders
├── server.ts               # Express development server with /api/contact endpoint
├── vercel.json             # Vercel SPA rewrite & build configuration
├── vite.config.ts          # Vite 8 bundler configuration
└── package.json            # Project dependencies and script declarations
```

---

## • Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (`v18.0.0` or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/PurvaBhadange/purva-portfolio.git
cd purva-portfolio

# Install dependencies cleanly
npm install
```

### 2. Environment Variables *(Optional)*
Create a `.env` file in the project root if you want to test the contact form delivery or Gemini features:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
# or
WEB3FORMS_ACCESS_KEY=your_web3forms_key_here
```

### 3. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to explore the portfolio live with hot module replacement (HMR).

### 4. Build for Production
```bash
npm run build
```
The compiled, minified bundle will be output to the `dist/` directory.

---

## 🚢 Deployment Guide

This project supports both **Static Single-Page Application (SPA)** hosting and **Full-Stack Node.js** hosting.

### Option A: Vercel / Netlify / Cloudflare Pages *(Recommended)*
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- *Note:* SPA rewrites are already configured out of the box in `vercel.json` and `public/_redirects`.

### Option B: Node.js / Docker Server
- Run `npm start` to execute the production server via `tsx server.ts`.

---

## • Contact & Connect

- **Name**: Purva Manishrao Bhadange
- **Location**: Pune, Maharashtra, India
- **Email**: [purvabhadange06@gmail.com](mailto:purvabhadange06@gmail.com)
- **LinkedIn**: [linkedin.com/in/purva-b-660982259](https://www.linkedin.com/in/purva-b-660982259/)
- **GitHub**: [github.com/PurvaBhadange](https://github.com/PurvaBhadange)
- **LeetCode**: [200+ Problems Solved](https://leetcode.com/)

---

<div align="center">
  <sub>Designed & engineered with ❤️ by <strong>Purva Bhadange</strong>. Released under the <a href="LICENSE">MIT License</a>.</sub>
</div>
