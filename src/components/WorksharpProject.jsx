import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const WORKSHARP_IMAGES = [
  { src: '/images/worksharp/_DSC6969.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { src: '/images/worksharp/_DSC7142.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { src: '/images/worksharp/_DSC6814.webp', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { src: '/images/worksharp/_DSC6908.webp', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { src: '/images/worksharp/IMG_3004.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
];

const WORKSHARP_NARRATIVE = {
  meta: [
    'ROLE( Photographer )',
    'CLIENT( Worksharp + Drill Doctor )',
    'PUBLICATION( Popular Mechanics Magazine )',
    'SCOPE( Commercial Editorial Photography, Product Imagery, Dual-Brand Shoot )',
  ],
  sections: [
    {
      label: 'Context',
      text: 'Worksharp and Drill Doctor needed a set of editorial images that could present both brands clearly within one shared shoot built for Popular Mechanics.',
    },
    {
      label: 'Problem',
      text: 'The challenge was making two related tool brands feel cohesive in the same visual system without flattening their differences or losing the product clarity the publication needed.',
    },
    {
      label: 'Process',
      text: 'I planned and photographed the project as a dual-brand shoot, building setups that could move between hero angles, detail shots, and product-forward compositions while keeping lighting, tone, and styling consistent.',
    },
    {
      label: 'Proposal',
      text: 'The direction focused on sharp, credible photography that could work editorially for the magazine while still giving each brand usable assets for web, print, and broader marketing needs.',
    },
    {
      label: 'Result',
      text: 'The final image set gave Worksharp and Drill Doctor a cohesive library of commercial editorial photography that served the Popular Mechanics feature and extended naturally into brand use afterward.',
    },
  ],
};

const WorksharpProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loadedBySrc, setLoadedBySrc] = useState({});

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
      className="worksharp-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="dark"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section data-header-theme="dark" style={{ position: 'relative', overflow: 'hidden', background: BLACK, color: WHITE }}>
        <div style={{ minHeight: '42vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)', position: 'relative', zIndex: 1 }}>
          <h1 className="home-hero__title" style={{ marginBottom: 'auto' }}>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <DecryptText as="span" text="WORKSHARP + DRILL DOCTOR" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>WORKSHARP + DRILL DOCTOR</span>
            <span style={{ margin: '0 14px' }}>•</span>
            <span style={{ marginLeft: 14 }}>SCOPE( COMMERCIAL EDITORIAL PHOTOGRAPHY )</span>
          </div>
          <div className="worksharp-rows">
            {WORKSHARP_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single
                ? 'worksharp-row worksharp-row--single'
                : (rIdx % 2 === 0 ? 'worksharp-row worksharp-row--left' : 'worksharp-row worksharp-row--right');
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
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
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
      <ProjectNarrative eyebrow="WORKSHARP + DRILL DOCTOR" meta={WORKSHARP_NARRATIVE.meta} sections={WORKSHARP_NARRATIVE.sections} />

      <style>{`
        .worksharp-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: var(--spacing-xxl);
        }

        .worksharp-row {
          display: flex;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .worksharp-card {
          border-radius: 12px;
          overflow: hidden;
          background: ${BLACK};
          min-width: 0;
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
          display: block;
          object-fit: cover;
          opacity: 0;
          transition: opacity 260ms ease;
        }

        .worksharp-frame--loaded .worksharp-skeleton {
          opacity: 0;
          pointer-events: none;
        }

        .worksharp-frame--loaded .worksharp-img {
          opacity: 1;
        }

        .worksharp-row--left .worksharp-card:first-child,
        .worksharp-row--right .worksharp-card:last-child {
          flex: 0 0 calc(64% - 5px);
        }

        .worksharp-row--left .worksharp-card:last-child,
        .worksharp-row--right .worksharp-card:first-child {
          flex: 0 0 calc(36% - 5px);
        }

        .worksharp-row--single .worksharp-card {
          flex: 0 0 100%;
        }

        @media (max-width: 700px) {
          .worksharp-row,
          .worksharp-row--left,
          .worksharp-row--right {
            flex-direction: column;
          }

          .worksharp-row .worksharp-card,
          .worksharp-row--left .worksharp-card,
          .worksharp-row--right .worksharp-card,
          .worksharp-row--single .worksharp-card {
            flex: 0 0 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default WorksharpProject;
