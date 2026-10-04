import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import DecryptText from './DecryptText';
import SectionVerticalNav from './SectionVerticalNav';

const BLACK = 'var(--color-bg)';
const GRAY1 = 'var(--color-text-dim)';
const GRAY2 = 'var(--color-border)';
const WHITE = 'var(--color-text)';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';

const TEAM = [
  {
    name: 'Forrest Tindall',
    role: 'Founder / Creative Director / Senior Designer / Fullstack Developer / Photographer',
    image: '/images/me%20new.webp',
  },
  {
    name: 'Sarah Houser',
    role: 'CMO / Art Director / Photographer',
    image: '/images/sarah%202.webp',
  },
  {
    name: 'Travis Winters',
    role: 'Graphic Designer / Motion Designer / Illustrator',
    image: '/images/travis.webp',
  },
];

const SECTIONS = [
  { id: 'studio', label: 'STUDIO' },
  { id: 'team', label: 'TEAM' },
  { id: 'playground', label: 'PLAYGROUND' },
  { id: 'next', label: 'NEXT STEP' },
];

const STUDIO_POINTS = [
  { k: 'One Studio', v: 'Branding, web, and photography under one roof, so everything shares one visual language.' },
  { k: 'Small Team', v: 'The people you meet are the people doing the work. No layers, no handoffs.' },
  { k: 'Ready to Use', v: 'Assets delivered ready for web, print, and social, with guidelines your team can follow.' },
  { k: 'Yours to Keep', v: 'Files and systems you own, built to keep working long after launch.' },
];

const About = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (ev) => setIsMobile(ev.matches);
    setIsMobile(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openContact = () => navigate('/contact');

  const openPlayground = () => navigate('/playground');

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/about#${id}`);
    }
  };

  const containerStyle = {
    maxWidth: 1400,
    marginLeft: isMobile ? 'auto' : '104px',
    paddingLeft: 'var(--spacing-md)',
    paddingRight: 'var(--spacing-md)',
  };

  const sectionHeadStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)',
    gap: 'var(--spacing-lg)',
    alignItems: 'start',
    borderTop: HOME_SECTION_DIVIDER,
    paddingTop: 'var(--spacing-xl)',
    marginBottom: 'var(--spacing-xl)',
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--font-display)',
    textTransform: 'uppercase',
    letterSpacing: '-0.04em',
    lineHeight: 1.02,
    margin: 0,
    fontSize: 'clamp(28px, 4.2vw, 56px)',
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
      <SectionVerticalNav sections={SECTIONS} basePath="/about" isMobile={isMobile} />

      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: HOME_SECTION_DIVIDER }}>
        <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px' }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'clamp(40px, 8vw, 128px)', marginBottom: 0, lineHeight: 0.88, letterSpacing: '-0.04em' }}>
              <DecryptText as="span" text="ABOUT" trigger="mount" duration={900} delay={150} />
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (07)</div>
          </header>
          <div style={{ height: 1, background: GRAY2, marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 820, opacity: 0.88, lineHeight: 1.55 }}>
            An independent creation studio in Boise, Idaho, making brands, websites, and photography for brave companies.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) 0 var(--spacing-xxl)' }}>
        <div className="container" style={containerStyle}>
          <section id="studio" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ ...sectionHeadStyle, borderTop: 'none', paddingTop: 0 }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                STUDIO / 01
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={sectionTitleStyle}>
                  <DecryptText as="span" text="Studio Practice" trigger="inView" duration={850} />
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.9 }}>
                  Creationbase is an independent full service creation studio based in Boise, Idaho. Founded in 2022, we partner with brands and teams to build distinctive brand identities, design fast and durable websites, and create photography that fits the work.
                </p>
                <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.9 }}>
                  Everything we make is built for clarity, recognition, and real use, so our clients look sharper and communicate faster across every touchpoint.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              {STUDIO_POINTS.map((item) => (
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
          </section>

          <section id="team" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={sectionHeadStyle}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                TEAM / 02
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={sectionTitleStyle}>
                  <DecryptText as="span" text="Lead Team" trigger="inView" duration={850} />
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.88 }}>
                  Small core team, senior all the way through. No layers, no juniors sold as leads.
                </p>
              </div>
            </div>

            <div
              className="studio-practice__team-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                gap: 'var(--spacing-lg)',
                alignItems: 'start',
              }}
            >
              {TEAM.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.06 * i }}
                  className="studio-practice__team-card"
                  style={{
                    border: `1px solid ${GRAY2}`,
                    borderRadius: 12,
                    padding: 14,
                    background: BLACK,
                    color: WHITE,
                  }}
                >
                  <div
                    className="studio-practice__team-image"
                    style={{
                      borderRadius: 10,
                      overflow: 'hidden',
                      aspectRatio: '4 / 5',
                      width: '100%',
                      background: '#0e0e0e',
                      marginBottom: 14,
                    }}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div className="studio-practice__team-meta" style={{ display: 'grid', gap: 6 }}>
                    <div
                      className="small-text"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'var(--font-mono-weight-bold)',
                        fontSize: 'var(--fs-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {m.name}
                    </div>
                    <div className="small-text" style={{ color: GRAY1, lineHeight: 1.45, letterSpacing: '0.02em' }}>
                      {m.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="playground" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={sectionHeadStyle}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                PLAYGROUND / 03
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={sectionTitleStyle}>
                  <DecryptText as="span" text="Playground" trigger="inView" duration={800} />
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.88 }}>
                  Experiments in design, art, development, and image-making.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={openPlayground}
                    className="newsletter-button newsletter-button--outline"
                  >
                    View Playground
                    <ArrowRight size={14} weight="thin" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="next" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Next Step</div>
                <div className="small-text" style={{ color: GRAY1 }}>Contact</div>
              </div>
              <h2 style={{ ...sectionTitleStyle, margin: '12px 0 var(--spacing-md)', fontSize: 'clamp(28px, 5vw, 64px)' }}>
                <DecryptText as="span" text="Let’s make something brave." trigger="inView" duration={900} />
              </h2>
              <div className="small-text" style={{ color: GRAY1, maxWidth: 820, lineHeight: 1.6 }}>
                Tell us about your brand, website, or photography project and we&apos;ll follow up with next steps.
              </div>
              <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" onClick={openContact} className="newsletter-button">
                  Start a Project
                  <ArrowRight size={14} weight="thin" />
                </button>
                <button
                  type="button"
                  onClick={() => jumpTo('studio')}
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

export default About;
