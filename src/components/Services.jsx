import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion, useSpring, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import DecryptText from './DecryptText';

const BLACK = 'var(--color-bg)';
const GRAY1 = 'var(--color-text-dim)';
const GRAY2 = 'var(--color-border)';
const WHITE = 'var(--color-text)';
const STRATEGY_CALL_URL = 'https://calendly.com/forrest-creationbase/30min';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';

const CORE_PILLARS = [
  {
    category: 'Strategy',
    index: 'P01',
    tagline: 'Where direction gets clear.',
    description:
      'We align your business vision with market reality. From positioning to GTM architecture, we create the blueprint for sustainable growth.',
    capabilities: [
      'Brand Strategy & Positioning',
      'Go-To-Market (GTM) Strategy',
      'Digital Audits & Roadmapping',
      'Martech Strategy & Selection',
    ],
  },
  {
    category: 'Branding',
    index: 'P02',
    tagline: 'Where identity gets forged.',
    description:
      'Distinctive visual systems and brand narratives built to command attention, earn trust, and create lasting brand equity.',
    capabilities: [
      'Visual Identity Systems',
      'Brand Messaging & Copywriting',
      'Brand Guidelines & Asset Kits',
      'Rebranding & Evolution',
    ],
  },
  {
    category: 'Website',
    index: 'P03',
    tagline: 'Where attention turns into action.',
    description:
      'High-performance digital experiences and custom web applications engineered to convert traffic into long-term client value.',
    capabilities: [
      'Custom Website Design & UX/UI',
      'Full-Stack Web Development',
      'Ecommerce & Product Interfaces',
      'Conversion Rate Optimization (CRO)',
    ],
  },
  {
    category: 'Social',
    index: 'P04',
    tagline: 'Where engagement builds community.',
    description:
      'Strategic content and organic social systems that build authority, deepen customer relationships, and keep your brand top-of-mind.',
    capabilities: [
      'Organic Social Strategy',
      'Content Design & Production',
      'Community Growth & CRM Alignment',
      'Campaign Creative & Execution',
    ],
  },
];

const DVCP_PROCESS = {
  title: 'Our Process',
  subtitle: 'Digital Value Creation Plan [DVCP]',
  description:
    'Our Digital Value Creation Plan is a fast, focused framework designed to cut through complexity, eliminate visual and technical friction, and identify hidden growth opportunities.',
  steps: [
    {
      step: '01',
      title: 'Digital Scorecard',
      description:
        'Comprehensive audit of your current brand presence, website performance, tech stack, and digital touchpoints.',
    },
    {
      step: '02',
      title: 'Opportunity Mapping',
      description:
        'Identifying blind spots, positioning gaps, and technical inefficiencies to unlock quick wins and long-term leverage.',
    },
    {
      step: '03',
      title: 'Roadmap & Execution',
      description:
        'Delivering a clear, actionable execution plan to transform your brand identity, web experience, and growth engine.',
    },
  ],
};

const PROCESS_IMAGE_POOL = [
  { project: 'BAC', i: '01', src: '/images/new%20mockeup.webp', alt: 'Boise Analog Club campaign mockup' },
  { project: 'BAC', i: '02', src: '/images/analog%20new%20mobile.webp', alt: 'Boise Analog Club mobile website mockup' },
  { project: 'BAC', i: '03', src: '/images/newseltter%20mockup%20reel.webp', alt: 'Boise Analog Club newsletter reel mockup' },
  { project: 'BAC', i: '04', src: '/images/bac%20july%202026.webp', alt: 'Boise Analog Club July 2026 campaign graphic' },
  { project: 'KNWN', i: '01', src: '/images/knwnlocal%20mockup.webp', alt: 'KnwnLocal homepage and editorial layout' },
  { project: 'KNWN', i: '02', src: '/images/knwnlocal%202.webp', alt: 'KnwnLocal AI editing and content workflow interface' },
  { project: 'WIM', i: '01', src: '/images/wim software.webp', alt: 'WIM software mockup' },
  { project: 'WIM', i: '02', src: '/images/wim typemark.webp', alt: 'WIM typemark' },
  { project: 'WIM', i: '03', src: '/images/wim logomark.webp', alt: 'WIM logomark' },
  { project: 'WIM', i: '04', src: '/images/wim safety shirt.webp', alt: 'WIM safety shirt mockup' },
  { project: 'WIM', i: '05', src: '/images/wim truck mockup.webp', alt: 'WIM truck mockup' },
  { project: 'WIM', i: '06', src: '/images/wim HAT MOCKUP.webp', alt: 'WIM hat mockup' },
  { project: 'CONT', i: '01', src: '/images/continuity/screens.webp', alt: 'Continuity screens' },
  { project: 'CONT', i: '02', src: '/images/continuity/app.webp', alt: 'Continuity app' },
  { project: 'CONT', i: '03', src: '/images/continuity/continuity%20logo.webp', alt: 'Continuity logo' },
  { project: 'CONT', i: '04', src: '/images/continuity/TSHIRT%20MOCKUP.webp', alt: 'Continuity t-shirt mockup' },
  { project: 'CONT', i: '05', src: '/images/continuity/Cotton%20Totebag%20Mockup.webp', alt: 'Continuity totebag mockup' },
  { project: 'MICR', i: '01', src: '/images/lobby.webp', alt: 'Micron lobby environmental signage' },
  { project: 'MICR', i: '02', src: '/images/stair.webp', alt: 'Micron stairwell ADA signage' },
  { project: 'MICR', i: '03', src: '/images/bathroom.webp', alt: 'Micron bathroom ADA compliance signage' },
  { project: 'MICR', i: '04', src: '/images/level.webp', alt: 'Micron level and floor identification signage' },
  { project: 'WRKS', i: '01', src: '/images/worksharp/_DSC6969.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '02', src: '/images/worksharp/_DSC7142.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '03', src: '/images/worksharp/_DSC6814.webp', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '04', src: '/images/worksharp/_DSC6908.webp', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '05', src: '/images/worksharp/IMG_3004.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'OPNZ', i: '01', src: '/images/OPEN NETIZEN CARD.jpg', alt: 'Open Netizen card mockup' },
  { project: 'OPNZ', i: '02', src: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg', alt: 'Open Netizen website mockup' },
  { project: 'OPNZ', i: '03', src: '/images/OPEN NETIZEN.jpg', alt: 'Open Netizen identity mockup' },
  { project: 'RICH', i: '01', src: '/images/ricochet mockup.webp', alt: 'Ricochet UI mockup' },
  { project: 'RICH', i: '02', src: '/images/Hourly Sales.PNG', alt: 'Ricochet hourly sales dashboard' },
  { project: 'RICH', i: '03', src: '/images/Exportable tables.PNG', alt: 'Ricochet exportable tables UI' },
];

const DvcpProcessImagePanel = ({ isMobile = false }) => {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: false, margin: '-5% 0px -5% 0px' });
  const reduceMotion = useReducedMotion();
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * PROCESS_IMAGE_POOL.length));
  const prevIdxRef = useRef(currentIdx);

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    const pickNext = () => {
      if (PROCESS_IMAGE_POOL.length <= 1) return 0;
      let n;
      let guard = 0;
      do {
        n = Math.floor(Math.random() * PROCESS_IMAGE_POOL.length);
        guard += 1;
      } while (n === prevIdxRef.current && guard < 10);
      prevIdxRef.current = n;
      setCurrentIdx(n);
    };
    const baseMs = 2400;
    const jitterMs = Math.floor(Math.random() * 800);
    const id = setInterval(pickNext, baseMs + jitterMs);
    return () => clearInterval(id);
  }, [inView, reduceMotion]);

  const current = PROCESS_IMAGE_POOL[currentIdx];
  const panelStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: isMobile ? '16 / 10' : '4 / 3',
    borderRadius: 14,
    overflow: 'hidden',
    border: HOME_SECTION_DIVIDER,
    background: 'rgba(255,255,255,0.03)',
  };

  return (
    <div ref={wrapRef} style={panelStyle}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current.src}
          src={current.src}
          alt={current.alt}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          loading="lazy"
        />
      </AnimatePresence>
      <div
        className="small-text"
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          padding: '5px 8px',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.54)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          color: '#fff',
          letterSpacing: '0.08em',
          lineHeight: 1,
          textTransform: 'uppercase',
          opacity: 0.92,
        }}
      >
        {current.project} · {current.i}
      </div>
    </div>
  );
};

