import { useEffect } from 'react';
import { motion } from 'framer-motion';

const BLACK = '#0F0F0F';
const WHITE = '#E2E2E0';
const GRAY1 = 'rgba(226, 226, 224, 0.66)';
const GRAY2 = '#353535';

const SPEC_IMAGES = [
  { src: '/images/C1 - Specs Restroom identity.png', label: 'C1' },
  { src: '/images/C2 - Specs Exit Stair.png', label: 'C2' },
  { src: '/images/C3 - Specs Maximum Occupency.png', label: 'C3' },
  { src: '/images/C4 - Specs Stairwell Landing Identification.png', label: 'C4' },
  { src: '/images/C5 - Specs Stairwell Landing Identification.png', label: 'C5' },
  { src: '/images/N4 - Specs Blade Identity.png', label: 'N4' },
  { src: '/images/N6 - Specs Room Identity.png', label: 'N6' },
  { src: '/images/N7 - Specs Office Idenity.png', label: 'N7' },
  { src: '/images/N9 - Specs Focus Room Identity.png', label: 'N9' },
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
      data-header-theme="dark"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: `1px solid ${GRAY2}` }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
              MICRON
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>
              WAYFINDING / ENVIRONMENTAL
            </div>
          </div>
          <div style={{ height: 1, background: GRAY2, marginTop: 'var(--spacing-sm)' }} />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 860, opacity: 0.9, textTransform: 'none' }}>
            Ongoing project. Designed over 1000 ADA-compliant signs for the massive 2026 Boise expansion—building a cohesive wayfinding system that merges strict regulatory standards with architectural harmony.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'var(--spacing-xl)', alignItems: 'start' }}>
            <div style={{ border: `1px solid ${GRAY2}`, overflow: 'hidden' }}>
              <img
                src="/images/MICRON.JPG"
                alt="Micron wayfinding specifications"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div>
              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  ROLE
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  Graphic Designer
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  FOCUS
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  ADA compliance, wayfinding hierarchy, and environmental signage systems.
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  DELIVERABLES
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none', display: 'grid', gap: 6 }}>
                  <div>Specs + documentation</div>
                  <div>Sign family system</div>
                  <div>Production-ready files</div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  TAGS
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  [WAYFINDING] [ENVIRONMENTAL] [ADA]
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)', marginTop: 'var(--spacing-xxl)' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
              <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                DESIGN MOCKUPS
              </h2>
              <div className="small-text" style={{ color: GRAY1 }}>
                SIGN FAMILY DETAILS
              </div>
            </div>
            <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 860, textTransform: 'none', opacity: 0.9 }}>
              A selection of design mockups covering room IDs, stair/exit identifiers, occupancy signage, restroom identity, and focus-room/office variants.
            </div>
          </div>

          <div className="micron-specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
            {SPEC_IMAGES.map((img) => (
              <div key={img.src} style={{ border: `1px solid ${GRAY2}`, overflow: 'hidden', background: BLACK }}>
                <img
                  src={img.src}
                  alt={`Micron design mockup ${img.label}`}
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
