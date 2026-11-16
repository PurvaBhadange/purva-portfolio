import React, { useEffect, useMemo, useRef } from 'react';

/* ---------- 3D-shaded cutout SVG stickers (coffee, error, fun + dev/AI) ---------- */
const svgUrl = (body: string): string =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${body}</svg>`
  );

export interface TypeMotionSticker {
  name: string;
  src: string;
}

export const STICKERS: TypeMotionSticker[] = [
  {
    name: 'Hyperfocused',
    src: svgUrl(`
      <defs>
        <radialGradient id="hfRing" cx="35%" cy="30%" r="68%">
          <stop offset="0" stop-color="#ff8a80"/>
          <stop offset="0.55" stop-color="#ef4444"/>
          <stop offset="1" stop-color="#991b1b"/>
        </radialGradient>
        <radialGradient id="hfCore" cx="35%" cy="30%" r="65%">
          <stop offset="0" stop-color="#fef08a"/>
          <stop offset="0.5" stop-color="#facc15"/>
          <stop offset="1" stop-color="#ea580c"/>
        </radialGradient>
      </defs>
      <circle cx="60" cy="64" r="44" fill="#450a0a"/>
      <circle cx="60" cy="60" r="44" fill="url(#hfRing)"/>
      <circle cx="60" cy="60" r="30" fill="#f8fafc"/>
      <circle cx="60" cy="60" r="18" fill="url(#hfRing)"/>
      <circle cx="60" cy="60" r="9" fill="url(#hfCore)"/>
      <path d="M60 10v14M60 96v14M10 60h14M96 60h14" stroke="#fde047" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="42" cy="34" rx="11" ry="5.5" fill="#ffffff" opacity="0.35" transform="rotate(-32 42 34)"/>
    `),
  },
  {
    name: 'Infinite Curiosity',
    src: svgUrl(`
      <defs>
        <linearGradient id="loopBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#38bdf8"/>
          <stop offset="0.55" stop-color="#2563eb"/>
          <stop offset="1" stop-color="#1e1b4b"/>
        </linearGradient>
      </defs>
      <rect x="14" y="24" width="92" height="72" rx="24" fill="#0f172a" transform="translate(0 5)"/>
      <rect x="14" y="24" width="92" height="72" rx="24" fill="url(#loopBg)"/>
      <path d="M41 46c-9 0-15 6-15 14s6 14 15 14c12 0 26-28 38-28 9 0 15 6 15 14s-6 14-15 14c-12 0-26-28-38-28Z" fill="none" stroke="#ffffff" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M36 33h14" stroke="#bae6fd" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>
    `),
  },
  {
    name: 'Merge Conflicts',
    src: svgUrl(`
      <defs>
        <linearGradient id="mergeG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fb923c"/>
          <stop offset="0.6" stop-color="#ea580c"/>
          <stop offset="1" stop-color="#9a3412"/>
        </linearGradient>
      </defs>
      <rect x="18" y="18" width="84" height="84" rx="24" fill="#431407" transform="translate(0 4)"/>
      <rect x="18" y="18" width="84" height="84" rx="24" fill="url(#mergeG)"/>
      <g fill="none" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round">
        <path d="M40 38v44M40 76c0-18 36-8 36-26"/>
        <circle cx="40" cy="34" r="6.5" fill="#fb923c"/>
        <circle cx="40" cy="84" r="6.5" fill="#fb923c"/>
        <circle cx="76" cy="40" r="6.5" fill="#fef08a"/>
      </g>
      <circle cx="84" cy="82" r="13" fill="#fef08a"/>
      <path d="M84 75v8" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="84" cy="89" r="2" fill="#7c2d12"/>
    `),
  },
  {
    name: 'Python Powered',
    src: svgUrl(`
      <defs>
        <linearGradient id="pyBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#60a5fa"/>
          <stop offset="0.55" stop-color="#3776ab"/>
          <stop offset="1" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="pyGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fef08a"/>
          <stop offset="0.55" stop-color="#ffd43b"/>
          <stop offset="1" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <path d="M59 14c-18 0-17 8-17 8l0 9h18v4H34s-14-1.5-14 19 12 20 12 20h7v-10s-.4-12 12-12h19s11 .2 11-11V24s1.7-10-22-10Zm-10 6a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2Z" fill="url(#pyBlue)"/>
      <path d="M61 106c18 0 17-8 17-8l0-9H60v-4h26s14 1.5 14-19-12-20-12-20h-7v10s.4 12-12 12H50s-11-.2-11 11v17s-1.7 10 22 10Zm10-6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z" fill="url(#pyGold)"/>
    `),
  },
  {
    name: 'Unreasonably Curious',
    src: svgUrl(`
      <defs>
        <linearGradient id="ucLens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#e0f2fe"/>
          <stop offset="0.6" stop-color="#7dd3fc"/>
          <stop offset="1" stop-color="#0284c7"/>
        </linearGradient>
        <linearGradient id="ucRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#c084fc"/>
          <stop offset="1" stop-color="#6d28d9"/>
        </linearGradient>
      </defs>
      <path d="M72 72l26 26" stroke="#4c1d95" stroke-width="14" stroke-linecap="round"/>
      <path d="M72 72l26 26" stroke="url(#ucRim)" stroke-width="10" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="32" fill="url(#ucRim)"/>
      <circle cx="50" cy="50" r="23" fill="url(#ucLens)"/>
      <path d="M44 43c0-4 3-7 7-7 4 0 7 3 7 6 0 4-6 5-6 9" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="52" cy="60" r="2.8" fill="#0f172a"/>
      <ellipse cx="38" cy="37" rx="7" ry="4" fill="#ffffff" opacity="0.65" transform="rotate(-30 38 37)"/>
    `),
  },
  {
    name: 'Research Rabbit Hole',
    src: svgUrl(`
      <defs>
        <radialGradient id="hole" cx="50%" cy="55%" r="55%">
          <stop offset="0" stop-color="#090d16"/>
          <stop offset="0.6" stop-color="#312e81"/>
          <stop offset="1" stop-color="#6366f1"/>
        </radialGradient>
        <linearGradient id="ear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="82" rx="44" ry="20" fill="url(#hole)"/>
      <ellipse cx="60" cy="82" rx="34" ry="13" fill="#090d16" stroke="#818cf8" stroke-width="3" stroke-dasharray="8 6"/>
      <ellipse cx="46" cy="40" rx="10" ry="25" fill="url(#ear)" transform="rotate(-12 46 40)"/>
      <ellipse cx="46" cy="41" rx="5" ry="16" fill="#f9a8d4" transform="rotate(-12 46 41)"/>
      <ellipse cx="74" cy="40" rx="10" ry="25" fill="url(#ear)" transform="rotate(12 74 40)"/>
      <ellipse cx="74" cy="41" rx="5" ry="16" fill="#f9a8d4" transform="rotate(12 74 41)"/>
      <path d="M36 74c2-15 12-24 24-24s22 9 24 24c-7 4-15 6-24 6s-17-2-24-6Z" fill="url(#ear)"/>
      <circle cx="51" cy="66" r="3.4" fill="#0f172a"/>
      <circle cx="69" cy="66" r="3.4" fill="#0f172a"/>
      <ellipse cx="60" cy="72" rx="3.5" ry="2.4" fill="#f472b6"/>
    `),
  },
  {
    name: 'Vibe Coder',
    src: svgUrl(`
      <defs>
        <linearGradient id="vibeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#5eead4"/>
          <stop offset="0.5" stop-color="#8b5cf6"/>
          <stop offset="1" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      <path d="M24 62v-6a36 36 0 0 1 72 0v6" fill="none" stroke="url(#vibeGrad)" stroke-width="11" stroke-linecap="round"/>
      <rect x="14" y="54" width="18" height="36" rx="9" fill="#0f172a" stroke="#5eead4" stroke-width="3.5"/>
      <rect x="88" y="54" width="18" height="36" rx="9" fill="#0f172a" stroke="#ec4899" stroke-width="3.5"/>
      <path d="M44 68l-9 8 9 8M76 68l9 8-9 8M64 64l-8 24" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    `),
  },
  {
    name: 'Always Building',
    src: svgUrl(`
      <defs>
        <linearGradient id="abCubeTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fef08a"/>
          <stop offset="1" stop-color="#f59e0b"/>
        </linearGradient>
        <linearGradient id="abCubeL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#60a5fa"/>
          <stop offset="1" stop-color="#2563eb"/>
        </linearGradient>
        <linearGradient id="abCubeR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#34d399"/>
          <stop offset="1" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <polygon points="60,16 96,36 60,56 24,36" fill="url(#abCubeTop)"/>
      <polygon points="24,36 60,56 60,98 24,78" fill="url(#abCubeL)"/>
      <polygon points="96,36 60,56 60,98 96,78" fill="url(#abCubeR)"/>
      <path d="M60 16l36 20v42L60 98 24 78V36Z" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" opacity="0.6"/>
      <path d="M44 29c4-3 11-5 16-5" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.75"/>
    `),
  },
  {
    name: 'Bug Hunt',
    src: svgUrl(`
      <defs>
        <radialGradient id="shell" cx="35%" cy="30%" r="65%">
          <stop offset="0" stop-color="#ff8a80"/>
          <stop offset="0.55" stop-color="#ef4444"/>
          <stop offset="1" stop-color="#7f1d1d"/>
        </radialGradient>
      </defs>
      <path d="M34 46L14 36M31 64H10M35 82L16 94M86 46l20-10M89 64h21M85 82l19 12M48 25L40 12M72 25l8-13" stroke="#991b1b" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="60" cy="68" rx="28" ry="33" fill="url(#shell)"/>
      <circle cx="60" cy="33" r="15" fill="#1e293b"/>
      <ellipse cx="47" cy="54" rx="7" ry="12" fill="#ffffff" opacity="0.28" transform="rotate(-18 47 54)"/>
      <path d="M60 44v56" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      <circle cx="47" cy="58" r="4.5" fill="#1e293b"/>
      <circle cx="73" cy="66" r="4.5" fill="#1e293b"/>
      <circle cx="48" cy="79" r="3.8" fill="#1e293b"/>
    `),
  },
  {
    name: 'Ship It!',
    src: svgUrl(`
      <defs>
        <linearGradient id="hull" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f8fafc"/>
          <stop offset="0.6" stop-color="#cbd5e1"/>
          <stop offset="1" stop-color="#64748b"/>
        </linearGradient>
        <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fde047"/>
          <stop offset="0.6" stop-color="#f97316"/>
          <stop offset="1" stop-color="#dc2626"/>
        </linearGradient>
      </defs>
      <g transform="rotate(35 60 60)">
        <path d="M51 86c0 12 9 22 9 22s9-10 9-22Z" fill="url(#flame)"/>
        <path d="M36 62l-10 22 18-6ZM84 62l10 22-18-6Z" fill="#ef4444"/>
        <path d="M60 12c17 16 22 38 18 68H42c-4-30 1-52 18-68Z" fill="url(#hull)"/>
        <path d="M47 28c4-7 8-12 13-16 5 4 9 9 13 16Z" fill="#ef4444"/>
        <circle cx="60" cy="48" r="10" fill="#1e293b"/>
        <circle cx="60" cy="48" r="6.5" fill="#38bdf8"/>
        <circle cx="58" cy="46" r="2.2" fill="#ffffff"/>
      </g>
    `),
  },
  {
    name: 'Terminal',
    src: svgUrl(`
      <defs>
        <linearGradient id="term" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#334155"/>
          <stop offset="1" stop-color="#090d16"/>
        </linearGradient>
      </defs>
      <rect x="14" y="20" width="92" height="80" rx="20" fill="#020617" transform="translate(0 5)"/>
      <rect x="14" y="20" width="92" height="80" rx="20" fill="url(#term)" stroke="#64748b" stroke-width="2.5"/>
      <path d="M22 36h76" stroke="#475569" stroke-width="2"/>
      <circle cx="29" cy="29" r="3.2" fill="#f87171"/>
      <circle cx="40" cy="29" r="3.2" fill="#facc15"/>
      <circle cx="51" cy="29" r="3.2" fill="#4ade80"/>
      <path d="M34 52l18 14-18 14M60 80h24" fill="none" stroke="#4ade80" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    `),
  },
];

/* ---------- helpers ---------- */
const sm = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));
const isLetterChar = (ch: string): boolean => /[A-Za-z0-9]/.test(ch);

const SHADOW = 'drop-shadow(0 .07em .09em rgba(0,0,0,.5))';

const GLYPH: React.CSSProperties = {
  background: 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
};

interface LetterState {
  i: number;
  k: number;
  ch: string;
  a: number;
  v: number;
  obj: number;
  shown: number;
  txt: string;
  tapUntil: number;
  intro: number;
  t0: number;
  sx: number;
  sy: number;
  ss: number;
  rx: number;
  ry: number;
  cx: number;
  cy: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  vis: boolean;
}

interface TypeMotionProps {
  text?: string;
  items?: TypeMotionSticker[];
  fontFamily?: string;
  fontSize?: string;
  glyphStyle?: React.CSSProperties;
  minHeight?: string;
}

export const TypeMotion: React.FC<TypeMotionProps> = ({
  text = "HI, I'M PURVA",
  items = STICKERS,
  fontFamily = "'Playfair Display', Georgia, 'Times New Roman', serif",
  fontSize = 'clamp(2.35rem, 9.6vw, 8.2rem)',
  glyphStyle,
  minHeight = 'clamp(135px, 19vh, 210px)',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const cntRef = useRef<HTMLDivElement>(null);
  const el = useRef<{
    g: (HTMLSpanElement | null)[];
    o: (HTMLDivElement | null)[];
    w: (HTMLSpanElement | null)[];
    r: (HTMLImageElement | null)[];
  }>({ g: [], o: [], w: [], r: [] });

  const chars = useMemo(() => [...text], [text]);
  const ks = useMemo(() => {
    let c = 0;
    return chars.map((ch) => (isLetterChar(ch) ? c++ : -1));
  }, [chars]);
  const K = ks.filter((k) => k >= 0).length;
  const n = items.length;

  // Map each letter character deterministically to a sticker whose label starts with that exact letter
  const letterObjs = useMemo(() => {
    const seenCounts: Record<string, number> = {};
    const out: number[] = [];
    chars.forEach((ch) => {
      if (!isLetterChar(ch)) return;
      const upper = ch.toUpperCase();
      const occ = seenCounts[upper] ?? 0;
      seenCounts[upper] = occ + 1;
      const matches = items
        .map((it, idx) => ({ it, idx }))
        .filter(({ it }) => it.name.trim().toUpperCase().startsWith(upper));
      if (matches.length > 0) {
        out.push(matches[occ % matches.length].idx);
      } else {
        out.push(out.length % Math.max(1, n));
      }
    });
    return out;
  }, [chars, items, n]);

  useEffect(() => {
    const root = rootRef.current;
    const head = headRef.current;
    const cap = capRef.current;
    const cnt = cntRef.current;
    const E = el.current;
    if (!root || !head || !cap || !cnt) return;

    const L: LetterState[] = [];
    chars.forEach((ch, i) => {
      if (isLetterChar(ch)) {
        const k = L.length;
        L.push({
          i,
          k,
          ch,
          a: 1,
          v: 0,
          obj: letterObjs[k] ?? k % n,
          shown: -1,
          txt: ch,
          tapUntil: 0,
          intro: 0,
          t0: 0,
          sx: 0,
          sy: 0,
          ss: 1,
          rx: 0,
          ry: 0,
          cx: 0,
          cy: 0,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          vis: false,
        });
      }
    });

    const S = {
      phase: 'load' as 'load' | 'fly' | 'live',
      loaded: 0,
      pct: 0,
      t0: performance.now(),
      introT: 0,
      px: -1e4,
      py: -1e4,
      hover: -1,
      em: 60,
      cl: -1,
    };

    items.forEach((it) => {
      const im = new Image();
      im.onload = im.onerror = () => {
        S.loaded++;
      };
      im.src = it.src;
    });

    const mv = (e: PointerEvent) => {
      S.px = e.clientX;
      S.py = e.clientY;
    };

    const lv = () => {
      S.px = -1e4;
      S.py = -1e4;
    };

    const dn = (e: PointerEvent) => {
      mv(e);
      if (S.phase !== 'live' || e.pointerType === 'mouse') return;
      const rr = root.getBoundingClientRect();
      const x = e.clientX - rr.left;
      const y = e.clientY - rr.top;
      const hit = L.find(
        (l) => x >= l.left && x <= l.right && y >= l.top && y <= l.bottom
      );
      if (hit) {
        hit.tapUntil = performance.now() + 900;
      }
    };

    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerdown', dn);
    document.addEventListener('pointerleave', lv);

    let prev = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const rr = root.getBoundingClientRect();
      const W = rr.width;
      const H = rr.height;

      let em = 60;
      L.forEach((l) => {
        const wEl = E.w[l.i];
        if (!wEl) return;
        const r = wEl.getBoundingClientRect();
        l.left = r.left - rr.left;
        l.right = r.right - rr.left;
        l.top = r.top - rr.top;
        l.bottom = r.bottom - rr.top;
        l.cx = (l.left + l.right) / 2;
        l.cy = (l.top + l.bottom) / 2;
        if (r.height > 0) em = r.height;
      });
      S.em = em;

      const px = S.px - rr.left;
      const py = S.py - rr.top;

      // spinning loader ring -> 100% -> eased arc flight -> left-to-right spring back
      const rad = Math.max(46, Math.min(W * 0.24, H * 0.35));
      const sz = Math.max(34, Math.min(82, em * 0.72));
      if (S.phase !== 'live') {
        const elapsed = now - S.t0;
        const real = S.loaded / Math.max(1, n);
        if (S.phase === 'load') {
          S.pct +=
            (Math.min(real, elapsed / 1400) - S.pct) * Math.min(1, dt * 8);
          if (real >= 1 && elapsed >= 1400 && S.pct > 0.99) {
            S.pct = 1;
            S.phase = 'fly';
            S.introT = now;
            cnt.style.opacity = '0';
          }
          const p = Math.floor(S.pct * 100);
          if (p !== S.cl) {
            S.cl = p;
            cnt.textContent = `${p}%`;
          }
        }
        L.forEach((l) => {
          const ang = now * 0.0007 + (l.k / L.length) * Math.PI * 2;
          l.rx = W / 2 + Math.cos(ang) * rad;
          l.ry = H / 2 + Math.sin(ang) * rad;
          const rEl = E.r[l.k];
          if (rEl && l.intro === 0) {
            rEl.style.width = rEl.style.height = `${sz}px`;
            rEl.style.transform = `translate(${l.rx - sz / 2}px,${l.ry - sz / 2}px) rotate(${Math.sin(ang * 2) * 10}deg)`;
          }
          if (S.phase === 'fly' && l.intro === 0 && now >= S.introT + l.k * 90) {
            l.intro = 1;
            l.t0 = now;
            l.sx = l.rx;
            l.sy = l.ry;
            l.ss = sz / em;
            if (rEl) rEl.style.display = 'none';
          }
        });
        if (S.phase === 'fly' && L.every((l) => l.intro === 2)) {
          S.phase = 'live';
        }
      }

      // strict per-letter bounding-box hover detection
      let hk = -1;
      L.forEach((l) => {
        if (px >= l.left && px <= l.right && py >= l.top && py <= l.bottom) {
          hk = l.k;
        }
      });
      S.hover = hk;

      let best: { X: number; Y: number; s: number; l: LetterState } | null =
        null;
      let amax = 0;

      L.forEach((l) => {
        const gEl = E.g[l.i];
        const oEl = E.o[l.i];
        if (!gEl || !oEl) return;

        const hovered = l.k === hk || now < l.tapUntil;
        const tg = l.intro < 2 || hovered ? 1 : 0;

        if (l.ch !== l.txt) {
          l.txt = l.ch;
          gEl.textContent = l.ch;
        }

        if (l.intro === 1) {
          l.a = 1;
          l.v = 0;
        } else {
          l.v += ((tg - l.a) * 240 - l.v * 19) * dt;
          l.a += l.v * dt;
        }

        let X = l.cx;
        let Y = l.cy;
        let s = Math.max(0, l.a);
        let rot = Math.sin(now / 500 + l.k * 1.7) * 8 * s;

        if (l.intro === 1) {
          const p = Math.min(1, (now - l.t0) / 700);
          const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
          X = lerp(l.sx, l.cx, e);
          Y =
            lerp(l.sy, l.cy, e) -
            Math.hypot(l.cx - l.sx, l.cy - l.sy) * 0.25 * Math.sin(Math.PI * e);
          s = lerp(l.ss, 1, e);
          rot = (1 - e) * (l.k % 2 ? 200 : -200);
          if (p >= 1) {
            l.intro = 2;
            l.a = 1;
            l.v = 0;
          }
        }

        const visible = l.intro > 0 && s > 0.001;
        if (visible !== l.vis) {
          l.vis = visible;
          oEl.style.display = visible ? '' : 'none';
        }
        if (visible) {
          if (l.obj !== l.shown) {
            const prevChild =
              l.shown >= 0
                ? (oEl.children[l.shown] as HTMLElement | undefined)
                : undefined;
            const nextChild = oEl.children[l.obj] as HTMLElement | undefined;
            if (prevChild) prevChild.style.visibility = 'hidden';
            if (nextChild) nextChild.style.visibility = 'visible';
            l.shown = l.obj;
          }
          oEl.style.opacity = '1';
          oEl.style.transform = `translate(-50%,-50%) translate(${X - l.cx}px,${Y - l.cy}px) rotate(${rot}deg) scale(${s})`;
          if (l.intro === 2 && s > amax) {
            amax = Math.min(s, 1);
            best = { X, Y, s, l };
          }
        }
        gEl.style.transform = `scale(${clamp(1 - l.a, 0, 1.3)})`;
      });

      // caption under the active hovered sticker
      if (best && S.phase === 'live') {
        const chosen = best as {
          X: number;
          Y: number;
          s: number;
          l: LetterState;
        };
        const t = items[chosen.l.obj].name;
        if (cap.textContent !== t) cap.textContent = t;
        const halfCap = cap.offsetWidth / 2;
        const capX = clamp(
          chosen.X,
          halfCap + 6,
          Math.max(halfCap + 6, W - halfCap - 6)
        );
        cap.style.opacity = String(sm(0.35, 0.9, amax));
        cap.style.transform = `translate(${capX}px,${chosen.Y + em * 0.5 * chosen.s + 6}px) translateX(-50%)`;
      } else {
        cap.style.opacity = '0';
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', mv);
      window.removeEventListener('pointerdown', dn);
      document.removeEventListener('pointerleave', lv);
    };
  }, [chars, items, letterObjs, n]);

  return (
    <div
      ref={rootRef}
      className="relative grid w-full place-items-center overflow-visible pb-4 sm:pb-5"
      style={{ minHeight }}
    >
      <h1
        ref={headRef}
        aria-label={text}
        className="m-0 whitespace-nowrap select-none text-center font-black leading-none tracking-[-0.02em]"
        style={{ fontFamily, fontSize }}
      >
        {chars.map((ch, i) =>
          !ch.trim() ? (
            <span key={i} className="inline-block w-[0.28em]" />
          ) : ks[i] < 0 ? (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block"
              style={{
                ...GLYPH,
                ...glyphStyle,
              }}
            >
              {ch}
            </span>
          ) : (
            <span
              key={i}
              ref={(node) => {
                el.current.w[i] = node;
              }}
              aria-hidden="true"
              className="relative inline-block cursor-pointer"
            >
              <span
                ref={(node) => {
                  el.current.g[i] = node;
                }}
                style={{
                  display: 'inline-block',
                  transform: 'scale(0)',
                  ...GLYPH,
                  ...glyphStyle,
                }}
              >
                {ch}
              </span>
              <div
                ref={(node) => {
                  el.current.o[i] = node;
                }}
                className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[1em] w-[1em] will-change-transform"
                style={{ filter: SHADOW }}
              >
                {items.map((it) => (
                  <img
                    key={it.name}
                    src={it.src}
                    alt=""
                    draggable={false}
                    className="invisible absolute inset-0 h-full w-full object-contain"
                  />
                ))}
              </div>
            </span>
          )
        )}
      </h1>

      {/* loader ring + counter */}
      {Array.from({ length: K }, (_, k) => (
        <img
          key={k}
          ref={(node) => {
            el.current.r[k] = node;
          }}
          src={items[letterObjs[k] ?? k % n].src}
          alt=""
          draggable={false}
          className="pointer-events-none absolute top-0 left-0 will-change-transform"
          style={{ filter: SHADOW }}
        />
      ))}

      <div
        ref={cntRef}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-[#c3ccd8] transition-opacity duration-300"
        style={{ fontSize: 'clamp(22px, 4vw, 44px)' }}
      >
        0%
      </div>

      <div
        ref={capRef}
        className="pointer-events-none absolute top-0 left-0 whitespace-nowrap rounded-full bg-[#D7E2EA] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0C0C0C] opacity-0"
      />
    </div>
  );
};

export default TypeMotion;
