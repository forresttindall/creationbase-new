import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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

const MOBILE_QUERY = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)')
  : { matches: false };

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

  const sections = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'pillars', label: 'Core Pillars' },
      { id: 'process', label: 'DVCP Process' },
      { id: 'next', label: 'Next Step' },
    ],
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/services#${id}`);
    } else {
      window.location.hash = id;
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
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 1400 }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
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
                  {sections.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => jumpTo(s.id)}
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
              <section id="overview" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start' }}>
                  <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                    OVERVIEW / 01
                  </div>
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

              <section id="pillars" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', marginBottom: 'var(--spacing-xl)' }}>
                  <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                    PILLARS / 02
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

              <section id="process" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                  <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                    PROCESS / 03
                  </div>
                  <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                    <h2 className="section-title" style={{ fontSize: 'clamp(28px, 5vw, 64px)', lineHeight: 0.9, margin: 0, color: WHITE }}>
                      <DecryptText as="span" text={DVCP_PROCESS.title} trigger="inView" duration={800} />
                    </h2>
                    <div className="small-text" style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight-bold)', fontSize: 'clamp(11px, 1.1vw, 13px)', letterSpacing: '0.05em', opacity: 0.88, textTransform: 'uppercase' }}>
                      {DVCP_PROCESS.subtitle}
                    </div>
                    <p className="small-text" style={{ maxWidth: '64ch', lineHeight: 1.55, opacity: 0.84, textTransform: 'none', margin: 0, color: WHITE }}>
                      {DVCP_PROCESS.description}
                    </p>
                  </div>
                </div>

                <div
                  className="home-dvcp-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                    gap: 0,
                    borderTop: HOME_SECTION_DIVIDER,
                    borderLeft: HOME_SECTION_DIVIDER,
                  }}
                >
                  {DVCP_PROCESS.steps.map((s, i) => (
                    <motion.article
                      key={s.step}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.08 * i }}
                      style={{
                        borderRight: HOME_SECTION_DIVIDER,
                        borderBottom: HOME_SECTION_DIVIDER,
                        padding: 'clamp(18px, 2.5vw, 28px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--spacing-sm)',
                        minHeight: 220,
                        background: BLACK,
                        color: WHITE,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span className="small-text" style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight-bold)', letterSpacing: '0.06em', opacity: 0.86 }}>
                          STEP {s.step}
                        </span>
                        <span className="small-text" style={{ opacity: 0.5, color: GRAY1 }}>
                          {i + 1} / {DVCP_PROCESS.steps.length}
                        </span>
                      </div>

                      <h3 className="section-title" style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', lineHeight: 1.05, margin: 0, color: WHITE }}>
                        <DecryptText as="span" text={s.title} trigger="inView" duration={600} delay={200 + i * 80} />
                      </h3>

                      <p className="small-text" style={{ lineHeight: 1.55, opacity: 0.82, textTransform: 'none', margin: 0, color: WHITE }}>
                        {s.description}
                      </p>
                    </motion.article>
                  ))}
                </div>
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
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Services;
