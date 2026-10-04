import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import DecryptText from './DecryptText';
import SectionVerticalNav from './SectionVerticalNav';
import { FAQ } from '../seo/site';

const BLACK = 'var(--color-bg)';
const GRAY1 = 'var(--color-text-dim)';
const GRAY2 = 'var(--color-border)';
const WHITE = 'var(--color-text)';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';

const SERVICES = [
  {
    category: 'Branding',
    index: '01',
    tagline: 'An identity you can use everywhere.',
    description:
      'A distinctive visual identity and the toolkit to apply it, so every touchpoint looks unmistakably like you.',
    deliverables: [
      'Logo & Mark System',
      'Typography & Color Palette',
      'Brand Guidelines',
      'Templates, Signage & Merch',
    ],
  },
  {
    category: 'Website',
    index: '02',
    tagline: 'A home base worth sending people to.',
    description:
      'Custom websites designed and built in-house: fast, clear, and easy for your team to keep up to date.',
    deliverables: [
      'Website Design (UI/UX)',
      'Development & Launch',
      'Ecommerce',
      'CMS & Content Setup',
    ],
  },
  {
    category: 'Photo',
    index: '03',
    tagline: 'Imagery that shows the real thing.',
    description:
      'Commercial photography art-directed to your brand, ready for your website, print, and social channels.',
    deliverables: [
      'Product Photography',
      'Brand & Lifestyle',
      'Portraits & Team Headshots',
      'Editing & Retouching',
    ],
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover',
    description: 'We learn your business, your audience, and exactly which assets you need.',
  },
  {
    step: '02',
    title: 'Create',
    description: 'We design, build, and shoot, with check-ins along the way so nothing is a surprise.',
  },
  {
    step: '03',
    title: 'Deliver',
    description: 'You get final files, a launched site, and guidelines your team owns and can reuse.',
  },
];

const PROCESS_IMAGE_POOL = [
  { project: 'BAC', i: '01', src: '/images/new%20mockeup.webp', alt: 'Boise Analog Club campaign mockup' },
  { project: 'BAC', i: '02', src: '/images/analog%20new%20mobile.webp', alt: 'Boise Analog Club mobile website mockup' },
  { project: 'BAC', i: '03', src: '/images/newseltter%20mockup%20reel.webp', alt: 'Boise Analog Club newsletter reel mockup' },
  { project: 'BAC', i: '04', src: '/images/bac%20july%202026.webp', alt: 'Boise Analog Club July 2026 campaign graphic' },
  { project: 'KNWN', i: '01', src: '/images/knwnlocal%20mockup.webp', alt: 'KnwnLocal homepage and editorial layout' },
  { project: 'KNWN', i: '02', src: '/images/knwnlocal%202.webp', alt: 'KnwnLocal AI editing and content workflow interface' },
  { project: 'WIM', i: '01', src: '/images/wim software.webp', alt: 'WIM software mockup' },
  { project: 'WIM', i: '02', src: '/images/wim typemark.webp', alt: 'WIM typemark' },
  { project: 'WIM', i: '03', src: '/images/wim logomark.webp', alt: 'WIM logomark' },
  { project: 'WIM', i: '04', src: '/images/wim safety shirt.webp', alt: 'WIM safety shirt mockup' },
  { project: 'WIM', i: '05', src: '/images/wim truck mockup.webp', alt: 'WIM truck mockup' },
  { project: 'WIM', i: '06', src: '/images/wim HAT MOCKUP.webp', alt: 'WIM hat mockup' },
  { project: 'CONT', i: '01', src: '/images/continuity/screens.webp', alt: 'Continuity screens' },
  { project: 'CONT', i: '02', src: '/images/continuity/app.webp', alt: 'Continuity app' },
  { project: 'CONT', i: '03', src: '/images/continuity/continuity%20logo.webp', alt: 'Continuity logo' },
  { project: 'CONT', i: '04', src: '/images/continuity/TSHIRT%20MOCKUP.webp', alt: 'Continuity t-shirt mockup' },
  { project: 'CONT', i: '05', src: '/images/continuity/Cotton%20Totebag%20Mockup.webp', alt: 'Continuity totebag mockup' },
  { project: 'MICR', i: '01', src: '/images/lobby.webp', alt: 'Micron lobby environmental signage' },
  { project: 'MICR', i: '02', src: '/images/stair.webp', alt: 'Micron stairwell ADA signage' },
  { project: 'MICR', i: '03', src: '/images/bathroom.webp', alt: 'Micron bathroom ADA compliance signage' },
  { project: 'MICR', i: '04', src: '/images/level.webp', alt: 'Micron level and floor identification signage' },
  { project: 'WRKS', i: '01', src: '/images/worksharp/_DSC6969.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '02', src: '/images/worksharp/_DSC7142.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '03', src: '/images/worksharp/_DSC6814.webp', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '04', src: '/images/worksharp/_DSC6908.webp', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'WRKS', i: '05', src: '/images/worksharp/IMG_3004.jpg', alt: 'Worksharp + Drill Doctor commercial editorial photography' },
  { project: 'OPNZ', i: '01', src: '/images/OPEN NETIZEN CARD.jpg', alt: 'Open Netizen card mockup' },
  { project: 'OPNZ', i: '02', src: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg', alt: 'Open Netizen website mockup' },
  { project: 'OPNZ', i: '03', src: '/images/OPEN NETIZEN.jpg', alt: 'Open Netizen identity mockup' },
  { project: 'RICH', i: '01', src: '/images/ricochet mockup.webp', alt: 'Ricochet UI mockup' },
  { project: 'RICH', i: '02', src: '/images/Hourly Sales.PNG', alt: 'Ricochet hourly sales dashboard' },
  { project: 'RICH', i: '03', src: '/images/Exportable tables.PNG', alt: 'Ricochet exportable tables UI' },
];

const WorkImagePanel = ({ isMobile = false }) => {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: false, margin: '-5% 0px -5% 0px' });
  const reduceMotion = useReducedMotion();
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * PROCESS_IMAGE_POOL.length));
  const prevIdxRef = useRef(currentIdx);

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    const pickNext = () => {
      if (PROCESS_IMAGE_POOL.length <= 1) return 0;
      let n;
      let guard = 0;
      do {
        n = Math.floor(Math.random() * PROCESS_IMAGE_POOL.length);
        guard += 1;
      } while (n === prevIdxRef.current && guard < 10);
      prevIdxRef.current = n;
      setCurrentIdx(n);
    };
    const baseMs = 2400;
    const jitterMs = Math.floor(Math.random() * 800);
    const id = setInterval(pickNext, baseMs + jitterMs);
    return () => clearInterval(id);
  }, [inView, reduceMotion]);

  const current = PROCESS_IMAGE_POOL[currentIdx];
  const panelStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: isMobile ? '16 / 10' : '4 / 3',
    borderRadius: 14,
    overflow: 'hidden',
    border: HOME_SECTION_DIVIDER,
    background: 'rgba(255,255,255,0.03)',
  };

  return (
    <div ref={wrapRef} style={panelStyle}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current.src}
          src={current.src}
          alt={current.alt}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          loading="lazy"
        />
      </AnimatePresence>
      <div
        className="small-text"
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          padding: '5px 8px',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.54)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          color: '#fff',
          letterSpacing: '0.08em',
          lineHeight: 1,
          textTransform: 'uppercase',
          opacity: 0.92,
        }}
      >
        {current.project} · {current.i}
      </div>
    </div>
  );
};