const SeriesLine = ({ s, idx, drawTotal, pointAt, liftRefsByKey, reduceMotion, EASE_GROWTH, onReady }) => {
  const mv = useMotionValue(0);
  const pct = useTransform(mv, (n) => Math.max(0, Math.min(1, n)));
  const dashOffset = useTransform(pct, (p) => drawTotal * (1 - p));
  const endX = useTransform(pct, (p) => { const [x] = pointAt(s.arr, p); return x; });
  const endY = useTransform(pct, (p) => { const [, y] = pointAt(s.arr, p); return y; });
  const gTransformString = useMotionValue('translate(0,0)');
  useEffect(() => {
    const ux = endX.on('change', (x) => {
      const y = endY.get();
      gTransformString.set(`translate(${x},${y})`);
    });
    return () => ux();
  }, [endX, endY, gTransformString]);

  const endpointScale = useMotionValue(0.6);
  useEffect(() => {
    const unsub = mv.on('change', (n) => {
      if (n > 0.1 && endpointScale.get() < 1.15) endpointScale.set(1.15);
    });
    const t = setTimeout(() => animate(endpointScale, 1, { duration: 0.35, ease: EASE_GROWTH }), 200);
    return () => { unsub(); clearTimeout(t); };
  }, [mv, endpointScale, EASE_GROWTH]);

  const calloutShow = useMotionValue(0);
  const calloutY = useMotionValue(12);
  useEffect(() => {
    const id = setTimeout(() => {
      animate(calloutShow, 1, { duration: 0.35, ease: EASE_GROWTH });
      animate(calloutY, 0, { duration: 0.45, ease: EASE_GROWTH });
    }, Math.max(0, 600 + idx * 220));
    return () => clearTimeout(id);
  }, [idx, calloutShow, calloutY, EASE_GROWTH]);

  const wpDotsRef = useRef(s.arr.map(() => ({ opacity: 0, scale: 0.8 })));
  useEffect(() => {
    if (s.lift == null) return;
    s.arr.forEach((_v, i) => {
      if (i === 0 || i === 4) return;
      const at = i / 4;
      const appearT = 800 + idx * 180 + at * (s.dur * 1000) * 0.88;
      const id1 = setTimeout(() => { const d = wpDotsRef.current[i]; d.opacity = 0; d.scale = 0.4; }, 0);
      const id2 = setTimeout(() => {
        const d = wpDotsRef.current[i];
        d.opacity = 1;
        animate(d, 'scale', 1, { duration: 0.35, ease: EASE_GROWTH });
      }, appearT);
      void id1; void id2;
    });
  }, [idx, s, EASE_GROWTH]);

  const liftMv = useMotionValue(0);
  const liftSp = useSpring(liftMv, { stiffness: 100, damping: 22, mass: 0.6 });
  useEffect(() => {
    if (s.lift == null) return;
    let raw = parseFloat(String(s.lift).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(raw)) raw = 0;
    const textRef = liftRefsByKey[s.key];
    if (!textRef) return;
    const unsub = liftSp.on('change', (n) => {
      if (s.lift.endsWith('×')) textRef.text = `${(Math.max(0, Math.round(n * 10) / 10)).toFixed(1)}×`;
      else if (s.lift.startsWith('+')) textRef.text = `+${Math.max(0, Math.round(n * 10) / 10)}%`;
      else textRef.text = `${Math.max(0, Math.round(n * 10) / 10)}%`;
    });
    const tid = setTimeout(() => {
      liftMv.set(0);
      setTimeout(() => liftMv.set(raw), 60);
    }, 420 + idx * 200);
    return () => { unsub(); clearTimeout(tid); };
  }, [s, idx, liftRefsByKey, liftMv, liftSp]);

  useEffect(() => {
    onReady({ mv, dashOffset, gTransformString, endpointScale, calloutShow, calloutY, wpDots: wpDotsRef.current });
  });

  return null;
};

