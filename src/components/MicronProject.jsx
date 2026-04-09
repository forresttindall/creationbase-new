import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const BLACK = '#FFFFFF';
const WHITE = '#111111';
const WORKSHARP_IMAGES = [
  { src: '/images/_DSC6969.jpg', alt: 'Work Sharp and Drill Doctor hero photograph' },
  { src: '/images/_DSC7142.jpg', alt: 'Work Sharp and Drill Doctor supporting photograph' },
  { src: '/images/_DSC4026.jpg', alt: 'Work Sharp and Drill Doctor editorial select' },
  { src: '/images/_DSC3935-2.jpg', alt: 'Work Sharp and Drill Doctor editorial select' },
  { src: '/images/_DSC6840.jpg', alt: 'Work Sharp and Drill Doctor editorial select' },
  { src: '/images/_DSC6814.webp', alt: 'Work Sharp and Drill Doctor editorial select' },
  { src: '/images/_DSC6836.webp', alt: 'Work Sharp and Drill Doctor editorial select' },
  { src: '/images/_DSC6908.webp', alt: 'Work Sharp and Drill Doctor editorial select' },
  { src: '/images/IMG_3004.jpg', alt: 'Work Sharp and Drill Doctor editorial select' },
];

const MicronProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    if (readMoreOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('worksharp-info-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('worksharp-info-open');
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
      document.body.classList.remove('worksharp-info-open');
      document.removeEventListener('click', handleNavClick, true);
    };
  }, [readMoreOpen]);

  useEffect(() => {
    const adjustRowHeights = () => {
      const rows = Array.from(document.querySelectorAll('.worksharp-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.worksharp-frame'));
        const imgs = Array.from(row.querySelectorAll('.worksharp-frame img'));
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
    const container = document;
    container.addEventListener('load', onLoad, true);
    window.addEventListener('resize', adjustRowHeights);
    const raf = requestAnimationFrame(adjustRowHeights);
    return () => {
      container.removeEventListener('load', onLoad, true);
      window.removeEventListener('resize', adjustRowHeights);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      className="worksharp-page"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section data-header-theme="light" style={{ position: 'relative', overflow: 'hidden', background: BLACK, color: WHITE }}>
        <div style={{ minHeight: '42vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)', position: 'relative', zIndex: 1 }}>
          <h1 className="home-hero__title" style={{ marginBottom: 'auto' }}>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <DecryptText as="span" text="PRINT READY" trigger="mount" delay={200} duration={900} />
            </div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
              <DecryptText as="span" text="PHOTOGRAPHY" trigger="mount" delay={440} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <button
        type="button"
        className="worksharp-readmore"
        aria-label="Read more"
        onClick={() => setReadMoreOpen(true)}
      >
        <div className="worksharp-readmore__track">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="worksharp-readmore__item small-text">
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
          className="worksharp-overlay"
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
            className="worksharp-overlay__inner"
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
              WORK SHARP + DRILL DOCTOR •
            </div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)' }}>ROLE</div>
            <div className="small-text" style={{ marginTop: 8 }}>Photographer</div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>SCOPE</div>
            <div className="small-text" style={{ marginTop: 8 }}>Editorial product photography, lighting direction, post-production, magazine-ready selects</div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>PROJECT</div>
            <div className="small-text" style={{ marginTop: 8 }}>
              Editorial product photoshoot for Popular Mechanics featuring Work Sharp and Drill Doctor—built around clean lighting, rugged material detail, and a sharp magazine-ready product story.
            </div>
          </motion.div>
        </motion.div>
      )}

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: '#000000', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>WORK SHARP + DRILL DOCTOR</span>
            <span style={{ margin: '0 14px' }}>•</span>
            <span style={{ marginLeft: 14 }}>SCOPE( POPULAR MECHANICS / PHOTOGRAPHY)</span>
          </div>
          <div className="worksharp-rows">
            {WORKSHARP_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single ? 'worksharp-row worksharp-row--single' : (rIdx % 2 === 0 ? 'worksharp-row worksharp-row--left' : 'worksharp-row worksharp-row--right');
              return (
                <div key={`row-${rIdx}`} className={rowClass}>
                  {row.map((image) => {
                    const isLoaded = !!loadedBySrc[image.src];
                    return (
                      <motion.div
                        key={image.src}
                        className="worksharp-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <div className={`worksharp-frame${isLoaded ? ' worksharp-frame--loaded' : ' worksharp-frame--loading'}`}>
                          <div className="worksharp-skeleton" aria-hidden="true" />
                          <img
                            className="worksharp-img"
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
                              const card = ev.currentTarget.closest('.worksharp-card');
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
        .worksharp-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: var(--spacing-xxl);
        }

        .worksharp-readmore {
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
        .worksharp-readmore__track {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          white-space: nowrap;
          will-change: transform;
          animation: worksharpMarquee 12s linear infinite;
          padding: 0 12px;
        }
        .worksharp-readmore__item {
          letter-spacing: 0.05em;
        }
        @keyframes worksharpMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        body.worksharp-info-open .worksharp-readmore { display: none; }
        body.worksharp-info-open .site-nav__menu-label {
          position: relative;
          color: transparent;
        }
        body.worksharp-info-open .site-nav__menu-label::after {
          content: 'Close';
          position: absolute;
          inset: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          pointer-events: none;
        }

        .worksharp-row {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .worksharp-card {
          border-radius: 12px;
          overflow: hidden;
          background: ${BLACK};
        }

        .worksharp-frame {
          height: auto;
          position: relative;
        }

        .worksharp-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(17, 17, 17, 0.06) 0%,
            rgba(17, 17, 17, 0.12) 50%,
            rgba(17, 17, 17, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: worksharpSkeleton 1.2s ease-in-out infinite;
          opacity: 1;
          transition: opacity 260ms ease;
        }

        @keyframes worksharpSkeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .worksharp-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          opacity: 0;
          filter: blur(12px);
          transform: scale(1.01);
          transition: opacity 380ms ease, filter 520ms ease, transform 520ms ease;
        }

        .worksharp-frame--loaded .worksharp-skeleton {
          opacity: 0;
        }

        .worksharp-frame--loaded .worksharp-img {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .worksharp-skeleton {
            animation: none;
          }
          .worksharp-img {
            transition: none;
          }
        }

        .worksharp-row--left .worksharp-card:first-child { flex: 0 0 60%; }
        .worksharp-row--left .worksharp-card:last-child { flex: 0 0 40%; }
        .worksharp-row--right .worksharp-card:first-child { flex: 0 0 40%; }
        .worksharp-row--right .worksharp-card:last-child { flex: 0 0 60%; }
        .worksharp-row--single .worksharp-card { flex: 1 1 auto; }

        @media (max-width: 700px) {
          .worksharp-readmore {
            bottom: 72px;
            width: calc(100% - 20px);
          }
          .worksharp-row {
            flex-direction: column;
          }
          .worksharp-card {
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default MicronProject;