const SECTIONS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'services', label: 'WHAT WE MAKE' },
  { id: 'process', label: 'HOW IT WORKS' },
  { id: 'faq', label: 'FAQ' },
  { id: 'next', label: 'NEXT STEP' },
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
      <SectionVerticalNav sections={SECTIONS} basePath="/services" isMobile={isMobile} />

      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px' }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'clamp(40px, 8vw, 128px)', marginBottom: 0, lineHeight: 0.88, letterSpacing: '-0.04em' }}>
              <DecryptText as="span" text="SERVICES" trigger="mount" duration={900} delay={150} />
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (02)</div>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 820, opacity: 0.85, lineHeight: 1.55 }}>
            Branding, Website, and Photo. Three services from one Boise, Idaho creation studio, made to work together.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) 0 var(--spacing-xxl)' }}>
        <section id="overview" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
          <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)', marginBottom: 'var(--spacing-xxl)' }}>
            <WorkImagePanel isMobile={isMobile} />
          </div>

          <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)' }}>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)', minWidth: 0 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                <DecryptText as="span" text="The assets your company needs to grow." trigger="inView" duration={900} />
              </h2>
              <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.9 }}>
                Creationbase is a creation studio in Boise, Idaho. We make the brand identity, website, and photography that brave companies across the Treasure Valley and beyond build on, designed as one system so everything looks and feels like it belongs together. You own every file, and it keeps working long after launch.
              </p>
            </div>
          </div>
        </section>

        <div className="container" style={{ maxWidth: 1400, marginLeft: isMobile ? 'auto' : '104px', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)' }}>
          <section id="services" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)', gap: 'var(--spacing-lg)', alignItems: 'start', borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: '0.08em', paddingTop: 6 }}>
                SERVICES / 03
              </div>
              <div style={{ minWidth: 0, display: 'grid', gap: 'var(--spacing-md)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
                  <DecryptText as="span" text="What We Make" trigger="inView" duration={900} />
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: 0, color: WHITE, maxWidth: 860, opacity: 0.88 }}>
                  Start with one or bring us all three.
                </p>
              </div>
            </div>

            <div
              className="home-services-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
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
                    minHeight: 320,
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
                    {service.tagline}
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
                    <p className="small-text" style={{ margin: 0, lineHeight: 1.5, opacity: 0.8, maxWidth: 340, fontSize: 'calc(var(--fs-sm) - 1px)' }}>
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
                  <p className="small-text" style={{ margin: 0, color: WHITE, opacity: 0.82, lineHeight: 1.6, textTransform: 'none' }}>
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
      </section>
    </motion.div>
  );
};

export default Services;
