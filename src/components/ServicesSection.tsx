import React from 'react';
import { FadeIn } from './FadeIn';

const SERVICES = [
  {
    number: '01',
    name: 'Machine Learning & Data Science',
    description:
      'Supervised & unsupervised learning, classification, regression, clustering, ensemble methods, feature engineering, imbalanced classification, model evaluation, EDA. Tools: Scikit-learn, Pandas, NumPy.',
  },
  {
    number: '02',
    name: 'AI Engineering & LLM Systems',
    description:
      'Generative AI, RAG, embeddings, semantic search, vector databases (FAISS), LangChain, multi-agent systems, AI workflow orchestration, prompt engineering, LLM integration (Gemini, Mistral, Ollama).',
  },
  {
    number: '03',
    name: 'Backend & APIs',
    description:
      'FastAPI, RESTful APIs, SQLAlchemy, Pydantic, authentication fundamentals.',
  },
  {
    number: '04',
    name: 'Programming & CS Fundamentals',
    description:
      'Python, C++, C, Java (basics), SQL, Data Structures & Algorithms, OOP.',
  },
  {
    number: '05',
    name: 'Databases',
    description: 'PostgreSQL, MySQL, MongoDB, SQLite.',
  },
  {
    number: '06',
    name: 'Tools & Deployment',
    description: 'Git, GitHub, Docker, Vercel, Render.',
  },
  {
    number: '07',
    name: 'Familiar with (working knowledge)',
    description:
      'React, Next.js, TypeScript, Streamlit. System design fundamentals: caching, load balancing, rate limiting, message queues, replication.',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative rounded-t-[40px] bg-white px-5 pt-20 pb-28 sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-36 md:rounded-t-[60px] md:px-10 md:pt-32 md:pb-44"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Skills
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {SERVICES.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={30}>
            <div
              className={`flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-12 sm:py-10 md:gap-16 md:py-12 ${
                i === 0 ? 'border-t' : ''
              } border-b`}
              style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
            >
              <span
                className="shrink-0 font-black leading-none text-[#0C0C0C] tabular-nums"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>

              <div className="flex flex-col gap-2 sm:gap-3">
                <h3
                  className="font-medium uppercase leading-tight text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]"
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
    </section>
  );
};
