import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'motion/react';

/* ---------- Types & Deck Configuration ---------- */

export interface WheelCardData {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  cover: string;
  video: string;
  href: string;
  external?: boolean;
}

const CARD_COUNT = 34;
const BASE_CARD_WIDTH = 136;
const BASE_CARD_HEIGHT = Math.round((BASE_CARD_WIDTH * 16) / 9);
const DEAL_DURATION_SEC = 2.6;
const LIFT_DURATION_SEC = 1.9;
const LIFT_EASE: [number, number, number, number] = [0.5, 0, 0.15, 1];
const DRIFT_DEG_PER_SEC = -7; // Turns left smoothly, matching the -28deg lift turn

const PROJECT_REELS: Omit<WheelCardData, 'id'>[] = [
  {
    title: 'EchoSeek',
    subtitle: 'Voice Console & FAISS Dense Vector RAG',
    tag: 'Sarvam AI · FAISS',
    cover: '/assets/aistudio/echoseek_55cb772c.jpeg',
    video: '/assets/videos/reel-echoseek.mp4',
    href: 'https://echo-seek-voice-assistant.vercel.app/',
    external: true,
  },
  {
    title: 'Revamp AI',
    subtitle: 'One Source, Every Format Transformation',
    tag: 'LangGraph · Qdrant',
    cover: '/assets/aistudio/REVAMP_AI_8c6cadf3.jpeg',
    video: '/assets/videos/reel-revamp.mp4',
    href: 'https://revamp-ai-ac5n-4hgdur7bs-purvabhadanges-projects.vercel.app',
    external: true,
  },
  {
    title: 'SANKALP',
    subtitle: 'Open Innovation Government Procurement',
    tag: 'Next.js · FastAPI',
    cover: '/assets/aistudio/SANKALP_58cba9e9.jpeg',
    video: '/assets/videos/reel-sankalp.mp4',
    href: 'https://sankalp-jade-zeta.vercel.app/',
    external: true,
  },
  {
    title: 'SYNQ',
    subtitle: 'Multi-Model DAG & FalkorDB Memory',
    tag: 'Ollama · Gemini',
    cover: '/assets/aistudio/SYNQ_7e96267b.jpeg',
    video: '/assets/videos/reel-synq.mp4',
    href: 'https://synq-sand.vercel.app/',
    external: true,
  },
  {
    title: 'ResearchMind',
    subtitle: '4-Agent Autonomous Research Pipeline',
    tag: 'Mistral · LangChain',
    cover: '/assets/aistudio/RESEARCH_MIND_da504e8e.jpeg',
    video: '/assets/videos/reel-researchmind.mp4',
    href: 'https://multi-agent-research-system-using-python.streamlit.app/',
    external: true,
  },
  {
    title: 'PhishPop!',
    subtitle: 'URL Threat Radar & XGBoost Explainability',
    tag: 'XGBoost · ML',
    cover: '/assets/aistudio/PHISH-POP_1c9a9dab.jpeg',
    video: '/assets/videos/reel-phishpop.mp4',
    href: 'https://rrmqwnyecvba4dqrrltcbm.streamlit.app/',
    external: true,
  },
  {
    title: 'ResolveOS',
    subtitle: 'Deterministic Governance & Resolution Center',
    tag: 'Policy Engine',
    cover: '/assets/aistudio/RESOLVE_OS_a0ae0a74.jpeg',
    video: '/assets/videos/reel-resolveos.mp4',
    href: 'https://resolve-os-2.vercel.app/',
    external: true,
  },
  {
    title: 'Hacker House Goa',
    subtitle: 'Interactive Builder ID Pass Engine',
    tag: 'HTML5 Canvas',
    cover: '/assets/aistudio/HH-GOA_9e1fbf00.jpeg',
    video: '/assets/videos/reel-hhgoa.mp4',
    href: 'https://hh-goa-id-card-gen.vercel.app/',
    external: true,
  },
];

// Dark reels: 0 (EchoSeek), 2 (SANKALP), 3 (SYNQ), 4 (ResearchMind), 7 (Hacker House Goa)
// Light reels: 1 (Revamp AI), 5 (PhishPop!), 6 (ResolveOS)
// Strict Dark -> Light -> Dark -> Light sequence around all 34 cards with >= 4 spacing (>= 6 across the visible top arc)
const DARK_SLOTS = [0, 2, 3, 4, 7, 0, 2, 3, 4, 7, 0, 2, 3, 4, 7, 2, 4] as const;
const LIGHT_SLOTS = [6, 1, 5, 6, 1, 5, 6, 1, 5, 1, 6, 5, 1, 5, 6, 1, 5] as const;

const CARDS: WheelCardData[] = Array.from({ length: CARD_COUNT }, (_, i) => {
  const slotIndex = Math.floor(i / 2);
  const reelIndex = i % 2 === 0 ? DARK_SLOTS[slotIndex] : LIGHT_SLOTS[slotIndex];
  const base = PROJECT_REELS[reelIndex];
  return {
    ...base,
    id: i,
  };
});

