import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import DecryptText from './DecryptText';

const BLACK = 'var(--color-bg)';
const GRAY1 = 'var(--color-text-dim)';
const GRAY2 = 'var(--color-border)';
const WHITE = 'var(--color-text)';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';
const STRATEGY_CALL_URL = 'https://calendly.com/forrest-creationbase/30min';

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

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openStrategyCall = () => {
    const win = window.open(STRATEGY_CALL_URL, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  const openPlayground = () => navigate('/playground');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="dark"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
      role="main"
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: HOME_SECTION_DIVIDER }}>
        <div className="container" style={{ maxWidth: 1400 }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
              <DecryptText as="span" text="ABOUT" trigger="mount" duration={900} delay={150} />
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (07)</div>
          </header>
          <div style={{ height: 1, background: GRAY2, marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 820, opacity: 0.88, lineHeight: 1.55 }}>
            Strategic creation consultancy. We align positioning, brand identity, website, and organic social into one accountable system — so mid-market companies can stop siloing spend and start compounding growth.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1400 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px, 0.65fr) minmax(0, 1.35fr)',
              gap: 'var(--spacing-xl)',
              alignItems: 'start',
            }}
          >
            <aside style={{ position: 'sticky', top: 120, alignSelf: 'start' }}>
              <div className="small-text" style={{ color: GRAY1, marginBottom: 12 }}>NAV</div>
              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 14 }}>
                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    { id: 'studio', label: 'Studio' },
                    { id: 'team', label: 'Team' },
                    { id: 'playground', label: 'Playground' },
                    { id: 'next', label: 'Next Step' },
                  ].map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(s.id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          window.history.replaceState(null, '', `/about#${s.id}`);
                        } else {
                          window.location.hash = s.id;
                        }
                      }}
                      className="small-text"
                      style={{
                        background: 'transparent',
                        border: `1px solid ${GRAY2}`,
                        borderRadius: 10,
                        padding: '12px 12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: WHITE,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 12,
                      }}
                    >
                      <span style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
                      <span style={{ color: GRAY1 }}>{idx < 9 ? `0${idx + 1}` : idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <button
                  type="button"
                  onClick={openStrategyCall}
                  className="newsletter-button"
                  style={{ width: '100%' }}
                >
                  Book Strategy Call
                  <ArrowUpRight size={14} weight="thin" />
                </button>
              </div>
            </aside>

            <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)' }}>
              <section id="studio" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 0.28fr) minmax(0, 1fr)',
                  gap: 'var(--spacing-lg)',
                  alignItems: 'start',
                }}>
                  <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                    STUDIO / 01
                  </div>
                  <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                      <DecryptText as="span" text="STUDIO PRACTICE" trigger="inView" duration={850} />
                    </h2>
                    <div className="small-text" style={{ lineHeight: 1.55, margin: 0, color: WHITE, maxWidth: 940, opacity: 0.9 }}>
                      Creationbase is an independent full service creation studio based in Boise, Idaho. Founded in 2022, we partner with brands and teams to shape clear visual systems, build distinctive brand identities, design fast and durable websites, and create photography that fits the work.
                    </div>
                    <div className="small-text" style={{ lineHeight: 1.55, margin: 0, color: WHITE, maxWidth: 940, opacity: 0.9 }}>
                      We deliver cohesive brand, web, and photo systems built for clarity, recognition, and real use. Our work is grounded in thoughtful process, strong design decisions, maintainable development, and visual direction that helps clients look sharper and communicate faster across every touchpoint.
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                      {[
                        { k: 'Positioning-Led', v: 'Strategy first, then identity, web, and social — all built to reinforce a shared anchor.' },
                        { k: 'Full Stack Studio', v: 'Design, engineering, content, and direction under one roof, so no handoff lines.' },
                        { k: 'Built for Mid-Market', v: 'Process, pacing, and output scaled for teams between series-A and enterprise.' },
                        { k: 'Systems Over Campaigns', v: 'Reusable direction and components that keep working long after launch.' },
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

              <section id="team" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 0.28fr) minmax(0, 1fr)',
                  gap: 'var(--spacing-lg)',
                  alignItems: 'start',
                  marginBottom: 'var(--spacing-xl)',
                }}>
                  <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                    TEAM / 02
                  </div>
                  <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                      <DecryptText as="span" text="Lead Team" trigger="inView" duration={850} />
                    </h2>
                    <div className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.88 }}>
                      Small core team, senior all the way through. No layers, no juniors sold as leads.
                    </div>
                  </div>
                </div>

                <div
                  className="studio-practice__team-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', borderBottom: HOME_SECTION_DIVIDER, paddingBottom: 'var(--spacing-sm)' }}>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em' }}>
                      PASSION PROJECTS / 03
                    </div>
                    <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: WHITE }}>
                      <DecryptText as="span" text="Playground" trigger="inView" duration={800} />
                    </h2>
                  </div>
                  <span className="small-text" style={{ color: GRAY1 }}>INDEX (07.1)</span>
                </div>

                <div
                  className="passion-projects-block"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr)',
                    marginTop: 'var(--spacing-xl)',
                  }}
                >
                  <div
                    className="passion-projects-item passion-projects-item--full"
                    style={{
                      border: `1px solid ${GRAY2}`,
                      borderRadius: 12,
                      padding: 20,
                      background: BLACK,
                    }}
                  >
                    <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                      <div className="small-text">PLAYGROUND</div>
                      <motion.button
                        onClick={openPlayground}
                        whileHover={{ opacity: 0.7 }}
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 'var(--font-mono-weight)',
                          fontSize: 'var(--fs-sm)',
                          textTransform: 'uppercase',
                          color: WHITE,
                        }}
                      >
                        [VIEW]
                        <ArrowUpRight size={20} weight="thin" aria-hidden="true" focusable="false" />
                      </motion.button>
                    </div>
                    <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85, lineHeight: 1.6, maxWidth: 640 }}>
                      Experiments in design, art, development, and image-making.
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
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.02,
                    margin: '12px 0 var(--spacing-md)',
                    fontSize: 'clamp(28px, 5vw, 64px)',
                  }}>
                    <DecryptText as="span" text="Let’s turn positioning into compounding growth." trigger="inView" duration={900} />
                  </h2>
                  <div className="small-text" style={{ color: GRAY1, maxWidth: 820, lineHeight: 1.6 }}>
                    Book a 30-minute strategy call and we&apos;ll walk through the Digital Value Creation Plan (DVCP) for your brand, website, and social channels — what we&apos;d measure first, where the quick wins are, and what a quarter of work would actually ship.
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
                      onClick={() => {
                        const el = document.getElementById('studio');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.history.replaceState(null, '', '/about#studio');
                      }}
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
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
