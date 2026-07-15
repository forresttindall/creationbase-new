import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router-dom';
import BoiseAnalogClubProject from './components/BoiseAnalogClubProject';
import KnwnLocalProject from './components/KnwnLocalProject';
import OpenNetizenProject from './components/OpenNetizenProject';
import Blog from './components/Blog';
import Contact from './components/Contact';
import RicochetProject from './components/RicochetProject';
import MicronProject from './components/MicronProject';
import Services from './components/Services';
import Playground from './components/Playground';
import WimProject from './components/WimProject';
import ContinuityProject from './components/ContinuityProject';
import CommercialPhotography from './components/CommercialPhotography';
import WorksharpProject from './components/WorksharpProject';
import DecryptText from './components/DecryptText';
import Tools from './components/Tools';
import Schema from './components/Schema';
import Merch from './components/Merch';
import MerchCheckout from './components/MerchCheckout';
import MerchCart from './components/MerchCart';
import { Analytics } from '@vercel/analytics/react';
import { blogPosts } from './blog/posts';

const UI_LIGHT = 'var(--color-text)';
const UI_DARK = 'var(--color-bg)';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';
const STRATEGY_CALL_URL = 'https://calendly.com/forrest-creationbase/30min';
const HERO_AVAILABILITY = {
  label: 'Available',
  color: '#5FE37C',
};
const GALLERY_IMAGES = [
  '/images/gallery/_DSC9182.webp',
  '/images/gallery/_DSC6969.webp',
  '/images/gallery/_DSC2741-2.webp',
  '/images/gallery/_DSC2447.webp',
  '/images/gallery/_DSC2444.webp',
  '/images/gallery/_DSC2583%202.webp',
  '/images/gallery/_DSC2680-2.webp',
  '/images/gallery/_DSC2350.webp',
  '/images/gallery/_DSC2439.webp',
  '/images/gallery/_DSC2406.webp',
  '/images/gallery/_DSC2349.webp',
  '/images/gallery/_DSC2702-2.webp',
  '/images/gallery/_DSC2560.webp',
  '/images/gallery/_DSC2193-2.webp',
  '/images/gallery/_DSC7999-4.webp',
  '/images/gallery/_DSC2744-2.webp',
  '/images/gallery/_DSC4899.webp',
  '/images/gallery/_DSC3168-2.webp',
  '/images/gallery/_DSC2733-2.webp',
  '/images/gallery/_DSC1613-3.webp',
  '/images/gallery/_DSC3991.webp',
  '/images/gallery/_DSC2842.webp',
  '/images/gallery/_DSC2674-2.webp',
  '/images/gallery/_DSC6942.webp',
  '/images/gallery/_DSC1954-2.webp',
  '/images/gallery/_DSC6814.webp',
  '/images/gallery/_DSC2823-2.webp',
  '/images/gallery/_DSC3525.webp',
  '/images/gallery/_DSC4685-2.webp',
  '/images/gallery/_DSC2016.webp',
];
const INDEX01_PROJECTS = [
  {
    id: 'bac',
    titleLines: ['Boise', 'Analog Club'],
    scope: 'Scope(Brand, Website, Campaign Assets)',
    primaryImage: '/images/new%20mockeup.webp',
    primaryAlt: 'Boise Analog Club campaign mockup',
    secondaryImage: '/images/analog%20new%20mobile.webp',
    secondaryAlt: 'Boise Analog Club mobile website mockup',
    secondaryFallbackImage: '/images/bac%20july%202026.webp',
    sideOffset: 'clamp(3rem, 8vw, 6rem)',
  },
  {
    id: 'knwnlocal',
    titleLines: ['KnwnLocal'],
    scope: 'Scope(UI/UX Design, Development)',
    primaryImage: '/images/knwnlocal%20mockup.webp',
    primaryAlt: 'KnwnLocal marketing site screenshot',
    secondaryImage: '/images/knwnlocal%202.webp',
    secondaryAlt: 'KnwnLocal CMS and editing workflow screenshot',
    secondaryFallbackImage: '/images/knwnlocal%20mockup.webp',
    sideOffset: 'clamp(3rem, 8vw, 6rem)',
  },
  {
    id: 'wim',
    titleLines: ['WIM'],
    scope: 'Scope(Identity, App UI/UX Design)',
    primaryImage: '/images/wim truck mockup.webp',
    primaryAlt: 'WIM truck mockup',
    secondaryImage: '/images/wim software.webp',
    secondaryAlt: 'WIM software mockup',
    secondaryFallbackImage: '/images/wim HAT MOCKUP.webp',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
  {
    id: 'continuity',
    titleLines: ['Continuity'],
    scope: 'Scope(Identity, App UI/UX Design)',
    primaryImage: '/images/continuity/screens.webp',
    primaryAlt: 'Continuity screens',
    secondaryImage: '/images/continuity/app.webp',
    secondaryAlt: 'Continuity app',
    secondaryFallbackImage: '/images/continuity/TSHIRT%20MOCKUP.webp',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
  {
    id: 'micron',
    titleLines: ['Micron'],
    scope: 'Scope(Environmental Signage, ADA Systems)',
    primaryImage: '/images/bathroom.webp',
    primaryAlt: 'Micron bathroom ADA signage',
    secondaryImage: '/images/lobby.webp',
    secondaryAlt: 'Micron lobby environmental signage',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
  {
    id: 'worksharp',
    titleLines: ['Worksharp + Drill Doctor'],
    scope: 'Scope(Photography, Commercial Editorial, Popular Mechanics)',
    primaryImage: '/images/worksharp/_DSC6969.jpg',
    primaryAlt: 'Worksharp + Drill Doctor commercial editorial photography',
    secondaryImage: '/images/worksharp/_DSC7142.jpg',
    secondaryAlt: 'Worksharp + Drill Doctor photography',
    secondaryFallbackImage: '/images/worksharp/_DSC6814.webp',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
];

const SiteFooter = ({
  isMobile,
  onBlogClick,
  onContactClick,
  reserveRightRail = false,
  newsletterName,
  newsletterEmail,
  newsletterStatus,
  onNewsletterNameChange,
  onNewsletterEmailChange,
  onSubmitNewsletter,
}) => {
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
            <div>
              <h2 className="section-title" style={{ fontWeight: 400, marginBottom: 0, fontSize: 'clamp(22px, 9vw, 72px)' }}>Let&apos;s Work<br />Together</h2>
              <div className="footer-cta__actions">
                <a href={STRATEGY_CALL_URL} target="_blank" rel="noreferrer" className="newsletter-button footer-cta__primary" style={{ textDecoration: 'none' }}>
                  Get Started
                  <ArrowUpRight size={14} weight="thin" />
                </a>
                <button type="button" className="newsletter-button newsletter-button--outline footer-cta__secondary" onClick={onContactClick}>
                  Contact
                </button>
              </div>
            </div>
          </div>
          <div className="footer-links-column">
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)', fontWeight: 'var(--font-mono-weight-bold)' }}>LINKS</p>
            <ul className="small-text footer-links-list">
              <li><a href="https://calendly.com/forrest-creationbase/30min" target="_blank" rel="noreferrer">GET STARTED</a></li>
              <li><a href="/contact" onClick={(ev) => { ev.preventDefault(); onContactClick(); }}>CONTACT</a></li>
              <li><a href="/blog" onClick={(ev) => { ev.preventDefault(); onBlogClick(); }}>BLOG</a></li>
              <li><a href="https://instagram.com/creationbase.io" target="_blank" rel="noreferrer">INSTAGRAM</a></li>
              <li><a href="https://www.linkedin.com/company/creationbaseio/" target="_blank" rel="noreferrer">LINKEDIN</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-marquee footer-marquee--text full-bleed">
          <div className="footer-marquee__track footer-marquee__track--reverse">
            {[...Array(20)].map((_, index) => (
              <span key={index} className="footer-marquee__text-item small-text">
                CREATIONBASE •
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

        <div className="newsletter-block footer-newsletter">
          <div className="footer-newsletter__grid">
            <div className="footer-newsletter__content">
              <h1 className="section-title" style={{ marginBottom: 14, fontWeight: 400, fontSize: 'clamp(22px, 4vw, 40px)' }}>
                get our free brand and website guide
              </h1>
              <form
                onSubmit={onSubmitNewsletter}
                className="newsletter-form"
                style={{
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(140px, 200px) 1fr auto'
                }}
              >
                <input
                  type="text"
                  value={newsletterName}
                  onChange={onNewsletterNameChange}
                  placeholder="Name"
                  required
                  className="newsletter-input"
                  aria-label="Name"
                />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={onNewsletterEmailChange}
                  placeholder="Email"
                  required
                  className="newsletter-input"
                  aria-label="Email"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="newsletter-button"
                  style={{
                    cursor: newsletterStatus === 'loading' ? 'default' : 'pointer',
                    opacity: newsletterStatus === 'loading' ? 0.6 : 1,
                    minWidth: 140,
                  }}
                >
                  {newsletterStatus === 'loading' ? '...' : 'Sign Up'}
                </button>
              </form>
              {newsletterStatus === 'success' && (
                <div className="small-text" style={{ marginTop: 10, opacity: 0.85, textTransform: 'none' }}>
                  Submitted.
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div className="small-text" style={{ marginTop: 10, opacity: 0.85, textTransform: 'none' }}>
                  Error. Try again.
                </div>
              )}
            </div>
            <div className="footer-newsletter__media" aria-hidden="true">
              <img
                src="/images/the%20guide%20mockup.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0', borderTop: HOME_SECTION_DIVIDER, paddingTop: '10px' }} className="flex">
          <p className="small-text" style={{ flex: 1 }}>© 2026 CREATIONBASE</p>
          <p className="small-text" style={{ textAlign: 'right' }}>
            DESIGNED & CODED IN BOISE, ID
          </p>
        </div>
      </div>
    </motion.section>
  );
};

const projects = [
  {
    title: "Boise Analog Club",
    category: "UI/UX + Product Design",
    image: "/images/new%20mockeup.webp",
    description: "Website design and campaign landing page direction",
    year: "2026"
  },
  {
    title: "KnwnLocal",
    category: "UI/UX + Product Design",
    image: "/images/knwnlocal%20mockup.webp",
    description: "Marketing site design and content workflow interface",
    year: "2026"
  },
  {
    title: "Wim Software",
    category: "UI/UX Design",
    image: "/images/wim software.webp",
    description: "website design and prototyping",
    year: "2026"
  },
  {
    title: "Amore",
    category: "UI/UX + Product Design",
    image: "/images/amore mockup.png",
    description: "Restaurant website design and prototyping in Figma",
    year: "2025"
  },
  {
    title: "Clearfeed",
    category: "UI/UX + Product Design",
    image: "/images/clearfeed.png",
    description: "Desktop application design and product workflows in Figma",
    year: "2025"
  },
  {
    title: "Arrowleaf",
    category: "UI/UX + Product Design",
    image: "/images/arrowleaf2.webp",
    description: "Website design system and page design in Figma",
    year: "2024"
  },
];

const graphicDesign = [

    {
    title: "WIM",
    category: "Brand Identity",
    image: "/images/wim safety shirt.webp",
    description: "Logo and Visual Identity System",
    year: "2026"
  },

 {
    title: "Alias Zine",
    category: "Brand Identity",
    image: "/images/gif.gif",
    description: "Logo Design, Animation Design",
    year: "2025"
  },
 
  {
    title: "Continuity",
    category: "Brand Identity",
    image: "/images/continuity/screens.webp",
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
    title: "WIM",
    category: "Design",
    image: "/images/wim truck mockup.webp",
    description: "Label illustration and design",
    year: "2025"
  },
  {
    title: "Continuity",
    category: "Brand Identity",
    image: "/images/continuity/TSHIRT MOCKUP.webp",
    description: "Promotional Poster Design",
    year: "2025"
  }
];

const photographyProjects = [
  {
    title: 'Worksharp + Drill Doctor',
    category: 'Popular Mechanics Magazine',
    image: '/images/worksharp/_DSC6969.jpg',
    description: 'Shoot for Popular Mechanics magazine',
    year: '2026'
  },
  {
    title: 'Worksharp + Drill Doctor',
    category: 'Popular Mechanics Magazine',
    image: '/images/worksharp/_DSC7142.jpg',
    description: 'Shoot for Popular Mechanics magazine',
    year: '2026'
  },
  {
    title: 'Editorial',
    category: 'Commercial / Editorial / Event Photography',
    image: '/images/event/7.webp',
    description: 'Editorial photography',
    year: '2026'
  },
  {
    title: 'Editorial',
    category: 'Commercial / Editorial / Event Photography',
    image: '/images/event/8.webp',
    description: 'Editorial photography',
    year: '2026'
  },
  {
    title: 'Editorial',
    category: 'Commercial / Editorial / Event Photography',
    image: '/images/_DSC9182.webp',
    description: 'Editorial photography',
    year: '2026'
  },
  {
    title: 'Lifestyle',
    category: 'Commercial / Editorial / Event Photography',
    image: '/images/_DSC3168-2.jpg',
    description: 'Lifestyle photography',
    year: '2026'
  }
];

const testimonials = [
  {
    name: "Emily Carter",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    stars: "★★★★★",
    headline: "FIVE STARS!!!",
    text: "I put off rebranding my business and building out a new website because I just didn't have the time or inclination to do it all myself. Working with Forrest was easy and fun because he was able to draw information out of me that helped make the design and layout reflect my values. He also built elements into my website that gets it ranked higher in search engines and it gets noticed."
  },
  {
    name: "Lauren Mitchell",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    stars: "★★★★★",
    headline: "I couldn't be happier!",
    text: "Forrest did a fantastic job on my website. It's now ranking higher on Google and bringing in more business. He gave my site the professional look I always wanted!"
  },
  {
    name: "Michael Bennett",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
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
  { src: '/images/bac gen x soft club.webp', alt: 'Boise Analog footer carousel image' },
  { src: '/images/device-1.PNG', alt: 'Playground footer carousel image' },
  { src: '/images/pilot micro new.png', alt: 'Art print footer carousel image' },
  { src: '/images/OPEN NETIZEN CARD.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/OPEN NETIZEN.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/continuity/screens.webp', alt: 'Continuity screens footer carousel image' },
  { src: '/images/continuity/app.webp', alt: 'Continuity app footer carousel image' },
  { src: '/images/continuity/continuity%20logo.webp', alt: 'Continuity logo footer carousel image' },
  { src: '/images/continuity/TSHIRT%20MOCKUP.webp', alt: 'Continuity t-shirt mockup footer carousel image' },
  { src: '/images/continuity/Cotton%20Totebag%20Mockup.webp', alt: 'Continuity totebag mockup footer carousel image' },
  { src: '/images/wim software.webp', alt: 'WIM software mockup footer carousel image' },
  { src: '/images/wim typemark.webp', alt: 'WIM typemark footer carousel image' },
  { src: '/images/wim logomark.webp', alt: 'WIM logomark footer carousel image' },
  { src: '/images/wim safety shirt.webp', alt: 'WIM safety shirt mockup footer carousel image' },
  { src: '/images/wim truck mockup.webp', alt: 'WIM truck mockup footer carousel image' },
  { src: '/images/wim HAT MOCKUP.webp', alt: 'WIM hat mockup footer carousel image' },
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
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [, setHeaderTheme] = useState(() => {
    if (typeof window === 'undefined' || !window.location) return 'light';
    const p = window.location.pathname;
    if (p === '/') return 'dark';
    return 'light';
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navLogoSpinTick, setNavLogoSpinTick] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 700px)');
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  
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
      setHeaderTheme('light');
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
    if (id === 'wim') navigate('/wim');
    else if (id === 'continuity') navigate('/continuity');
    else if (id === 'knwnlocal') navigate('/knwnlocal');
    else if (id === 'on') navigate('/open-netizen');
    else if (id === 'bac') navigate('/boise-analog-club');
    else if (id === 'ricochet') navigate('/ricochet');
    else if (id === 'micron') navigate('/micron');
    else if (id === 'playground') navigate('/playground');
    else if (id === 'photography') navigate('/photography');
    else if (id === 'gallery') navigate('/gallery');
    else if (id === 'worksharp') navigate('/worksharp');
    else if (id === 'blog') navigate('/blog');
  };

  const openBlog = () => {
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      const y = window.scrollY || 0;
      homeScrollYRef.current = y;
      sessionStorage.setItem('homeScrollY', String(y));
      pendingHomeScrollRestoreRef.current = true;
    } else {
      pendingHomeScrollRestoreRef.current = false;
    }
    navigate('/blog');
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

  const openStrategyCall = () => {
    setMobileNavOpen(false);
    const win = window.open(STRATEGY_CALL_URL, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  const openMaterialLab = () => {
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      const y = window.scrollY || 0;
      homeScrollYRef.current = y;
      sessionStorage.setItem('homeScrollY', String(y));
      pendingHomeScrollRestoreRef.current = true;
    } else {
      pendingHomeScrollRestoreRef.current = false;
    }
    navigate('/material-lab');
  };

  const openServices = () => {
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      const y = window.scrollY || 0;
      homeScrollYRef.current = y;
      sessionStorage.setItem('homeScrollY', String(y));
      pendingHomeScrollRestoreRef.current = true;
    } else {
      pendingHomeScrollRestoreRef.current = false;
    }
    navigate('/services');
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
    if (pathname === '/wim') setActiveCaseStudy('wim');
    else if (pathname === '/continuity') setActiveCaseStudy('continuity');
    else if (pathname === '/knwnlocal') setActiveCaseStudy('knwnlocal');
    else if (pathname === '/open-netizen') setActiveCaseStudy('on');
    else if (pathname === '/boise-analog-club') setActiveCaseStudy('bac');
    else if (pathname === '/ricochet') setActiveCaseStudy('ricochet');
    else if (pathname === '/micron') setActiveCaseStudy('micron');
    else if (pathname === '/playground') setActiveCaseStudy('playground');
    else if (pathname === '/photography') setActiveCaseStudy('photography');
    else if (pathname === '/gallery') setActiveCaseStudy('gallery');
    else if (pathname === '/worksharp') setActiveCaseStudy('worksharp');
    else if (pathname === '/services') setActiveCaseStudy('services');
    else if (pathname === '/merch' || pathname === '/merch/cart' || pathname === '/merch/checkout') {
      setActiveCaseStudy(null);
      navigate('/', { replace: true });
    }
    else if (pathname === '/blog' || pathname.startsWith('/blog/')) setActiveCaseStudy('blog');
    else if (pathname === '/contact') setActiveCaseStudy('contact');
    else if (pathname === '/material-lab' || pathname.startsWith('/material-lab/')) setActiveCaseStudy('material-lab');
    else if (pathname === '/tools' || pathname.startsWith('/tools/')) {
      setActiveCaseStudy('material-lab');
      navigate('/material-lab', { replace: true });
    }
    else setActiveCaseStudy(null);
  }, [location.pathname, navigate]);

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
        body: JSON.stringify({ email: newsletterEmail, name: newsletterName }),
      });
      if (!resp.ok) throw new Error('Subscribe failed');
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setNewsletterName('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  const toggleMobileNav = () => {
    setNavLogoSpinTick((value) => value + 1);
    setMobileNavOpen((value) => !value);
  };

  const blogPostData = useMemo(() => {
    if (activeCaseStudy !== 'blog') return null;
    const slug = location.pathname.startsWith('/blog/') ? decodeURIComponent(location.pathname.slice('/blog/'.length)) : null;
    if (!slug) return null;
    return blogPosts.find((p) => p.slug === slug && !p.hidden);
  }, [activeCaseStudy, location.pathname]);

  return (
    <div className="app">
      {blogPostData ? (
        <Schema 
          type="BlogPosting" 
          data={{
            title: blogPostData.title,
            date: blogPostData.date,
            slug: blogPostData.slug,
            image: blogPostData.image,
            description: Array.isArray(blogPostData.body) ? blogPostData.body[0].slice(0, 160) : ''
          }} 
        />
      ) : (
        <Schema type="LocalBusiness" />
      )}
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
                  Brand
                </button>
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('dev')}>
                  UI/UX
                </button>
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('photography')}>
                  Photography
                </button>
                <button type="button" className="mobile-nav-link" onClick={openServices}>
                  Services
                </button>
                <button type="button" className="mobile-nav-link" onClick={openMaterialLab}>
                  Material Lab
                </button>
                <button type="button" className="mobile-nav-link" onClick={openBlog}>
                  Blog
                </button>
                <button type="button" className="mobile-nav-link" onClick={openStrategyCall}>
                  Get Started
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
        ) : activeCaseStudy === 'merch-cart' ? (
          <MerchCart key="merch-cart" />
        ) : activeCaseStudy === 'merch-checkout' ? (
          <MerchCheckout key="merch-checkout" />
        ) : activeCaseStudy === 'merch' ? (
          <Merch key="merch" />
        ) : activeCaseStudy === 'services' ? (
          <Services key="services" />
        ) : activeCaseStudy === 'contact' ? (
          <Contact key="contact" />
        ) : activeCaseStudy === 'photography' ? (
          <CommercialPhotography key="photography" />
        ) : activeCaseStudy === 'gallery' ? (
          <CommercialPhotography key="gallery" images={GALLERY_IMAGES} masonryClassName="mosaic-masonry mosaic-masonry--spaced" />
        ) : activeCaseStudy === 'worksharp' ? (
          <WorksharpProject key="worksharp" />
        ) : activeCaseStudy === 'wim' ? (
          <WimProject key="wim" />
        ) : activeCaseStudy === 'continuity' ? (
          <ContinuityProject key="continuity" />
        ) : activeCaseStudy === 'knwnlocal' ? (
          <KnwnLocalProject key="knwnlocal" />
        ) : activeCaseStudy === 'bac' ? (
          <BoiseAnalogClubProject key="bac" />
        ) : activeCaseStudy === 'on' ? (
          <OpenNetizenProject key="on" />
        ) : activeCaseStudy === 'ricochet' ? (
          <RicochetProject key="ricochet" />
        ) : activeCaseStudy === 'micron' ? (
          <MicronProject key="micron" />
        ) : activeCaseStudy === 'playground' ? (
          <Playground key="playground" />
        ) : activeCaseStudy === 'material-lab' ? (
          <Tools key="material-lab" />
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
                  <div className="home-hero__title-line" style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                    <DecryptText as="span" text="Brand + Web + Photo" trigger="mount" delay={200} duration={900} />
                  </div>
                  <div className="home-hero__title-line" style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                    <DecryptText as="span" text="The Creation Studio For Bold Brands" trigger="mount" delay={260} duration={900} />
                  </div>
                </h1>
                <motion.div 
                  className="home-hero__meta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(220px, 1fr) minmax(160px, auto)',
                    alignItems: 'start',
                    gap: 'var(--spacing-lg)'
                  }}
                >
                  <div className="small-text home-hero__identity" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
                    <div className="home-hero__identity-desktop" style={{ display: 'grid', gap: '6px' }}>
                      <div style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Creationbase</div>
                      <div>YOUR CREATION STUDIO</div>
                    </div>
                    <div className="home-hero__identity-mobile">
                      <div style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Creationbase</div>
                      <div>YOUR CREATION STUDIO</div>
                    </div>
                  </div>
                  <div className="small-text home-hero__availability" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2, justifySelf: 'end', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <span>currently:</span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: HERO_AVAILABILITY.color, display: 'inline-block' }} />
                      <span>{HERO_AVAILABILITY.label}</span>
                    </div>
                    <div>Remote / Worldwide</div>
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
                            <div className="home-project-layer__media-overlay-panels" aria-hidden="true">
                              <div className="home-project-layer__media-overlay-panel home-project-layer__media-overlay-panel--main" />
                              <div className="home-project-layer__media-overlay-panel home-project-layer__media-overlay-panel--side" />
                            </div>
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

            <section
              data-header-theme="light"
              className="home-overview"
              style={{
                padding: 'calc(var(--spacing-xxl) * 2) var(--spacing-md) var(--spacing-xxl)',
                background: UI_DARK,
                color: UI_LIGHT,
                minHeight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  maxWidth: 'var(--content-max-w)',
                  margin: '0 auto',
                  borderTop: HOME_SECTION_DIVIDER,
                  borderBottom: HOME_SECTION_DIVIDER,
                  padding: 'clamp(28px, 5vw, 56px) 0',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)',
                  gap: 'var(--spacing-lg)',
                  alignItems: 'start',
                }}
              >
                <div
                  className="small-text"
                  style={{
                    opacity: 0.72,
                    letterSpacing: '0.08em',
                    paddingTop: '6px',
                  }}
                >
                  START / 02
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.4fr) minmax(220px, 0.6fr)',
                    gap: 'var(--spacing-lg)',
                    alignItems: 'end',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h2
                      className="section-title"
                      style={{
                        marginBottom: 0,
                        maxWidth: '12ch',
                        color: UI_LIGHT,
                        lineHeight: 0.88,
                        fontSize: 'clamp(38px, 7vw, 96px)',
                      }}
                    >
                      Start Something Sharp.
                    </h2>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gap: '16px',
                      alignContent: 'end',
                      minWidth: 0,
                    }}
                  >
                    <p
                      className="small-text"
                      style={{
                        margin: 0,
                        maxWidth: 320,
                        lineHeight: 1.45,
                        opacity: 0.88,
                        textTransform: 'none',
                      }}
                    >
                      Identity, web design, development, and photography for bold brands.
                    </p>
                    <div>
                      <button
                        type="button"
                        className="newsletter-button"
                        onClick={openStrategyCall}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        Get Started
                        <ArrowUpRight size={14} weight="thin" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Selected Clients & Testimonials */}
            <section style={{ 
              padding: '0',
              background: UI_DARK,
              color: UI_LIGHT,
              minHeight: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: 3,
              overflow: 'hidden'
            }}>
              {/* Selected Clients Marquee/Grid */}
              <div style={{ padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                    <DecryptText as="span" text="CLIENTS" trigger="inView" duration={800} />
                  </h2>
                  <span className="small-text">Index (03)</span>
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
                        <img
                          src="/images/micron.png"
                          alt="Micron"
                          className="studio-client-logo studio-client-logo--invert"
                          style={{
                            height: 26,
                            width: 'auto',
                            maxWidth: 220,
                            display: 'block',
                            opacity: 0.95,
                          }}
                        />
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
                        <img
                          src="/images/ramboll-transparent.png"
                          alt="Ramboll"
                          className="studio-client-logo"
                          style={{
                            height: 26,
                            width: 'auto',
                            maxWidth: 240,
                            display: 'block',
                            opacity: 0.98,
                          }}
                        />
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
                  {/* Worksharp */}
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
                        <img
                          src="/images/worksharp.webp"
                          alt="Worksharp"
                          className="studio-client-logo"
                          style={{
                            height: 54,
                            width: 'auto',
                            maxWidth: 240,
                            display: 'block',
                            opacity: 0.98,
                          }}
                        />
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A03
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Directed, produced, and photographed multiple campaigns for Worksharp and Drill Doctor, creating commercial editorial imagery for Popular Mechanics that balanced product clarity, brand consistency, and publication-ready execution.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight)', fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
                      [PHOTOGRAPHY] [CAMPAIGN] [POPULAR MECHANICS]
                    </div>
                  </motion.div>
                  {/* Granite Gear */}
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
                        <img
                          src="/images/granitegear.png"
                          alt="Granite Gear"
                          className="studio-client-logo"
                          style={{
                            height: 48,
                            width: 'auto',
                            maxWidth: 240,
                            display: 'block',
                            opacity: 0.98,
                          }}
                        />
                      </h4>
                      <div className="small-text" style={{ color: UI_LIGHT }}>
                        A04
                      </div>
                    </div>
                    <p className="small-text" style={{ maxWidth: '90%' }}>
                      Directed, produced, and photographed multiple campaigns for Granite Gear, creating imagery used for Backpacker Magazine and brand marketing with a focus on durable product storytelling and outdoor credibility.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight)', fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
                      [PHOTOGRAPHY] [CAMPAIGN] [BACKPACKER]
                    </div>
                  </motion.div>
                </div>
                <div style={{
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: 'var(--spacing-lg)',
                  alignItems: 'start',
                  marginTop: 'var(--spacing-xl)',
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

            <section id="dev" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="UI/UX + PRODUCT DESIGN" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (04)</span>
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

            {/* Get Started CTA */}
            <section
              data-header-theme="light"
              className="home-overview"
              style={{
                padding: 'var(--spacing-xxl) var(--spacing-md)',
                background: UI_DARK,
                color: UI_LIGHT,
                minHeight: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 18 }}
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  maxWidth: 'var(--content-max-w)',
                  margin: '0 auto',
                  borderTop: HOME_SECTION_DIVIDER,
                  borderBottom: HOME_SECTION_DIVIDER,
                  padding: 'clamp(28px, 5vw, 56px) 0',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(120px, 0.28fr) minmax(0, 1fr)',
                  gap: 'var(--spacing-lg)',
                  alignItems: 'start',
                }}
              >
                <div
                  className="small-text"
                  style={{
                    opacity: 0.72,
                    letterSpacing: '0.08em',
                    paddingTop: '6px',
                  }}
                >
                  START / 02
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.4fr) minmax(220px, 0.6fr)',
                    gap: 'var(--spacing-lg)',
                    alignItems: 'end',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h2
                      className="section-title"
                      style={{
                        marginBottom: 0,
                        maxWidth: '12ch',
                        color: UI_LIGHT,
                        lineHeight: 0.88,
                        fontSize: 'clamp(38px, 7vw, 96px)',
                      }}
                    >
                      Build Something People Actually Remember.
                    </h2>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gap: '16px',
                      alignContent: 'end',
                      minWidth: 0,
                    }}
                  >
                    <p
                      className="small-text"
                      style={{
                        margin: 0,
                        maxWidth: 320,
                        lineHeight: 1.45,
                        opacity: 0.88,
                        textTransform: 'none',
                      }}
                    >
                      Brand, site, and product direction with a clear point of view. Start with a call.
                    </p>
                    <div>
                      <button
                        type="button"
                        className="newsletter-button"
                        onClick={openStrategyCall}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        Get Started
                        <ArrowUpRight size={14} weight="thin" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <section id="design" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="GRAPHIC DESIGN" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (05)</span>
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

            <section id="photography" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="PHOTOGRAPHY" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (06)</span>
              </div>

              <div className="uiux-rows">
                {photographyProjects.reduce((rows, project, idx) => {
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
                          key={`${project.title}-${project.image}`}
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
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                <motion.button
                  type="button"
                  onClick={() => openCaseStudy('gallery')}
                  whileHover={{ opacity: 0.75 }}
                  className="newsletter-button"
                  style={{ minWidth: 180 }}
                >
                  View More
                  <ArrowUpRight size={14} weight="thin" />
                </motion.button>
              </div>
            </section>

            <section style={{ padding: '0', background: UI_DARK, color: UI_LIGHT, minHeight: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div className="studio-practice">
                <div className="studio-practice__header">
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', borderBottom: HOME_SECTION_DIVIDER, paddingBottom: 'var(--spacing-sm)' }}>
                    <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                      <DecryptText as="span" text="STUDIO PRACTICE" trigger="inView" duration={800} />
                    </h2>
                    <span className="small-text">Index (07)</span>
                  </div>
                </div>

                <div className="studio-practice__grid">
                  <div className="studio-practice__content">
                    <div className="studio-practice__top">
                      <div className="studio-practice__copy">
                        <div className="small-text" style={{ maxWidth: '520px' }}>
                          Creationbase is an independent full service creation studio based in Boise, Idaho. Founded in 2022, we partner with brands and teams to shape clear visual systems, build distinctive brand identities, design fast and durable websites, and create photography that fits the work.
                        </div>
                        <div className="small-text" style={{ maxWidth: '520px', marginTop: 'var(--spacing-md)' }}>
                          We deliver cohesive brand, web, and photo systems built for clarity, recognition, and real use. Our work is grounded in thoughtful process, strong design decisions, maintainable development, and visual direction that helps clients look sharper and communicate faster across every touchpoint.
                        </div>
                      </div>

                      <div className="studio-practice__team">
                        <div className="studio-practice__team-grid">
                          <div className="studio-practice__team-card">
                            <div className="studio-practice__team-image">
                              <img src="/images/me%20new.JPG" alt="Forrest Tindall" loading="lazy" decoding="async" />
                            </div>
                            <div className="studio-practice__team-meta">
                              <div className="studio-practice__team-name">Forrest Tindall</div>
                              <div className="studio-practice__team-role">Founder / Creative Director / Senior Designer / Fullstack Developer / Photographer</div>
                            </div>
                          </div>

                          <div className="studio-practice__team-card">
                            <div className="studio-practice__team-image">
                              <img src="/images/sarah%202.jpg" alt="Sarah Houser" loading="lazy" decoding="async" />
                            </div>
                            <div className="studio-practice__team-meta">
                              <div className="studio-practice__team-name">Sarah Houser</div>
                              <div className="studio-practice__team-role">CMO / Art Director / Photographer</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="studio-practice__passion">
                      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', borderBottom: HOME_SECTION_DIVIDER, paddingBottom: 'var(--spacing-sm)' }}>
                        <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                          <DecryptText as="span" text="PASSION PROJECTS" trigger="inView" duration={800} />
                        </h2>
                    <span className="small-text">Index (07.1)</span>
                      </div>

                      <div className="passion-projects-block">
                        <div className="passion-projects-grid">
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
        isMobile={isMobile}
        onBlogClick={openBlog}
        onContactClick={openContact}
        reserveRightRail={activeCaseStudy === 'on'}
        newsletterName={newsletterName}
        newsletterEmail={newsletterEmail}
        newsletterStatus={newsletterStatus}
        onNewsletterNameChange={(ev) => setNewsletterName(ev.target.value)}
        onNewsletterEmailChange={(ev) => setNewsletterEmail(ev.target.value)}
        onSubmitNewsletter={submitNewsletter}
      />
      <Analytics />
    </div>
  );
}

export default App;
