import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router-dom';
import BoiseAnalogClubCaseStudy from './components/BoiseAnalogClubCaseStudy';
import OpenNetizenCaseStudy from './components/OpenNetizenCaseStudy';
import Portraits from './components/Portraits';
import StreetPhotography from './components/StreetPhotography';
import CommercialPhotography from './components/CommercialPhotography';
import Blog from './components/Blog';
import Contact from './components/Contact';
import RicochetProject from './components/RicochetProject';
import MicronProject from './components/MicronProject';
import Playground from './components/Playground';
import DecryptText from './components/DecryptText';

const UI_LIGHT = '#111111';
const UI_DARK = '#FFFFFF';
const HOME_SECTION_DIVIDER = '1px solid #000000';
const HERO_AVAILABILITY = {
  label: 'Available',
  color: '#5FE37C',
};

const SiteFooter = ({ newsletterEmail, newsletterStatus, onNewsletterEmailChange, onSubmitNewsletter, onContactClick }) => {
  const footerVantaElRef = useRef(null);
  const footerVantaEffectRef = useRef(null);

  useEffect(() => {
    const el = footerVantaElRef.current;
    if (!el) return;

    let initTimer = 0;
    let resizeHandler = null;
    let lastWidth = window.innerWidth;

    const destroy = () => {
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
      }
      if (!footerVantaEffectRef.current) return;
      try {
        footerVantaEffectRef.current.destroy();
      } catch {
        void 0;
      }
      footerVantaEffectRef.current = null;
    };

    const init = () => {
      if (!window.VANTA || typeof window.VANTA.TOPOLOGY !== 'function') return false;
      destroy();
      footerVantaEffectRef.current = window.VANTA.TOPOLOGY({
        el,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x000000,
        backgroundColor: 0xffffff,
      });

      const effect = footerVantaEffectRef.current;
      if (effect && typeof effect.resize === 'function') {
        try {
          window.removeEventListener('resize', effect.resize);
        } catch {
          void 0;
        }
        lastWidth = window.innerWidth;
        resizeHandler = () => {
          const w = window.innerWidth;
          if (w !== lastWidth) {
            lastWidth = w;
            try {
              effect.resize();
            } catch {
              void 0;
            }
          }
        };
        window.addEventListener('resize', resizeHandler);
      }

      return true;
    };

    if (!init()) {
      initTimer = window.setInterval(() => {
        if (init()) window.clearInterval(initTimer);
      }, 100);
    }

    return () => {
      if (initTimer) window.clearInterval(initTimer);
      destroy();
    };
  }, []);

  return (
    <motion.section
      data-header-theme="light"
      className="footer-vanta"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden', background: UI_DARK }}
    >
      <div ref={footerVantaElRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div className="footer-cta">
          <h2 className="section-title" style={{ fontWeight: 400 }}>Let&apos;s Work<br />Together</h2>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-xl)' }}>
          <div>
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)' }}>LINKS</p>
            <ul className="small-text">
              <li><a href="/contact" onClick={(ev) => { ev.preventDefault(); onContactClick(); }} style={{ wordBreak: 'break-all' }}>FORREST.TINDALL@GMAIL.COM</a></li>
              <li><a href="https://instagram.com/forrest.tindall/" target="_blank" rel="noreferrer">INSTAGRAM</a></li>
              <li><a href="https://www.linkedin.com/in/forrest-tindall/" target="_blank" rel="noreferrer">LINKEDIN</a></li>
            </ul>
          </div>
          <div>
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)' }}>SERVICES</p>
            <ul className="small-text">
              <li>DESIGN</li>
              <li>DEVELOPMENT</li>
              <li>PHOTOGRAPHY</li>
              <li>VISUAL SYSTEMS</li>
            </ul>
          </div>
        </div>

        <div className="newsletter-block">
          <div className="newsletter-inner">
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)' }}>NEWSLETTER</p>
            <form onSubmit={onSubmitNewsletter} className="newsletter-form">
              <input
                type="email"
                value={newsletterEmail}
                onChange={onNewsletterEmailChange}
                placeholder="Email"
                required
                className="newsletter-input"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="newsletter-button"
                style={{
                  cursor: newsletterStatus === 'loading' ? 'default' : 'pointer',
                  opacity: newsletterStatus === 'loading' ? 0.6 : 1,
                }}
              >
                {newsletterStatus === 'loading' ? '...' : 'Sign Up'}
              </button>
            </form>

            {newsletterStatus === 'success' && (
              <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85 }}>
                Submitted.
              </div>
            )}
            {newsletterStatus === 'error' && (
              <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85 }}>
                Error. Try again.
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-xxl)', borderTop: '1px solid rgba(17, 17, 17, 0.18)', paddingTop: 'var(--spacing-sm)' }} className="flex">
          <p className="small-text" style={{ flex: 1 }}>© 2026 FORREST TINDALL</p>
          <p className="small-text">DESIGNED & CODED IN BOISE, ID</p>
        </div>
      </div>
    </motion.section>
  );
};

