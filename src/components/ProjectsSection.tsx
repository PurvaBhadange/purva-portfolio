import React, { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { LiveProjectButton } from './LiveProjectButton';

export type ProjectFilterCategory = 'All' | 'AI/ML' | 'Full-Stack' | 'Personal';

export interface ArchitectureStage {
  layer: string;
  title: string;
  components: string[];
  connectionLabel?: string;
}

export interface TechGroup {
  group: string;
  items: string[];
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface ProjectItem {
  number: string;
  name: string;
  category: string;
  filterCategories: Exclude<ProjectFilterCategory, 'All'>[];
  summary: string;
  highlights: string[];
  deliverables: string[];
  architectureSummary: string;
  architectureStages: ArchitectureStage[];
  architectureLoopNote?: string;
  technicalSpecs: TechnicalSpec[];
  techStackGroups: TechGroup[];
  status?: string;
  liveUrl?: string;
  col1Images: [string, string];
  col2Image: string;
}

const FILTER_OPTIONS: ProjectFilterCategory[] = [
  'All',
  'AI/ML',
  'Full-Stack',
  'Personal',
];

export const PROJECTS: ProjectItem[] = [
  {
    number: '01',
    name: 'EchoSeek',
    category: 'Voice-Enabled Multilingual RAG Assistant',
    filterCategories: ['AI/ML', 'Personal'],
    summary:
      'Modular FastAPI + React voice assistant enabling spoken queries in English and Indic languages (including code-switched input), backed by multilingual E5 embeddings, FAISS over MSMARCO-XI, and Gemini generation.',
    highlights: [
      'Enabled spoken queries in English and Indic languages including code-switched input via Sarvam AI.',
      'Built semantic retrieval using multilingual E5 embeddings and FAISS vector search over MSMARCO-XI.',
      'Implemented grounding guardrails and source provenance to reduce unsupported answers and preserve traceability.',
    ],
    deliverables: [
      'Python',
      'FastAPI',
      'React',
      'Sarvam AI',
      'Gemini',
      'FAISS',
      'Hugging Face',
    ],
    architectureSummary:
      'Voice audio streams from the React client into FastAPI, passes through Sarvam AI speech transcription and language detection, retrieves dense multilingual passages from FAISS over MSMARCO-XI, and synthesizes cited responses with Gemini.',
    architectureStages: [
      {
        layer: '01 · Client Layer',
        title: 'React Voice Interface',
        components: ['Web Audio Mic Capture', 'Language Selector', 'Citation Drawer'],
        connectionLabel: 'Audio / Text Request',
      },
      {
        layer: '02 · Speech & API',
        title: 'FastAPI + Sarvam AI',
        components: ['Sarvam STT / TTS', 'Code-Switch Normalization', 'Query Router'],
        connectionLabel: 'Normalized Multilingual Query',
      },
      {
        layer: '03 · Dense Retrieval',
        title: 'Multilingual E5 + FAISS',
        components: ['E5 Dense Embeddings', 'MSMARCO-XI Index', 'Top-K Passage Scoring'],
        connectionLabel: 'Grounded Context Chunks',
      },
      {
        layer: '04 · Generation',
        title: 'Gemini + Guardrails',
        components: ['Context-Bound Prompting', 'Source Provenance', 'Traceable Response'],
      },
    ],
    architectureLoopNote:
      'Provenance verification checks every claim against retrieved MSMARCO-XI chunk IDs before audio/text delivery.',
    technicalSpecs: [
      { label: 'Retrieval Engine', value: 'FAISS Flat/IVF + Multilingual-E5' },
      { label: 'Corpus', value: 'MSMARCO-XI Multilingual Passages' },
      { label: 'Speech Pipeline', value: 'Sarvam AI (EN + Indic + Code-Switched)' },
      { label: 'Safety', value: 'Grounding guardrails & source citations' },
    ],
    techStackGroups: [
      { group: 'Frontend', items: ['React', 'JavaScript / TypeScript', 'Tailwind CSS'] },
      { group: 'Backend & API', items: ['Python', 'FastAPI', 'REST / Audio Streaming'] },
      {
        group: 'AI / ML & Vector Search',
        items: ['Sarvam AI', 'Google Gemini', 'Multilingual E5', 'FAISS', 'Hugging Face'],
      },
      { group: 'Dataset & Deployment', items: ['MSMARCO-XI', 'Vercel'] },
    ],
    liveUrl: 'https://echo-seek-voice-assistant.vercel.app/',
    col1Images: [
      '/assets/aistudio/image_539b420b.png',
      '/assets/aistudio/image_e645bebf.png',
    ],
    col2Image: '/assets/aistudio/image_4146547a.png',
  },
  {
    number: '02',
    name: 'SANKALP',
    category: 'Government Innovation-Procurement Platform',
    filterCategories: ['Full-Stack'],
    summary:
      'Startup-friendly government procurement prototype connecting public challenges with startups, domain experts, and end-to-end pilot-to-procurement workflows.',
    highlights: [
      'Engineered role-based workflows for Government Officers, Startups, Experts, and Admins.',
      'Implemented end-to-end pilot-to-procurement milestone tracking and evaluation decision management.',
      'Built traceable audit and transparency mechanisms with AI-assisted evaluation support.',
    ],
    deliverables: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Docker'],
    architectureSummary:
      'A multi-role Next.js portal authenticates Officers, Startups, Domain Experts, and Admins against a FastAPI state engine backed by PostgreSQL, tracking every procurement milestone and evaluation log.',
    architectureStages: [
      {
        layer: '01 · Role Portals',
        title: 'Next.js Multi-Tenant UI',
        components: ['Gov Officer Console', 'Startup Portal', 'Expert Review View'],
        connectionLabel: 'Role-Scoped HTTPS / JSON',
      },
      {
        layer: '02 · Application API',
        title: 'FastAPI Service & RBAC',
        components: ['JWT / Role Guards', 'Challenge Publishing', 'Milestone State Machine'],
        connectionLabel: 'Validated State Transitions',
      },
      {
        layer: '03 · Decision Layer',
        title: 'Evaluation & Audit Engine',
        components: ['AI Evaluation Briefs', 'Weighted Rubrics', 'Immutable Audit Trail'],
        connectionLabel: 'ORM Transactions',
      },
      {
        layer: '04 · Persistence',
        title: 'PostgreSQL + Docker',
        components: ['SQLAlchemy Models', 'Relational Schemas', 'Containerized Runtime'],
      },
    ],
    architectureLoopNote:
      'Pilot milestones emit immutable audit events feeding officer approval gates before full-scale procurement release.',
    technicalSpecs: [
      { label: 'Access Control', value: '4-Role RBAC (Officer, Startup, Expert, Admin)' },
      { label: 'Workflow Model', value: 'Challenge -> Pilot -> Milestone -> Procurement' },
      { label: 'Database Layer', value: 'PostgreSQL + SQLAlchemy ORM' },
      { label: 'Infrastructure', value: 'Docker containers + Vercel frontend' },
    ],
    techStackGroups: [
      { group: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
      { group: 'Backend & ORM', items: ['Python', 'FastAPI', 'SQLAlchemy'] },
      { group: 'Database & Infra', items: ['PostgreSQL', 'Docker', 'Vercel'] },
    ],
    liveUrl: 'https://sankalp-jade-zeta.vercel.app/',
    col1Images: [
      '/assets/aistudio/image_4fcf5afa.png',
      '/assets/aistudio/image_53891d41.png',
    ],
    col2Image: '/assets/aistudio/image_a739d1c4.png',
  },
  {
    number: '03',
    name: 'ResearchMind',
    category: 'Multi-Agent Research System',
    filterCategories: ['AI/ML', 'Personal'],
    summary:
      '4-agent research pipeline comprising Search, Reader, Writer, and Critic agents to automate structured web research, fact-checking, and report generation.',
    highlights: [
      'Designed a 4-agent pipeline (Search, Reader, Writer, Critic) using LangChain and Mistral AI.',
      'Integrated Tavily search and BeautifulSoup to gather and extract structured web research.',
      'Deployed on Streamlit with live pipeline status visualization and Markdown export for reports and critic feedback.',
    ],
    deliverables: [
      'Python',
      'LangChain',
      'Mistral AI',
      'Tavily',
      'BeautifulSoup',
      'Streamlit',
    ],
    architectureSummary:
      'User prompts trigger an orchestrated LangChain state graph where Search gathers URLs via Tavily, Reader cleans web text via BeautifulSoup, Writer drafts structured sections, and Critic verifies claims iteratively.',
    architectureStages: [
      {
        layer: '01 · Control UI',
        title: 'Streamlit Dashboard',
        components: ['Topic & Depth Controls', 'Live Agent Status', 'Markdown Exporter'],
        connectionLabel: 'Research Directive',
      },
      {
        layer: '02 · Discovery',
        title: 'Search & Reader Agents',
        components: ['Tavily Web Search', 'BeautifulSoup Parser', 'Source Denoising'],
        connectionLabel: 'Cleaned Evidence Corpus',
      },
      {
        layer: '03 · Synthesis',
        title: 'Writer Agent (Mistral AI)',
        components: ['Section Outlining', 'Evidence Grounding', 'Draft Generation'],
        connectionLabel: 'Candidate Report Draft',
      },
      {
        layer: '04 · Verification',
        title: 'Critic Agent Loop',
        components: ['Claim Fact-Checking', 'Gap Detection', 'Quality Score & Revisions'],
      },
    ],
    architectureLoopNote:
      'Critic agent returns structured revision notes back to the Writer or Search agent until factual completeness passes.',
    technicalSpecs: [
      { label: 'Agent Pattern', value: '4-Agent Sequential + Iterative Critic Loop' },
      { label: 'Foundation Model', value: 'Mistral AI via LangChain' },
      { label: 'Web Acquisition', value: 'Tavily Search API + BeautifulSoup4' },
      { label: 'Output Format', value: 'Streaming status + Downloadable Markdown' },
    ],
    techStackGroups: [
      { group: 'Orchestration & LLM', items: ['Python', 'LangChain', 'Mistral AI'] },
      { group: 'Web Scraping & Search', items: ['Tavily API', 'BeautifulSoup', 'Requests'] },
      { group: 'UI & Deployment', items: ['Streamlit', 'Markdown Export'] },
    ],
    liveUrl: 'https://multi-agent-research-system-using-python.streamlit.app/',
    col1Images: [
      '/assets/aistudio/image_2d98fbb2.png',
      '/assets/aistudio/image_665fc2dd.png',
    ],
    col2Image: '/assets/aistudio/image_e7adb2ee.png',
  },
  {
    number: '04',
    name: 'Revamp AI',
    category: 'Cybersecurity Intelligence & Content Transformation',
    filterCategories: ['AI/ML', 'Full-Stack'],
    summary:
      'Multimodal agentic AI platform solving fragmented cybersecurity intelligence by transforming unstructured PDFs, images, audio, video, URLs, and raw text into consistent, audience-specific artifacts without hallucinations.',
    highlights: [
      'Centralized extracted threats, Indicators of Compromise (IoCs), and insights into an Intermediate Context Object (ICO) for cross-format consistency.',
      'Orchestrated specialized LangGraph and LangChain agents to generate executive summaries, security advisories, awareness campaigns, slide decks, infographics, and audio/video scripts.',
      'Grounded outputs via Qdrant and Sentence Transformers RAG over MITRE ATT&CK and NIST, cross-checking artifacts against the ICO to curb hallucinations.',
    ],
    deliverables: [
      'Python',
      'FastAPI',
      'React',
      'TypeScript',
      'LangGraph',
      'LangChain',
      'Qdrant',
      'Sentence Transformers',
      'PostgreSQL',
      'Redis',
      'Celery',
      'Ollama',
    ],
    architectureSummary:
      'Unstructured documents, media, and URLs are ingested asynchronously via Celery workers into a canonical Intermediate Context Object (ICO), enriched via Qdrant RAG over MITRE ATT&CK & NIST, and transformed by LangGraph agents.',
    architectureStages: [
      {
        layer: '01 · Ingestion Queue',
        title: 'Multimodal Extractors',
        components: ['PDF / DOCX / URLs', 'Audio / Video / Images', 'Celery + Redis Workers'],
        connectionLabel: 'Extracted Entities & IoCs',
      },
      {
        layer: '02 · Canonical State',
        title: 'Intermediate Context (ICO)',
        components: ['Structured Threat Schema', 'IoC Normalization', 'PostgreSQL Store'],
        connectionLabel: 'Single Source of Truth',
      },
      {
        layer: '03 · Domain RAG',
        title: 'Qdrant + Embeddings',
        components: ['Sentence Transformers', 'MITRE ATT&CK Vectors', 'NIST Frameworks'],
        connectionLabel: 'Grounded Context',
      },
      {
        layer: '04 · Agent Studio',
        title: 'LangGraph + Ollama',
        components: ['Advisories & Briefs', 'Decks & Infographics', 'ICO Cross-Check Gate'],
      },
    ],
    architectureLoopNote:
      'Every generated artifact is validated back against the Intermediate Context Object (ICO) to prevent cross-format drift.',
    technicalSpecs: [
      { label: 'Core Pattern', value: 'Canonical Intermediate Context Object (ICO)' },
      { label: 'Agent Runtime', value: 'LangGraph State Machines + LangChain + Ollama' },
      { label: 'Vector Grounding', value: 'Qdrant + Sentence Transformers (MITRE / NIST)' },
      { label: 'Async Infra', value: 'FastAPI + Celery + Redis + PostgreSQL' },
    ],
    techStackGroups: [
      { group: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS'] },
      { group: 'Backend & Async Workers', items: ['Python', 'FastAPI', 'Celery', 'Redis'] },
      {
        group: 'Agentic AI & RAG',
        items: [
          'LangGraph',
          'LangChain',
          'Ollama',
          'Qdrant',
          'Sentence Transformers',
        ],
      },
      { group: 'Database & Domain KB', items: ['PostgreSQL', 'MITRE ATT&CK', 'NIST'] },
    ],
    liveUrl: 'https://revamp-ai-ac5n-4hgdur7bs-purvabhadanges-projects.vercel.app',
    col1Images: [
      '/assets/aistudio/image_d29e1f94.png',
      '/assets/aistudio/image_cc28faa3.png',
    ],
    col2Image: '/assets/aistudio/image_ab4653bb.png',
  },
  {
    number: '05',
    name: 'SYNQ',
    status: 'In Progress',
    category: 'Multi-Agent AI Orchestration Platform',
    filterCategories: ['AI/ML', 'Full-Stack', 'Personal'],
    summary:
      'In-progress multi-agent AI orchestration platform coordinating local and cloud models through a unified workspace with persistent FalkorDB project memory, eliminating context loss and manual handoffs.',
    highlights: [
      'Decomposes objectives into dependency-aware Directed Acyclic Graphs (DAGs) with deterministic capability-based model routing across Ollama, Gemini, and AWS Bedrock with automatic fallback and cooldowns.',
      'Persists project context, task executions, artifacts, and architectural decisions in a FalkorDB memory graph with interactive relationship visualization.',
      'Streams real-time agent execution and token progress over WebSockets with human-in-the-loop approval checkpoints.',
    ],
    deliverables: [
      'Python',
      'FastAPI',
      'Next.js',
      'TypeScript',
      'FalkorDB',
      'Ollama',
      'Gemini',
      'AWS Bedrock',
      'SQLite',
      'Docker',
    ],
    architectureSummary:
      'An AI planner decomposes high-level goals into a dependency DAG executed by a deterministic router across local and cloud models, streaming events over WebSockets while persisting project memory in FalkorDB.',
    architectureStages: [
      {
        layer: '01 · Workspace',
        title: 'Next.js Live Console',
        components: ['WebSocket Stream', 'DAG Execution View', 'Human Approval Gates'],
        connectionLabel: 'Project Objective & Approvals',
      },
      {
        layer: '02 · Planner & Router',
        title: 'FastAPI DAG Engine',
        components: ['Objective -> DAG Planner', 'Capability Router', 'Rate-Limit Cooldowns'],
        connectionLabel: 'Provider Dispatch',
      },
      {
        layer: '03 · Hybrid Model Mesh',
        title: 'Local + Cloud Providers',
        components: ['Ollama (Local)', 'Google Gemini', 'AWS Bedrock + Auto-Fallback'],
        connectionLabel: 'Artifacts & Decisions',
      },
      {
        layer: '04 · Memory Graph',
        title: 'FalkorDB + SQLite',
        components: ['Entity & Decision Graph', 'Execution Checkpoints', 'Cross-Task Retrieval'],
      },
    ],
    architectureLoopNote:
      'Completed DAG nodes write entities and decisions into FalkorDB so downstream tasks query shared memory automatically.',
    technicalSpecs: [
      { label: 'Execution Model', value: 'Dependency-Aware DAG + HITL Checkpoints' },
      { label: 'Model Mesh', value: 'Ollama + Gemini + AWS Bedrock (Auto-Fallback)' },
      { label: 'Graph Memory', value: 'FalkorDB Persistent Knowledge Graph' },
      { label: 'Realtime & Storage', value: 'FastAPI WebSockets + SQLite + Docker' },
    ],
    techStackGroups: [
      { group: 'Frontend', items: ['Next.js', 'TypeScript', 'WebSockets UI', 'Graph Explorer'] },
      { group: 'Backend & Orchestration', items: ['Python', 'FastAPI', 'DAG Scheduler'] },
      { group: 'LLM Providers', items: ['Ollama', 'Google Gemini', 'AWS Bedrock'] },
      { group: 'Memory & Infra', items: ['FalkorDB', 'SQLite', 'Docker', 'Vercel'] },
    ],
    liveUrl: 'https://synq-sand.vercel.app/',
    col1Images: [
      '/assets/aistudio/image_df29f744.png',
      '/assets/aistudio/image_27da4f37.png',
    ],
    col2Image: '/assets/aistudio/image_cf217e24.png',
  },
];

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
  onSelectProject: (project: ProjectItem) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
  progress,
  onSelectProject,
}) => {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const start = index * (1 / totalCards);
  const scale = useTransform(progress, [start, 1], [1, targetScale]);

  return (
    <div className="min-h-[85vh] md:h-[85vh]">
      <motion.article
        style={{
          scale,
          transformOrigin: 'top center',
          ['--stack-offset' as string]: `${index * 24}px`,
        }}
        className="sticky top-[calc(5.5rem+var(--stack-offset))] mx-auto max-w-6xl rounded-[40px] border-2 border-[#D7E2EA]/25 bg-[#0C0C0C] p-4 shadow-[0_-14px_42px_rgba(12,12,12,0.24)] sm:rounded-[50px] sm:p-6 md:top-[calc(7.5rem+var(--stack-offset))] md:rounded-[60px] md:p-8"
      >
        {/* Top Row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-8">
            <span
              className="font-black leading-none text-[#D7E2EA] tabular-nums"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 96px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">
                  {project.category}
                </span>
                {project.status && (
                  <span className="text-xs font-medium uppercase tracking-widest text-amber-300/90 sm:text-sm">
                    &middot; {project.status}
                  </span>
                )}
              </div>
              <h3
                className="font-medium uppercase leading-tight text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => onSelectProject(project)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#D7E2EA] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#0C0C0C] whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA] sm:px-7 sm:py-3 sm:text-sm"
            >
              <Maximize2 className="h-3.5 w-3.5 shrink-0" />
              <span>Expand View</span>
            </button>
            <LiveProjectButton
              href={project.liveUrl}
              onClick={() => onSelectProject(project)}
            />
          </div>
        </div>

        {/* Bottom Row: Two-column image grid */}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-stretch">
          {/* Left column: 40% width, 2 stacked images */}
          <div className="flex w-full flex-col gap-3 sm:gap-4 md:w-[40%]">
            <div
              className="w-full overflow-hidden rounded-[40px] bg-[#161616] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, min(16vw, 20vh), 230px)' }}
            >
              <img
                src={project.col1Images[0]}
                alt={`${project.name} showcase render 1`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
            <div
              className="w-full overflow-hidden rounded-[40px] bg-[#161616] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(160px, min(22vw, 30vh), 340px)' }}
            >
              <img
                src={project.col1Images[1]}
                alt={`${project.name} showcase render 2`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Right column: 60% width, 1 tall image */}
          <div className="relative w-full overflow-hidden rounded-[40px] bg-[#161616] sm:rounded-[50px] md:w-[60%] md:rounded-[60px]">
            <img
              src={project.col2Image}
              alt={`${project.name} main artwork`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-[1.02] md:absolute md:inset-0 md:h-full"
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
};

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
}) => {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterCategory>('All');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.filterCategories.includes(activeFilter));
  }, [activeFilter]);

  const countFor = (cat: ProjectFilterCategory) =>
    cat === 'All'
      ? PROJECTS.length
      : PROJECTS.filter((p) => p.filterCategories.includes(cat)).length;

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-white px-5 pt-20 pb-24 text-[#0C0C0C] sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-32 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="mb-8 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-10 md:mb-12"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Project
        </h2>
      </FadeIn>

      {/* Project Category Filter Bar */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mx-auto mb-10 flex max-w-3xl flex-wrap items-center justify-center gap-2.5 sm:mb-14 sm:gap-3 md:mb-16"
      >
        {FILTER_OPTIONS.map((category) => {
          const isActive = activeFilter === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveFilter(category)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-200 sm:px-6 sm:py-2.5 sm:text-sm ${
                isActive
                  ? 'border-[#0C0C0C] bg-[#0C0C0C] text-white shadow-[0_8px_24px_rgba(12,12,12,0.16)]'
                  : 'border-[#0C0C0C]/20 bg-[#F4F6F8] text-[#0C0C0C]/75 hover:border-[#0C0C0C]/55 hover:text-[#0C0C0C]'
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-[11px] tabular-nums ${
                  isActive ? 'text-white/70' : 'text-[#0C0C0C]/45'
                }`}
              >
                {countFor(category)}
              </span>
            </button>
          );
        })}
      </div>

      <div ref={containerRef} className="relative flex flex-col gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={`${activeFilter}-${project.number}`}
            project={project}
            index={index}
            totalCards={filteredProjects.length}
            progress={scrollYProgress}
            onSelectProject={onSelectProject}
          />
        ))}
      </div>
    </section>
  );
};
