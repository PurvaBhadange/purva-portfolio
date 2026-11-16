import React from 'react';
import { FadeIn } from './FadeIn';

interface ServiceOffering {
  number: string;
  name: string;
  description: string;
}

const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    number: '01',
    name: 'AI & LLM Engineering',
    description:
      'End-to-end RAG pipelines, FAISS semantic search, LangChain & LangGraph multi-agent systems, prompt engineering, and Gemini, Mistral & Ollama integrations.',
  },
  {
    number: '02',
    name: 'Machine Learning & Data Science',
    description:
      'Predictive modeling, classification, regression, clustering, ensemble methods, feature engineering, imbalanced data handling, and EDA with Scikit-learn, Pandas & NumPy.',
  },
  {
    number: '03',
    name: 'Backend APIs & Databases',
    description:
      'FastAPI services, RESTful APIs, SQLAlchemy ORM, Pydantic validation, authentication fundamentals, and clean schemas across PostgreSQL, MySQL, MongoDB & SQLite.',
  },
  {
    number: '04',
    name: 'Full-Stack Web & Deployment',
    description:
      'Responsive AI product interfaces and deployments from concept to production with React, Next.js, TypeScript, Streamlit, Docker, Git/GitHub, Vercel & Render.',
  },
];

interface HowICanHelpSectionProps {
  onOpenContact?: () => void;
}

export const HowICanHelpSection: React.FC<HowICanHelpSectionProps> = ({
  onOpenContact,
}) => {
  const handleGetInTouch = () => {
    if (onOpenContact) {
      onOpenContact();
      return;
    }
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services-offered"
      aria-label="Services"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 pb-28 text-[#D7E2EA] sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-36 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32 md:pb-44"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading mb-6 text-center font-black uppercase leading-none tracking-tight sm:mb-8"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} y={24}>
          <p
            className="mx-auto mb-16 max-w-2xl text-center font-light leading-relaxed text-[#D7E2EA]/75 sm:mb-20 md:mb-24"
            style={{ fontSize: 'clamp(0.95rem, 1.75vw, 1.25rem)' }}
          >
            How I can help &mdash; collaborating on internships, startups, and applied engineering
            teams to build practical AI/ML systems and reliable full-stack products.
          </p>
        </FadeIn>

        <div>
          {SERVICE_OFFERINGS.map((service, i) => (
            <FadeIn key={service.number} delay={i * 0.1} y={30}>
              <div
                className={`group flex flex-col gap-4 py-8 transition-colors duration-200 sm:flex-row sm:items-center sm:gap-12 sm:py-10 md:gap-16 md:py-12 ${
                  i === 0 ? 'border-t' : ''
                } border-b`}
                style={{ borderColor: 'rgba(215, 226, 234, 0.15)' }}
              >
                <span
                  className="shrink-0 font-black leading-none text-[#BBCCD7] tabular-nums transition-colors duration-200 group-hover:text-white"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {service.number}
                </span>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <h3
                    className="font-medium uppercase leading-tight text-[#D7E2EA] transition-colors duration-200 group-hover:text-white"
                    style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="max-w-2xl font-light leading-relaxed text-[#D7E2EA]"
                    style={{
                      fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                      opacity: 0.6,
                    }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.15} y={20}>
          <div className="mt-14 flex items-center justify-center sm:mt-16 md:mt-20">
            <button
              type="button"
              onClick={handleGetInTouch}
              className="cursor-pointer rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] whitespace-nowrap shrink-0 transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-sm md:py-4 md:text-base"
            >
              Get In Touch
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowICanHelpSection;