const projects = [
  {
    title: "Ricochet",
    category: "UI/UX Design",
    image: "/images/ricochet mockup.png",
    description: "SaaS website design and prototyping at Superbase",
    year: "2026"
  },
  {
    title: "Amore",
    category: "UI/UX Design & Dev",
    image: "/images/amore mockup.png",
    description: "Restaurant website design in figma and dev in REACT",
    year: "2025"
  },
  {
    title: "Clearfeed",
    category: "UI/UX Design & Dev",
    image: "/images/clearfeed.png",
    description: "Desktop application design in figma and dev in ELECTRON",
    year: "2025"
  },
  {
    title: "Fastburger",
    category: "Brand & UI/UX Design",
    image: "/images/fastburger.png",
    description: "Restaurant website design in figma and dev in REACT",
    year: "2025"
  },
  {
    title: "Arrowleaf",
    category: "UI/UX Design & Dev",
    image: "/images/arrowleaf.png",
    description: "Website design in figma and dev in REACT",
    year: "2024"
  },

];

const graphicDesign = [
 {
    title: "Analogix Zine",
    category: "Brand Identity",
    image: "/images/gif.gif",
    description: "Logo Design, Animation Design",
    year: "2025"
  },
     {
    title: "Micron Technology",
    category: "Environmental Signage",
    image: "/images/MICRON.JPG",
    description: "Environmental signage",
    year: "2026"
  },
 
  {
    title: "Boise Analog Club",
    category: "Brand Identity",
    image: "/images/bac gen x soft club.png",
    description: "Social Media Promotional Asset Design",
    year: "2026"
  },
 
  {
    title: "Creationbase",
    category: "Asset Design",
    image: "/images/launch art.png",
    description: "Digital assets for launch campaign.",
    year: "2025"
  },

  

  {
    title: "Paradox Labs",
    category: "Brand Identity",
    image: "/images/paradoxlabscard.jpg",
    description: "Logo and Visual Identity System",
    year: "2025"
  },
  {
    title: "Moab Brewery",
    category: "Illustration",
    image: "/images/beer-3.jpg",
    description: "Label illustration and design",
    year: "2025"
  },
  {
    title: "Conway The Machine",
    category: "Album Art Design",
    image: "/images/conway the machine 1 mockup.png",
    description: "Concept album artwork design.",
    year: "2025"
  },
  {
    title: "Boise Analog Club",
    category: "Brand Identity",
    image: "/images/bac.png",
    description: "Promotional Poster Design",
    year: "2025"
  }
];


