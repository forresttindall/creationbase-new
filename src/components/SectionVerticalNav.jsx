import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const WHITE = 'var(--color-text)';

// Fixed left-edge progress nav for long single-column pages (Services, About).
// `sections` is a list of { id, label } matching element ids on the page.
const SectionVerticalNav = ({ sections, basePath, isMobile = false }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [withinProgress, setWithinProgress] = useState(() => sections.map(() => 0));
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
        for (let i = 0; i < sections.length; i++) {
          const el = document.getElementById(sections[i].id);
          if (!el) { progress.push(0); continue; }
          const top = el.offsetTop;
          const next = sections[i + 1]
            ? document.getElementById(sections[i + 1].id)?.offsetTop ?? (top + el.offsetHeight + 1)
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
  }, [sections]);

  if (isMobile) return null;

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `${basePath}#${id}`);
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
              key={sections[activeIdx].label}
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
              {sections[activeIdx].label}
            </motion.span>
          </AnimatePresence>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center', margin: '12px 0 0' }}>
          {sections.map((s, i) => {
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

export default SectionVerticalNav;
