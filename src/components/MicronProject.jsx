import { useEffect } from 'react';
import { motion } from 'framer-motion';

const BLACK = '#FFFFFF';
const WHITE = '#111111';
const GRAY1 = 'rgba(17, 17, 17, 0.56)';
const GRAY2 = '#C9C9C9';

const SPEC_IMAGES = [
  { src: '/images/_DSC4026.jpg', label: '01' },
  { src: '/images/_DSC7142.jpg', label: '02' },
  { src: '/images/_DSC3935-2.jpg', label: '03' },
  { src: '/images/_DSC6840.jpg', label: '04' },
  { src: '/images/IMG_3004.jpg', label: '05' },
];

const MicronProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: `1px solid ${GRAY2}` }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
              WORK SHARP + DRILL DOCTOR
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>
              POPULAR MECHANICS / PHOTOGRAPHY
            </div>
          </div>
          <div style={{ height: 1, background: GRAY2, marginTop: 'var(--spacing-sm)' }} />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 860, opacity: 0.9, textTransform: 'none' }}>
            Editorial product photoshoot for Popular Mechanics featuring Work Sharp and Drill Doctor—built around clean lighting, rugged material detail, and a sharp magazine-ready product story.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'var(--spacing-xl)', alignItems: 'start' }}>
            <div style={{ border: `1px solid ${GRAY2}`, overflow: 'hidden' }}>
              <img
                src="/images/_DSC6969.jpg"
                alt="Work Sharp and Drill Doctor Popular Mechanics cover image"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div>
              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  ROLE
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  Photographer
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  FOCUS
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  Editorial product photography, lighting control, texture, and durable tool-focused detail.
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  DELIVERABLES
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none', display: 'grid', gap: 6 }}>
                  <div>Hero cover image</div>
                  <div>Editorial selects</div>
                  <div>Magazine-ready product photography</div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  TAGS
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  [EDITORIAL] [PRODUCT] [PHOTOGRAPHY]
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)', marginTop: 'var(--spacing-xxl)' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
              <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                PHOTO SELECTS
              </h2>
              <div className="small-text" style={{ color: GRAY1 }}>
                POPULAR MECHANICS FEATURE
              </div>
            </div>
            <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 860, textTransform: 'none', opacity: 0.9 }}>
              Supporting selects from the combined Work Sharp + Drill Doctor shoot, balancing utility, material realism, and editorial clarity across the spread.
            </div>
          </div>

          <div className="micron-specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
            {SPEC_IMAGES.map((img) => (
              <div key={img.src} style={{ border: `1px solid ${GRAY2}`, overflow: 'hidden', background: BLACK }}>
                <img
                  src={img.src}
                  alt={`Work Sharp and Drill Doctor photo ${img.label}`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 1100px) {
              .micron-specs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            }
            @media (max-width: 700px) {
              .micron-specs-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>
    </motion.div>
  );
};

export default MicronProject;
