import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FadeIn } from './FadeIn';
import { TypeMotion } from './TypeMotion';

const HERO_TICKER_ITEMS = [
  { label: 'AI Engineering', target: 'services' },
  { label: 'RAG Systems', target: 'projects' },
  { label: 'Multi-Agent Pipelines', target: 'projects' },
  { label: 'Machine Learning', target: 'services' },
  { label: 'Data Science', target: 'services' },
  { label: 'Full-Stack Engineering', target: 'projects' },
];

const THOUGHT_MESSAGES = [
  {
    prefix: "Turning \u2018I wonder if...\u2019 into ",
    highlight: "\u2018I built it.\u2019",
  },
  {
    prefix: 'Think like an engineer \u2014 ',
    highlight: 'learn by building.',
  },
] as const;

const RARE_SPARKLES = [
  { left: '8%', top: '31%', size: 14, delay: 0.2, duration: 5.2, base: 0.24, peak: 0.68 },
  { left: '91%', top: '28%', size: 12, delay: 1.4, duration: 6.0, base: 0.22, peak: 0.62 },
  { left: '15%', top: '74%', size: 13, delay: 2.3, duration: 5.6, base: 0.22, peak: 0.64 },
  { left: '84%', top: '72%', size: 15, delay: 0.8, duration: 6.4, base: 0.26, peak: 0.72 },
  { left: '6%', top: '53%', size: 11, delay: 1.9, duration: 5.4, base: 0.20, peak: 0.56 },
] as const;

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [showThought, setShowThought] = useState(false);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const shownAtRef = useRef<number>(0);
  const interactionCountRef = useRef<number>(0);
  const lastTriggerAtRef = useRef<number>(0);

  useEffect(() => {
    const triggerThought = () => {
      const now = Date.now();
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (now - lastTriggerAtRef.current > 300) {
        interactionCountRef.current += 1;
        const n = interactionCountRef.current;
        setThoughtIndex(n === 1 ? 0 : n % 2 === 0 ? 1 : 0);
        lastTriggerAtRef.current = now;
      }
      shownAtRef.current = now;
      setShowThought(true);
    };

    const scheduleHideThought = () => {
      const elapsed = Date.now() - shownAtRef.current;
      const remaining = Math.max(0, 1800 - elapsed);
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
      }
      holdTimerRef.current = window.setTimeout(() => {
        setShowThought(false);
        holdTimerRef.current = null;
      }, remaining);
    };

    const handleFaceChange = (event: Event) => {
      const custom = event as CustomEvent<{ face?: string }>;
      const nextFace = custom.detail?.face;

      if (nextFace === 'wink' || nextFace === 'shock') {
        triggerThought();
      } else {
        scheduleHideThought();
      }
    };

    const handlePortraitHover = (event: Event) => {
      const custom = event as CustomEvent<{ count?: number }>;
      if ((custom.detail?.count ?? 0) > 2) {
        triggerThought();
        scheduleHideThought();
      }
    };

    window.addEventListener('purva:facechange', handleFaceChange);
    window.addEventListener('purva:porthover', handlePortraitHover);
    return () => {
      window.removeEventListener('purva:facechange', handleFaceChange);
      window.removeEventListener('purva:porthover', handlePortraitHover);
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative flex min-h-screen lg:h-screen w-full flex-col justify-between bg-[#0C0C0C]"
      style={{ overflowX: 'clip' }}
    >
      {/* Subtle studio ambient glow behind the portrait so it feels grounded in the dark canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 46% 42% at 50% 54%, rgba(187, 204, 215, 0.08) 0%, rgba(12, 12, 12, 0) 72%)',
        }}
      />

      {/* Rear shiny small background sparkles (few, subtle, clearly visible behind portrait) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {RARE_SPARKLES.map((sp, idx) => (
          <motion.svg
            key={idx}
            viewBox="0 0 24 24"
            className="absolute"
            style={{
              left: sp.left,
              top: sp.top,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              filter: 'drop-shadow(0 0 5px rgba(215, 226, 234, 0.7))',
            }}
            initial={
              prefersReducedMotion
                ? { opacity: sp.base * 1.4, scale: 0.9, rotate: 0 }
                : { opacity: sp.base, scale: 0.82, rotate: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: sp.base * 1.4, scale: 0.9, rotate: 0 }
                : {
                    opacity: [sp.base, sp.peak, sp.base],
                    scale: [0.82, 1.15, 0.82],
                    rotate: [0, 18, 0],
                  }
            }
            transition={{
              duration: sp.duration,
              delay: sp.delay,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
          >
            <path
              fill="#D7E2EA"
              d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
            />
            <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
          </motion.svg>
        ))}
      </div>

      {/* Top area: Interactive TypeMotion Hero Heading (clears fixed top Navbar cleanly) */}
      <div className="relative z-20 w-full shrink-0 pt-[68px] sm:pt-[76px] md:pt-[84px]">
        <div className="px-4 md:px-8">
          <TypeMotion text="HI, I'M PURVA" />
        </div>
      </div>

      {/* Dedicated Middle Stage: Centered Living Portrait (never overlaps heading or bottom bar) */}
      <div className="relative z-10 flex flex-1 min-h-0 w-full items-center justify-center px-4 py-2">
        <div className="hero-portrait-wrap" id="magnetWrap">
          <FadeIn delay={0.6} y={30} className="w-full h-full">
            <div className="hero-portrait-inner" id="magnetInner">
              <img
                id="faceFallback"
                src="/src/assets/images/purva_tee_smile_1794836201158.jpg"
                alt="Realistic 3D portrait of Purva"
                referrerPolicy="no-referrer"
                style={{
                  maskImage:
                    'radial-gradient(ellipse 68% 66% at 50% 44%, black 48%, rgba(0,0,0,0.4) 76%, transparent 98%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 68% 66% at 50% 44%, black 48%, rgba(0,0,0,0.4) 76%, transparent 98%)',
                }}
              />
              <canvas id="faceGl" aria-hidden="true" />
              <div id="faceProps" aria-hidden="true">
                <svg id="faceFly" viewBox="0 0 32 32">
                  <path
                    className="wing"
                    d="M15 15C12 9.500 4.500 8.500 2 13c2.500 4.500 10 4.500 13 2z"
                  />
                  <path
                    className="wing r"
                    d="M17 15c3-5.500 10.500-6.500 13-2-2.500 4.500-10 4.500-13 2z"
                  />
                  <ellipse cx="16" cy="19.500" rx="4" ry="6.500" />
                  <circle cx="16" cy="11.500" r="3.300" />
                </svg>
                <svg id="faceHand" viewBox="0 0 32 32">
                  <path
                    className="open"
                    d="M10.500 16.500V8.200a1.800 1.800 0 0 1 3.600 0V14v-8a1.800 1.800 0 0 1 3.600 0V14 7a1.800 1.800 0 0 1 3.600 0v8-5a1.800 1.800 0 0 1 3.600 0v10.500c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-3.500-5.600c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.600 1z"
                  />
                  <path
                    className="grab"
                    d="M10.500 17v-3.300a1.800 1.800 0 0 1 3.600 0V14v-1.800a1.800 1.800 0 0 1 3.600 0V14v-1.300a1.800 1.800 0 0 1 3.600 0V14v-.3a1.800 1.800 0 0 1 3.600 0v6.800c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-2.300-3.700c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.700 1z"
                  />
                </svg>
                <svg id="faceHearts" viewBox="0 0 64 64" style={{ left: '61%', top: '48%' }}>
                  <path
                    className="h1"
                    fill="#FF6B9E"
                    d="M24 38c0 0-9-6.2-9-12.1 0-3 2.3-5.2 5-5.2 1.8 0 3.2.9 4 2.2.8-1.3 2.2-2.2 4-2.2 2.7 0 5 2.2 5 5.2C33 31.8 24 38 24 38z"
                  />
                  <path
                    className="h2"
                    fill="#FF94B8"
                    d="M44 30c0 0-6-4.2-6-8.2 0-2 1.5-3.5 3.3-3.5 1.2 0 2.2.6 2.7 1.5.5-.9 1.5-1.5 2.7-1.5 1.8 0 3.3 1.5 3.3 3.5C50 25.8 44 30 44 30z"
                  />
                  <path
                    className="h3"
                    fill="#FFAEC9"
                    d="M35 48c0 0-5-3.4-5-6.6 0-1.7 1.2-2.9 2.7-2.9 1 0 1.8.5 2.3 1.2.5-.7 1.3-1.2 2.3-1.2 1.5 0 2.7 1.2 2.7 2.9C40 44.6 35 48 35 48z"
                  />
                </svg>
                <svg id="faceStars" viewBox="0 0 100 44" style={{ left: '50%', top: '16%' }}>
                  <g className="orbit">
                    <path
                      fill="#FFE07D"
                      d="M18 14l2.2 5.2L26 21l-5.8 1.8L18 28l-2.2-5.2L10 21l5.8-1.8z"
                    />
                    <path
                      fill="#D7E2EA"
                      d="M50 6l2.4 5.6L58 14l-5.6 2.4L50 22l-2.4-5.6L42 14l5.6-2.4z"
                    />
                    <path
                      fill="#FF9ED2"
                      d="M82 14l2.2 5.2L90 21l-5.8 1.8L82 28l-2.2-5.2L74 21l5.8-1.8z"
                    />
                  </g>
                </svg>
                <svg id="faceZzz" viewBox="0 0 64 64" style={{ left: '68%', top: '26%' }}>
                  <text
                    x="10"
                    y="48"
                    className="z1"
                    fill="#D7E2EA"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Kanit, sans-serif"
                  >
                    Z
                  </text>
                  <text
                    x="24"
                    y="34"
                    className="z2"
                    fill="#BBCCD7"
                    fontSize="16"
                    fontWeight="700"
                    fontFamily="Kanit, sans-serif"
                  >
                    Z
                  </text>
                  <text
                    x="40"
                    y="20"
                    className="z3"
                    fill="#FFFFFF"
                    fontSize="19"
                    fontWeight="800"
                    fontFamily="Kanit, sans-serif"
                  >
                    z
                  </text>
                </svg>
              </div>

              {/* Animated thought bubble emerging from head */}
              <AnimatePresence>
                {showThought && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="pointer-events-none absolute right-[-4%] -top-7 z-30 sm:left-[68%] sm:right-auto sm:top-[1%] md:left-[72%] md:-top-[1%]"
                  >
                    {/* Trailing bubbles emerging from head crown */}
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2, delay: 0.02 }}
                      className="absolute -left-5 bottom-[-10px] h-2.5 w-2.5 rounded-full border border-[#D7E2EA]/40 bg-[#14171D]/90 backdrop-blur-sm sm:-left-7 sm:bottom-[-12px]"
                    />
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.22, delay: 0.08 }}
                      className="absolute -left-2.5 bottom-[-2px] h-3.5 w-3.5 rounded-full border border-[#D7E2EA]/40 bg-[#14171D]/90 backdrop-blur-sm sm:-left-3.5 sm:bottom-[-3px]"
                    />

                    {/* Thought cloud pill */}
                    <motion.div
                      key={thoughtIndex}
                      initial={{ opacity: 0, scale: 0.55, x: -12, y: 12 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        y: [0, -4, 0],
                      }}
                      exit={{ opacity: 0, scale: 0.72, x: -8, y: 8 }}
                      transition={{
                        opacity: { duration: 0.24, delay: 0.12 },
                        scale: {
                          type: 'spring',
                          stiffness: 340,
                          damping: 22,
                          delay: 0.12,
                        },
                        x: { duration: 0.28, delay: 0.12 },
                        y: {
                          repeat: Infinity,
                          duration: 3.2,
                          ease: 'easeInOut',
                          delay: 0.4,
                        },
                      }}
                      style={{ transformOrigin: 'bottom left' }}
                      className="w-[215px] rounded-[24px] border border-[#D7E2EA]/35 bg-[#12151C]/90 px-4 py-3 text-left shadow-[0_14px_38px_rgba(0,0,0,0.65)] backdrop-blur-md sm:w-[255px] sm:rounded-[28px] sm:px-5 sm:py-3.5"
                    >
                      <p className="text-xs font-light leading-snug tracking-wide text-[#D7E2EA]/80 sm:text-[13px]">
                        {THOUGHT_MESSAGES[thoughtIndex].prefix}
                        <span className="font-semibold text-white">
                          {THOUGHT_MESSAGES[thoughtIndex].highlight}
                        </span>
                      </p>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Bar: Animated skill ticker matching site design */}
      <FadeIn delay={0.35} y={18} className="relative z-20 mb-2 w-full shrink-0 sm:mb-4">
        <div
          aria-label="Core engineering domains"
          className="hero-ticker-bar relative w-full overflow-hidden border-y border-[#D7E2EA]/18 bg-[#0C0C0C]/85 py-3.5 backdrop-blur-md sm:py-4"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <div className="hero-ticker-track">
            {[0, 1].map((halfIndex) => (
              <div
                key={halfIndex}
                aria-hidden={halfIndex === 1}
                className="flex shrink-0 items-center"
              >
                {[0, 1].map((passIndex) =>
                  HERO_TICKER_ITEMS.map((item) => (
                    <React.Fragment key={`${halfIndex}-${passIndex}-${item.label}`}>
                      <button
                        type="button"
                        tabIndex={halfIndex === 1 || passIndex === 1 ? -1 : undefined}
                        onClick={() => scrollToSection(item.target)}
                        className="cursor-pointer whitespace-nowrap px-6 text-xs font-medium uppercase tracking-[0.22em] text-[#D7E2EA]/75 transition-all duration-200 hover:-translate-y-0.5 hover:text-white sm:px-9 sm:text-sm md:px-11"
                      >
                        {item.label}
                      </button>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="hero-ticker-star h-2.5 w-2.5 shrink-0 text-[#BBCCD7]/60"
                        fill="currentColor"
                      >
                        <path d="M8 0L9.9 6.1L16 8L9.9 9.9L8 16L6.1 9.9L0 8L6.1 6.1L8 0Z" />
                      </svg>
                    </React.Fragment>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
};
