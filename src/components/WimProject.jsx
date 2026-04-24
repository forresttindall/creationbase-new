import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const BLACK = '#FFFFFF';
const WHITE = '#111111';

const WIM_IMAGES = 
[{ src: '/images/wim software.png', alt: 'WIM software mockup' },
   { src: '/images/wim typemark.jpg', alt: 'WIM typemark' },
    { src: '/images/wim logomark.jpg', alt: 'WIM logomark' },
  { src: '/images/wim safety shirt.jpg', alt: 'WIM safety shirt mockup' },
 
 { src: '/images/wim truck mockup.jpg', alt: 'WIM truck mockup' },
  { src: '/images/wim HAT MOCKUP.png', alt: 'WIM hat mockup' },
  
  
];

const WimProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    if (readMoreOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('wim-info-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('wim-info-open');
    }
    const handleNavClick = (ev) => {
      const el = ev.target.closest('.site-nav__menu-toggle');
      if (readMoreOpen && el) {
        ev.preventDefault();
        ev.stopPropagation();
        setReadMoreOpen(false);
      }
    };
    document.addEventListener('click', handleNavClick, true);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('wim-info-open');
      document.removeEventListener('click', handleNavClick, true);
    };
  }, [readMoreOpen]);

  useEffect(() => {
    const adjustRowHeights = () => {
      const rows = Array.from(document.querySelectorAll('.wim-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.wim-frame'));
        const imgs = Array.from(row.querySelectorAll('.wim-frame img'));
        if (frames.length !== imgs.length || frames.length === 0) return;
        const heights = imgs.map((img, idx) => {
          const frame = frames[idx];
          const w = frame.getBoundingClientRect().width;
          const naturalW = img.naturalWidth || w;
          const naturalH = img.naturalHeight || w;
          const ratio = naturalH / naturalW;
          return Math.max(0, Math.round(w * ratio));
        });
        const minH = Math.min(...heights);
        frames.forEach((frame) => {
          frame.style.height = `${minH}px`;
        });
      });
    };
    const onLoad = (ev) => {
      if (ev && ev.target && ev.target.tagName === 'IMG') adjustRowHeights();
    };
    document.addEventListener('load', onLoad, true);
    window.addEventListener('resize', adjustRowHeights);
    const raf = requestAnimationFrame(adjustRowHeights);
    return () => {
      document.removeEventListener('load', onLoad, true);
      window.removeEventListener('resize', adjustRowHeights);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      className="wim-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section data-header-theme="light" style={{ position: 'relative', overflow: 'hidden', background: BLACK, color: WHITE }}>
        <div style={{ minHeight: '42vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)', position: 'relative', zIndex: 1 }}>
          <h1 className="home-hero__title" style={{ marginBottom: 'auto' }}>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <DecryptText as="span" text="WAREHOUSE INTELLIGENCE" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <button
        type="button"
        className="wim-readmore"
        aria-label="Read more"
        onClick={() => setReadMoreOpen(true)}
      >
        <div className="wim-readmore__track">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="wim-readmore__item small-text">
              READ MORE •
            </span>
          ))}
        </div>
      </button>

      {readMoreOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="wim-overlay"
          onClick={() => setReadMoreOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(150,150,150,0.32)',
            backdropFilter: 'blur(26px)',
            WebkitBackdropFilter: 'blur(26px)',
            zIndex: 390,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="wim-overlay__inner"
            onClick={(ev) => ev.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(820px, calc(100% - 40px))',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: 'none',
              padding: 'var(--spacing-xl) var(--spacing-lg)',
              color: '#111111'
            }}
          >
            <div className="small-text" style={{ marginBottom: 'var(--spacing-lg)', fontWeight: 'var(--font-mono-weight-bold)' }}>
              WAREHOUSE INTELLIGENCE •
            </div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)' }}>ROLE</div>
            <div className="small-text" style={{ marginTop: 8 }}>BRAND + IDENTITY DESIGN</div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>SCOPE</div>
            <div className="small-text" style={{ marginTop: 8 }}>IDENTITY SYSTEM, SOFTWARE APP UI/UX DESIGN</div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>PROJECT</div>
            <div className="small-text" style={{ marginTop: 8 }}>
              WAREHOUSE INTELLIGENCE BRAND SYSTEM AND UNIFORM SUITE—BUILT FOR CLARITY, RECOGNITION, AND APPLICATION ACROSS APPAREL AND FIELD USE.
            </div>
          </motion.div>
        </motion.div>
      )}

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: '#000000', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>WIM</span>
          </div>
          <div className="wim-rows">
            {WIM_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single ? 'wim-row wim-row--single' : (rIdx % 2 === 0 ? 'wim-row wim-row--left' : 'wim-row wim-row--right');
              return (
                <div key={`row-${rIdx}`} className={rowClass}>
                  {row.map((image) => {
                    const isLoaded = !!loadedBySrc[image.src];
                    return (
                      <motion.div
                        key={image.src}
                        className="wim-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      >
                        <div className={`wim-frame${isLoaded ? ' wim-frame--loaded' : ' wim-frame--loading'}`}>
                          <div className="wim-skeleton" aria-hidden="true" />
                          <img
                            className="wim-img"
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => {
                              setLoadedBySrc((prev) => {
                                if (prev[image.src]) return prev;
                                return { ...prev, [image.src]: true };
                              });
                            }}
                            onError={(ev) => {
                              const card = ev.currentTarget.closest('.wim-card');
                              if (card) card.style.display = 'none';
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .wim-readmore {
          position: fixed;
          left: 50%;
          bottom: 78px;
          transform: translateX(-50%);
          display: block;
          width: clamp(280px, 64vw, 740px);
          height: 34px;
          border-radius: 999px;
          border: none;
          background: rgba(191, 191, 191, 0.45);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          color: inherit;
          overflow: hidden;
          z-index: 402;
          pointer-events: auto;
        }
        .wim-readmore__track {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          white-space: nowrap;
          will-change: transform;
          animation: wimMarquee 12s linear infinite;
          padding: 0 12px;
        }
        .wim-readmore__item {
          letter-spacing: 0.05em;
        }
        @keyframes wimMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        body.wim-info-open .wim-readmore { display: none; }
        body.wim-info-open .site-nav__menu-label {
          position: relative;
          color: transparent;
        }
        body.wim-info-open .site-nav__menu-label::after {
          content: 'Close';
          position: absolute;
          inset: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          pointer-events: none;
        }

        .wim-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: var(--spacing-xxl);
        }

        .wim-row {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .wim-card {
          border-radius: 12px;
          overflow: hidden;
          background: ${BLACK};
        }

        .wim-frame {
          height: auto;
          position: relative;
        }

        .wim-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(17, 17, 17, 0.06) 0%,
            rgba(17, 17, 17, 0.12) 50%,
            rgba(17, 17, 17, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: wimSkeleton 1.2s ease-in-out infinite;
          opacity: 1;
          transition: opacity 260ms ease;
        }

        @keyframes wimSkeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .wim-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          opacity: 0;
          filter: blur(12px);
          transform: scale(1.01);
          transition: opacity 380ms ease, filter 520ms ease, transform 520ms ease;
        }

        .wim-frame--loaded .wim-skeleton {
          opacity: 0;
        }

        .wim-frame--loaded .wim-img {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .wim-skeleton {
            animation: none;
          }
          .wim-img {
            transition: none;
          }
        }

        .wim-row--left .wim-card:first-child { flex: 3 1 0; }
        .wim-row--left .wim-card:last-child { flex: 2 1 0; }
        .wim-row--right .wim-card:first-child { flex: 2 1 0; }
        .wim-row--right .wim-card:last-child { flex: 3 1 0; }
        .wim-row--single .wim-card { flex: 1 1 auto; }

        @media (max-width: 700px) {
          .wim-page .home-hero__title {
            max-width: 100%;
            white-space: normal;
            overflow-wrap: anywhere;
          }
          .wim-readmore {
            bottom: 72px;
            width: calc(100% - 20px);
          }
          .wim-row {
            flex-direction: column;
          }
          .wim-row--left .wim-card:first-child,
          .wim-row--left .wim-card:last-child,
          .wim-row--right .wim-card:first-child,
          .wim-row--right .wim-card:last-child,
          .wim-row--single .wim-card {
            flex: 0 0 auto;
          }
          .wim-card {
            width: 100%;
          }
          .wim-img {
            height: auto;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default WimProject;