const testimonials = [
  {
    name: "Lori Tindall",
    image: "/images/lori.jpg",
    stars: "★★★★★",
    headline: "FIVE STARS!!!",
    text: "I put off rebranding my business and building out a new website because I just didn't have the time or inclination to do it all myself. Working with Forrest was easy and fun because he was able to draw information out of me that helped make the design and layout reflect my values. He also built elements into my website that gets it ranked higher in search engines and it gets noticed."
  },
  {
    name: "Jackie Beauchaine",
    image: "/images/jackie.jpg",
    stars: "★★★★★",
    headline: "I couldn't be happier!",
    text: "Forrest did a fantastic job on my website. It's now ranking higher on Google and bringing in more business. He gave my site the professional look I always wanted!"
  },
  {
    name: "Douglas Herlocker",
    image: "/images/douglas.webp",
    stars: "★★★★★",
    headline: "Very pleased with the results!",
    text: "His quality and attention to detail is among the best. He built a website for my business partner that was clean, professional, and exceeded expectations."
  }
];

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-md)',
        cursor: 'zoom-out'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={onClose}
        style={{
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'zoom-out',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: 0,
            background: 'none',
            border: 'none',
            color: UI_LIGHT,
            fontSize: 'var(--fs-lg)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase'
          }}
        >
          [CLOSE]
        </button>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={project.image} 
            alt={project.title}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80vh', 
              objectFit: 'contain',
              display: 'block'
            }} 
          />
        </div>
        <div style={{ 
          marginTop: 'var(--spacing-md)', 
          color: UI_LIGHT, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 className="section-title" style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--spacing-xs)', color: UI_LIGHT }}>{project.title}</h2>
            <p className="small-text" style={{ opacity: 0.8 }}>{project.description}</p>
          </div>
          <div className="small-text" style={{ textAlign: 'right' }}>
            <div>{project.category}</div>
            <div>{project.year}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [, setHeaderTheme] = useState(() => {
    if (typeof window === 'undefined' || !window.location) return 'light';
    const p = window.location.pathname;
    if (p === '/' || p === '/portraits' || p === '/street-photography') return 'dark';
    return 'light';
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    let lastWidth = window.innerWidth;
    const setStableVh = () => {
      document.documentElement.style.setProperty('--vh-stable', `${window.innerHeight}px`);
    };
    const onResize = () => {
      const w = window.innerWidth;
      if (w !== lastWidth) {
        lastWidth = w;
        setStableVh();
      }
    };
    setStableVh();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    if (!redirect) return;
    navigate(redirect, { replace: true });
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (location.pathname !== '/') {
      if (location.pathname === '/portraits' || location.pathname === '/street-photography') {
        setHeaderTheme('dark');
      } else {
        setHeaderTheme('light');
      }
      return;
    }

    const parseRgb = (value) => {
      const m =
        value &&
        value.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)/i);
      if (!m) return null;
      const r = Number(m[1]);
      const g = Number(m[2]);
      const b = Number(m[3]);
      const a = m[4] !== undefined ? Number(m[4]) : 1;
      if (![r, g, b, a].every((n) => Number.isFinite(n))) return null;
      return { r, g, b, a };
    };

    const isTransparent = (value) =>
      value === 'transparent' || value === 'rgba(0, 0, 0, 0)' || value === 'rgba(0,0,0,0)';

    const luminance = ({ r, g, b }) => {
      const toLinear = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      const R = toLinear(r);
      const G = toLinear(g);
      const B = toLinear(b);
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };

    const getThemeFromElement = (startEl) => {
      let el = startEl;
      while (el && el !== document.documentElement) {
        if (el.getAttribute) {
          const explicit = el.getAttribute('data-header-theme');
          if (explicit === 'dark' || explicit === 'light') return explicit;
        }
        if (el instanceof Element) {
          const bg = window.getComputedStyle(el).backgroundColor;
          if (bg && !isTransparent(bg)) {
            const rgb = parseRgb(bg);
            if (rgb && rgb.a > 0) return luminance(rgb) < 0.4 ? 'dark' : 'light';
          }
        }
        el = el.parentElement;
      }
      return 'light';
    };

    const sampleBelowHeader = () => {
      if ((window.scrollY || 0) < 8) {
        setHeaderTheme('dark');
        return;
      }
      const x = Math.floor(window.innerWidth / 2);
      const headerEl = document.querySelector('.site-header');
      let y = 2;
      if (headerEl) {
        const rect = headerEl.getBoundingClientRect();
        y = Math.max(2, Math.ceil(rect.bottom + 2));
      }
      const el = document.elementFromPoint(x, y);
      if (!el) return;
      setHeaderTheme(getThemeFromElement(el));
    };

    let raf = 0;
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        sampleBelowHeader();
      });
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    setHeaderTheme('dark');
    requestAnimationFrame(() => requestAnimationFrame(sampleBelowHeader));

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [location.pathname]);

  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const homeScrollYRef = useRef(0);
  const pendingHomeScrollRestoreRef = useRef(false);
  const openCaseStudy = (id) => {
    const y = window.scrollY || 0;
    homeScrollYRef.current = y;
    sessionStorage.setItem('homeScrollY', String(y));
    pendingHomeScrollRestoreRef.current = true;
    if (id === 'on') navigate('/open-netizen');
    else if (id === 'bac') navigate('/boise-analog-club');
    else if (id === 'ricochet') navigate('/ricochet');
    else if (id === 'micron') navigate('/work-sharp-drill-doctor');
    else if (id === 'playground') navigate('/playground');
    else if (id === 'portraits') navigate('/portraits');
    else if (id === 'street') navigate('/street-photography');
    else if (id === 'commercial') navigate('/commercial-photography');
    else if (id === 'blog') navigate('/blog');
  };

  const openContact = () => {
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      const y = window.scrollY || 0;
      homeScrollYRef.current = y;
      sessionStorage.setItem('homeScrollY', String(y));
      pendingHomeScrollRestoreRef.current = true;
    } else {
      pendingHomeScrollRestoreRef.current = false;
    }
    navigate('/contact');
  };

  const goToSection = (id) => {
    setMobileNavOpen(false);
    pendingHomeScrollRestoreRef.current = false;
    if (id === 'photo') {
      openCaseStudy('commercial');
      return;
    }
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/#${id}`);
    } else {
      window.location.hash = id;
    }
  };

  const restoreHomeScroll = () => {
    const stored = sessionStorage.getItem('homeScrollY');
    const y = stored ? Number(stored) : homeScrollYRef.current;
    window.scrollTo(0, Number.isFinite(y) ? y : 0);
  };

  useEffect(() => {
    if (location.pathname !== '/') return;
    const hash = (location.hash || '').replace('#', '');
    if (!hash) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/open-netizen') setActiveCaseStudy('on');
    else if (pathname === '/boise-analog-club') setActiveCaseStudy('bac');
    else if (pathname === '/ricochet') setActiveCaseStudy('ricochet');
    else if (pathname === '/work-sharp-drill-doctor') setActiveCaseStudy('micron');
    else if (pathname === '/playground') setActiveCaseStudy('playground');
    else if (pathname === '/portraits') setActiveCaseStudy('portraits');
    else if (pathname === '/street-photography') setActiveCaseStudy('street');
    else if (pathname === '/commercial-photography') setActiveCaseStudy('commercial');
    else if (pathname === '/blog' || pathname.startsWith('/blog/')) setActiveCaseStudy('blog');
    else if (pathname === '/contact') setActiveCaseStudy('contact');
    else setActiveCaseStudy(null);
  }, [location.pathname]);

  const headerColor = UI_LIGHT;
  const headerLogoSrc = '/images/logoblack.png';
  const mobileNavBg = 'rgba(150,150,150,0.32)';

  const goHome = () => {
    setMobileNavOpen(false);
    pendingHomeScrollRestoreRef.current = false;
    homeScrollYRef.current = 0;
    sessionStorage.removeItem('homeScrollY');
    setHeaderTheme('dark');
    if (location.pathname !== '/') navigate('/');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const submitNewsletter = async (e) => {
    e.preventDefault();
    if (newsletterStatus === 'loading') return;
    setNewsletterStatus('loading');
    try {
      const resp = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (!resp.ok) throw new Error('Subscribe failed');
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="app">
      <motion.header 
        className="site-header"
        data-mobile-nav-open={mobileNavOpen ? 'true' : 'false'}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ 
          color: headerColor
        }}
      >
        <nav className="site-nav" aria-label="Primary">
          <div className="site-nav__menu-button">
            <button
              type="button"
              className="site-nav__home-link"
              aria-label="Go to home"
              onClick={goHome}
            >
              <span className="site-nav__menu-logos" aria-hidden="true">
                <img src={headerLogoSrc} alt="" className="site-nav__menu-logo" />
                <img src={headerLogoSrc} alt="" className="site-nav__menu-logo" />
              </span>
            </button>
            <button
              type="button"
              className="site-nav__menu-toggle"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-panel"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              <span className="site-nav__menu-label">{mobileNavOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            id="mobile-nav-panel"
            key="mobile-nav"
            className="mobile-nav-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
            style={{ background: mobileNavBg, color: headerColor }}
          >
            <motion.div
              className="mobile-nav-panel__inner"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(ev) => ev.stopPropagation()}
            >
              <div className="mobile-nav-grid">
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('design')}>
                  Design
                </button>
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('dev')}>
                  Dev
                </button>
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('photo')}>
                  Photo
                </button>
                <button type="button" className="mobile-nav-link" onClick={openContact}>
                  Contact
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (!activeCaseStudy && pendingHomeScrollRestoreRef.current) {
            requestAnimationFrame(() => requestAnimationFrame(() => restoreHomeScroll()));
            pendingHomeScrollRestoreRef.current = false;
          }
        }}
      >
        {activeCaseStudy === 'blog' ? (
          <Blog key="blog" />
        ) : activeCaseStudy === 'contact' ? (
          <Contact key="contact" />
        ) : activeCaseStudy === 'bac' ? (
          <BoiseAnalogClubCaseStudy key="bac" />
        ) : activeCaseStudy === 'on' ? (
          <OpenNetizenCaseStudy key="on" />
        ) : activeCaseStudy === 'ricochet' ? (
          <RicochetProject key="ricochet" />
        ) : activeCaseStudy === 'micron' ? (
          <MicronProject key="micron" />
        ) : activeCaseStudy === 'playground' ? (
          <Playground key="playground" />
        ) : activeCaseStudy === 'portraits' ? (
          <Portraits key="portraits" />
        ) : activeCaseStudy === 'street' ? (
          <StreetPhotography key="street" />
        ) : activeCaseStudy === 'commercial' ? (
          <CommercialPhotography key="commercial" />
        ) : (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero */}
            <section data-header-theme="light" style={{ position: 'relative', overflow: 'hidden', background: UI_DARK, color: UI_LIGHT }}>
              <div style={{ minHeight: '58vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--spacing-md) var(--spacing-md) calc(var(--spacing-xl) * 1.5)', position: 'relative', zIndex: 1 }}>
                <h1 style={{ 
                  fontFamily: 'var(--font-display)', fontWeight: 400, 
                  fontSize: 'var(--fs-display)', 
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.04em',
                  marginBottom: 'var(--home-hero-h1-mb)',
                  maxWidth: '8ch'
                }}>
                  <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                    <DecryptText as="span" text="Visual" trigger="mount" delay={200} duration={900} />
                  </div>
                  <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
                    <DecryptText as="span" text="System" trigger="mount" delay={320} duration={900} />
                  </div>
                  <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
                    <DecryptText as="span" text="Design" trigger="mount" delay={440} duration={900} />
                  </div>
                </h1>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(220px, 1.15fr) minmax(240px, 1.7fr) minmax(160px, 0.9fr)',
                    alignItems: 'end',
                    gap: 'var(--spacing-lg)'
                  }}
                >
                  <div className="small-text" style={{ lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span>Forrest Tindall Studio</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#111111', display: 'inline-block', flex: '0 0 auto' }} />
                    <span>(Design Studio and Digital Partner)</span>
                  </div>
                  <div className="small-text" style={{ lineHeight: 1.2 }}>
                    <div>WE HELP YOU:</div>
                    <div>— Define your visual system</div>
                    <div>— Design your digital presence</div>
                    <div>— Deploy your brand online</div>
                  </div>
                  <div className="small-text" style={{ lineHeight: 1.2, justifySelf: 'end', textAlign: 'right' }}>
                    <div>currently:</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: HERO_AVAILABILITY.color, display: 'inline-block' }} />
                      <span>{HERO_AVAILABILITY.label}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex" style={{ justifyContent: 'space-between', padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-sm)', alignItems: 'baseline', background: 'transparent', position: 'relative', zIndex: 1, borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  PROJECTS
                </h2>
                <span className="small-text" style={{ color: UI_LIGHT }}>Index (01)</span>
              </div>
            </section>



            {/* Featured Case Studies */}
            <motion.section 
              data-header-theme="light"
              style={{ 
                padding: '0',
                borderBottom: 'none',
                minHeight: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="home-case-study-grid">
              <motion.div
                onClick={() => openCaseStudy('ricochet')}
                whileHover="hover"
                className="home-case-study-item"
                style={{ 
                  position: 'relative', 
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '100%', height: '100%' }}>
                  <img 
                    src="/images/ricochet mockup.png" 
                    alt="Ricochet Project" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '12px'
                    }} 
                  />
                </div>
                
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '0 var(--spacing-md) var(--spacing-md)',
                  pointerEvents: 'none'
                }}>
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ 
                        fontFamily: 'var(--font-display)', fontWeight: 400, 
                        fontSize: 'var(--fs-xl)', 
                        lineHeight: 1,
                        color: UI_DARK,
                        margin: '0 0 var(--spacing-sm) 0',
                        textTransform: 'uppercase'
                      }}>
                        Ricochet
                      </h3>
                      <p className="small-text" style={{ color: UI_DARK, maxWidth: '400px', margin: 0 }}>
                        Website redesign + rebrand post-acquisition—moving away from the startup SaaS look into a more contemporary aesthetic.
                      </p>
                    </div>

                    <motion.div 
                      variants={{
                        hover: { opacity: 0.7, scale: 1.08 }
                      }}
                      style={{
                        color: UI_DARK,
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <ArrowUpRight size={34} weight="thin" aria-hidden="true" focusable="false" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                onClick={() => openCaseStudy('on')}
                whileHover="hover"
                className="home-case-study-item"
                style={{ 
                  position: 'relative', 
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '100%', height: '100%' }}>
                  <img 
                    src="/images/OPEN NETIZEN CARD.jpg" 
                    alt="Open Netizen Case Study" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '12px'
                    }} 
                  />
                </div>
                
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '0 var(--spacing-md) var(--spacing-md)',
                  pointerEvents: 'none'
                }}>
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ 
                        fontFamily: 'var(--font-display)', fontWeight: 400, 
                        fontSize: 'var(--fs-xl)', 
                        lineHeight: 1,
                        color: UI_DARK,
                        margin: '0 0 var(--spacing-sm) 0',
                        textTransform: 'uppercase'
                      }}>
                        Open Netizen
                      </h3>
                      <p className="small-text" style={{ color: UI_DARK, maxWidth: '420px', margin: 0 }}>
                        Brand identity and visual system design for a decentralized digital network.
                      </p>
                    </div>

                    <motion.div 
                      variants={{
                        hover: { opacity: 0.7, scale: 1.08 }
                      }}
                      style={{
                        color: UI_DARK,
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <ArrowUpRight size={34} weight="thin" aria-hidden="true" focusable="false" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                onClick={() => openCaseStudy('micron')}
                whileHover="hover"
                className="home-case-study-item"
                style={{ 
                  position: 'relative', 
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '100%', height: '100%' }}>
                  <img 
                    src="/images/_DSC6969.jpg" 
                    alt="Work Sharp and Drill Doctor Popular Mechanics photoshoot" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '12px'
                    }} 
                  />
                </div>
                
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '0 var(--spacing-md) var(--spacing-md)',
                  pointerEvents: 'none'
                }}>
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ 
                        fontFamily: 'var(--font-display)', fontWeight: 400, 
                        fontSize: 'var(--fs-xl)', 
                        lineHeight: 1,
                        color: UI_DARK,
                        margin: '0 0 var(--spacing-sm) 0',
                        textTransform: 'uppercase'
                      }}>
                        Work Sharp + Drill Doctor
                      </h3>
                      <p className="small-text" style={{ color: UI_DARK, maxWidth: '420px', margin: 0 }}>
                        Combined product photoshoot for Popular Mechanics featuring Work Sharp and Drill Doctor.
                      </p>
                    </div>

                    <motion.div 
                      variants={{
                        hover: { opacity: 0.7, scale: 1.08 }
                      }}
                      style={{
                        color: UI_DARK,
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <ArrowUpRight size={34} weight="thin" aria-hidden="true" focusable="false" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                onClick={() => openCaseStudy('bac')}
                whileHover="hover"
                className="home-case-study-item"
                style={{ 
                  position: 'relative', 
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '100%', height: '100%' }}>
                  <img 
                    src="/images/analogmockup 2.png" 
                    alt="Boise Analog Club Case Study" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '12px'
                    }} 
                  />
                </div>
                
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '0 var(--spacing-md) var(--spacing-md)',
                  pointerEvents: 'none'
                }}>
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ 
                        fontFamily: 'var(--font-display)', fontWeight: 400, 
                        fontSize: 'var(--fs-xl)', 
                        lineHeight: 1,
                        color: UI_DARK,
                        margin: '0 0 var(--spacing-sm) 0',
                        textTransform: 'uppercase',
                        maxWidth: '11ch'
                      }}>
                        <span style={{ display: 'block' }}>Boise Analog</span>
                        <span style={{ display: 'block' }}>Club</span>
                      </h3>
                      <p className="small-text" style={{ color: UI_DARK, maxWidth: '420px', margin: 0 }}>
                        Flyer design and brand identity system for a community film photography club.
                      </p>
                    </div>

                    <motion.div 
                      variants={{
                        hover: { opacity: 0.7, scale: 1.08 }
                      }}
                      style={{
                        color: UI_DARK,
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <ArrowUpRight size={34} weight="thin" aria-hidden="true" focusable="false" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              </div>
            </motion.section>

            {/* Selected Clients & Testimonials */}
            <section style={{ 
              padding: '0',
              background: UI_DARK,
              color: UI_LIGHT,
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Selected Clients Marquee/Grid */}
              <div style={{ padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                    <DecryptText as="span" text="CLIENTS & PARTNERS" trigger="inView" duration={800} />
                  </h2>
                  <span className="small-text">Index (02)</span>
                </div>

                <div className="studio-client-grid">
                  {/* Micron */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-md)' }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                      <img src="/images/micron.png" alt="Micron" style={{ height: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-lg)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 400
                      }}>
                        Micron Technology
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A01
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Designed over 1000 ADA-compliant signs for the massive 2026 Boise expansion. Creating a cohesive wayfinding system that merges strict regulatory standards with architectural harmony.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                      [WAYFINDING] [ENVIRONMENTAL] [ADA]
                    </div>
                  </motion.div>
                  {/* Ramboll */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{ borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-md)' }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                      <img src="/images/ramboll.png" alt="Ramboll" style={{ height: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-lg)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 400
                      }}>
                        Ramboll
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A02
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Built a custom data migration system for Ramboll North America&apos;s Air Quality division and provide ongoing system administration for data migration servers. Delivering a robust full-stack solution to ensure data integrity and streamline complex environmental reporting workflows.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                      [FULL STACK] [SYSTEM ADMIN] [DATA MIGRATION]
                    </div>
                  </motion.div>

                  {/* Superbase */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    style={{ borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-md)' }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                      <img src="/images/superbase.jpg" alt="Superbase" style={{ height: '100%', filter: 'invert(1)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-lg)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 400
                      }}>
                        Superbase
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A03
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Collaborated on high-level UI/UX and design.  Building a scalable digital website and design systems with a leading design agency.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                      [UI/UX DESIGN] [DEVELOPMENT] [AGENCY PARTNER]
                    </div>
                  </motion.div>

                  {/* CMYK Graffix */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    style={{ borderTop: HOME_SECTION_DIVIDER, paddingTop: 'var(--spacing-md)' }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                      <img src="/images/cmyk.jpg" alt="CMYK Graffix" style={{ height: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-lg)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 400
                      }}>
                        CMYK Graffix
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A04
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Partner for large-format print and branding projects. Delivering print-ready assets and visual identities for a premier design and print agency.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                      [GRAPHIC DESIGN] [PRINT] [AGENCY PARTNER]
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Testimonials */}
              <div style={{ padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                    <DecryptText as="span" text="CLIENT FEEDBACK" trigger="inView" duration={800} />
                  </h2>
                  <span className="small-text">Index (03)</span>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: 'var(--spacing-lg)',
                  alignItems: 'start'
                }}>
                  {testimonials.map((testimonial, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        borderTop: HOME_SECTION_DIVIDER,
                        paddingTop: 'var(--spacing-md)'
                      }}
                    >
                      {/* Header: User Info + Index Number */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        {/* Left: Image + Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: `1px solid ${UI_LIGHT}`
                            }}>
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                            <div style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 'var(--fs-xs)',
                              textTransform: 'uppercase'
                            }}>
                              [{testimonial.name}]
                            </div>
                        </div>

                        {/* Right: Index Number */}
                        <div className="small-text" style={{ color: UI_LIGHT }}>
                          {`A${String(i + 5).padStart(2, '0')}`}
                        </div>
                      </div>

                      {/* Body Content */}
                      <div>
                        <h4 style={{ 
                            fontFamily: 'var(--font-display)', 
                            fontWeight: 400,
                            fontSize: 'var(--fs-lg)', 
                            textTransform: 'uppercase',
                            marginBottom: 'var(--spacing-sm)',
                            lineHeight: 1
                        }}>
                            {testimonial.headline}
                        </h4>
                        <p className="small-text" style={{ 
                            lineHeight: 1.6,
                            marginBottom: 'var(--spacing-md)',
                            textTransform: 'uppercase',
                            maxWidth: '90%'
                        }}>
                            “{testimonial.text}”
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section
              data-header-theme="light"
              style={{
                padding: 'var(--spacing-xxl) var(--spacing-md)',
                backgroundColor: UI_DARK,
                color: UI_LIGHT,
              }}
            >
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="SERVICES" trigger="inView" duration={800} />
                </h2>
                <span className="small-text" style={{ color: UI_LIGHT }}>Index (04)</span>
              </div>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--spacing-xl)',
                  alignItems: 'start',
                }}
              >
                <div style={{ maxWidth: '520px' }}>
                  <p
                    className="small-text"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: UI_LIGHT,
                      lineHeight: 1.6,
                      textTransform: 'uppercase',
                      maxWidth: '90%',
                    }}
                  >
                    Full-stack creative for brands and teams. I design visual systems, build fast websites, and create photography that supports the story.
                  </p>
                  <div className="small-text" style={{ marginTop: 'var(--spacing-md)', color: UI_LIGHT }}>
                    Available contract, project-based, or retainer.
                  </div>
                </div>
                <div>
                  <ul className="small-text" style={{ listStyle: 'none', display: 'grid', gap: 0, color: UI_LIGHT }}>
                    <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderTop: '1px solid #000000' }}>
                      <span>DESIGN</span>
                      <span style={{ color: UI_LIGHT }}>01</span>
                    </li>
                    <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderTop: '1px solid #000000' }}>
                      <span>DEVELOPMENT</span>
                      <span style={{ color: UI_LIGHT }}>02</span>
                    </li>
                    <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderTop: '1px solid #000000' }}>
                      <span>PHOTOGRAPHY</span>
                      <span style={{ color: UI_LIGHT }}>03</span>
                    </li>
                    <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderTop: '1px solid #000000' }}>
                      <span>VISUAL SYSTEMS</span>
                      <span style={{ color: UI_LIGHT }}>04</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="dev" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="UI/UX DESIGN + DEV" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (05)</span>
              </div>
              
              <div className="project-grid project-grid--tight">
                {projects.map((project, index) => (
                  <motion.article 
                    key={index} 
                    className="project-card"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onClick={() => setSelectedProject(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: UI_DARK }}>
                      <div style={{ 
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: UI_DARK
                      }}>
                        <img 
                          src={project.image} 
                          alt={project.title}
                          style={{ 
                            width: 'auto',
                            height: '100%',
                            maxWidth: 'none',
                            display: 'block',
                            transition: 'all 0.5s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                      <div className="flex" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', padding: '10px 12px', alignItems: 'baseline' }}>
                        <div>
                          <h3 className="small-text" style={{ fontWeight: 'bold' }}>{project.title}</h3>
                          <p className="small-text" style={{ opacity: 0.7 }}>{project.description}</p>
                        </div>
                        <div className="small-text" style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ whiteSpace: 'nowrap' }}>{project.category}</div>
                          <div>{project.year}</div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section id="design" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="GRAPHIC DESIGN" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (06)</span>
              </div>

              <div className="project-grid project-grid--tight" style={{ alignItems: 'start' }}>
                {graphicDesign.map((project, i) => (
                  <motion.article 
                    key={i} 
                    className="project-card"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onClick={() => setSelectedProject(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: UI_DARK }}>
                      <div style={{ 
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: UI_DARK
                      }}>
                        <img 
                            src={project.image} 
                            alt={project.title} 
                            style={{ 
                              width: 'auto',
                              height: '100%',
                              maxWidth: 'none',
                              display: 'block',
                              transition: 'all 0.5s ease'
                            }} 
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            loading="lazy" 
                          />
                      </div>
                      <div className="flex" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', padding: '10px 12px', alignItems: 'baseline' }}>
                        <div>
                          <h3 className="small-text" style={{ fontWeight: 'bold' }}>{project.title}</h3>
                          <p className="small-text" style={{ opacity: 0.7 }}>{project.description}</p>
                        </div>
                        <div className="small-text" style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ whiteSpace: 'nowrap' }}>{project.category}</div>
                          <div>{project.year}</div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section style={{ 
              padding: '0',
              background: UI_DARK,
              color: UI_LIGHT,
              minHeight: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="studio-split-layout">
                <div className="studio-practice-header">
                  <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', borderBottom: HOME_SECTION_DIVIDER, paddingBottom: 'var(--spacing-sm)' }}>
                    <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                      <DecryptText as="span" text="STUDIO PRACTICE" trigger="inView" duration={800} />
                    </h2>
                    <span className="small-text">Index (08)</span>
                  </div>
                </div>

                <div className="studio-portrait-wrapper studio-practice-image" style={{ padding: '10px', boxSizing: 'border-box' }}>
                  <img 
                    src="/images/me1.jpg" 
                    alt="Portrait" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'grayscale(100%) contrast(1.1)',
                      display: 'block',
                      borderRadius: '12px'
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 'calc(var(--spacing-md) + 10px)',
                    left: 'calc(var(--spacing-md) + 10px)',
                    background: UI_DARK,
                    color: UI_LIGHT,
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--fs-xs)',
                    textTransform: 'uppercase'
                  }}>
                    Figure 01. Portrait
                  </div>
                </div>

                <div className="studio-typography-column studio-practice-body">
                  <div>
                    <div className="small-text" style={{ maxWidth: '300px', marginTop: 'var(--spacing-lg)' }}>
                      Forrest Tindall is a Fullstack Creative from Boise, Idaho. His work spans photography, design, art, web development, sculpture, knife making, and illustration, blending technical precision with visual storytelling. He began making art early, first through drawing and writing, then discovering film photography at thirteen. In 2012, he began designing logos, websites, and he launched <em>Tindall Knives</em>, beginning an over decade-long career as a bladesmith. Around the same time, he started a parallel path in photography, focusing on outdoor and product photography for the knife and tool industry. His photography has been featured in multiple publications, including <em>Popular Mechanics Magazine</em>. Years spent shaping steel by hand in the mountains became a study in patience, discipline, and craftsmanship, qualities that continue to define his creative work today. Through photography, design, writing, illustration, and mixed media, Tindall explores identity, society, and the subtle contradictions of modern life, examining the space between what we call things and what they truly are. His work has appeared in exhibitions, global publications, and bespoke retailers, reflecting an ongoing effort to bridge the personal and the universal.
                    </div>

                    <div className="flex" style={{ justifyContent: 'space-between', marginTop: 'var(--spacing-xl)', alignItems: 'baseline', borderBottom: HOME_SECTION_DIVIDER, paddingBottom: 'var(--spacing-sm)' }}>
                      <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                        <DecryptText as="span" text="PASSION PROJECTS" trigger="inView" duration={800} />
                      </h2>
                      <span className="small-text">Index (07.1)</span>
                    </div>

                    <div className="passion-projects-block">
                      <div className="passion-projects-grid">
                        <div className="passion-projects-item passion-projects-item--left">
                          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                            <div className="small-text">PORTRAITS</div>
                            <motion.button
                              onClick={() => openCaseStudy('portraits')}
                              whileHover={{ opacity: 0.7 }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--fs-xs)',
                                textTransform: 'uppercase',
                                color: UI_LIGHT,
                              }}
                            >
                              [VIEW]
                              <ArrowUpRight size={20} weight="thin" aria-hidden="true" focusable="false" />
                            </motion.button>
                          </div>
                          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85 }}>
                            Portrait photography studies in light—texture, gesture, and presence.
                          </div>
                        </div>

                        <div className="passion-projects-item passion-projects-item--right">
                          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                            <div className="small-text">STREET PHOTOGRAPHY</div>
                            <motion.button
                              onClick={() => openCaseStudy('street')}
                              whileHover={{ opacity: 0.7 }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--fs-xs)',
                                textTransform: 'uppercase',
                                color: UI_LIGHT,
                              }}
                            >
                              [VIEW]
                              <ArrowUpRight size={20} weight="thin" aria-hidden="true" focusable="false" />
                            </motion.button>
                          </div>
                          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85 }}>
                            Mostly shot on film in black and white—protest, movement, and chance.
                          </div>
                        </div>

                        <div className="passion-projects-item passion-projects-item--full">
                          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                            <div className="small-text">PLAYGROUND</div>
                            <motion.button
                              onClick={() => openCaseStudy('playground')}
                              whileHover={{ opacity: 0.7 }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--fs-xs)',
                                textTransform: 'uppercase',
                                color: UI_LIGHT,
                              }}
                            >
                              [VIEW]
                              <ArrowUpRight size={20} weight="thin" aria-hidden="true" focusable="false" />
                            </motion.button>
                          </div>
                          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85 }}>
                            Experiments in design, art, development, and image-making.
                          </div>
                        </div>

                        <div className="passion-projects-item passion-projects-item--full">
                          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                            <div className="small-text">COMMERCIAL PHOTOGRAPHY</div>
                            <motion.button
                              onClick={() => openCaseStudy('commercial')}
                              whileHover={{ opacity: 0.7 }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--fs-xs)',
                                textTransform: 'uppercase',
                                color: UI_LIGHT,
                              }}
                            >
                              [VIEW]
                              <ArrowUpRight size={20} weight="thin" aria-hidden="true" focusable="false" />
                            </motion.button>
                          </div>
                          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85 }}>
                            Commercial image work focused on products, environment, and brand storytelling.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </motion.div>
        )}
      </AnimatePresence>
      <SiteFooter
        newsletterEmail={newsletterEmail}
        newsletterStatus={newsletterStatus}
        onNewsletterEmailChange={(ev) => setNewsletterEmail(ev.target.value)}
        onSubmitNewsletter={submitNewsletter}
        onContactClick={openContact}
      />
    </div>
  );
}

export default App;