const StrategyGrowthGraph = ({ isMobile = false }) => {
  const wrapRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(wrapRef, { once: true, margin: '-8% 0px -8% 0px' });

  const STROKE = 'var(--color-text)';
  const DIM = 'var(--color-text-dim)';
  const RULE = 'var(--color-border)';
  const ACCENT = 'var(--color-accent, var(--color-text))';

  const W = 640;
  const H = 360;
  const PL = 48;
  const PR = 20;
  const PT = 22;
  const PB = 48;
  const IW = W - PL - PR;
  const IH = H - PT - PB;
  const EASE_GROWTH = [0.22, 1, 0.36, 1];

  const series = useMemo(() => {
    const base = [90, 94, 98, 102, 108];
    const brand = [90, 122, 158, 200, 248];
    const web = [90, 148, 210, 268, 306];
    const social = [90, 110, 144, 186, 222];
    const toY = (v) => PT + IH - ((v - 60) / (330 - 60)) * IH;
    const toX = (i) => PL + (IW * i) / 4;
    const makeArr = (vals) => vals.map((v, i) => [toX(i), toY(v)]);
    return [
      { key: 'base', label: 'No System · Siloed Vendors', color: DIM, dash: '3 6', width: 2, arr: makeArr(base), lift: null, start: 0, dur: 1.6 },
      { key: 'web', label: 'Website · Positioned', color: STROKE, width: 3.2, arr: makeArr(web), lift: '+212%', start: 0.1, dur: 1.9 },
      { key: 'social', label: 'Social · Owned Channels', color: STROKE, width: 2.6, dash: '8 4', arr: makeArr(social), lift: '4.7×', start: 0.18, dur: 1.9 },
      { key: 'brand', label: 'Branding · Compounding Demand', color: STROKE, width: 2.6, dash: '1.5 5', arr: makeArr(brand), lift: '3.1×', start: 0.26, dur: 1.9 },
    ];
  }, [DIM, STROKE]);

  const pointAt = useMemo(() => {
    const pct = (t) => {
      let lo = 0, hi = 1, mid;
      for (let k = 0; k < 32; k++) {
        mid = (lo + hi) / 2;
        const xv = 3 * 0.22 * mid * (1 - mid) * (1 - mid) + 3 * 0.36 * mid * mid * (1 - mid) + mid * mid * mid;
        if (xv < t) lo = mid; else hi = mid;
      }
      const yv = 3 * 1 * lo * (1 - lo) * (1 - lo) + 3 * 1 * lo * lo * (1 - lo) + lo * lo * lo;
      return yv;
    };
    return (arr, p) => {
      const pos = Math.max(0, Math.min(1, p));
      const n = arr.length - 1;
      const idx = Math.min(n - 1, Math.floor(pos * n));
      const frac = pos * n - idx;
      const [x0, y0] = arr[idx];
      const [x1, y1] = arr[idx + 1];
      const eased = pct(frac);
      return [x0 + (x1 - x0) * eased, y0 + (y1 - y0) * eased];
    };
  }, []);

  const toX = (i) => PL + (IW * i) / 4;
  const toY = (v) => {
    const raw = typeof v === 'number' ? v : (Array.isArray(v) ? v[1] : PT + IH);
    return PT + IH - ((raw - 60) / (330 - 60)) * IH;
  };
  const linePath = (arr) => arr.reduce((d, p, i) => {
    const [x, y] = p;
    const cmd = i === 0 ? 'M' : 'L';
    return d + `${cmd} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }, '').trim();
  const areaPath = (arr) => {
    const yBot = (PT + IH).toFixed(2);
    const first = arr[0];
    const last = arr[arr.length - 1];
    return `M ${first[0].toFixed(2)} ${yBot} ` +
      arr.reduce((d, p) => d + `L ${p[0].toFixed(2)} ${p[1].toFixed(2)} `, '') +
      `L ${last[0].toFixed(2)} ${yBot} Z`;
  };

  const drawTotals = useMemo(() => {
    return series.map((s) => {
      let total = 0;
      for (let i = 1; i < s.arr.length; i++) {
        const dx = s.arr[i][0] - s.arr[i - 1][0];
        const dy = s.arr[i][1] - s.arr[i - 1][1];
        total += Math.sqrt(dx * dx + dy * dy);
      }
      return total;
    });
  }, [series]);

  const progressRefsRef = useRef([]);
  const liftRefsByKey = useMemo(() => {
    const byKey = {};
    series.forEach((s) => {
      if (s.lift != null) {
        byKey[s.key] = { text: s.lift.includes('×') ? '0.0×' : '0%' };
      }
    });
    return byKey;
  }, [series]);

  const startedRef = useRef(false);
  useEffect(() => {
    if (!inView) return undefined;
    let localStopped = false;
    let outerStops = [];
    requestAnimationFrame(() => {
      if (localStopped) return;
      const tid = setTimeout(() => {
        if (localStopped) return;
        if (startedRef.current) return;
        startedRef.current = true;
        outerStops = series.map((s, idx) => {
          const ref = progressRefsRef.current[idx];
          if (!ref) return () => {};
          const { mv } = ref;
          if (reduceMotion) {
            mv.set(1);
            return () => {};
          }
          mv.jump(0);
          return animate(mv, 1, {
            duration: s.dur,
            delay: s.start,
            ease: EASE_GROWTH,
          }).stop;
        });
      }, 32);
      outerStops.push(() => clearTimeout(tid));
    });
    return () => {
      localStopped = true;
      queueMicrotask(() => {
        outerStops.forEach((stop) => stop());
        outerStops = [];
      });
    };
  }, [inView, reduceMotion, series, EASE_GROWTH]);

  const liftText = (key) => (liftRefsByKey[key] ? liftRefsByKey[key].text : '');

  const handleReady = (idx, bundle) => {
    progressRefsRef.current[idx] = bundle;
  };

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 18 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        width: '100%',
        background: BLACK,
        overflow: 'hidden',
      }}
    >
      {series.map((s, idx) => (
        <SeriesLine
          key={`sl-svc-${s.key}`}
          s={s}
          idx={idx}
          drawTotal={drawTotals[idx]}
          pointAt={pointAt}
          liftRefsByKey={liftRefsByKey}
          reduceMotion={reduceMotion}
          EASE_GROWTH={EASE_GROWTH}
          onReady={(bundle) => handleReady(idx, bundle)}
        />
      ))}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '0 0 10px',
        borderBottom: HOME_SECTION_DIVIDER,
        marginBottom: 6,
      }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.7 }}>
            GROWTH SIGNAL · POST DVCP
          </div>
          <div className="section-title" style={{
            fontSize: 'clamp(18px, 2.6vw, 26px)',
            marginBottom: 0,
            color: WHITE,
            lineHeight: 1,
          }}>
            Positioned channels vs. baseline
          </div>
        </div>
        <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.7 }}>
          Q0 → Q4 · 12MO
        </div>
      </div>

      <div style={{ padding: '12px 0 0' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Growth chart comparing positioned Branding, Website, and Social channels to baseline over four quarters"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <pattern id="sg-grid-svc" x={PL} y={PT} width={IW / 4} height={IH / 5} patternUnits="userSpaceOnUse">
              <path d={`M ${(IW / 4).toFixed(2)} 0 L 0 0 0 ${(IH / 5).toFixed(2)}`} fill="none" stroke={RULE} strokeOpacity="0.45" strokeWidth="1" />
            </pattern>
            {series.map((s) => (
              <linearGradient key={`grad-svc-${s.key}`} id={`sg-area-svc-${s.key}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.key === 'web' ? STROKE : DIM} stopOpacity={0.34} />
                <stop offset="100%" stopColor={s.key === 'web' ? STROKE : DIM} stopOpacity={0} />
              </linearGradient>
            ))}
            {series.filter((s) => s.dash && s.lift != null).map((s) => {
              const idx = series.findIndex((x) => x.key === s.key);
              const pRef = progressRefsRef.current[idx] || { dashOffset: drawTotals[idx] };
              const draw = drawTotals[idx];
              return (
                <clipPath key={`clip-svc-${s.key}`} id={`sg-clip-svc-${s.key}`}>
                  <motion.path
                    d={linePath(s.arr)}
                    fill="none"
                    stroke="white"
                    strokeWidth={s.width + 4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={draw}
                    style={{ strokeDashoffset: pRef.dashOffset }}
                  />
                </clipPath>
              );
            })}
            <filter id="sg-pulse-svc" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x={PL} y={PT} width={IW} height={IH} fill="url(#sg-grid-svc)" />

          {[0, 1, 2, 3, 4, 5].map((i) => {
            const y = PT + (IH * i) / 5;
            const val = Math.round(330 - (240 * i) / 5);
            return (
              <g key={`h-svc-${i}`}>
                <line x1={PL} x2={PL + IW} y1={y} y2={y} stroke={RULE} strokeOpacity="0.25" strokeDasharray="3 4" />
                <text
                  x={PL - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontWeight="var(--font-mono-weight)"
                  fontSize={10}
                  letterSpacing="0.06em"
                  fill={DIM}
                  opacity={0.68}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {['Q0', 'Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => {
            const x = PL + (IW * i) / 4;
            return (
              <text
                key={`q-svc-${q}`}
                x={x}
                y={PT + IH + 22}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontWeight="var(--font-mono-weight)"
                fontSize={11}
                letterSpacing="0.08em"
                fill={DIM}
                opacity={0.78}
              >
                {q}
              </text>
            );
          })}

          {series.map((s, idx) => (
            <path
              key={`area-svc-${s.key}`}
              d={areaPath(s.arr)}
              fill={`url(#sg-area-svc-${s.key})`}
              opacity={s.key === 'base' ? 0 : 0.9}
            />
          ))}

          {series.map((s, idx) => {
            if (!s.dash) return null;
            const pRef = progressRefsRef.current[idx] || { dashOffset: drawTotals[idx] };
            const draw = drawTotals[idx];
            return (
              <path
                key={`line-svc-solid-${s.key}`}
                d={linePath(s.arr)}
                fill="none"
                stroke={s.color}
                strokeOpacity={0.32}
                strokeWidth={s.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={draw}
                style={{ strokeDashoffset: pRef.dashOffset }}
              />
            );
          })}

          {series.filter((s) => !s.dash || s.lift == null).map((s) => {
            const idx = series.findIndex((x) => x.key === s.key);
            const pRef = progressRefsRef.current[idx] || { dashOffset: drawTotals[idx] };
            const draw = drawTotals[idx];
            return (
              <motion.path
                key={`line-svc-${s.key}`}
                d={linePath(s.arr)}
                fill="none"
                stroke={s.color}
                strokeOpacity={1}
                strokeWidth={s.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={draw}
                style={{ strokeDashoffset: pRef.dashOffset }}
              />
            );
          })}

          {series.filter((s) => s.dash && s.lift != null).map((s) => {
            return (
              <g
                key={`wrap-svc-${s.key}`}
                style={{ clipPath: `url(#sg-clip-svc-${s.key})` }}
              >
                <path
                  d={linePath(s.arr)}
                  fill="none"
                  stroke={s.color}
                  strokeOpacity={1}
                  strokeWidth={s.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={s.dash}
                />
              </g>
            );
          })}

          {series.filter((s) => s.lift != null).map((s) => {
            const idx = series.findIndex((x) => x.key === s.key);
            const pRef = progressRefsRef.current[idx] || { gTransformString: 'translate(0,0)', wpDots: s.arr.map(() => ({ opacity: 0, scale: 0.8 })), endpointScale: 1, calloutShow: 1, calloutY: 0 };
            return s.arr.map((v, i) => {
              if (i === 0) return null;
              if (i !== 4) {
                const wp = pRef.wpDots[i];
                return (
                  <motion.circle
                    key={`pt-svc-${s.key}-${i}`}
                    cx={toX(i)}
                    cy={toY(v)}
                    r={2.6}
                    fill={s.color}
                    style={reduceMotion ? undefined : { opacity: wp.opacity, scale: wp.scale, transformOrigin: `${toX(i)}px ${toY(v)}px` }}
                  />
                );
              }
              const firedAtLeastOnce = reduceMotion || inView;
              return (
                <g
                  key={`end-svc-${s.key}`}
                  transform={pRef.gTransformString}
                >
                  <motion.circle
                    cx={0}
                    cy={0}
                    r={4.5}
                    fill={BLACK}
                    stroke={s.color}
                    strokeWidth={2}
                    style={reduceMotion ? undefined : { scale: pRef.endpointScale, transformOrigin: '0 0' }}
                    transition={reduceMotion ? undefined : { type: 'spring', stiffness: 320, damping: 22 }}
                  />
                  {!reduceMotion && firedAtLeastOnce && (
                    <>
                      <motion.circle
                        cx={0}
                        cy={0}
                        r={4.5}
                        fill="none"
                        stroke={s.color}
                        strokeOpacity={0.5}
                        initial={{ scale: 0.4, opacity: 0.8 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 1.4, delay: s.start + s.dur + 0.05, repeat: Infinity, repeatDelay: 1.1 }}
                      />
                      <motion.circle
                        cx={0}
                        cy={0}
                        r={2.8}
                        fill={s.color}
                        style={{ scale: pRef.endpointScale, transformOrigin: '0 0' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      />
                    </>
                  )}
                  {reduceMotion && <circle cx={0} cy={0} r={2.8} fill={s.color} />}
                  {s.lift != null && (
                    <motion.g
                      style={reduceMotion ? undefined : { opacity: pRef.calloutShow, translateY: pRef.calloutY }}
                    >
                      <rect
                        x={-42}
                        y={-32}
                        width={64}
                        height={20}
                        rx={5}
                        fill={STROKE}
                        fillOpacity={0.08}
                        stroke={RULE}
                      />
                      <text
                        x={-34}
                        y={-18}
                        fontFamily="var(--font-mono)"
                        fontWeight="var(--font-mono-weight-bold)"
                        fontSize={10}
                        letterSpacing="0.08em"
                        fill={s.color}
                      >
                        {liftText(s.key)}
                      </text>
                    </motion.g>
                  )}
                </g>
              );
            });
          })}
        </svg>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: 0,
          marginTop: 16,
          paddingTop: 18,
          borderTop: HOME_SECTION_DIVIDER,
        }}>
          <div
            className="small-text"
            style={{
              borderRight: HOME_SECTION_DIVIDER,
              padding: '10px 14px',
              letterSpacing: '0.08em',
              opacity: 0.55,
              textTransform: 'uppercase',
              display: isMobile ? 'none' : 'block',
            }}
          >
            SERIES
          </div>
          <div
            className="small-text"
            style={{
              borderRight: HOME_SECTION_DIVIDER,
              padding: '10px 14px',
              letterSpacing: '0.08em',
              opacity: 0.55,
              textTransform: 'uppercase',
              display: isMobile ? 'none' : 'block',
            }}
          >
            CHANNEL
          </div>
          <div
            className="small-text"
            style={{
              padding: '10px 14px',
              textAlign: 'right',
              letterSpacing: '0.08em',
              opacity: 0.55,
              textTransform: 'uppercase',
              display: isMobile ? 'none' : 'block',
            }}
          >
            Q4 · 12MO LIFT
          </div>
          {series.filter((s) => s.key !== 'base').map((s, i, arr) => (
            <div
              key={`svc-legend-${s.key}`}
              style={{
                gridColumn: isMobile ? '1 / -1' : '1 / -1',
                display: 'grid',
                gridTemplateColumns: isMobile ? 'minmax(0, 1fr) 92px' : 'repeat(3, minmax(0, 1fr))',
                gap: isMobile ? 6 : 10,
                alignItems: 'center',
                background: BLACK,
                padding: isMobile ? '12px 10px' : '14px',
                borderTop: i === 0 ? 'none' : HOME_SECTION_DIVIDER,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10, minWidth: 0 }}>
                <svg width={isMobile ? 22 : 28} height={10} role="img" aria-hidden="true">
                  <line
                    x1={1}
                    y1={5}
                    x2={isMobile ? 20 : 26}
                    y2={5}
                    stroke={s.color}
                    strokeWidth={s.dash ? 1.8 : (isMobile ? 2.4 : 2.8)}
                    strokeLinecap="round"
                    strokeDasharray={s.dash ? s.dash : undefined}
                  />
                </svg>
                <span
                  className="small-text"
                  style={{
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    opacity: isMobile ? 0.82 : 0.9,
                    fontSize: isMobile ? 'calc(var(--fs-sm) - 1px)' : 'var(--fs-sm)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                >
                  {isMobile
                    ? `${s.key === 'web' ? '02' : s.key === 'social' ? '04' : '01'} · ${s.label}`
                    : (s.key === 'web' ? '02' : s.key === 'social' ? '04' : '01')}
                </span>
              </div>
              {!isMobile && (
                <span
                  className="small-text"
                  style={{
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    opacity: 0.9,
                    textAlign: 'start',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                >
                  {s.label}
                </span>
              )}
              <span
                className="small-text"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'var(--font-mono-weight-bold)',
                  fontSize: isMobile ? 'clamp(13px, 3.8vw, 16px)' : 'clamp(14px, 1.4vw, 18px)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  textAlign: 'right',
                  justifySelf: isMobile ? 'end' : 'auto',
                  color: i === 0 ? STROKE : DIM,
                }}
              >
                {liftText(s.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SECTIONS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'process', label: 'OUR PROCESS' },
  { id: 'pillars', label: 'CORE PILLARS' },
  { id: 'growth', label: 'GROWTH SIGNAL' },
  { id: 'next', label: 'NEXT STEP' },
];

const ServicesVerticalNav = ({ isMobile = false }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [withinProgress, setWithinProgress] = useState([0, 0, 0, 0, 0]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const threshold = scrollY + vh * 0.35;
        let idx = 0;
        const progress = [];
        for (let i = 0; i < SECTIONS.length; i++) {
          const el = document.getElementById(SECTIONS[i].id);
          if (!el) { progress.push(0); continue; }
          const top = el.offsetTop;
          const next = SECTIONS[i + 1]
            ? document.getElementById(SECTIONS[i + 1].id)?.offsetTop ?? (top + el.offsetHeight + 1)
            : (top + el.offsetHeight + 1);
          const height = Math.max(1, next - top);
          const rawP = Math.max(0, Math.min(1, (scrollY - top) / height));
          progress.push(rawP);
          if (top <= threshold) idx = i;
        }
        setActiveIdx(idx);
        setWithinProgress(progress);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (isMobile) return null;

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/services#${id}`);
    }
  };

  const MIN_DOT_H = 8;
  const MAX_DOT_H = 36;
  const BEVEL = 14;
  const RAD = 10;

  const W = 44;
  const H = 292;

  const topLeftSharp = [0, 0];
  const pBevelTopEnd = [W - RAD, BEVEL];
  const pBevelRightTop = [W, BEVEL + RAD];
  const pBevelRightBottom = [W, H - BEVEL - RAD];
  const pBevelBottomStart = [W - RAD, H - BEVEL];
  const bottomLeftSharp = [0, H];

  const shapePath = `
    M ${topLeftSharp[0]} ${topLeftSharp[1]}
    L ${pBevelTopEnd[0]} ${pBevelTopEnd[1]}
    A ${RAD} ${RAD} 0 0 1 ${pBevelRightTop[0]} ${pBevelRightTop[1]}
    L ${pBevelRightBottom[0]} ${pBevelRightBottom[1]}
    A ${RAD} ${RAD} 0 0 1 ${pBevelBottomStart[0]} ${pBevelBottomStart[1]}
    L ${bottomLeftSharp[0]} ${bottomLeftSharp[1]}
    Z
  `;

  const strokeShapePath = `
    M 0.5 0.5
    L ${W - RAD - 0.5} ${BEVEL + 0.5}
    A ${RAD} ${RAD} 0 0 1 ${W - 0.5} ${BEVEL + RAD - 0.5}
    L ${W - 0.5} ${H - BEVEL - RAD + 0.5}
    A ${RAD} ${RAD} 0 0 1 ${W - RAD - 0.5} ${H - BEVEL + 0.5}
    L 0.5 ${H - 0.5}
    Z
  `;

  const CLIP_ID = `svc-nav-clip-${BEVEL}-${RAD}`;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={0}
        height={0}
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <defs>
          <clipPath id={CLIP_ID} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          width: W,
          height: H,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          clipPath: `url(#${CLIP_ID})`,
          WebkitClipPath: `url(#${CLIP_ID})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${BEVEL + 18}px 0 ${BEVEL + 18}px 0`,
          boxSizing: 'border-box',
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: W,
            height: H,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <path
            d={strokeShapePath}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="small-text"
          style={{
            position: 'relative',
            zIndex: 1,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            minHeight: 0,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={SECTIONS[activeIdx].label}
              initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(10px, 0.85vw, 12px)',
                letterSpacing: '0.18em',
                color: WHITE,
                textTransform: 'uppercase',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {SECTIONS[activeIdx].label}
            </motion.span>
          </AnimatePresence>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center', margin: '12px 0 0' }}>
          {SECTIONS.map((s, i) => {
            const isActive = i === activeIdx;
            const p = withinProgress[i] ?? 0;
            const h = isActive
              ? MIN_DOT_H + p * (MAX_DOT_H - MIN_DOT_H)
              : MIN_DOT_H;
            const bg = isActive
              ? 'rgba(255,255,255,0.92)'
              : 'rgba(255,255,255,0.18)';
            const glow = isActive ? '0 0 0 4px rgba(255,255,255,0.06)' : 'none';
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpTo(s.id)}
                aria-label={`Go to ${s.label}`}
                aria-current={isActive ? 'true' : 'false'}
                style={{
                  width: 6,
                  height: Math.max(MIN_DOT_H, Math.min(MAX_DOT_H, h)),
                  borderRadius: 999,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  background: bg,
                  transition: reduceMotion
                    ? 'none'
                    : 'height 0.18s cubic-bezier(0.22,1,0.36,1), background 0.3s ease, box-shadow 0.3s ease',
                  outline: 'none',
                  boxShadow: glow,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (ev) => setIsMobile(ev.matches);
    setIsMobile(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/services#${id}`);
    }
  };

  const openStrategyCall = () => {
    const win = window.open(STRATEGY_CALL_URL, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="dark"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
      role="main"
    >
      <ServicesVerticalNav isMobile={isMobile} />

      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px' }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'clamp(40px, 8vw, 128px)', marginBottom: 0, lineHeight: 0.88, letterSpacing: '-0.04em' }}>
              <DecryptText as="span" text="SERVICES" trigger="mount" duration={900} delay={150} />
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (02)</div>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 820, opacity: 0.85, lineHeight: 1.55 }}>
            Four pillars. One process. Strategy, Branding, Website, and Social — wired together with our Digital Value Creation Plan (DVCP) to cut friction, sharpen positioning, and drive measurable growth for mid-market companies.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) 0 var(--spacing-xxl)' }}>
        <section id="overview" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
          <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)', marginBottom: 'var(--spacing-xxl)' }}>
            <DvcpProcessImagePanel isMobile={isMobile} />
          </div>

          <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)' }}>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)', minWidth: 0 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                <DecryptText as="span" text="Built to drive growth for mid-market companies." trigger="inView" duration={900} />
              </h2>
              <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.9 }}>
                Creationbase is a Strategic Creation Consultancy. We combine positioning, identity, web, and organic social into one accountable system — so your brand presence doesn&apos;t just look sharp, it compounds. When strategy drives design and design drives the website, and the website feeds social, every dollar you spend on visibility multiplies instead of disappearing into separate silos.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                {[
                  { k: 'Outcome-First', v: 'A clear positioning anchor at the top; identity, site, and social all built to support it.' },
                  { k: 'One Team', v: 'Strategy, branding, web engineering, and social content under one roof — no handoff blame.' },
                  { k: 'Fast & Measurable', v: 'A 3-step DVCP framework that ships clarity first, then growth-driving execution.' },
                  { k: 'Built to Last', v: 'Reusable systems, not one-off campaigns. Your assets keep working long after launch.' },
                ].map((item) => (
                  <div key={item.k} style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                    <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {item.k}
                    </div>
                    <div className="small-text" style={{ color: WHITE, lineHeight: 1.6 }}>
                      {item.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)' }}>
          <section id="process" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                PROCESS / 02
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="small-text" style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight-bold)', fontSize: 'clamp(11px, 1.1vw, 13px)', letterSpacing: '0.05em', opacity: 0.88, textTransform: 'uppercase' }}>
                  {DVCP_PROCESS.subtitle}
                </div>
                <h2 className="section-title" style={{ fontSize: 'clamp(32px, 6vw, 84px)', lineHeight: 0.9, margin: 0, color: WHITE }}>
                  <DecryptText as="span" text={DVCP_PROCESS.title.toUpperCase()} trigger="inView" duration={800} />
                </h2>
                <p className="small-text" style={{ maxWidth: '64ch', lineHeight: 1.55, opacity: 0.84, textTransform: 'none', margin: 0, color: WHITE }}>
                  {DVCP_PROCESS.description}
                </p>
              </div>
            </div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
              transition={{ duration: 0.45 }}
              style={{
                borderTop: HOME_SECTION_DIVIDER,
                borderBottom: HOME_SECTION_DIVIDER,
                padding: '10px 0',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(100px, 0.24fr) minmax(0, 1fr)',
                gap: 'var(--spacing-md)',
                alignItems: 'start',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              <div
                className="small-text"
                style={{
                  opacity: 0.72,
                  letterSpacing: '0.08em',
                  paddingTop: '4px',
                }}
              >
                DVCP / 00
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.1fr) minmax(320px, 0.9fr)',
                  gap: 'var(--spacing-md)',
                  alignItems: 'stretch',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h2
                    className="section-title"
                    style={{
                      marginBottom: 0,
                      maxWidth: isMobile ? '100%' : '12ch',
                      width: '100%',
                      color: WHITE,
                      lineHeight: 0.9,
                      fontSize: 'clamp(26px, 5vw, 68px)',
                    }}
                  >
                    <DecryptText as="span" text="DIGITAL VALUE" trigger="inView" duration={800} delay={120} />
                    <br />
                    <DecryptText as="span" text="CREATION PLAN" trigger="inView" duration={800} delay={220} />
                  </h2>
                </div>
                <div style={{ minWidth: 0 }}>
                  <DvcpProcessImagePanel isMobile={isMobile} />
                </div>
              </div>
            </motion.div>

            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                  gap: 0,
                  borderTop: HOME_SECTION_DIVIDER,
                  borderLeft: HOME_SECTION_DIVIDER,
                }}
              >
                {DVCP_PROCESS.steps.map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    style={{
                      borderRight: HOME_SECTION_DIVIDER,
                      borderBottom: HOME_SECTION_DIVIDER,
                      padding: 'var(--spacing-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 'var(--spacing-sm)',
                      minHeight: 200,
                      background: BLACK,
                    }}
                  >
                    <div
                      className="small-text"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        opacity: 0.76,
                      }}
                    >
                      <span>STEP {s.step}</span>
                      <span>{String(i + 1).padStart(2, '0')} / 03</span>
                    </div>
                    <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
                      <h3
                        className="section-title"
                        style={{
                          fontSize: 'clamp(20px, 2.4vw, 30px)',
                          lineHeight: 0.96,
                          letterSpacing: '-0.03em',
                          margin: 0,
                          color: WHITE,
                        }}
                      >
                        <DecryptText as="span" text={s.title.toUpperCase()} trigger="inView" duration={550} delay={160 + i * 80} />
                      </h3>
                      <p
                        className="small-text"
                        style={{
                          margin: 0,
                          lineHeight: 1.5,
                          opacity: 0.8,
                          textTransform: 'uppercase',
                          maxWidth: 340,
                          fontSize: 'calc(var(--fs-sm) - 1px)',
                        }}
                      >
                        {s.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="pillars" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                PILLARS / 03
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                  <DecryptText as="span" text="Core Pillars" trigger="inView" duration={900} />
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.88 }}>
                  Four disciplines, intentionally small. Pick one pillar or wire all four together — the framework is the same.
                </p>
              </div>
            </div>

            <div
              className="home-services-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                gap: 0,
                borderTop: HOME_SECTION_DIVIDER,
                borderLeft: HOME_SECTION_DIVIDER,
              }}
            >
              {CORE_PILLARS.map((pillar, i) => (
                <motion.article
                  key={pillar.category}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.05 * i }}
                  style={{
                    borderRight: HOME_SECTION_DIVIDER,
                    borderBottom: HOME_SECTION_DIVIDER,
                    padding: 'clamp(20px, 2.8vw, 32px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md)',
                    minHeight: 280,
                    background: BLACK,
                    color: WHITE,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                    <h3
                      className="section-title"
                      style={{
                        fontSize: 'clamp(26px, 3.6vw, 48px)',
                        lineHeight: 0.9,
                        margin: 0,
                        color: WHITE,
                      }}
                    >
                      <DecryptText as="span" text={pillar.category} trigger="inView" duration={600} delay={150 + i * 60} />
                    </h3>
                    <span className="small-text" style={{ opacity: 0.78, letterSpacing: '0.06em', color: GRAY1 }}>
                      {pillar.index}
                    </span>
                  </div>

                  <p
                    className="small-text"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 400,
                      fontSize: 'clamp(14px, 1.4vw, 18px)',
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                      color: WHITE,
                      opacity: 0.92,
                      margin: 0,
                    }}
                  >
                    {pillar.tagline}
                  </p>

                  <p
                    className="small-text"
                    style={{
                      lineHeight: 1.55,
                      opacity: 0.82,
                      textTransform: 'none',
                      margin: 0,
                      color: WHITE,
                    }}
                  >
                    {pillar.description}
                  </p>

                  <ul
                    className="small-text"
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 'auto 0 0 0',
                      display: 'grid',
                      gap: 6,
                      fontSize: 'var(--fs-xs)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {pillar.capabilities.map((cap) => (
                      <li
                        key={cap}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          opacity: 0.8,
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 'var(--font-mono-weight)',
                        }}
                      >
                        <span aria-hidden style={{ opacity: 0.5, lineHeight: 1.4, flexShrink: 0 }}>
                          —
                        </span>
                        <span style={{ lineHeight: 1.4, color: WHITE }}>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </section>

          <section id="growth" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                GROWTH / 04
              </div>
              <div style={{ display: 'grid', gap: 'var(--spacing-md)', minWidth: 0 }}>
                <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.76 }}>
                  POSITION + DEPLOY + MEASURE
                </div>
                <h3 className="section-title" style={{
                  margin: 0,
                  color: WHITE,
                  lineHeight: 0.9,
                  fontSize: 'clamp(34px, 5.6vw, 84px)',
                }}>
                  <DecryptText as="span" text="Turn positioning" trigger="inView" duration={850} delay={120} />
                  <br />
                  <DecryptText as="span" text="into compounding" trigger="inView" duration={850} delay={200} />
                  <br />
                  <DecryptText as="span" text="growth signals." trigger="inView" duration={850} delay={280} />
                </h3>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
                gap: 'var(--spacing-xl)',
                alignItems: 'start',
              }}
            >
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <StrategyGrowthGraph isMobile={isMobile} />
              </div>

              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <p className="small-text" style={{
                  margin: 0,
                  lineHeight: 1.55,
                  opacity: 0.88,
                  maxWidth: 620,
                }}>
                  We anchor every engagement to a shared growth baseline — then reposition brand, web, and social channels so they move the same indicators, the same way, and compound from the same story.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                  {[
                    { k: 'AUDIT', v: 'Brand, website, and stack scored against one DVCP scorecard.' },
                    { k: 'POSITION', v: 'A single story that branding, web, and social all reinforce.' },
                    { k: 'DEPLOY', v: 'Tactics shipped in the order they compound fastest.' },
                    { k: 'MEASURE', v: 'Pipelines tracked so positioning work shows up in pipeline.' },
                  ].map((s, i) => (
                    <div key={s.k} style={{
                      display: 'grid',
                      gap: 8,
                      paddingTop: 14,
                      borderTop: HOME_SECTION_DIVIDER,
                    }}>
                      <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.76 }}>
                        0{i + 1} · {s.k}
                      </div>
                      <div className="small-text" style={{ lineHeight: 1.55, opacity: 0.92 }}>
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          <section id="next" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Next Step</div>
                <div className="small-text" style={{ color: GRAY1 }}>Contact</div>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '12px 0 var(--spacing-md)', fontSize: 'clamp(28px, 5vw, 64px)' }}>
                <DecryptText as="span" text="Let’s sharpen the system and grow the top line." trigger="inView" duration={900} />
              </h2>
              <div className="small-text" style={{ color: GRAY1, maxWidth: 820, lineHeight: 1.6 }}>
                Book a 30-minute strategy call and we&apos;ll walk through the Digital Value Creation Plan for your brand, website, and social channels — what we&apos;d measure first, where the quick wins are, and what a quarter of work would actually ship.
              </div>
              <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" onClick={openStrategyCall} className="newsletter-button">
                  Book Strategy Call
                  <ArrowUpRight size={14} weight="thin" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="newsletter-button newsletter-button--outline"
                >
                  Contact Form
                </button>
                <button
                  type="button"
                  onClick={() => jumpTo('overview')}
                  className="small-text"
                  style={{
                    background: 'transparent',
                    color: WHITE,
                    border: `1px solid ${GRAY2}`,
                    borderRadius: 10,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Back to Top
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </motion.div>
  );
};

export default Services;
