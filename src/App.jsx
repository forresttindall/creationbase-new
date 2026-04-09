import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router-dom';
import BoiseAnalogClubCaseStudy from './components/BoiseAnalogClubCaseStudy';
import OpenNetizenProject from './components/OpenNetizenProject';
import Portraits from './components/Portraits';
import StreetPhotography from './components/StreetPhotography';
import CommercialPhotography from './components/CommercialPhotography';
import Blog from './components/Blog';
import Contact from './components/Contact';
import RicochetProject from './components/RicochetProject';
import MicronProject from './components/MicronProject';
import Playground from './components/Playground';
import FastburgerProject from './components/FastburgerProject';
import DecryptText from './components/DecryptText';

const UI_LIGHT = '#111111';
const UI_DARK = '#FFFFFF';
const HOME_SECTION_DIVIDER = '1px solid #000000';
const HERO_AVAILABILITY = {
  label: 'Available',
  color: '#5FE37C',
};
const INDEX01_PROJECTS = [
  {
    id: 'fastburger',
    titleLines: ['Fastburger'],
    scope: 'Scope(Full Brand Identity System, Website)',
    primaryImage: '/images/fastburger box.webp',
    primaryAlt: 'Fastburger packaging mockup',
    secondaryImage: '/images/fastburger website mockup 1.webp',
    secondaryAlt: 'Fastburger website mockup',
    secondaryFallbackImage: '/images/fastburger box.webp',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
  {
    id: 'ricochet',
    titleLines: ['Ricochet'],
    scope: 'Scope(Brand, Website)',
    primaryImage: '/images/ricochet mockup.webp',
    primaryAlt: 'Ricochet project mockup',
    secondaryImage: '/images/Exportable tables.PNG',
    secondaryAlt: 'Ricochet exportable tables interface',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
  {
    id: 'on',
    titleLines: ['Open Netizen'],
    scope: 'Scope(Identity, Visual System)',
    primaryImage: '/images/OPEN NETIZEN CARD.jpg',
    primaryAlt: 'Open Netizen brand card',
    secondaryImage: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg',
    secondaryAlt: 'Open Netizen website mockup',
    sideOffset: 'clamp(3rem, 8vw, 6rem)',
  },
  {
    id: 'micron',
    titleLines: ['Work Sharp +', 'Drill Doctor'],
    scope: 'Scope(Photography, Campaign Assets)',
    primaryImage: '/images/_DSC6969.jpg',
    primaryAlt: 'Work Sharp and Drill Doctor hero photograph',
    secondaryImage: '/images/_DSC7142.jpg',
    secondaryAlt: 'Work Sharp and Drill Doctor supporting photograph',
    sideOffset: 'clamp(2.5rem, 6vw, 4.5rem)',
  },
];

const SiteFooter = ({ onContactClick, reserveRightRail = false }) => {
  const shuffledFooterImages = useMemo(() => {
    const arr = [...FOOTER_CAROUSEL_IMAGES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }, []);
  const footerImageMarqueeDuration = useMemo(() => {
    const seconds = Math.max(34, shuffledFooterImages.length * 2);
    return `${seconds}s`;
  }, [shuffledFooterImages.length]);
  return (
    <motion.section
      data-header-theme="light"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden', background: UI_DARK }}
    >
      <div className={`footer-shell${reserveRightRail ? ' footer-shell--tracker' : ''}`} style={{ padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-xxl)', minHeight: '80vh', position: 'relative', zIndex: 1 }}>
        <div className="footer-top">
          <div className="footer-cta">
            <h2 className="section-title" style={{ fontWeight: 400, marginBottom: 0, fontSize: 'clamp(22px, 9vw, 72px)' }}>Let&apos;s Work<br />Together</h2>
          </div>
          <div className="footer-links-column">
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)', fontWeight: 'var(--font-mono-weight-bold)' }}>LINKS</p>
            <ul className="small-text footer-links-list">
              <li><a href="/contact" onClick={(ev) => { ev.preventDefault(); onContactClick(); }}>CONTACT</a></li>
              <li><a href="https://instagram.com/forrest.tindall/" target="_blank" rel="noreferrer">INSTAGRAM</a></li>
              <li><a href="https://www.linkedin.com/in/forrest-tindall/" target="_blank" rel="noreferrer">LINKEDIN</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-marquee footer-marquee--text full-bleed">
          <div className="footer-marquee__track footer-marquee__track--reverse">
            {[...Array(20)].map((_, index) => (
              <span key={index} className="footer-marquee__text-item small-text">
                FORREST TINDALL STUDIO •
              </span>
            ))}
          </div>
        </div>

        <div className="footer-marquee footer-marquee--images full-bleed">
          <div className="footer-marquee__track" style={{ '--footer-marquee-duration': footerImageMarqueeDuration }}>
            {[...shuffledFooterImages, ...shuffledFooterImages].map((item, index) => (
              <div key={`${item.src}-${index}`} className="footer-carousel-card">
                <img src={item.src} alt={item.alt} className="footer-carousel-card__image" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '0', borderTop: HOME_SECTION_DIVIDER, paddingTop: '10px' }} className="flex">
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
    image: "/images/ricochet mockup.webp",
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
    title: "Fastburger",
    category: "Brand & UI/UX Design",
    image: "/images/fastburger website mockup 1.webp",
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
    title: "Arrowleaf",
    category: "UI/UX Design & Dev",
    image: "/images/arrowleaf2.webp",
    description: "Website design in figma and dev in REACT",
    year: "2024"
  },

];

const graphicDesign = [

    {
    title: "Paradox Labs",
    category: "Brand Identity",
    image: "/images/paradoxlabscard.jpg",
    description: "Logo and Visual Identity System",
    year: "2025"
  },

 {
    title: "Alias Zine",
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
    image: "/images/bac soft club mockup.webp",
    description: "Social Media Promotional Asset Design",
    year: "2026"
  },
 
  /*
  {
    title: "Creationbase",
    category: "Asset Design",
    image: "/images/launch art.png",
    description: "Digital assets for launch campaign.",
    year: "2025"
  },
  */

  


  {
    title: "Moab Brewery",
    category: "Illustration",
    image: "/images/beer-3.webp",
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
    image: "/images/bac community mockup.webp",
    description: "Promotional Poster Design",
    year: "2025"
  }
];

const COMMERCIAL_PHOTOGRAPHY_IMAGES = [
  '/images/_DSC4685-2.webp',
  '/images/_DSC4390.webp',
  '/images/_DSC2842.webp',
  
  '/images/_DSC3168.webp',
  
  '/images/_DSC1954-2.webp',
  '/images/_DSC6942.webp',
  

  '/images/_DSC4899.webp',
 
  '/images/_DSC2016.webp',
  '/images/_DSC9182.webp',
];

const photography = COMMERCIAL_PHOTOGRAPHY_IMAGES.map((image, idx) => ({
  title: `Commercial ${String(idx + 1).padStart(2, '0')}`,
  category: 'Commercial Photography',
  image,
  description: 'Commercial photography—product, environment, and brand storytelling.',
  year: '2026',
}));


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

const FOOTER_CAROUSEL_IMAGES = [
  { src: '/images/ricochet mockup.webp', alt: 'Ricochet footer carousel image' },
  { src: '/images/amore mockup.png', alt: 'Amore footer carousel image' },
  { src: '/images/clearfeed.png', alt: 'Clearfeed footer carousel image' },
  { src: '/images/gif.gif', alt: 'Graphic design footer carousel image' },
  { src: '/images/bac gen x soft club.png', alt: 'Boise Analog footer carousel image' },
  { src: '/images/device-1.PNG', alt: 'Playground footer carousel image' },
  { src: '/images/pilot micro new.png', alt: 'Art print footer carousel image' },
  { src: '/images/OPEN NETIZEN CARD.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/OPEN NETIZEN.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/FASTBURGER MENU MOCKUP.webp', alt: 'Fastburger menu mockup footer carousel image' },
  { src: '/images/FASTBURGER MENU.webp', alt: 'Fastburger printed menu footer carousel image' },
  { src: '/images/fastburger box.webp', alt: 'Fastburger box footer carousel image' },
  { src: '/images/fastburger a board.webp', alt: 'Fastburger signage footer carousel image' },
  { src: '/images/fastburger typemark.webp', alt: 'Fastburger typemark footer carousel image' },
  { src: '/images/fastburger website mockup 1.webp', alt: 'Fastburger website mockup footer carousel image' },
  { src: '/images/fastburger website mockup 2.webp', alt: 'Fastburger website mockup footer carousel image' },
  ...COMMERCIAL_PHOTOGRAPHY_IMAGES.map((src) => ({ src, alt: 'Commercial photography footer carousel image' })),
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
        backgroundColor: 'rgba(191, 191, 191, 0.45)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
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
        <div
          style={{
            position: 'absolute',
            top: '-46px',
            right: 0,
            padding: 4,
            background: 'rgba(191, 191, 191, 0.45)',
            borderRadius: 12,
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
          }}
        >
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: 'none',
              borderRadius: 10,
              padding: '10px 16px',
              color: UI_LIGHT,
              fontSize: 'calc(var(--fs-xs) + 3px)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'var(--font-mono-weight)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            Close
          </button>
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '100%' }}>
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
            <div className="home-project-layer__meta" style={{ marginTop: 'var(--spacing-md)', color: UI_LIGHT, padding: 0 }}>
              <div className="home-project-layer__copy">
                <h3
                  className="home-project-layer__inline-title"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'var(--font-mono-weight-bold)',
                    fontSize: 'var(--fs-sm)',
                    lineHeight: 1.2,
                    color: UI_LIGHT,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {`${project.title} •`}
                </h3>
                <div className="home-project-layer__details">
                  <span>{`SCOPE( ${project.category} )`}</span>
                </div>
              </div>
            </div>
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
  const [navLogoSpinTick, setNavLogoSpinTick] = useState(0);
  
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
    if (location.pathname !== '/') return;
    const adjustRowHeights = () => {
      const isMobile = window.matchMedia('(max-width: 700px)').matches;
      const rows = Array.from(document.querySelectorAll('.uiux-row'));
      const maxRowH = Math.round(Math.max(260, Math.min(520, window.innerHeight * 0.6)));
      const maxSingleRowH = Math.round(Math.max(340, Math.min(680, window.innerHeight * 0.72)));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.uiux-frame'));
        if (frames.length === 0) return;
        if (isMobile) {
          frames.forEach((frame) => {
            frame.style.height = '';
          });
          return;
        }
        const imgs = Array.from(row.querySelectorAll('.uiux-frame img'));
        if (frames.length !== imgs.length) return;
        const isSingle = row.classList.contains('uiux-row--single');
        const heights = imgs.map((img, idx) => {
          const frame = frames[idx];
          const w = frame.getBoundingClientRect().width;
          const naturalW = img.naturalWidth || w;
          const naturalH = img.naturalHeight || w;
          const ratio = naturalH / naturalW;
          return Math.max(0, Math.round(w * ratio));
        });
        const minH = Math.min(...heights);
        const targetH = Math.min(minH, isSingle ? maxSingleRowH : maxRowH);
        frames.forEach((frame) => {
          frame.style.height = `${targetH}px`;
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
  }, [location.pathname]);

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
    if (id === 'fastburger') navigate('/fastburger');
    else if (id === 'on') navigate('/open-netizen');
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
    if (pathname === '/fastburger') setActiveCaseStudy('fastburger');
    else if (pathname === '/open-netizen') setActiveCaseStudy('on');
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
  const headerLogoSrc = '/images/new logo.png';
  const mobileNavBg = 'rgba(150,150,150,0.32)';
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothScrollVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const navScrollSpin = useMotionValue(0);
  const navScrollSpinReverse = useTransform(navScrollSpin, (v) => -v);
  const navScrollRotate = navScrollSpin;
  const navScrollRotateReverse = navScrollSpinReverse;
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 30, stiffness: 500, mass: 0.2 });
  const cursorYSpring = useSpring(cursorY, { damping: 30, stiffness: 500, mass: 0.2 });

  useEffect(() => {
    if (reduceMotion) {
      setCursorEnabled(false);
      return;
    }
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const hoverQuery = window.matchMedia('(hover: hover)');
    const update = () => setCursorEnabled(pointerQuery.matches && hoverQuery.matches);
    update();
    if (pointerQuery.addEventListener) {
      pointerQuery.addEventListener('change', update);
      hoverQuery.addEventListener('change', update);
      return () => {
        pointerQuery.removeEventListener('change', update);
        hoverQuery.removeEventListener('change', update);
      };
    }
    pointerQuery.addListener(update);
    hoverQuery.addListener(update);
    return () => {
      pointerQuery.removeListener(update);
      hoverQuery.removeListener(update);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!cursorEnabled) return;
    const onMove = (ev) => {
      cursorX.set(ev.clientX);
      cursorY.set(ev.clientY);
    };
    const onLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [cursorEnabled, cursorX, cursorY]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const v = smoothScrollVelocity.get();
    const clamped = Math.max(-4000, Math.min(4000, v));
    navScrollSpin.set(navScrollSpin.get() + clamped * 0.05 * (delta / 1000));
  });

  const goHome = () => {
    setNavLogoSpinTick((value) => value + 1);
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

  const toggleMobileNav = () => {
    setNavLogoSpinTick((value) => value + 1);
    setMobileNavOpen((value) => !value);
  };

  return (
    <div className="app">
      {cursorEnabled && (
        <motion.div
          aria-hidden="true"
          className="cursor-follower"
          style={{ x: cursorXSpring, y: cursorYSpring }}
        />
      )}
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
                <motion.span style={{ display: 'inline-flex', rotate: navScrollRotate }}>
                  <motion.img
                    src={headerLogoSrc}
                    alt=""
                    className="site-nav__menu-logo"
                    animate={{ rotate: navLogoSpinTick * 360 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.span>
                <motion.span style={{ display: 'inline-flex', rotate: navScrollRotateReverse }}>
                  <motion.img
                    src={headerLogoSrc}
                    alt=""
                    className="site-nav__menu-logo"
                    animate={{ rotate: navLogoSpinTick * -360 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.span>
              </span>
            </button>
            <button
              type="button"
              className="site-nav__menu-toggle"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-panel"
              onClick={toggleMobileNav}
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
          <Contact
            key="contact"
            newsletterEmail={newsletterEmail}
            newsletterStatus={newsletterStatus}
            onNewsletterEmailChange={(ev) => setNewsletterEmail(ev.target.value)}
            onSubmitNewsletter={submitNewsletter}
          />
        ) : activeCaseStudy === 'fastburger' ? (
          <FastburgerProject key="fastburger" />
        ) : activeCaseStudy === 'bac' ? (
          <BoiseAnalogClubCaseStudy key="bac" />
        ) : activeCaseStudy === 'on' ? (
          <OpenNetizenProject key="on" />
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
            <section data-header-theme="light" style={{ position: 'relative', overflow: 'hidden', background: UI_DARK, color: UI_LIGHT, borderBottom: HOME_SECTION_DIVIDER }}>
              <div style={{ minHeight: 'var(--home-hero-min-h)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)', position: 'relative', zIndex: 1 }}>
                <h1 className="home-hero__title" style={{ 
                  fontFamily: 'var(--font-display)', fontWeight: 'var(--font-display-weight)', 
                  fontSynthesis: 'weight',
                  marginBottom: 'auto'
                }}>
                  <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                    <DecryptText as="span" text="Visual System" trigger="mount" delay={200} duration={900} />
                  </div>
                  <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
                    <DecryptText as="span" text="Design + Dev" trigger="mount" delay={440} duration={900} />
                  </div>
                </h1>
                <motion.div 
                  className="home-hero__meta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(220px, 1.15fr) minmax(240px, 1.7fr) minmax(160px, 0.9fr)',
                    alignItems: 'start',
                    gap: 'var(--spacing-lg)'
                  }}
                >
                  <div className="small-text home-hero__identity" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
                    <div className="home-hero__identity-desktop" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Forrest Tindall Studio</span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#111111', display: 'inline-block', flex: '0 0 auto' }} />
                      <span>(Design Studio and Digital Partner)</span>
                    </div>
                    <div className="home-hero__identity-mobile">
                      <div style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Forrest Tindall Studio •</div>
                      <div>(Design + Dev Studio and Digital Partner)</div>
                    </div>
                  </div>
                  <div className="small-text home-hero__services" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '12px', alignItems: 'start' }}>
                    <div>I HELP YOU:</div>
                    <div>
                      <div>— Define your visual system</div>
                      <div>— Design your digital presence</div>
                      <div>— Deploy your brand online</div>
                    </div>
                  </div>
                  <div className="small-text home-hero__availability" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2, justifySelf: 'end', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <span>currently:</span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: HERO_AVAILABILITY.color, display: 'inline-block' }} />
                      <span>{HERO_AVAILABILITY.label}</span>
                    </div>
                    <div>Boise + Remote</div>
                  </div>
                </motion.div>
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
              <div className="home-project-stack">
                {INDEX01_PROJECTS.map((project, index) => (
                  <article
                    key={project.id}
                    className="home-project-layer"
                    style={{ zIndex: index + 1 }}
                  >
                    <motion.div
                      onClick={() => openCaseStudy(project.id)}
                      className="home-project-layer__sticky"
                    >
                      <div className="home-project-layer__panel">
                        <motion.div className="home-project-layer__media" whileHover="hover">
                          <div className="home-project-layer__media-main">
                            <img
                              src={project.primaryImage}
                              alt={project.primaryAlt}
                              className="home-project-layer__image"
                            />
                          </div>
                          <div className="home-project-layer__media-side">
                            <img
                              src={project.secondaryImage}
                              alt={project.secondaryAlt}
                              className="home-project-layer__image"
                              onError={(ev) => {
                                ev.currentTarget.onerror = null;
                                ev.currentTarget.src = project.secondaryFallbackImage || project.primaryImage;
                              }}
                            />
                          </div>
                          <motion.div
                            className="home-project-layer__media-overlay"
                            variants={{
                              hover: { opacity: 1 },
                            }}
                          >
                            <div className="home-project-layer__view-chip">View</div>
                          </motion.div>
                        </motion.div>
                        <div className="home-project-layer__meta">
                          <div className="home-project-layer__copy">
                            <h3
                              className="home-project-layer__inline-title"
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 'var(--font-mono-weight-bold)',
                                fontSize: 'var(--fs-sm)',
                                lineHeight: 1.2,
                                color: UI_LIGHT,
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {`${project.titleLines.join(' ')} •`}
                            </h3>
                            <div className="home-project-layer__details small-text">
                              <span>{project.scope}</span>
                              <span>{`Project (${String(index + 1).padStart(2, '0')})`}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </article>
                ))}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-sm)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'var(--font-mono-weight-bold)',
                        letterSpacing: '0.02em'
                      }}>
                        Micron Technology •
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A01
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Designed over 1000 ADA-compliant signs for the massive 2026 Boise expansion. Creating a cohesive wayfinding system that merges strict regulatory standards with architectural harmony.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight)', fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-sm)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'var(--font-mono-weight-bold)',
                        letterSpacing: '0.02em'
                      }}>
                        Ramboll •
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A02
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Built a custom data migration system for Ramboll North America&apos;s Air Quality division and provide ongoing system administration for data migration servers. Delivering a robust full-stack solution to ensure data integrity and streamline complex environmental reporting workflows.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight)', fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-sm)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'var(--font-mono-weight-bold)',
                        letterSpacing: '0.02em'
                      }}>
                        Superbase •
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A03
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Collaborated on high-level UI/UX and design.  Building a scalable digital website and design systems with a leading design agency.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight)', fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ 
                        fontSize: 'var(--fs-sm)', 
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'var(--font-mono-weight-bold)',
                        letterSpacing: '0.02em'
                      }}>
                        CMYK Graffix •
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A04
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Partner for large-format print and branding projects. Delivering print-ready assets and visual identities for a premier design and print agency.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight)', fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
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
                              fontWeight: 'var(--font-mono-weight)',
                              fontSize: 'var(--fs-sm)',
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
                            fontFamily: 'var(--font-mono)', 
                            fontWeight: 'var(--font-mono-weight-bold)',
                            fontSize: 'var(--fs-sm)', 
                            textTransform: 'uppercase',
                            marginBottom: 'var(--spacing-sm)',
                            lineHeight: 1,
                            letterSpacing: '0.02em'
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
              
              <div className="uiux-rows">
                {projects.reduce((rows, project, idx) => {
                  const rowIndex = Math.floor(idx / 2);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(project);
                  return rows;
                }, []).map((row, rIdx) => {
                  const single = row.length === 1;
                  const rowClass = single ? 'uiux-row uiux-row--single' : (rIdx % 2 === 0 ? 'uiux-row uiux-row--left' : 'uiux-row uiux-row--right');
                  return (
                    <div key={`uiux-row-${rIdx}`} className={rowClass}>
                      {row.map((project) => (
                        <motion.div
                          key={project.title}
                          className="uiux-card"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="uiux-frame">
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              onError={(ev) => {
                                const card = ev.currentTarget.closest('.uiux-card');
                                if (card) card.style.display = 'none';
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="design" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="GRAPHIC DESIGN" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (06)</span>
              </div>

              <div className="uiux-rows">
                {graphicDesign.reduce((rows, project, idx) => {
                  const rowIndex = Math.floor(idx / 2);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(project);
                  return rows;
                }, []).map((row, rIdx) => {
                  const single = row.length === 1;
                  const rowClass = single ? 'uiux-row uiux-row--single' : (rIdx % 2 === 0 ? 'uiux-row uiux-row--left' : 'uiux-row uiux-row--right');
                  return (
                    <div key={`design-row-${rIdx}`} className={rowClass}>
                      {row.map((project) => (
                        <motion.div
                          key={project.title}
                          className="uiux-card"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="uiux-frame">
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              onError={(ev) => {
                                const card = ev.currentTarget.closest('.uiux-card');
                                if (card) card.style.display = 'none';
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="photo" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="PHOTOGRAPHY" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (07)</span>
              </div>

              <div className="uiux-rows">
                {photography.reduce((rows, project, idx) => {
                  const rowIndex = Math.floor(idx / 2);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(project);
                  return rows;
                }, []).map((row, rIdx) => {
                  const single = row.length === 1;
                  const rowClass = single ? 'uiux-row uiux-row--single' : (rIdx % 2 === 0 ? 'uiux-row uiux-row--left' : 'uiux-row uiux-row--right');
                  return (
                    <div key={`photo-row-${rIdx}`} className={rowClass}>
                      {row.map((project) => (
                        <motion.div
                          key={project.image}
                          className="uiux-card"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="uiux-frame">
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              onError={(ev) => {
                                const card = ev.currentTarget.closest('.uiux-card');
                                if (card) card.style.display = 'none';
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
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

                <motion.div
                  className="studio-portrait-wrapper studio-practice-image"
                  style={{ padding: '10px', boxSizing: 'border-box' }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <img 
                    src="/images/me1.jpg" 
                    alt="Portrait" 
                    className="studio-portrait-single"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'grayscale(100%) contrast(1.1)',
                      borderRadius: '12px'
                    }} 
                  />
                  <div className="studio-portrait-mosaic">
                    <img src="/images/me1.jpg" alt="Portrait mosaic one" className="studio-portrait-mosaic__tile studio-portrait-mosaic__tile--wide studio-portrait-mosaic__tile--first" />
                    <img src="/images/mirror.jpg" alt="Portrait mosaic two" className="studio-portrait-mosaic__tile studio-portrait-mosaic__tile--wide studio-portrait-mosaic__tile--second" />
                    <img src="/images/me2.jpg" alt="Portrait mosaic two" className="studio-portrait-mosaic__tile" />
                    <img src="/images/mirror3.jpg" alt="Portrait mosaic four" className="studio-portrait-mosaic__tile studio-portrait-mosaic__tile--fourth" />
                  </div>
                  <div className="studio-portrait-label" style={{
                    position: 'absolute',
                    bottom: 'calc(var(--spacing-md) + 10px)',
                    left: 'calc(var(--spacing-md) + 10px)',
                    background: UI_DARK,
                    color: UI_LIGHT,
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'var(--font-mono-weight)',
                    fontSize: 'var(--fs-sm)',
                    textTransform: 'uppercase'
                  }}>
                    <span className="studio-portrait-label__single">Figure 01. Portrait</span>
                    <span className="studio-portrait-label__multi">Figure 01. Portraits</span>
                  </div>
                </motion.div>

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
                                fontWeight: 'var(--font-mono-weight)',
                                fontSize: 'var(--fs-sm)',
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
                                fontWeight: 'var(--font-mono-weight)',
                                fontSize: 'var(--fs-sm)',
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
                                fontWeight: 'var(--font-mono-weight)',
                                fontSize: 'var(--fs-sm)',
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
                              onClick={() => {
                                goToSection('photo');
                              }}
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
                                fontWeight: 'var(--font-mono-weight)',
                                fontSize: 'var(--fs-sm)',
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
      <SiteFooter onContactClick={openContact} reserveRightRail={activeCaseStudy === 'bac' || activeCaseStudy === 'on'} />
    </div>
  );
}

export default App;
