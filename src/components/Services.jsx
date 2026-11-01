import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import DecryptText from './DecryptText';
import { FAQ } from '../seo/site';

const BLACK = 'var(--color-bg)';
const GRAY1 = 'var(--color-text-dim)';
const GRAY2 = 'var(--color-border)';
const WHITE = 'var(--color-text)';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';
const BODY_TEXT_STYLE = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 'var(--font-mono-weight)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const SERVICES = [
  {
    category: 'Brand',
    index: '01',
    tagline: 'A brand system built to scale with you.',
    description:
      'Identity, positioning, and core assets designed to make your company recognizable, credible, and easier to trust.',
    deliverables: [
      'Logo & Identity System',
      'Messaging & Positioning Direction',
      'Typography & Color System',
      'Brand Guidelines & Templates',
    ],
  },
  {
    category: 'Web',
    index: '02',
    tagline: 'A site that earns attention and converts it.',
    description:
      'Custom websites designed and built in-house to be clear, fast, easy to update, and strong enough to support growth.',
    deliverables: [
      'Website Strategy & UI/UX',
      'Custom Development & Launch',
      'CMS & Content Setup',
      'Landing Pages & Conversion Flows',
    ],
  },
  {
    category: 'Photo',
    index: '03',
    tagline: 'Real imagery for real trust.',
    description:
      'Commercial photography art-directed to your brand and created to work across your site, campaigns, print, and social channels.',
    deliverables: [
      'Product Photography',
      'Brand & Lifestyle Shoots',
      'Portraits & Team Headshots',
      'Editing & Retouching',
    ],
  },
  {
    category: 'Messaging Strategy',
    index: '04',
    tagline: 'Clear words that make the rest of the work stronger.',
    description:
      'Positioning, offer language, and message architecture that give your website, campaigns, and sales materials a clearer point of view.',
    deliverables: [
      'Messaging Frameworks',
      'Offer Positioning',
      'Brand Voice Direction',
      'Homepage & Campaign Copy Guidance',
    ],
  },
  {
    category: 'SEO',
    index: '05',
    tagline: 'Search visibility with substance behind it.',
    description:
      'Search strategy and on-site optimization that help the right people find you, understand you, and keep moving.',
    deliverables: [
      'Technical SEO Audits',
      'On-Page Optimization',
      'Site Structure & Metadata',
      'Content Strategy for Search',
    ],
  },
  {
    category: 'AEO',
    index: '06',
    tagline: 'Built for answer engines, not just search engines.',
    description:
      'Content and information architecture shaped for AI search, answer engines, and the way people now discover brands through generated results.',
    deliverables: [
      'Answer-Focused Content Structure',
      'Entity & Topic Mapping',
      'LLM / AI Visibility Strategy',
      'Schema & Knowledge Signals',
    ],
  },
  {
    category: 'Social Media',
    index: '07',
    tagline: 'A consistent presence people remember.',
    description:
      'Social media management built around brand consistency, useful content, and a cadence your business can actually maintain.',
    deliverables: [
      'Channel Strategy & Planning',
      'Content Calendars',
      'Post Design & Asset Production',
      'Publishing & Performance Review',
    ],
  },
  {
    category: 'Campaigns',
    index: '08',
    tagline: 'Campaign creative that connects the whole system.',
    description:
      'Integrated marketing campaigns with the design, messaging, landing pages, and content support needed to launch cleanly.',
    deliverables: [
      'Launch Campaign Concepts',
      'Campaign Messaging Systems',
      'Paid / Organic Creative Assets',
      'Landing Page Support',
    ],
  },
  {
    category: 'Launch Support',
    index: '09',
    tagline: 'A coordinated launch without the scramble.',
    description:
      'Hands-on support for launches so your website, messaging, email, social, and campaign assets all go live together cleanly.',
    deliverables: [
      'Launch Planning & Rollout',
      'Asset Coordination',
      'Launch-Day Updates',
      'Post-Launch Cleanup & Support',
    ],
  },
  {
    category: 'Email Marketing',
    index: '10',
    tagline: 'Email that stays on-brand and drives action.',
    description:
      'Email strategy and execution for newsletters, launches, nurture flows, and retention moments that keep your audience warm.',
    deliverables: [
      'Newsletter Design Systems',
      'Campaign & Automation Planning',
      'Launch and Nurture Emails',
      'Copy, Layout, and Reporting',
    ],
  },
];

