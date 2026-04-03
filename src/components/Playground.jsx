import { useEffect } from 'react';
import { motion } from 'framer-motion';

const BLACK = '#0F0F0F';
const WHITE = '#E2E2E0';
const GRAY1 = 'rgba(226, 226, 224, 0.66)';
const BORDER = 'var(--color-border)';

const ITEMS = [
  { src: '/images/device-1.PNG', tag: 'Product Design', maxWidth: 640 },
  { src: '/images/P3061294.webp', tag: 'Personal Photography', maxWidth: 560 },
  { src: '/images/worm primary.JPG', tag: 'Art Print', maxWidth: 600 },
  { src: '/images/device-2.PNG', tag: 'Product Design', maxWidth: 640 },
  { src: '/images/network.jpg', tag: 'Development Project', maxWidth: 700 },
  { src: '/images/_DSC2145.webp', tag: 'Personal Photography', maxWidth: 600 },
  { src: '/images/pilot micro new.png', tag: 'Art Print', maxWidth: 560 },
  { src: '/images/look see 2.JPG', tag: 'Art Print', maxWidth: 680 },
  { src: '/images/_DSC2122-2.webp', tag: 'Personal Photography', maxWidth: 560 },
  { src: '/images/_DSC2025-2.webp', tag: 'Personal Photography', maxWidth: 640 },
];

const Playground = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="dark"
      className="playground-page"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="full-bleed playground-bleed">
          <div className="playground-header flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
              <span className="playground-title-rainbow">PLAYGROUND</span>
            </h1>
            <div className="playground-kicker small-text" style={{ color: GRAY1 }}>
              DESIGN / ART / DEV
            </div>
          </div>
          <div style={{ height: 1, background: BORDER, marginTop: 'var(--spacing-sm)' }} />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 860, opacity: 0.9, textTransform: 'none' }}>
            A place for experiments—product renders, visual studies, and technical prototypes.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="full-bleed playground-bleed">
          <div className="playground-stack">
            {ITEMS.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={item.src}
                  className={isLeft ? 'playground-row playground-row--left' : 'playground-row playground-row--right'}
                >
                  <div className="playground-card" style={{ width: '100%', maxWidth: item.maxWidth }}>
                    <div className="playground-frame">
                      <img src={item.src} alt={item.tag} loading="lazy" decoding="async" />
                    </div>
                    <div className="playground-tag">{item.tag}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .playground-title-rainbow {
          background-image: linear-gradient(
            90deg,
            #ff4d4d,
            #ffb84d,
            #fff04d,
            #4dff88,
            #4dd9ff,
            #8a4dff,
            #ff4dd2,
            #ff4d4d
          );
          background-size: 300% 100%;
          background-position: 0% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow:
            0 0 14px rgba(255, 77, 77, 0.25),
            0 0 26px rgba(77, 217, 255, 0.2),
            0 0 38px rgba(138, 77, 255, 0.18);
          animation: playgroundRainbowShift 6s linear infinite, playgroundGlowPulse 2.6s ease-in-out infinite;
          filter: saturate(1.25);
        }

        @keyframes playgroundRainbowShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes playgroundGlowPulse {
          0%, 100% {
            text-shadow:
              0 0 10px rgba(255, 77, 77, 0.18),
              0 0 18px rgba(77, 217, 255, 0.16),
              0 0 26px rgba(138, 77, 255, 0.14);
          }
          50% {
            text-shadow:
              0 0 18px rgba(255, 77, 77, 0.34),
              0 0 34px rgba(77, 217, 255, 0.26),
              0 0 52px rgba(138, 77, 255, 0.24);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .playground-title-rainbow {
            animation: none;
            background-position: 50% 50%;
          }
        }

        .playground-page .playground-bleed {
          padding-left: clamp(24px, 6vw, 120px);
          padding-right: clamp(24px, 6vw, 120px);
        }

        .playground-stack {
          display: flex;
          flex-direction: column;
          gap: clamp(48px, 10vh, 140px);
        }

        .playground-row {
          display: flex;
          width: 100%;
        }

        .playground-row--left {
          justify-content: flex-start;
        }

        .playground-row--right {
          justify-content: flex-end;
        }

        .playground-card {
          max-width: 100%;
        }

        .playground-frame {
          position: relative;
          width: 100%;
          overflow: visible;
          background: ${BLACK};
        }

        .playground-frame img {
          width: 100%;
          height: auto;
          display: block;
        }

        .playground-tag {
          margin-top: 14px;
          font-family: var(--font-mono);
          font-size: var(--fs-xs);
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${GRAY1};
          width: 100%;
          text-align: left;
        }

        @media (max-width: 700px) {
          .playground-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }

          .playground-kicker {
            width: 100%;
          }

          .playground-page .playground-bleed {
            padding-left: var(--spacing-sm);
            padding-right: var(--spacing-sm);
          }

          .playground-stack {
            gap: var(--spacing-xxl);
          }

          .playground-row--left,
          .playground-row--right {
            justify-content: stretch;
          }

          .playground-card {
            width: 100%;
            max-width: 100% !important;
          }

          .playground-frame {
            height: auto;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Playground;