/* ---------- Math Helpers ---------- */

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - clamp01(t), 3);

/** Wrap any angle in degrees into (-180, 180] */
const wrapAngle = (deg: number): number => {
  let a = ((deg + 180) % 360 + 360) % 360 - 180;
  if (a === -180) a = 180;
  return a;
};

/** Compute the single-card CSS 3D pose from deal (0..1), lift (0..1), and wheel spin */
export function computeCardPose(params: {
  homeAngle: number;
  order: number;
  deal: number;
  lift: number;
  wheelSpin: number;
  heightScale: number;
}) {
  const { homeAngle, order, deal, lift, wheelSpin, heightScale } = params;

  // Individual card slice of the deal [0..1]
  const rawSlice = clamp01((deal - order * 0.6) / 0.4);
  const p = easeOutCubic(rawSlice);

  // Deal: sweep from +70deg (right) down to home, rise from +140px low, flip 180->0, scale 0.7->1
  const dealSweep = (1 - p) * 70;
  const flip = (1 - p) * 180;
  const dealScale = lerp(0.7, 1, p);

  // Lift: radius 580->1010, pivotY 500->814, card scale +35%, opening turn -28deg left
  const baseRadius = lerp(580, 1010, lift) * heightScale;
  const basePivotY = lerp(500, 814, lift) * heightScale;
  const pivotY = basePivotY + (1 - p) * 140 * heightScale;
  const radius = lerp(0, baseRadius, p);
  const s = dealScale * (1 + 0.35 * lift);

  // Angle turns left during deal, turns -28deg left on lift, and drifts left (-7 deg/s)
  const angle = homeAngle + dealSweep - 28 * lift + wheelSpin;
  const wrapped = wrapAngle(angle);
  const distFromTop = Math.abs(wrapped);

  // Small negative Z of angular distance from top -> top card overlaps neighbors symmetrically
  const depth = -distFromTop * 0.45;
  const visible = p > 0.002 && distFromTop <= 100;

  // Strict single-transform order required by spec
  const transform = `translate3d(0px, ${pivotY.toFixed(2)}px, ${depth.toFixed(2)}px) rotateZ(${angle.toFixed(3)}deg) translate3d(0px, ${(-radius).toFixed(2)}px, 0px) rotateY(${flip.toFixed(2)}deg) scale(${s.toFixed(4)})`;

  return {
    transform,
    visible,
    distFromTop,
    zIndex: Math.round(1000 - distFromTop),
  };
}

interface CardCache {
  transform: string;
  visibility: 'visible' | 'hidden';
  zIndex: string;
  playing: boolean;
}

/* ---------- Seeded Painterly Sky & Volumetric Cumulus Cloud Renderers ---------- */

function createPrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function paintSunsetSkyCanvas(canvas: HTMLCanvasElement, w: number, h: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Base clear-blue -> lavender -> golden-peach horizon gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0.0, '#5A96DA');
  skyGrad.addColorStop(0.24, '#72ACE4');
  skyGrad.addColorStop(0.46, '#9BB4DF');
  skyGrad.addColorStop(0.66, '#C5B1D4');
  skyGrad.addColorStop(0.84, '#E8BA9F');
  skyGrad.addColorStop(1.0, '#F7CA99');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Soft sunlit golden-hour atmospheric glows behind clouds
  const warmHorizon = ctx.createRadialGradient(w * 0.64, h * 0.78, 0, w * 0.64, h * 0.78, w * 0.68);
  warmHorizon.addColorStop(0, 'rgba(255, 224, 178, 0.52)');
  warmHorizon.addColorStop(0.45, 'rgba(246, 185, 162, 0.25)');
  warmHorizon.addColorStop(1, 'rgba(246, 185, 162, 0)');
  ctx.fillStyle = warmHorizon;
  ctx.fillRect(0, 0, w, h);

  const upperLeftGlow = ctx.createRadialGradient(w * 0.14, h * 0.54, 0, w * 0.14, h * 0.54, w * 0.45);
  upperLeftGlow.addColorStop(0, 'rgba(248, 200, 175, 0.28)');
  upperLeftGlow.addColorStop(1, 'rgba(248, 200, 175, 0)');
  ctx.fillStyle = upperLeftGlow;
  ctx.fillRect(0, 0, w, h);

  // 3. Swept sunlit rose-peach & cream cirrus wisps in the upper sky
  const rand = createPrng(90421);
  const drawWispCluster = (
    cx: number,
    cy: number,
    spreadX: number,
    spreadY: number,
    count: number,
    baseRadius: number,
    colorRgb: string,
    alphaMax: number
  ) => {
    for (let i = 0; i < count; i++) {
      const t = (i / Math.max(1, count - 1)) * 2 - 1;
      const px = cx + t * spreadX + (rand() - 0.5) * spreadX * 0.35;
      const py = cy - t * spreadY * 0.28 + (rand() - 0.5) * spreadY;
      const rx = baseRadius * (0.7 + rand() * 0.9);
      const ry = rx * (0.28 + rand() * 0.18);
      const alpha = alphaMax * (1 - Math.abs(t) * 0.45) * (0.55 + rand() * 0.45);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-0.14 + (rand() - 0.5) * 0.12);
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      g.addColorStop(0, `rgba(${colorRgb}, ${alpha.toFixed(3)})`);
      g.addColorStop(0.55, `rgba(${colorRgb}, ${(alpha * 0.45).toFixed(3)})`);
      g.addColorStop(1, `rgba(${colorRgb}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  // Upper-right sunlit cirrus ribbons (matching reference top-right pink/peach streaks)
  drawWispCluster(w * 0.78, h * 0.11, w * 0.26, h * 0.08, 28, w * 0.11, '196, 178, 214', 0.22);
  drawWispCluster(w * 0.80, h * 0.10, w * 0.24, h * 0.07, 26, w * 0.095, '252, 205, 190', 0.28);
  drawWispCluster(w * 0.84, h * 0.09, w * 0.20, h * 0.05, 20, w * 0.07, '255, 236, 218', 0.30);

  // Mid-upper drifting warm streaks
  drawWispCluster(w * 0.32, h * 0.19, w * 0.22, h * 0.06, 22, w * 0.085, '232, 196, 212', 0.18);
  drawWispCluster(w * 0.62, h * 0.25, w * 0.24, h * 0.06, 24, w * 0.09, '253, 216, 198', 0.24);
  drawWispCluster(w * 0.18, h * 0.34, w * 0.18, h * 0.05, 16, w * 0.075, '248, 214, 206', 0.18);
}

function paintCumulusCloudsCanvas(canvas: HTMLCanvasElement, w: number, h: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);

  const rand = createPrng(31847);

  // Stamp soft volumetric radial cloud puffs with sunlit upper-right gradient
  const drawCloudPuff = (
    cx: number,
    cy: number,
    r: number,
    litColor: string,
    midColor: string,
    shadowColor: string,
    opacity = 0.92
  ) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    const g = ctx.createRadialGradient(
      cx + r * 0.14,
      cy - r * 0.28,
      r * 0.05,
      cx - r * 0.06,
      cy + r * 0.12,
      r
    );
    g.addColorStop(0, litColor);
    g.addColorStop(0.5, midColor);
    g.addColorStop(0.84, shadowColor);
    g.addColorStop(1, 'rgba(205, 175, 198, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Cumulus dome ridge builder: stamps clustered sub-puffs for organic cotton-like edges
  const drawCumulusCluster = (
    nx: number,
    ny: number,
    nr: number,
    puffs: number,
    litColor: string,
    midColor: string,
    shadowColor: string,
    opacity = 0.92
  ) => {
    const cx = nx * w;
    const cy = ny * h;
    const baseR = nr * Math.min(w * 0.65, h * 1.15);
    for (let i = 0; i < puffs; i++) {
      const ang = rand() * Math.PI * 2;
      const dist = Math.pow(rand(), 0.7) * baseR * 0.58;
      const px = cx + Math.cos(ang) * dist * 1.15;
      const py = cy + Math.sin(ang) * dist * 0.78;
      const pr = baseR * (0.42 + rand() * 0.45);
      drawCloudPuff(px, py, pr, litColor, midColor, shadowColor, opacity);
    }
  };

  // 1. Distant cool lavender-mauve cumulus silhouette (tall tower on right + gentle left swell, safe below y=0)
  const backNodes: [number, number, number][] = [
    [0.05, 0.72, 0.17],
    [0.16, 0.66, 0.18],
    [0.29, 0.72, 0.16],
    [0.42, 0.67, 0.18],
    [0.55, 0.56, 0.19],
    [0.67, 0.44, 0.20],
    [0.78, 0.37, 0.21],
    [0.89, 0.44, 0.20],
    [0.98, 0.56, 0.18],
  ];
  for (const [nx, ny, nr] of backNodes) {
    drawCumulusCluster(
      nx,
      ny,
      nr,
      14,
      'rgba(250, 218, 204, 0.96)',
      'rgba(198, 176, 208, 0.92)',
      'rgba(154, 148, 192, 0.76)',
      0.92
    );
  }

  // 2. Mid golden-peach & soft lilac billowing cumulus layer (opaque coverage over lower wheel)
  const midNodes: [number, number, number][] = [
    [-0.02, 0.77, 0.19],
    [0.11, 0.71, 0.20],
    [0.23, 0.76, 0.18],
    [0.37, 0.79, 0.19],
    [0.51, 0.66, 0.20],
    [0.63, 0.53, 0.21],
    [0.75, 0.46, 0.22],
    [0.86, 0.53, 0.21],
    [0.97, 0.62, 0.20],
  ];
  for (const [nx, ny, nr] of midNodes) {
    drawCumulusCluster(
      nx,
      ny,
      nr,
      15,
      'rgba(255, 236, 210, 0.98)',
      'rgba(242, 192, 173, 0.96)',
      'rgba(178, 152, 188, 0.86)',
      0.96
    );
  }

  // Solid base cushion across bottom 32% so wheel cards underneath never show through gaps
  const solidBase = ctx.createLinearGradient(0, h * 0.64, 0, h);
  solidBase.addColorStop(0, 'rgba(232, 184, 168, 0)');
  solidBase.addColorStop(0.28, 'rgba(238, 190, 166, 0.95)');
  solidBase.addColorStop(0.65, 'rgba(250, 204, 164, 0.99)');
  solidBase.addColorStop(1, 'rgba(252, 216, 172, 1)');
  ctx.fillStyle = solidBase;
  ctx.fillRect(0, h * 0.62, w, h * 0.38);

  // 3. Foreground sunlit golden-cream cumulus puffs (bright sunset-lit tops across bottom & right)
  const frontNodes: [number, number, number][] = [
    [0.04, 0.82, 0.28],
    [0.17, 0.78, 0.27],
    [0.29, 0.84, 0.28],
    [0.43, 0.86, 0.27],
    [0.56, 0.74, 0.29],
    [0.68, 0.62, 0.30],
    [0.79, 0.55, 0.31],
    [0.90, 0.66, 0.30],
    [0.99, 0.76, 0.27],
    [0.22, 0.96, 0.29],
    [0.50, 0.97, 0.31],
    [0.76, 0.95, 0.32],
    [0.95, 0.96, 0.29],
  ];
  for (const [nx, ny, nr] of frontNodes) {
    drawCumulusCluster(
      nx,
      ny,
      nr,
      12,
      'rgba(255, 244, 224, 0.98)',
      'rgba(253, 207, 158, 0.96)',
      'rgba(234, 174, 148, 0.84)',
      0.95
    );
  }

  // 4. Warm golden-amber horizon wash along the very bottom foreground puffs
  const goldenRim = ctx.createLinearGradient(0, h * 0.74, 0, h);
  goldenRim.addColorStop(0, 'rgba(255, 218, 165, 0)');
  goldenRim.addColorStop(0.55, 'rgba(255, 208, 148, 0.32)');
  goldenRim.addColorStop(1, 'rgba(252, 194, 134, 0.52)');
  ctx.fillStyle = goldenRim;
  ctx.fillRect(0, h * 0.74, w, h * 0.26);
}

const SKY_MOTES = [
  { left: '19%', top: '29%', size: 4, delay: 0.8, duration: 6.5 },
  { left: '41%', top: '21%', size: 3, delay: 2.4, duration: 7.2 },
  { left: '66%', top: '33%', size: 4, delay: 1.5, duration: 6.8 },
  { left: '82%', top: '52%', size: 5, delay: 3.2, duration: 8.0 },
  { left: '12%', top: '61%', size: 4, delay: 2.0, duration: 7.5 },
  { left: '54%', top: '57%', size: 3, delay: 4.1, duration: 6.2 },
] as const;

export const MarqueeSection: React.FC = () => {
  const frameRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const skyCanvasRef = useRef<HTMLCanvasElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const cloudCanvasRef = useRef<HTMLCanvasElement>(null);
  const motesLayerRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const cardCacheRef = useRef<CardCache[]>(
    Array.from({ length: CARD_COUNT }, () => ({
      transform: '',
      visibility: 'hidden',
      zIndex: '',
      playing: false,
    }))
  );
  const sceneCacheRef = useRef({
    stageTransform: '',
    skyOpacity: '',
    cloudTransform: '',
    motesOpacity: '',
  });

  // Two MotionValues drive everything
  const dealMV = useMotionValue(0);
  const liftMV = useMotionValue(0);

  // Layout metrics sized to the hero frame (not window)
  const frameMetricsRef = useRef({
    width: 1280,
    height: 820,
    heightScale: 0.9,
    cardW: 122,
    cardH: 217,
  });
  const [cardSize, setCardSize] = useState({ width: 122, height: 217 });

  // Entrance & asset state
  const [progressPct, setProgressPct] = useState(0);
  const [entranceDone, setEntranceDone] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [runNonce, setRunNonce] = useState(0);

  const assetsReadyRef = useRef(false);
  const dealDoneRef = useRef(false);
  const liftStartedRef = useRef(false);
  const entranceSkippedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const headlineTimerRef = useRef<number | null>(null);
  const animControlsRef = useRef<{ stop: () => void }[]>([]);

  // Gesture & wheel spin state
  const gestureRef = useRef({
    driftAngle: 0,
    targetOffset: 0,
    visibleOffset: 0,
    velocity: 0,
    isDragging: false,
    didDrag: false,
    startX: 0,
    lastX: 0,
    lastMoveTime: 0,
  });

  // Static per-card home angles and symmetrical top-first deal order
  const cardMeta = useMemo(
    () =>
      CARDS.map((_, i) => {
        const homeAngle = (i * 360) / CARD_COUNT;
        const homeDist = Math.abs(wrapAngle(homeAngle));
        const order = homeDist / 180;
        return { homeAngle, order };
      }),
    []
  );

  // Reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotionRef.current = mq.matches;
      setReducedMotion(mq.matches);
      if (mq.matches) {
        dealMV.jump(1);
        liftMV.jump(1);
        assetsReadyRef.current = true;
        dealDoneRef.current = true;
        liftStartedRef.current = true;
        setProgressPct(100);
        setShowHeadline(true);
        setEntranceDone(true);
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [dealMV, liftMV]);

  // Size scene strictly to the hero frame via ResizeObserver
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const updateMetrics = (width: number, height: number) => {
      const safeW = Math.max(320, width);
      const safeH = Math.max(520, height);
      // Max top extent of top card at lift=1 is ((1010 - 814) + cardH*1.35/2) * 1.14 ≈ 410px
      const heightScale = Math.min(1, (safeH * 0.45) / 410);
      const cardW = Math.round(Math.min(BASE_CARD_WIDTH * heightScale, safeW * 0.31));
      const cardH = Math.round((cardW * 16) / 9);
      frameMetricsRef.current = {
        width: safeW,
        height: safeH,
        heightScale,
        cardW,
        cardH,
      };
      setCardSize((prev) =>
        prev.width === cardW && prev.height === cardH ? prev : { width: cardW, height: cardH }
      );
    };

    const rect = el.getBoundingClientRect();
    updateMetrics(rect.width, rect.height);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateMetrics(entry.contentRect.width, entry.contentRect.height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Paint the golden-hour sky & billowing cumulus clouds cleanly when frame dimensions initialize/change
  useEffect(() => {
    const frameEl = frameRef.current;
    const skyCanvas = skyCanvasRef.current;
    const cloudCanvas = cloudCanvasRef.current;
    if (!frameEl || !skyCanvas || !cloudCanvas) return;

    let lastPaintedW = 0;
    const repaint = () => {
      const rect = frameEl.getBoundingClientRect();
      const targetW = Math.min(1440, Math.max(480, Math.round(rect.width)));
      const targetH = Math.min(900, Math.max(420, Math.round(rect.height)));
      if (Math.abs(targetW - lastPaintedW) < 40 && lastPaintedW > 0) return;
      lastPaintedW = targetW;

      skyCanvas.width = targetW;
      skyCanvas.height = targetH;
      paintSunsetSkyCanvas(skyCanvas, targetW, targetH);

      cloudCanvas.width = targetW;
      cloudCanvas.height = Math.round(targetH * 0.62);
      paintCumulusCloudsCanvas(cloudCanvas, cloudCanvas.width, cloudCanvas.height);
    };

    repaint();
    const ro = new ResizeObserver(repaint);
    ro.observe(frameEl);
    return () => ro.disconnect();
  }, []);

  // Skip / finish entrance immediately
  const endEntranceInstantly = useCallback(() => {
    if (entranceSkippedRef.current) return;
    entranceSkippedRef.current = true;
    animControlsRef.current.forEach((c) => c.stop());
    animControlsRef.current = [];
    if (headlineTimerRef.current !== null) {
      window.clearTimeout(headlineTimerRef.current);
      headlineTimerRef.current = null;
    }
    assetsReadyRef.current = true;
    dealDoneRef.current = true;
    liftStartedRef.current = true;
    dealMV.jump(1);
    liftMV.jump(1);
    setProgressPct(100);
    setShowHeadline(true);
    setEntranceDone(true);
  }, [dealMV, liftMV]);

  // Escape & Tab shortcuts end entrance instantly
  useEffect(() => {
    if (entranceDone) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        endEntranceInstantly();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [endEntranceInstantly, entranceDone]);

  // Entrance orchestration: pre-decode covers via img.decode(), then 2.6s linear deal -> 1.9s lift
  useEffect(() => {
    let cancelled = false;
    animControlsRef.current.forEach((c) => c.stop());
    animControlsRef.current = [];
    if (headlineTimerRef.current !== null) {
      window.clearTimeout(headlineTimerRef.current);
      headlineTimerRef.current = null;
    }

    if (reducedMotionRef.current) {
      dealMV.jump(1);
      liftMV.jump(1);
      setProgressPct(100);
      setShowHeadline(true);
      setEntranceDone(true);
      return;
    }

    entranceSkippedRef.current = false;
    assetsReadyRef.current = false;
    dealDoneRef.current = false;
    liftStartedRef.current = false;
    gestureRef.current.driftAngle = 0;
    gestureRef.current.targetOffset = 0;
    gestureRef.current.visibleOffset = 0;
    gestureRef.current.velocity = 0;

    dealMV.jump(0);
    liftMV.jump(0);
    setProgressPct(0);
    setShowHeadline(false);
    setEntranceDone(false);

    const uniqueCovers = Array.from(new Set(CARDS.map((c) => c.cover)));
    let decodedCount = 0;
    let dealStarted = false;

    const updateProgress = () => {
      if (cancelled || entranceSkippedRef.current) return;
      const decodeFrac = decodedCount / Math.max(1, uniqueCovers.length);
      const dealFrac = dealMV.get();
      // 35% real cover decoding + 65% deal + preview readiness
      const pct = Math.min(100, Math.round((decodeFrac * 0.35 + dealFrac * 0.65) * 100));
      setProgressPct(pct);
    };

    const maybeStartLift = () => {
      if (
        cancelled ||
        entranceSkippedRef.current ||
        liftStartedRef.current ||
        !dealDoneRef.current ||
        !assetsReadyRef.current
      ) {
        return;
      }
      liftStartedRef.current = true;
      setProgressPct(100);

      // Header & headline reveal ~1s into the lift while the wheel is still turning
      headlineTimerRef.current = window.setTimeout(() => {
        if (!cancelled) setShowHeadline(true);
      }, 1000);

      const liftAnim = animate(liftMV, 1, {
        duration: LIFT_DURATION_SEC,
        ease: LIFT_EASE,
        onComplete: () => {
          if (!cancelled) {
            setShowHeadline(true);
            setEntranceDone(true);
          }
        },
      });
      animControlsRef.current.push(liftAnim);
    };

    const startDeal = () => {
      if (cancelled || dealStarted || entranceSkippedRef.current) return;
      dealStarted = true;
      const dealAnim = animate(dealMV, 1, {
        duration: DEAL_DURATION_SEC,
        ease: 'linear',
        onUpdate: updateProgress,
        onComplete: () => {
          if (cancelled) return;
          dealDoneRef.current = true;
          updateProgress();
          maybeStartLift();
        },
      });
      animControlsRef.current.push(dealAnim);
    };

    // Decode every cover image via img.decode() BEFORE the deal starts
    Promise.all(
      uniqueCovers.map(async (src) => {
        const img = new Image();
        img.src = src;
        try {
          if (typeof img.decode === 'function') {
            await img.decode();
          } else {
            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
          }
        } catch {
          // Graceful fallback if decode rejects on cached/SVG fallback
        } finally {
          decodedCount += 1;
          updateProgress();
        }
      })
    ).then(() => {
      if (cancelled || entranceSkippedRef.current) return;
      assetsReadyRef.current = true;
      startDeal();
      maybeStartLift();
    });

    return () => {
      cancelled = true;
      animControlsRef.current.forEach((c) => c.stop());
      animControlsRef.current = [];
      if (headlineTimerRef.current !== null) {
        window.clearTimeout(headlineTimerRef.current);
        headlineTimerRef.current = null;
      }
    };
  }, [dealMV, liftMV, runNonce]);

  // Single requestAnimationFrame loop driving all 34 cards, scene world, gestures & video playback
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const deal = dealMV.get();
      const lift = liftMV.get();
      const g = gestureRef.current;

      // Continuous slow left drift (-7 deg/s scaled by lift) — skipped on prefers-reduced-motion
      if (!reducedMotionRef.current && lift > 0.001) {
        g.driftAngle += DRIFT_DEG_PER_SEC * lift * dt;
      }

      // Momentum decay after release & exponential follow toward target angle
      if (!g.isDragging && Math.abs(g.velocity) > 0.05) {
        g.targetOffset += g.velocity * dt;
        g.velocity *= Math.exp(-dt * 3.2);
      } else if (!g.isDragging) {
        g.velocity = 0;
      }

      const followAlpha = 1 - Math.exp(-dt * 9);
      g.visibleOffset += (g.targetOffset - g.visibleOffset) * followAlpha;

      const wheelSpin = g.driftAngle + g.visibleOffset;
      const { heightScale } = frameMetricsRef.current;

      // Scene-level tilt (-12deg X) & +14% scale + painted sky + volumetric cloud bank + subtle warm motes
      const stageEl = stageRef.current;
      const skyEl = skyRef.current;
      const cloudEl = cloudRef.current;
      const motesEl = motesLayerRef.current;
      const sc = sceneCacheRef.current;

      const nextStageTransform = `rotateX(${(-12 * lift).toFixed(3)}deg) scale(${(1 + 0.14 * lift).toFixed(4)})`;
      if (stageEl && sc.stageTransform !== nextStageTransform) {
        stageEl.style.transform = nextStageTransform;
        sc.stageTransform = nextStageTransform;
      }

      const nextSkyOpacity = lift.toFixed(4);
      if (skyEl && sc.skyOpacity !== nextSkyOpacity) {
        skyEl.style.opacity = nextSkyOpacity;
        sc.skyOpacity = nextSkyOpacity;
      }

      if (motesEl && sc.motesOpacity !== nextSkyOpacity) {
        motesEl.style.opacity = nextSkyOpacity;
        sc.motesOpacity = nextSkyOpacity;
      }

      const cloudY = (1 - lift) * 105;
      const nextCloudTransform = `translate3d(0px, ${cloudY.toFixed(2)}%, 0px)`;
      if (cloudEl && sc.cloudTransform !== nextCloudTransform) {
        cloudEl.style.transform = nextCloudTransform;
        sc.cloudTransform = nextCloudTransform;
      }

      // Update all 34 cards with strict style-cache checks (skip DOM writes when unchanged)
      const cache = cardCacheRef.current;
      for (let i = 0; i < CARD_COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const meta = cardMeta[i];
        const pose = computeCardPose({
          homeAngle: meta.homeAngle,
          order: meta.order,
          deal,
          lift,
          wheelSpin,
          heightScale,
        });

        const c = cache[i];
        const nextVis: 'visible' | 'hidden' = pose.visible ? 'visible' : 'hidden';
        if (c.visibility !== nextVis) {
          el.style.visibility = nextVis;
          c.visibility = nextVis;
        }

        if (pose.visible) {
          if (c.transform !== pose.transform) {
            el.style.transform = pose.transform;
            c.transform = pose.transform;
          }
          const nextZ = String(pose.zIndex);
          if (c.zIndex !== nextZ) {
            el.style.zIndex = nextZ;
            c.zIndex = nextZ;
          }
        }

        // Video playback gate: lift > 0.6 and within 40deg of top
        const videoEl = videoRefs.current[i];
        if (videoEl) {
          const shouldPlay =
            !reducedMotionRef.current && lift > 0.6 && pose.visible && pose.distFromTop <= 40;
          if (shouldPlay !== c.playing) {
            c.playing = shouldPlay;
            if (shouldPlay) {
              const playPromise = videoEl.play();
              if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                  // Ignore autoplay interruption when rapidly scrubbing
                });
              }
            } else {
              videoEl.pause();
              if (videoEl.style.opacity !== '0') {
                videoEl.style.opacity = '0';
              }
            }
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [cardMeta, dealMV, liftMV]);

  /* ---------- Gestures: Drag, Swipe & Horizontal Wheel ---------- */

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if ((e.target as HTMLElement | null)?.closest('button')) return;

    const g = gestureRef.current;
    g.isDragging = true;
    g.didDrag = false;
    g.startX = e.clientX;
    g.lastX = e.clientX;
    g.lastMoveTime = performance.now();
    g.velocity = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const g = gestureRef.current;
    if (!g.isDragging) return;

    const now = performance.now();
    const dx = e.clientX - g.lastX;
    const totalDx = Math.abs(e.clientX - g.startX);

    if (totalDx > 6 && !g.didDrag) {
      g.didDrag = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable
      }
    }

    const dt = Math.max(0.004, (now - g.lastMoveTime) / 1000);
    const deltaDeg = dx * 0.24;
    g.targetOffset += deltaDeg;
    g.velocity = Math.max(-280, Math.min(280, deltaDeg / dt));
    g.lastX = e.clientX;
    g.lastMoveTime = now;
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLElement>) => {
    const g = gestureRef.current;
    if (!g.isDragging) return;
    g.isDragging = false;

    // Ignore release velocity if pointer paused for > 80ms before release
    if (performance.now() - g.lastMoveTime > 80) {
      g.velocity = 0;
    }

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    // Clear didDrag after click phase resolves
    window.setTimeout(() => {
      g.didDrag = false;
    }, 40);
  };

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Allow normal vertical page scrolling; turn the wheel on horizontal swipe or Shift+wheel
      const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!horizontalIntent) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      gestureRef.current.targetOffset -= delta * 0.16;
      gestureRef.current.velocity = 0;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, card: WheelCardData) => {
    if (gestureRef.current.didDrag) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!card.external && card.href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(card.href.slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={frameRef}
      aria-label="Interactive 3D video showcase wheel"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className="relative h-[min(92vh,840px)] min-h-[600px] w-full select-none overflow-hidden bg-[#0C0C0C] [touch-action:pan-y]"
      style={{ perspective: '1400px' }}
    >
      {/* THE WORLD: Painted golden-hour sky behind the wheel (fades in during lift) */}
      <div
        ref={skyRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ opacity: 0 }}
      >
        <canvas
          ref={skyCanvasRef}
          className="h-full w-full object-cover"
        />
        {/* Subtle slow-drifting high altitude pink/cream cirrus wisps */}
        {!reducedMotion && (
          <motion.div
            animate={{ x: ['-3%', '3%', '-3%'] }}
            transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-x-10 top-0 h-[42%] opacity-55"
            style={{
              background:
                'radial-gradient(ellipse 38% 14% at 72% 24%, rgba(255, 224, 206, 0.42) 0%, transparent 72%), radial-gradient(ellipse 32% 12% at 24% 38%, rgba(247, 206, 214, 0.32) 0%, transparent 72%)',
            }}
          />
        )}
        {/* Delicate top edge vignette so Hero section merges softly into the bright sky */}
        <div
          className="absolute inset-x-0 top-0 h-8"
          style={{
            background: 'linear-gradient(180deg, rgba(12,12,12,0.55) 0%, rgba(12,12,12,0) 100%)',
          }}
        />
      </div>

      {/* Delayed Header & Editorial Ink Headline at Bottom over sunlit cumulus clouds */}
      <motion.div
        initial={false}
        animate={{
          opacity: showHeadline ? 1 : 0,
        }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-28"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,232,202,0) 0%, rgba(252,216,178,0.22) 65%, rgba(12,12,12,0.28) 96%, rgba(12,12,12,0.72) 100%)',
        }}
      />
      <motion.header
        initial={false}
        animate={{
          opacity: showHeadline ? 1 : 0,
          y: showHeadline ? 0 : 18,
        }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-7 z-30 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:bottom-9 md:bottom-11"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#282032]/85 drop-shadow-[0_1px_8px_rgba(255,244,226,0.7)] sm:text-xs">
          Applied AI &middot; RAG Pipelines &middot; Full-Stack Engineering
        </p>
        <h2
          className="mt-1.5 font-black uppercase leading-none tracking-tight text-[#16131C] drop-shadow-[0_2px_16px_rgba(255,242,218,0.75)]"
          style={{ fontSize: 'clamp(1.75rem, 4.4vw, 3.6rem)' }}
        >
          Built &amp; Shipped
        </h2>
      </motion.header>

      {/* Progress Counter during Deal & visible Skip / Replay control */}
      <div className="absolute top-5 right-5 z-40 flex items-center gap-3 sm:top-7 sm:right-8">
        {!entranceDone && (
          <>
            <span
              role="status"
              aria-live="polite"
              className="rounded-full border border-white/25 bg-[#0C0C0C]/65 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums backdrop-blur-md"
            >
              {progressPct}%
            </span>
            <button
              type="button"
              onClick={endEntranceInstantly}
              className="cursor-pointer rounded-full border border-white/40 bg-white/90 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0C0C0C] shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Skip intro
            </button>
          </>
        )}
        {entranceDone && !reducedMotion && (
          <button
            type="button"
            onClick={() => setRunNonce((n) => n + 1)}
            className="cursor-pointer rounded-full border border-white/30 bg-[#0C0C0C]/55 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md transition-colors hover:border-white hover:bg-[#0C0C0C]/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Replay deck
          </button>
        )}
      </div>

      {/* THE WHEEL: 3D Stage */}
      <div
        ref={stageRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {CARDS.map((card, i) => (
            <a
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              onClick={(e) => handleCardClick(e, card)}
              aria-label={`${card.title} — ${card.subtitle}`}
              className="group pointer-events-auto absolute top-1/2 left-1/2 block overflow-hidden rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                width: `${cardSize.width}px`,
                height: `${cardSize.height}px`,
                marginLeft: `${-cardSize.width / 2}px`,
                marginTop: `${-cardSize.height / 2}px`,
                transformStyle: 'preserve-3d',
                visibility: 'hidden',
                willChange: 'transform',
              }}
            >
              <span className="sr-only">
                {card.title} — {card.subtitle}
              </span>

              {/* FRONT FACE */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[18px] border border-[#D7E2EA]/30 bg-[#12151C] shadow-[0_18px_42px_rgba(0,0,0,0.65)]"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <img
                  src={card.cover}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={card.video}
                  muted
                  loop
                  playsInline
                  preload="none"
                  onPlaying={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onPause={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                  style={{ opacity: 0 }}
                />

                {/* Legible bottom metadata scrim */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-2.5 pt-10 text-left"
                >
                  <span className="font-mono text-[8px] font-semibold uppercase tracking-widest text-[#BBCCD7]">
                    {card.tag}
                  </span>
                  <span className="truncate text-xs font-semibold leading-tight text-white">
                    {card.title}
                  </span>
                </div>
              </div>

              {/* BACK FACE (ink panel with serif monogram visible during 180->0 flip) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[18px] border border-[#D7E2EA]/30 bg-[#101318] shadow-[0_18px_42px_rgba(0,0,0,0.65)]"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="flex h-[84%] w-[82%] flex-col items-center justify-center rounded-[12px] border border-[#D7E2EA]/20 bg-[radial-gradient(circle_at_50%_35%,rgba(187,204,215,0.12),transparent_70%)]">
                  <span
                    className="text-3xl font-black text-[#D7E2EA]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    P
                  </span>
                  <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.28em] text-[#BBCCD7]/55">
                    Deck
                  </span>
                </div>
              </div>
            </a>
        ))}
      </div>

      {/* VOLUMETRIC CUMULUS CLOUD BANK: Rises in front of the wheel's lower half */}
      <div
        ref={cloudRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[62%] min-h-[320px]"
        style={{
          transform: 'translate3d(0px, 105%, 0px)',
          willChange: 'transform',
        }}
      >
        <canvas
          ref={cloudCanvasRef}
          className="h-full w-full object-cover"
        />
      </div>

      {/* SOFT WARM SKY MOTES (visible once sky lifts) */}
      <div
        ref={motesLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[22] overflow-hidden"
        style={{ opacity: 0 }}
      >
        {!reducedMotion &&
          SKY_MOTES.map((mote, idx) => (
            <motion.span
              key={`mote-${idx}`}
              className="absolute rounded-full bg-[#FFE9BD]"
              style={{
                left: mote.left,
                top: mote.top,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                boxShadow: '0 0 8px rgba(255, 232, 178, 0.85)',
              }}
              animate={{
                opacity: [0.15, 0.65, 0.15],
                scale: [0.85, 1.15, 0.85],
              }}
              transition={{
                duration: mote.duration,
                delay: mote.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