const RETAINER = {
  index: 'R01',
  title: 'Retainer',
  tagline: 'Ongoing support for brands that need consistency after launch.',
  description:
    'For teams that need a steady creative and marketing partner, retainers cover the ongoing work that keeps your brand active, updated, and growing after the initial build.',
  items: [
    'Website Updates & Care',
    'SEO / AEO Optimization',
    'Social Media Management',
    'Email Marketing Support',
    'Campaign Rollouts',
    'Monthly Creative Requests',
  ],
};

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover',
    description: 'We learn your business, your audience, and exactly which assets will move the needle first.',
  },
  {
    step: '02',
    title: 'Build',
    description: 'We design the system, produce the assets, and launch the pieces in the order that makes the most sense.',
  },
  {
    step: '03',
    title: 'Grow',
    description: 'We refine performance over time with ongoing content, campaigns, search visibility, and marketing support.',
  },
];

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jumpTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/services');
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/services#${id}`);
    }
  };

  const openContact = () => navigate('/contact');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="dark"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
      role="main"
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)' }}>
        <div className="container" style={{ maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto' }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'clamp(40px, 8vw, 128px)', marginBottom: 0, lineHeight: 0.88, letterSpacing: '-0.04em' }}>
              <DecryptText as="span" text="SERVICES" trigger="mount" duration={900} delay={150} />
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (02)</div>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', maxWidth: 1040 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.8vw, 64px)' }}>
              <DecryptText as="span" text="Brand web photo, plus the systems that grow demand." trigger="inView" duration={900} />
            </h2>
            <p className="small-text" style={{ ...BODY_TEXT_STYLE, lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 920, opacity: 0.88 }}>
              Creationbase builds the core assets first, then extends them into SEO, AEO, social media management, marketing campaigns, and email marketing so your company shows up consistently everywhere people find you.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) 0 var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)' }}>
          <section id="services" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                SERVICES / 10
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                  <DecryptText as="span" text="What We Make" trigger="inView" duration={900} />
                </h2>
                <p className="small-text" style={{ ...BODY_TEXT_STYLE, lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.88 }}>
                  Start with brand, web, or photo, then expand into the channels that help the work get found and perform.
                </p>
              </div>
            </div>

            <div
              className="home-services-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
                gap: 0,
                borderTop: HOME_SECTION_DIVIDER,
                borderLeft: HOME_SECTION_DIVIDER,
              }}
            >
              {SERVICES.map((service, i) => (
                <motion.article
                  key={service.category}
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
                    minHeight: 340,
                    background: BLACK,
                    color: WHITE,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                    <h3
                      className="section-title"
                      style={{
                        fontSize: 'clamp(26px, 3.2vw, 44px)',
                        lineHeight: 0.9,
                        margin: 0,
                        color: WHITE,
                      }}
                    >
                      <DecryptText as="span" text={service.category} trigger="inView" duration={600} delay={150 + i * 60} />
                    </h3>
                    <span className="small-text" style={{ opacity: 0.78, letterSpacing: '0.06em', color: GRAY1 }}>
                      {service.index}
                    </span>
                  </div>

                  <p
                    className="small-text"
                    style={{
                      ...BODY_TEXT_STYLE,
                      fontSize: 'clamp(14px, 1.4vw, 18px)',
                      lineHeight: 1.3,
                      color: WHITE,
                      opacity: 0.92,
                      margin: 0,
                    }}
                  >
                    {service.tagline}
                  </p>

                  <p
                    className="small-text"
                    style={{
                      ...BODY_TEXT_STYLE,
                      lineHeight: 1.55,
                      opacity: 0.82,
                      margin: 0,
                      color: WHITE,
                    }}
                  >
                    {service.description}
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
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
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
                        <span style={{ lineHeight: 1.4, color: WHITE }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              style={{
                marginTop: 'var(--spacing-lg)',
                border: HOME_SECTION_DIVIDER,
                padding: 'clamp(20px, 3vw, 36px)',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(180px, 0.32fr) minmax(0, 1fr)',
                gap: 'var(--spacing-lg)',
                background: BLACK,
              }}
            >
              <div style={{ display: 'grid', gap: '10px', alignContent: 'start' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em' }}>
                  {RETAINER.index}
                </div>
                <h3
                  className="section-title"
                  style={{
                    fontSize: 'clamp(26px, 3.6vw, 48px)',
                    lineHeight: 0.92,
                    margin: 0,
                    color: WHITE,
                  }}
                >
                  <DecryptText as="span" text={RETAINER.title} trigger="inView" duration={700} />
                </h3>
              </div>

              <div style={{ display: 'grid', gap: 'var(--spacing-md)', minWidth: 0 }}>
                <p
                  className="small-text"
                  style={{
                    ...BODY_TEXT_STYLE,
                    fontSize: 'clamp(14px, 1.4vw, 18px)',
                    lineHeight: 1.3,
                    color: WHITE,
                    opacity: 0.92,
                    margin: 0,
                  }}
                >
                  {RETAINER.tagline}
                </p>
                <p
                  className="small-text"
                  style={{
                    ...BODY_TEXT_STYLE,
                    lineHeight: 1.55,
                    color: WHITE,
                    opacity: 0.82,
                    margin: 0,
                    maxWidth: 900,
                  }}
                >
                  {RETAINER.description}
                </p>
                <ul
                  className="small-text"
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                    gap: '8px 18px',
                    fontSize: 'var(--fs-xs)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {RETAINER.items.map((item) => (
                    <li
                      key={item}
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
                      <span style={{ lineHeight: 1.4, color: WHITE }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </section>

          <section id="process" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                PROCESS / 04
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                  <DecryptText as="span" text="How It Works" trigger="inView" duration={900} />
                </h2>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                gap: 0,
                borderTop: HOME_SECTION_DIVIDER,
                borderLeft: HOME_SECTION_DIVIDER,
              }}
            >
              {PROCESS_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  style={{
                    borderRight: HOME_SECTION_DIVIDER,
                    borderBottom: HOME_SECTION_DIVIDER,
                    padding: 'var(--spacing-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-sm)',
                    minHeight: 180,
                    background: BLACK,
                  }}
                >
                  <div className="small-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', opacity: 0.76 }}>
                    <span>STEP {s.step}</span>
                    <span>{String(i + 1).padStart(2, '0')} / {String(PROCESS_STEPS.length).padStart(2, '0')}</span>
                  </div>
                  <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
                    <h3 className="section-title" style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', lineHeight: 0.96, letterSpacing: '-0.03em', margin: 0, color: WHITE }}>
                      <DecryptText as="span" text={s.title.toUpperCase()} trigger="inView" duration={550} delay={160 + i * 80} />
                    </h3>
                    <p className="small-text" style={{ ...BODY_TEXT_STYLE, margin: 0, lineHeight: 1.5, opacity: 0.8, maxWidth: 340, fontSize: 'calc(var(--fs-sm) - 1px)' }}>
                      {s.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="faq" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                FAQ / 05
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                  <DecryptText as="span" text="Questions" trigger="inView" duration={900} />
                </h2>
              </div>
            </div>

            <div style={{ borderTop: HOME_SECTION_DIVIDER }}>
              {FAQ.map(({ q, a }) => (
                <div
                  key={q}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
                    gap: isMobile ? 8 : 'var(--spacing-lg)',
                    padding: 'var(--spacing-md) 0',
                    borderBottom: HOME_SECTION_DIVIDER,
                  }}
                >
                  <h3 className="small-text" style={{ margin: 0, color: WHITE, letterSpacing: '0.04em', lineHeight: 1.5, fontWeight: 'var(--font-mono-weight-bold)' }}>
                    {q}
                  </h3>
                  <p className="small-text" style={{ ...BODY_TEXT_STYLE, margin: 0, color: WHITE, opacity: 0.82, lineHeight: 1.6 }}>
                    {a}
                  </p>
                </div>
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
                <DecryptText as="span" text="Let’s make what your brand needs next." trigger="inView" duration={900} />
              </h2>
              <p className="small-text" style={{ ...BODY_TEXT_STYLE, color: GRAY1, maxWidth: 820, lineHeight: 1.6, margin: 0 }}>
                Tell us what you need help with, from brand and web to SEO, campaigns, social, or email, and we&apos;ll follow up with next steps.
              </p>
              <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" onClick={openContact} className="newsletter-button">
                  Start a Project
                  <ArrowRight size={14} weight="thin" />
                </button>
                <button
                  type="button"
                  onClick={() => jumpTo('top')}
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

export default Services;
