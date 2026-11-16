import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';

interface AboutSectionProps {
  onOpenResume: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenResume,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Scroll-driven vertical parallax for top and bottom pairs
  const topParallaxY = useTransform(scrollYProgress, [0, 1], [-28, 34]);
  const bottomParallaxY = useTransform(scrollYProgress, [0, 1], [34, -36]);

  // Cursor-driven subtle depth parallax across the section
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.6 });

  const leftShiftX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const rightShiftX = useTransform(smoothX, [-1, 1], [14, -14]);
  const topShiftY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const bottomShiftY = useTransform(smoothY, [-1, 1], [12, -12]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-24 sm:px-8 md:px-10 md:py-32"
    >
      {/* Top-left: Moon icon */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="pointer-events-auto absolute top-[4%] left-[2%] z-0 opacity-60 sm:left-[3%] md:left-[4%] md:opacity-80"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: topParallaxY, x: leftShiftX, translateY: topShiftY }
          }
        >
          <motion.img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D moon render"
            referrerPolicy="no-referrer"
            className="h-auto w-[68px] object-contain select-none will-change-transform sm:w-[92px] md:w-[116px]"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [-8, 10],
                    x: [-5, 6],
                    rotate: [-5, 6],
                  }
            }
            transition={{
              duration: 5.2,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            whileHover={
              prefersReducedMotion ? undefined : { scale: 1.15, rotate: 12 }
            }
          />
        </motion.div>
      </FadeIn>

      {/* Bottom-left: 3D cube / sculptural object */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="pointer-events-auto absolute bottom-[5%] left-[2%] z-0 opacity-55 sm:left-[4%] md:left-[6%] md:opacity-80"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: bottomParallaxY, x: leftShiftX, translateY: bottomShiftY }
          }
        >
          <motion.img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D sculptural object"
            referrerPolicy="no-referrer"
            className="h-auto w-[60px] object-contain select-none will-change-transform sm:w-[82px] md:w-[104px]"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [10, -10],
                    x: [4, -6],
                    rotate: [6, -7],
                  }
            }
            transition={{
              duration: 6.1,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            whileHover={
              prefersReducedMotion ? undefined : { scale: 1.15, rotate: -14 }
            }
          />
        </motion.div>
      </FadeIn>

      {/* Top-right: Lego / cursor icon */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="pointer-events-auto absolute top-[4%] right-[2%] z-0 opacity-60 sm:right-[3%] md:right-[4%] md:opacity-80"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: topParallaxY, x: rightShiftX, translateY: topShiftY }
          }
        >
          <motion.img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D geometric brick"
            referrerPolicy="no-referrer"
            className="h-auto w-[68px] object-contain select-none will-change-transform sm:w-[92px] md:w-[116px]"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [-10, 9],
                    x: [6, -5],
                    rotate: [7, -5],
                  }
            }
            transition={{
              duration: 5.6,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            whileHover={
              prefersReducedMotion ? undefined : { scale: 1.15, rotate: -12 }
            }
          />
        </motion.div>
      </FadeIn>

      {/* Bottom-right: 3D smile / abstract group */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="pointer-events-auto absolute right-[2%] bottom-[5%] z-0 opacity-55 sm:right-[4%] md:right-[6%] md:opacity-80"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: bottomParallaxY, x: rightShiftX, translateY: bottomShiftY }
          }
        >
          <motion.img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D abstract cluster"
            referrerPolicy="no-referrer"
            className="h-auto w-[72px] object-contain select-none will-change-transform sm:w-[96px] md:w-[120px]"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [9, -11],
                    x: [-6, 5],
                    rotate: [-6, 7],
                  }
            }
            transition={{
              duration: 6.5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            whileHover={
              prefersReducedMotion ? undefined : { scale: 1.15, rotate: 14 }
            }
          />
        </motion.div>
      </FadeIn>

      {/* Centered Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-12 sm:gap-14 md:gap-16">
        <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading text-center font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              About me
            </h2>
          </FadeIn>

          <AnimatedText
            text="Third-year B.Tech AI & ML student at PES Modern College of Engineering, Pune. I build practical AI/ML applications and software systems, turning ideas into working products. What sets me apart is how I work: I experiment hands-on, think like an engineer about how a system holds together, and learn by building. I’m now focused on applied AI, ML engineering, and data science, and I’m looking for internships where I can contribute to real problems and keep growing."
            className="max-w-3xl text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 1.85vw, 1.3rem)' }}
          />
        </div>

        {/* Two-column details */}
        <FadeIn
          delay={0.15}
          y={20}
          className="grid w-full max-w-3xl grid-cols-1 gap-10 border-t border-[#D7E2EA]/15 pt-10 text-left sm:grid-cols-2 sm:gap-12"
        >
          {/* Left column */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Education
              </h3>
              <p className="text-sm font-medium text-[#D7E2EA] sm:text-base">
                B.Tech, AI &amp; ML
              </p>
              <p className="text-sm font-light text-[#D7E2EA]/80">
                PES Modern College of Engineering, Pune (2024&ndash;2028)
              </p>
              <p className="text-sm font-medium text-[#D7E2EA] tabular-nums">
                CGPA: 9.31
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Experience
              </h3>
              <p className="text-sm font-medium text-[#D7E2EA] sm:text-base">
                Secretary, App Club (PES Modern College of Engineering)
              </p>
              <p className="text-sm font-light text-[#D7E2EA]/80">
                Previously: Technical Team member, App Club
              </p>
              <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/80">
                Hackathons: Smart India Hackathon (SIH) &middot; Adobe University Hackathon &middot; Ignisia &lsquo;26 National Level AI Hackathon, MIT-WPU &middot; Amazon ML Challenge 2026
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Stats
              </h3>
              <p className="text-sm font-medium text-[#D7E2EA] tabular-nums sm:text-base">
                200+ LeetCode problems solved
              </p>
              <p className="text-sm font-light text-[#D7E2EA]/80">
                Google AI Certified &middot; NPTEL Data Science
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Core Focus
              </h3>
              <p className="text-sm font-medium text-[#D7E2EA] sm:text-base">
                RAG Pipelines &amp; Multi-Agent Systems
              </p>
              <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/80">
                Dense vector search, multilingual speech/text assistants, and LLM grounding guardrails
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Engineering Approach
              </h3>
              <p className="text-sm font-medium text-[#D7E2EA] sm:text-base">
                Hands-On Systems Thinking
              </p>
              <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/80">
                Iterative prototyping paired with clean FastAPI boundaries, Pydantic validation, and grounded evaluation
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Languages
              </h3>
              <p className="text-sm font-light text-[#D7E2EA]/90 sm:text-base">
                <span className="font-medium text-[#D7E2EA]">Programming:</span> Python, C++, C, Java, SQL
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Software
              </h3>
              <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/90 sm:text-base">
                FastAPI &middot; React &middot; Node.js &middot; LangChain &middot; FAISS
                <br />
                Scikit-learn &middot; XGBoost &middot; Pandas &middot; NumPy
                <br />
                MongoDB &middot; MySQL &middot; Docker &middot; Git &middot; Vercel
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Interests
              </h3>
              <p className="text-sm font-light text-[#D7E2EA]/90 sm:text-base">
                Machine Learning &middot; AI Engineering &middot; Development
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Featured Builds
              </h3>
              <p className="text-sm font-medium text-[#D7E2EA] sm:text-base">
                EchoSeek &middot; SYNQ &middot; SANKALP &middot; ResearchMind
              </p>
              <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/80">
                8+ end-to-end AI, ML, and full-stack products shipped from idea to live deployment
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                Availability
              </h3>
              <p className="text-sm font-medium text-[#D7E2EA] sm:text-base">
                Open to AI/ML &amp; Data Science Internships
              </p>
              <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/80">
                Based in Pune, India &middot; Available for on-site &amp; remote engineering teams
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onOpenResume}
            className="cursor-pointer rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] whitespace-nowrap shrink-0 transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-sm md:py-4 md:text-base"
          >
            View Resume
          </button>

          <a
            href="https://github.com/PurvaBhadange"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]/40 px-7 py-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] whitespace-nowrap shrink-0 transition-colors duration-200 hover:border-[#D7E2EA] hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3.5 sm:text-sm md:py-4 md:text-base"
          >
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>

          <a
            href="https://www.linkedin.com/in/purva-b-660982259/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]/40 px-7 py-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] whitespace-nowrap shrink-0 transition-colors duration-200 hover:border-[#D7E2EA] hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3.5 sm:text-sm md:py-4 md:text-base"
          >
            LinkedIn
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
