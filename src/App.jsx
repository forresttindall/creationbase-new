import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, animate, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from '@phosphor-icons/react';
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
import About from './components/About';
import { Analytics } from '@vercel/analytics/react';
import { blogPosts } from './blog/posts';

const UI_LIGHT = 'var(--color-text)';
const UI_DARK = 'var(--color-bg)';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';
const STRATEGY_CALL_URL = 'https://calendly.com/forrest-creationbase/30min';

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
  { project: 'OPNZ', i: '04', src: '/images/sign mockup open netizen.png', alt: 'Open Netizen signage mockup' },
  { project: 'RICH', i: '01', src: '/images/ricochet mockup.webp', alt: 'Ricochet UI mockup' },
  { project: 'RICH', i: '02', src: '/images/Hourly Sales.PNG', alt: 'Ricochet hourly sales dashboard' },
  { project: 'RICH', i: '03', src: '/images/Exportable tables.PNG', alt: 'Ricochet exportable tables UI' },
];

const HERO_AVAILABILITY = {
  label: 'Available',
  color: '#5FE37C',
};
const GALLERY_IMAGES = [
  '/images/gallery/_DSC6969.webp',
  '/images/gallery/_DSC3151.webp',
  '/images/gallery/_DSC1975-2.webp',
  '/images/gallery/_DSC6942.webp',
  '/images/gallery/_DSC3525.webp',
  '/images/gallery/sharpener.webp',
  '/images/gallery/_DSC3323.webp',
  '/images/gallery/_DSC2741-2.webp',
  '/images/gallery/_DSC3294.webp',
  '/images/gallery/_DSC2744-2.webp',
  '/images/gallery/_DSC7142.webp',
  '/images/gallery/_DSC9182.webp',
  '/images/gallery/pot.webp',
  '/images/gallery/_DSC2702-2.webp',
  '/images/gallery/2.webp',
  '/images/gallery/whisk.webp',
  '/images/gallery/_DSC2674-2.webp',
  '/images/gallery/_DSC3939.webp',
  '/images/gallery/_DSC2823-2.webp',
  '/images/gallery/_DSC3766.webp',
  '/images/gallery/_DSC3626.webp',
  '/images/gallery/_DSC4145.webp',
  '/images/gallery/_DSC7999-4.webp',
  '/images/gallery/_DSC3445.webp',
  '/images/gallery/3.webp',
  '/images/gallery/_DSC4333.webp',
  '/images/gallery/_DSC3343.webp',
  '/images/gallery/_DSC4274.webp',
  '/images/gallery/_DSC2193-2.webp',
  '/images/gallery/_DSC4685-2.webp',
  '/images/gallery/_DSC4390-2.webp',
  '/images/gallery/_DSC6814.webp',
  '/images/gallery/_DSC3168-2.webp',
  '/images/gallery/_DSC4899.webp',
  '/images/gallery/8.webp',
  '/images/gallery/_DSC2842.webp',
  '/images/gallery/_DSC5377.webp',
  '/images/gallery/jaredknife.webp',
  '/images/gallery/_DSC3812.webp',
  '/images/gallery/_DSC2016.webp',
  '/images/gallery/_DSC6836.webp',
  '/images/gallery/_DSC1954-2.webp',
  '/images/gallery/_DSC1613-3.webp',
  '/images/gallery/_DSC3991.webp',
  '/images/gallery/_DSC2733-2.webp',
  '/images/gallery/_DSC3579.webp',
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
    image: '/images/_DSC4684-2..webp',
    description: 'Editorial photography',
    year: '2026'
  },
  {
    title: 'Editorial',
    category: 'Commercial / Editorial / Event Photography',
    image: '/images/gallery/_DSC2016.webp',
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    stars: "★★★★★",
    headline: "FIVE STARS!!!",
    text: "I put off rebranding my business and building out a new website because I just didn't have the time or inclination to do it all myself. Working with Forrest was easy and fun because he was able to draw information out of me that helped make the design and layout reflect my values. He also built elements into my website that gets it ranked higher in search engines and it gets noticed."
  },
  {
    name: "Lauren Mitchell",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    stars: "★★★★★",
    headline: "I couldn't be happier!",
    text: "Forrest did a fantastic job on my website. It's now ranking higher on Google and bringing in more business. He gave my site the professional look I always wanted!"
  },
  {
    name: "Michael Bennett",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
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

const STATS_RAW = [
  { k: 'CLIENTS SHIPPED', v: '28', u: 'engagements', tone: 'primary' },
  { k: 'AVG. PIPELINE LIFT', v: '+147%', u: '12mo post-engage', tone: 'primary' },
  { k: 'SITE LIFT (MID-MKT)', v: '212%', u: 'sessions / conversion', tone: 'dim' },
  { k: 'BRAND RECALL', v: '3.1×', u: 'post-rebrand surveys', tone: 'dim' },
  { k: 'ON-TIME LAUNCH', v: '96%', u: 'scoped engagements', tone: 'dim' },
  { k: 'AVG. RETAINER LENGTH', v: '14 mo', u: 'multi-system work', tone: 'dim' },
];

const parseStatV = (v) => {
  const m = String(v).replace(/[^\d.]/g, '');
  const num = parseFloat(m);
  if (!Number.isFinite(num)) return 0;
  return num;
};

const AnimatedStatValue = ({ target, tone = 'dim', label, unit, index = 0, isMobile = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  const reduceMotion = useReducedMotion();
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 80, damping: 24, mass: 0.6 });
  const display = useTransform(sp, (n) => {
    if (target === '28') return String(Math.max(0, Math.round(n)));
    if (target === '96%') return `${Math.max(0, Math.round(n))}%`;
    if (target === '14 mo') return `${Math.max(0, Math.round(n))} mo`;
    if (target.startsWith('+')) {
      const pct = parseStatV(target);
      return `+${Math.max(0, Math.round(n * 10) / 10)}%`;
    }
    if (target.endsWith('×')) {
      const v = parseStatV(target);
      return `${(Math.max(0, Math.round(n * 10) / 10)).toFixed(1)}×`;
    }
    const pct = parseStatV(target);
    return `${Math.max(0, Math.round(n * 10) / 10)}%`;
  });
  const [text, setText] = useState('0');

  useEffect(() => {
    const unsub = display.on('change', (v) => setText(v));
    return () => unsub();
  }, [display]);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      mv.set(target === '28' || target === '96%' || target === '14 mo' ? parseStatV(target) : parseStatV(target));
      return;
    }
    const tgt = parseStatV(target);
    const controls = () => {
      mv.set(0);
      setTimeout(() => {
        mv.set(tgt);
      }, 120 + index * 80);
    };
    controls();
  }, [inView, target, reduceMotion, mv, index]);

  const len = String(label).length >= 5
    ? 'clamp(28px, 5vw, 64px)'
    : 'clamp(36px, 6vw, 84px)';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: 0.05 * index }}
      style={{
        gridColumn: isMobile ? 'auto' : (index <= 1 ? 'span 2' : 'span 2'),
        minHeight: isMobile ? 150 : 180,
        padding: 'clamp(18px, 3vw, 28px)',
        borderRight: HOME_SECTION_DIVIDER,
        borderBottom: HOME_SECTION_DIVIDER,
        background: (index <= 1) ? 'rgba(255,255,255,0.025)' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--spacing-md)',
      }}
    >
      <div className="small-text" style={{
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        opacity: 0.72,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}>
        <span>{label}</span>
        <span style={{ opacity: 0.5 }}>0{index + 1}</span>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <div className="section-title" style={{
          fontSize: len,
          lineHeight: 0.88,
          letterSpacing: '-0.04em',
          marginBottom: 0,
          color: tone === 'primary' ? UI_LIGHT : 'rgba(255,255,255,0.84)',
        }}>
          {text}
        </div>
        <div className="small-text" style={{
          opacity: 0.6,
          lineHeight: 1.4,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {unit}
        </div>
      </div>
    </motion.div>
  );
};

const DvcpProcessImagePanel = ({ isMobile = false }) => {
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
    const baseMs = 3500;
    const jitterMs = Math.floor(Math.random() * 1000);
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

const StrategyGrowthGraph = ({ isMobile = false }) => {
  const wrapRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(wrapRef, { once: true, margin: '-8% 0px -8% 0px' });

  const STROKE = 'var(--color-text)';
  const DIM = 'var(--color-text-dim)';
  const RULE = 'var(--color-border)';
  const ACCENT = 'var(--color-accent, var(--color-text))';

  const W = 640;
  const H = 360;
  const PL = 48;
  const PR = 20;
  const PT = 22;
  const PB = 48;
  const IW = W - PL - PR;
  const IH = H - PT - PB;

  const quarters = ['Q0', 'Q1', 'Q2', 'Q3', 'Q4'];
  const brands = [100, 122, 152, 190, 238];
  const webs = [100, 134, 176, 226, 298];
  const socials = [100, 148, 184, 240, 312];
  const baseline = [100, 106, 111, 116, 121];

  const toX = (i) => PL + (IW * i) / 4;
  const toY = (v) => PT + IH - (IH * (v - 90)) / 240;

  const linePath = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(2)},${toY(v).toFixed(2)}`).join(' ');

  const areaPath = (arr) => {
    const p = arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(2)},${toY(v).toFixed(2)}`).join(' ');
    return `${p} L${toX(4).toFixed(2)},${(PT + IH).toFixed(2)} L${toX(0).toFixed(2)},${(PT + IH).toFixed(2)} Z`;
  };

  const series = [
    { key: 'brand',  label: 'BRANDING', arr: brands,  color: STROKE, width: 2,   dash: '5 5', area: undefined, start: 0.00, lift: 138, dur: 4.6 },
    { key: 'web',    label: 'WEBSITE',  arr: webs,    color: STROKE, width: 3,   dash: undefined, area: 0.14,      start: 0.08, lift: 198, dur: 4.6 },
    { key: 'social', label: 'SOCIAL',   arr: socials, color: DIM,    width: 2.5, dash: undefined, area: 0.08,      start: 0.24, lift: 212, dur: 4.6 },
    { key: 'base',   label: 'BASELINE', arr: baseline, color: RULE, width: 1.5, dash: '2 4', area: undefined, start: 0.0, lift: null, dur: 3.2 },
  ];

  // Per-series ACTUAL visual polyline length (Euclidean sum of the 4 segments).
  // This ONE number drives BOTH the traveling end-dot's path sampler AND the
  // stroke dash-draw math — so the drawn stroke head and the dot always match.
  const VISUAL_TOTAL_LEN = series.map((s) => {
    let acc = 0;
    for (let i = 0; i < s.arr.length - 1; i++) {
      const x0 = toX(i), y0 = toY(s.arr[i]);
      const x1 = toX(i + 1), y1 = toY(s.arr[i + 1]);
      acc += Math.hypot(x1 - x0, y1 - y0);
    }
    return acc;
  });

  // Small safety buffer so dash-draw never leaves a 1px gap at the endpoint.
  const DRAW_TOTAL = (i) => VISUAL_TOTAL_LEN[i] + 2;

  // ——— Per-series progress driver (0 → 1), unified motion source of truth. ———
  // Every animation sample uses this progress number at runtime:
  //   • strokeDashoffset  -> draws [start, p*DRAW] exactly behind the head
  //   • end-dot sampler   -> {x, y} at polyline fraction p
  //   • lift counter      -> +0% -> +p*LIFT%
  //   • waypoint pop      -> threshold at waypoint fraction i/4
  //   • endpoint/callout  -> scale/reveal
  // => line head, dot, number, and dots all arrive simultaneously.
  const EASE_GROWTH = [0.22, 0.61, 0.36, 1];
  const progressRefs = series.map((s, idx) => {
    const mv = useMotionValue(0);
    const totalLen = VISUAL_TOTAL_LEN[idx];

    // Polyline sampler — returns {x, y} at fraction p ∈ [0,1] of actual length
    const segLens = s.arr.slice(0, -1).map((_, i) => {
      const x0 = toX(i), y0 = toY(s.arr[i]);
      const x1 = toX(i + 1), y1 = toY(s.arr[i + 1]);
      return Math.hypot(x1 - x0, y1 - y0);
    });
    const sample = (p) => {
      const clamped = Math.max(0, Math.min(1, p));
      const d = clamped * totalLen;
      let accD = 0;
      for (let i = 0; i < segLens.length; i++) {
        if (accD + segLens[i] >= d) {
          const segFrac = segLens[i] === 0 ? 0 : (d - accD) / segLens[i];
          const x0 = toX(i), y0 = toY(s.arr[i]);
          const x1 = toX(i + 1), y1 = toY(s.arr[i + 1]);
          return { x: x0 + (x1 - x0) * segFrac, y: y0 + (y1 - y0) * segFrac };
        }
        accD += segLens[i];
      }
      return { x: toX(s.arr.length - 1), y: toY(s.arr[s.arr.length - 1]) };
    };

    // — Derived transforms (hooks created in stable order, always same count) —
    const x = useTransform(mv, (p) => sample(p).x);
    const y = useTransform(mv, (p) => sample(p).y);

    // SVG attribute transform string for <g transform="translate(X,Y)">.
    // We can't pass a motion value directly to transform= prop because it
    // renders as [object Object], and CSS pixel translateX/translateY double
    // viewBox scaling. Solution: keep a reactive string via useState and
    // subscribe to x/y changes so we have a plain translate() string to
    // put on the SVG transform attribute (always in SVG user units).
    const [gTransformString, setG] = useState(() => {
      const s = sample(0);
      return `translate(${s.x.toFixed(3)}, ${s.y.toFixed(3)})`;
    });
    useEffect(() => {
      const update = () => {
        setG(`translate(${x.get().toFixed(3)}, ${y.get().toFixed(3)})`);
      };
      const uX = x.on('change', update);
      const uY = y.on('change', update);
      update();
      return () => { uX(); uY(); };
    }, [x, y]);

    // DRAW MATH: dashArray = [drawLen, gapLen]. We want drawn portion =
    // positions 0 → p*drawLen. With dashOffset = drawLen * (1-p), at p=0
    // the gap covers 0→drawLen (hidden), at p=1 dash covers 0→drawLen
    // (full). Using unified drawLen DRAW_TOTAL so drawn part stops exactly
    // where traveling dot is.
    const draw = DRAW_TOTAL(idx);
    const dashOffset = useTransform(mv, (p) => (reduceMotion ? 0 : draw * (1 - Math.max(0, Math.min(1, p)))));

    // Traveling end-dot visuals:
    const endpointScale = useTransform(mv, (p) => (p > 0 ? 1 : 0));
    const calloutShow = useTransform(mv, (p) => (p > 0.04 ? 1 : 0));
    const calloutY = useTransform(mv, (p) => (p > 0.04 ? 0 : 6));

    // Waypoint dot pre-created transforms (hooks up front, not in render)
    const wpDots = [0, 1, 2, 3].map((i) => {
      const crossP = i / 4;
      const opacity = useTransform(mv, (p) => (p >= crossP ? 1 : 0));
      const scale = useTransform(mv, (p) => (p >= crossP ? 1 : 0));
      return { opacity, scale };
    });

    return {
      key: s.key,
      mv, sample, x, y, totalLen, draw,
      dashOffset, gTransformString,
      endpointScale, calloutShow, calloutY,
      wpDots,
    };
  });
  // Rebuild a key→ref map so callers can still lookup by s.key
  const byKey = Object.fromEntries(progressRefs.map((r) => [r.key, r]));

  // Lift counters — driven by each series' progress MV (no springs needed).
  // progress 0 → 1 maps to +0% → +LIFT%. The number rises at exactly the
  // same speed the end-dot moves along the line.
  const liftRefs = series.reduce((acc, s) => {
    if (s.lift == null) return acc;
    const pRef = byKey[s.key];
    const display = useTransform(pRef.mv, (p) => `+${Math.max(0, Math.round(Math.max(0, Math.min(1, p)) * s.lift))}%`);
    const [text, setText] = useState('+0%');
    useEffect(() => {
      const unsub = display.on('change', (v) => setText(v));
      return () => unsub();
    }, [display]);
    acc[s.key] = { mv: pRef.mv, display, text, target: s.lift };
    return acc;
  }, {});

  // Kick off progress MV 0→1 for every series once inView fires.
  // `animate(MV, target, { duration, delay, ease })` is the framer-motion
  // MotionValue tween function — this is what actually updates every frame.
  useEffect(() => {
    if (!inView) return undefined;
    const controls = series.map((s) => {
      const ref = byKey[s.key];
      const { mv } = ref;
      if (reduceMotion) {
        mv.set(1);
        return () => {};
      }
      mv.jump(0);
      return animate(mv, 1, {
        duration: s.dur,
        delay: s.start,
        ease: EASE_GROWTH,
      }).stop;
    });
    return () => controls.forEach((stop) => stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  // Helper: lift counter display getter (SVG text + legend cell)
  const liftText = (key) => (liftRefs[key] ? liftRefs[key].text : '');

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 18 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        width: '100%',
        background: UI_DARK,
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '0 0 10px',
        borderBottom: HOME_SECTION_DIVIDER,
        marginBottom: 6,
      }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.7 }}>
            GROWTH SIGNAL · POST DVCP
          </div>
          <div className="section-title" style={{
            fontSize: 'clamp(18px, 2.6vw, 26px)',
            marginBottom: 0,
            color: UI_LIGHT,
            lineHeight: 1,
          }}>
            Positioned channels vs. baseline
          </div>
        </div>
        <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.7 }}>
          Q0 → Q4 · 12MO
        </div>
      </div>

      <div style={{ padding: '12px 0 0' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Growth chart comparing positioned Branding, Website, and Social channels to baseline over four quarters"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <pattern id="sg-grid" x={PL} y={PT} width={IW / 4} height={IH / 5} patternUnits="userSpaceOnUse">
              <path d={`M ${(IW / 4).toFixed(2)} 0 L 0 0 0 ${(IH / 5).toFixed(2)}`} fill="none" stroke={RULE} strokeOpacity="0.45" strokeWidth="1" />
            </pattern>
            {series.map((s, i) => (
              <linearGradient key={`grad-${s.key}`} id={`sg-area-${s.key}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={i === 0 ? STROKE : DIM} stopOpacity={0.34} />
                <stop offset="100%" stopColor={i === 0 ? STROKE : DIM} stopOpacity="0" />
              </linearGradient>
            ))}
            <filter id="sg-pulse" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x={PL} y={PT} width={IW} height={IH} fill="url(#sg-grid)" />

          {[0, 1, 2, 3, 4, 5].map((i) => {
            const y = PT + (IH * i) / 5;
            const val = Math.round(330 - (240 * i) / 5);
            return (
              <g key={`h-${i}`}>
                <line x1={PL} x2={PL + IW} y1={y} y2={y} stroke={RULE} strokeOpacity="0.25" strokeDasharray="3 4" />
                <text
                  x={PL - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  letterSpacing="0.08em"
                  fill={DIM}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={`x-${i}`}
              x={toX(i)}
              y={H - PB + 20}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontWeight="var(--font-mono-weight-bold)"
              fontSize={11}
              letterSpacing="0.1em"
              fill={DIM}
            >
              {quarters[i]}
            </text>
          ))}

          {/* Area fills — slow creep in behind stroke, easeInOut growth-curve feel */}
          {series.map((s, idx) => {
            if (!s.area) return null;
            const fired = reduceMotion || inView;
            return (
              <motion.path
                key={`area-${s.key}`}
                d={areaPath(s.arr)}
                fill={`url(#sg-area-${s.key})`}
                fillOpacity={reduceMotion ? s.area : 0}
                animate={fired ? { fillOpacity: [0, s.area] } : { fillOpacity: 0 }}
                transition={{ duration: Math.min(2.6, s.dur + 0.1), delay: fired ? s.start : 0, ease: EASE_GROWTH }}
              />
            );
          })}

          {/* Stroke draw-in — ONE motion driver: every frame of progress MV p∈[0,1]
              updates the visible stroke via style.strokeDashoffset = draw*(1-p).
              (progress MV is tweened via animate() on inView — matches exactly
              the traveling end-dot position + counter number).

              Dashed line draw math (Branding / Baseline):
                "dash on, dash off" segments repeat for the full 0→DRAW length,
                then a final gap of DRAW closes the cycle. Total cycle = 2·DRAW.
                At dashOffset = DRAW (progress=0), screen 0→DRAW sits entirely
                inside the final big gap → fully hidden.
                At dashOffset = 0 (progress=1), screen 0→DRAW sits entirely in
                the repeated dashed segments → fully drawn with dashes.
              This matches the exact 0→1 reveal of the solid Website/Social
              lines so stroke draw head aligns with traveling endpoint at all
              times — no more early-finish dashed lines.
          */}
          {series.map((s, idx) => {
            const draw = DRAW_TOTAL(idx);
            const pRef = progressRefs[idx];
            let dashArray;
            if (s.dash) {
              const [on, off] = s.dash.split(/[\s,]+/).map(Number);
              const seg = (on || 0) + (off || 0);
              const reps = Math.ceil(draw / seg) + 1;
              const parts = [];
              for (let r = 0; r < reps; r++) {
                parts.push(on, off);
              }
              parts.push(draw);
              dashArray = parts.join(' ');
            } else {
              dashArray = draw;
            }
            return (
              <motion.path
                key={`ln-${s.key}`}
                d={linePath(s.arr)}
                fill="none"
                stroke={s.color}
                strokeOpacity={s.key === 'base' ? 0.85 : 1}
                strokeWidth={s.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashArray}
                style={{ strokeDashoffset: pRef.dashOffset }}
              />
            );
          })}

          {/* Waypoint dots + traveling endpoint — all 3 positioned series (Website,
              Social, Branding) get the full treatment. Only the no-lift baseline
              reference line skips waypoints/endpoints. */}
          {series.filter((s) => s.lift != null).map((s) => {
            const idx = series.findIndex((x) => x.key === s.key);
            const pRef = progressRefs[idx];
            return s.arr.map((v, i) => {
              if (i !== 4) {
                const wp = pRef.wpDots[i];
                return (
                  <motion.circle
                    key={`pt-${s.key}-${i}`}
                    cx={toX(i)}
                    cy={toY(v)}
                    r={2.6}
                    fill={s.color}
                    style={reduceMotion ? undefined : { opacity: wp.opacity, scale: wp.scale, transformOrigin: `${toX(i)}px ${toY(v)}px` }}
                  />
                );
              }
              // ——— TRAVELING ENDPOINT + CALLOUT ———
              // <g transform="translate(X,Y)"> uses the SVG native transform
              // attribute (user-units, not CSS px) so vb_x=616 renders at the
              // actual right-edge endpoint of the polyline.
              // gTransformString is a useState string kept in sync with x/y MV
              // by change listeners (hooks up front, not in render).
              const firedAtLeastOnce = reduceMotion || inView;
              return (
                <g
                  key={`end-${s.key}`}
                  transform={pRef.gTransformString}
                >
                  <motion.circle
                    cx={0}
                    cy={0}
                    r={4.5}
                    fill={UI_DARK}
                    stroke={s.color}
                    strokeWidth={2}
                    style={reduceMotion ? undefined : { scale: pRef.endpointScale, transformOrigin: '0 0' }}
                    transition={reduceMotion ? undefined : { type: 'spring', stiffness: 320, damping: 22 }}
                  />
                  {!reduceMotion && firedAtLeastOnce && (
                    <>
                      <motion.circle
                        cx={0}
                        cy={0}
                        r={4.5}
                        fill="none"
                        stroke={s.color}
                        strokeOpacity={0.5}
                        initial={{ scale: 0.4, opacity: 0.8 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 1.4, delay: s.start + s.dur + 0.05, repeat: Infinity, repeatDelay: 1.1 }}
                      />
                      <motion.circle
                        cx={0}
                        cy={0}
                        r={2.8}
                        fill={s.color}
                        style={{ scale: pRef.endpointScale, transformOrigin: '0 0' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      />
                    </>
                  )}
                  {reduceMotion && <circle cx={0} cy={0} r={2.8} fill={s.color} />}
                  {s.lift != null && (
                    <motion.g
                      style={reduceMotion ? undefined : { opacity: pRef.calloutShow, translateY: pRef.calloutY }}
                    >
                      <rect
                        x={-42}
                        y={-32}
                        width={64}
                        height={20}
                        rx={5}
                        fill={STROKE}
                        fillOpacity={0.08}
                        stroke={RULE}
                      />
                      <text
                        x={-34}
                        y={-18}
                        fontFamily="var(--font-mono)"
                        fontWeight="var(--font-mono-weight-bold)"
                        fontSize={10}
                        letterSpacing="0.08em"
                        fill={s.color}
                      >
                        {liftText(s.key)}
                      </text>
                    </motion.g>
                  )}
                </g>
              );
            });
          })}
        </svg>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: 0,
          marginTop: 16,
          paddingTop: 18,
          borderTop: HOME_SECTION_DIVIDER,
        }}>
          <div
            className="small-text"
            style={{
              borderRight: HOME_SECTION_DIVIDER,
              padding: '10px 14px',
              letterSpacing: '0.08em',
              opacity: 0.55,
              textTransform: 'uppercase',
              display: isMobile ? 'none' : 'block',
            }}
          >
            SERIES
          </div>
          <div
            className="small-text"
            style={{
              borderRight: HOME_SECTION_DIVIDER,
              padding: '10px 14px',
              letterSpacing: '0.08em',
              opacity: 0.55,
              textTransform: 'uppercase',
              display: isMobile ? 'none' : 'block',
            }}
          >
            CHANNEL
          </div>
          <div
            className="small-text"
            style={{
              padding: '10px 14px',
              textAlign: 'right',
              letterSpacing: '0.08em',
              opacity: 0.55,
              textTransform: 'uppercase',
              display: isMobile ? 'none' : 'block',
            }}
          >
            Q4 · 12MO LIFT
          </div>
          {series.filter((s) => s.key !== 'base').map((s, i, arr) => (
            <div
              key={s.key}
              style={{
                gridColumn: isMobile ? '1 / -1' : '1 / -1',
                display: 'grid',
                gridTemplateColumns: isMobile ? 'minmax(0, 1fr) 86px' : 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                alignItems: 'baseline',
                background: UI_DARK,
                padding: '14px',
                borderTop: i === 0 ? 'none' : HOME_SECTION_DIVIDER,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width={28} height={10} role="img" aria-hidden="true">
                  <line
                    x1={1}
                    y1={5}
                    x2={26}
                    y2={5}
                    stroke={s.color}
                    strokeWidth={s.dash ? 1.8 : 2.8}
                    strokeLinecap="round"
                    strokeDasharray={s.dash ? s.dash : undefined}
                  />
                </svg>
                <span
                  className="small-text"
                  style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  {s.key === 'web' ? '02' : s.key === 'social' ? '04' : '01'}
                </span>
              </div>
              <span
                className="small-text"
                style={{
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  opacity: 0.9,
                  textAlign: isMobile ? 'left' : 'start',
                }}
              >
                {s.label}
              </span>
              <span
                className="small-text"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'var(--font-mono-weight-bold)',
                  fontSize: 'clamp(14px, 1.4vw, 18px)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  textAlign: isMobile ? 'right' : 'right',
                  color: i === 0 ? STROKE : DIM,
                }}
              >
                {liftText(s.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
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

  const TYPEWRITER_WORDS = ['Branding', 'Website', 'Social', 'Strategy'];
  const [typewriterWordIdx, setTypewriterWordIdx] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterDeleting, setTypewriterDeleting] = useState(false);

  useEffect(() => {
    const currentWord = TYPEWRITER_WORDS[typewriterWordIdx];
    const baseDelay = typewriterDeleting ? 55 : 110;
    const timer = window.setTimeout(() => {
      if (!typewriterDeleting) {
        const next = currentWord.slice(0, typewriterText.length + 1);
        setTypewriterText(next);
        if (next === currentWord) {
          window.setTimeout(() => setTypewriterDeleting(true), 1600);
        }
      } else {
        const next = currentWord.slice(0, Math.max(0, typewriterText.length - 1));
        setTypewriterText(next);
        if (next === '') {
          setTypewriterDeleting(false);
          setTypewriterWordIdx((i) => (i + 1) % TYPEWRITER_WORDS.length);
        }
      }
    }, baseDelay);
    return () => window.clearTimeout(timer);
  }, [typewriterText, typewriterDeleting, typewriterWordIdx]);

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

  const openAbout = () => {
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      const y = window.scrollY || 0;
      homeScrollYRef.current = y;
      sessionStorage.setItem('homeScrollY', String(y));
      pendingHomeScrollRestoreRef.current = true;
    } else {
      pendingHomeScrollRestoreRef.current = false;
    }
    navigate('/about');
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
    else if (pathname === '/about') setActiveCaseStudy('about');
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
  const mobileNavBg = 'rgba(8,8,8,0.72)';
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
                  Social
                </button>
                <button type="button" className="mobile-nav-link" onClick={openServices}>
                  Services
                </button>
                <button type="button" className="mobile-nav-link" onClick={openAbout}>
                  About
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
        ) : activeCaseStudy === 'about' ? (
          <About key="about" />
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
                <div style={{ marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <h1 className="home-hero__title" style={{
                    fontFamily: 'var(--font-display)', fontWeight: 'var(--font-display-weight)',
                    fontSynthesis: 'weight',
                    margin: 0,
                    fontSize: 'clamp(44px, 9vw, 190px)',
                  }}>
                    <div className="home-hero__title-line" style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                      <DecryptText as="span" text="A Strategic Creation Consultancy" trigger="mount" delay={200} duration={900} />
                    </div>
                  </h1>
                  <div
                    className="home-hero__subhead"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 'var(--font-display-weight)',
                      fontSize: 'clamp(20px, 4.2vw, 64px)',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      color: UI_LIGHT,
                      opacity: 0.92,
                      minHeight: '1.1em',
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.1 }}
                      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                    >
                      {typewriterText}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 1.1 }}
                      style={{ display: 'inline-block', width: '0.5ch', marginLeft: '2px', color: UI_LIGHT, fontWeight: 'var(--font-mono-weight-bold)' }}
                      aria-hidden="true"
                    >
                      _
                    </motion.span>
                  </div>
                </div>
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
                paddingTop: 'clamp(56px, 9vw, 120px)',
                paddingBottom: 'var(--spacing-xxl)',
                paddingLeft: 'var(--spacing-md)',
                paddingRight: 'var(--spacing-md)',
                background: UI_DARK,
                color: UI_LIGHT,
                minHeight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div aria-hidden="true" style={{
                position: 'absolute',
                inset: '0 auto 0 50%',
                width: '240vw',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.0) 55%)',
                pointerEvents: 'none',
              }} />
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 18 }}
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  maxWidth: 'var(--content-max-w)',
                  margin: '0 auto',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div className="flex" style={{
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingBottom: 'var(--spacing-sm)',
                  borderBottom: HOME_SECTION_DIVIDER,
                  marginBottom: 'var(--spacing-xl)',
                }}>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.72 }}>
                      STUDIO SCORE · 2024 — 2026
                    </div>
                    <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                      <DecryptText as="span" text="Build Something" trigger="inView" duration={900} delay={120} />
                      <br className="md:block" style={{ display: isMobile ? 'none' : 'block' }} />
                      <DecryptText as="span" text="People Actually Remember." trigger="inView" duration={900} delay={260} />
                    </h2>
                  </div>
                  <span className="small-text">Index (02)</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, minmax(0, 1fr))',
                  gap: 0,
                  borderTop: HOME_SECTION_DIVIDER,
                  borderLeft: HOME_SECTION_DIVIDER,
                }}>
                  {STATS_RAW.map((stat, i) => (
                    <AnimatedStatValue
                      key={stat.k}
                      index={i}
                      label={stat.k}
                      target={stat.v}
                      unit={stat.u}
                      tone={stat.tone}
                      isMobile={isMobile}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  style={{
                    marginTop: 'var(--spacing-xl)',
                    padding: '16px 0 0',
                    borderTop: HOME_SECTION_DIVIDER,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                  }}
                >
                  <div className="small-text" style={{
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    opacity: 0.78,
                    maxWidth: 620,
                    lineHeight: 1.5,
                  }}>
                    Four pillars, one process, no silos. Strategy first — then Branding, Website, and Social all ship from the same scorecard.
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}>
                    {[
                      { k: 'STRATEGY', i: '01' },
                      { k: 'BRANDING', i: '02' },
                      { k: 'WEBSITE', i: '03' },
                      { k: 'SOCIAL', i: '04' },
                    ].map((p, i, arr) => (
                      <div key={p.k} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        border: HOME_SECTION_DIVIDER,
                        borderRadius: 999,
                      }}>
                        <span className="small-text" style={{
                          letterSpacing: '0.1em',
                          opacity: 0.55,
                          textTransform: 'uppercase',
                        }}>
                          {p.i}
                        </span>
                        <span className="small-text" style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 'var(--font-mono-weight-bold)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          color: UI_LIGHT,
                        }}>
                          {p.k}
                        </span>
                        {i < arr.length - 1 && (
                          <span aria-hidden="true" style={{
                            marginLeft: 2,
                            color: 'rgba(255,255,255,0.32)',
                            fontSize: 12,
                          }}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
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

                <div className="studio-client-grid-home" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: 0,
                  alignItems: 'stretch',
                  borderTop: HOME_SECTION_DIVIDER,
                  borderLeft: HOME_SECTION_DIVIDER,
                }}>
                  {/* Micron */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                      borderRight: HOME_SECTION_DIVIDER,
                      borderBottom: HOME_SECTION_DIVIDER,
                      padding: 'var(--spacing-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 'var(--spacing-md)',
                      minHeight: 160,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto' }}>
                      <img
                        src="/images/micron.png"
                        alt="Micron"
                        className="studio-client-logo studio-client-logo--invert"
                        style={{
                          height: 26,
                          width: 'auto',
                          maxWidth: '100%',
                          display: 'block',
                          opacity: 0.95,
                        }}
                      />
                    </div>
                    <div className="small-text" style={{ color: UI_LIGHT }}>
                      A01
                    </div>
                  </motion.div>
                  {/* Ramboll */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    style={{
                      borderRight: HOME_SECTION_DIVIDER,
                      borderBottom: HOME_SECTION_DIVIDER,
                      padding: 'var(--spacing-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 'var(--spacing-md)',
                      minHeight: 160,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto' }}>
                      <img
                        src="/images/ramboll-transparent.png"
                        alt="Ramboll"
                        className="studio-client-logo"
                        style={{
                          height: 26,
                          width: 'auto',
                          maxWidth: '100%',
                          display: 'block',
                          opacity: 0.98,
                        }}
                      />
                    </div>
                    <div className="small-text" style={{ color: UI_LIGHT }}>
                      A02
                    </div>
                  </motion.div>
                  {/* Worksharp */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{
                      borderRight: HOME_SECTION_DIVIDER,
                      borderBottom: HOME_SECTION_DIVIDER,
                      padding: 'var(--spacing-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 'var(--spacing-md)',
                      minHeight: 160,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto' }}>
                      <img
                        src="/images/worksharp.webp"
                        alt="Worksharp"
                        className="studio-client-logo"
                        style={{
                          height: 54,
                          width: 'auto',
                          maxWidth: '100%',
                          display: 'block',
                          opacity: 0.98,
                        }}
                      />
                    </div>
                    <div className="small-text" style={{ color: UI_LIGHT }}>
                      A03
                    </div>
                  </motion.div>
                  {/* Granite Gear */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    style={{
                      borderRight: HOME_SECTION_DIVIDER,
                      borderBottom: HOME_SECTION_DIVIDER,
                      padding: 'var(--spacing-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 'var(--spacing-md)',
                      minHeight: 160,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto' }}>
                      <img
                        src="/images/granitegear.png"
                        alt="Granite Gear"
                        className="studio-client-logo"
                        style={{
                          height: 48,
                          width: 'auto',
                          maxWidth: '100%',
                          display: 'block',
                          opacity: 0.98,
                        }}
                      />
                    </div>
                    <div className="small-text" style={{ color: UI_LIGHT }}>
                      A04
                    </div>
                  </motion.div>
                </div>
                <style>{`
                  @media (max-width: 1000px) {
                    .studio-client-grid-home { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                  }
                  @media (max-width: 560px) {
                    .studio-client-grid-home { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                  }
                `}</style>
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
                  <DecryptText as="span" text="WEBSITE" trigger="inView" duration={800} />
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

            <section id="design" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="BRANDING" trigger="inView" duration={800} />
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
            
            <section
              data-header-theme="light"
              style={{
                paddingTop: 'var(--spacing-xxl)',
                paddingBottom: 'var(--spacing-xxl)',
                paddingLeft: 'var(--spacing-md)',
                paddingRight: 'var(--spacing-md)',
                background: UI_DARK,
                color: UI_LIGHT,
                minHeight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ width: '100%', maxWidth: 'var(--content-max-w)', margin: '0 auto' }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                    <DecryptText as="span" text="OUR PROCESS" trigger="inView" duration={800} />
                  </h2>
                  <span className="small-text">Index (02.5)</span>
                </div>

                <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 12 }}
                  viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                  transition={{ duration: 0.45 }}
                  style={{
                    borderTop: HOME_SECTION_DIVIDER,
                    borderBottom: HOME_SECTION_DIVIDER,
                    padding: '10px 0',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(100px, 0.24fr) minmax(0, 1fr)',
                    gap: 'var(--spacing-md)',
                    alignItems: 'start',
                  }}
                >
                  <div
                    className="small-text"
                    style={{
                      opacity: 0.72,
                      letterSpacing: '0.08em',
                      paddingTop: '4px',
                    }}
                  >
                    DVCP / 00
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.1fr) minmax(320px, 0.9fr)',
                      gap: 'var(--spacing-md)',
                      alignItems: 'stretch',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h2
                        className="section-title"
                        style={{
                          marginBottom: 0,
                          maxWidth: '12ch',
                          color: UI_LIGHT,
                          lineHeight: 0.9,
                          fontSize: 'clamp(26px, 5vw, 68px)',
                        }}
                      >
                        <DecryptText as="span" text="DIGITAL VALUE" trigger="inView" duration={800} delay={120} />
                        <br />
                        <DecryptText as="span" text="CREATION PLAN" trigger="inView" duration={800} delay={220} />
                      </h2>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <DvcpProcessImagePanel isMobile={isMobile} />
                    </div>
                  </div>
                </motion.div>

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                      gap: 0,
                      borderTop: HOME_SECTION_DIVIDER,
                      borderLeft: HOME_SECTION_DIVIDER,
                    }}
                  >
                    {DVCP_PROCESS.steps.map((s, i) => (
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
                          minHeight: 160,
                        }}
                      >
                        <div
                          className="small-text"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            opacity: 0.76,
                          }}
                        >
                          <span>STEP {s.step}</span>
                          <span>{String(i + 1).padStart(2, '0')} / 03</span>
                        </div>
                        <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
                          <h3
                            className="section-title"
                            style={{
                              fontSize: 'clamp(17px, 2.2vw, 26px)',
                              lineHeight: 0.96,
                              letterSpacing: '-0.03em',
                              margin: 0,
                              color: UI_LIGHT,
                            }}
                          >
                            <DecryptText as="span" text={s.title.toUpperCase()} trigger="inView" duration={550} delay={160 + i * 80} />
                          </h3>
                          <p
                            className="small-text"
                            style={{
                              margin: 0,
                              lineHeight: 1.4,
                              opacity: 0.8,
                              textTransform: 'uppercase',
                              maxWidth: 340,
                              fontSize: 'calc(var(--fs-sm) - 1px)',
                            }}
                          >
                            {s.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="photography" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="SOCIAL" trigger="inView" duration={800} />
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


            <section id="strategy" data-header-theme="light" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div style={{ width: '100%', maxWidth: 'var(--content-max-w)', margin: '0 auto' }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                    <DecryptText as="span" text="STRATEGY" trigger="inView" duration={800} />
                  </h2>
                  <span className="small-text">Index (07)</span>
                </div>

                <StrategyGrowthGraph isMobile={isMobile} />

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
                    gap: 'var(--spacing-xl)',
                    alignItems: 'start',
                    marginTop: 'var(--spacing-xl)',
                  }}
                >
                  <div style={{ display: 'grid', gap: 'var(--spacing-md)', minWidth: 0 }}>
                    <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.76 }}>
                      POSITION + DEPLOY + MEASURE
                    </div>
                    <h3 className="section-title" style={{
                      margin: 0,
                      color: UI_LIGHT,
                      lineHeight: 0.9,
                      fontSize: 'clamp(34px, 5.6vw, 84px)',
                    }}>
                      <DecryptText as="span" text="Turn positioning" trigger="inView" duration={850} delay={120} />
                      <br />
                      <DecryptText as="span" text="into compounding" trigger="inView" duration={850} delay={200} />
                      <br />
                      <DecryptText as="span" text="growth signals." trigger="inView" duration={850} delay={280} />
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    <p className="small-text" style={{
                      margin: 0,
                      lineHeight: 1.55,
                      opacity: 0.88,
                      maxWidth: 620,
                    }}>
                      We anchor every engagement to a shared growth baseline — then reposition brand, web, and social channels so they move the same indicators, the same way, and compound from the same story.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                      {[
                        { k: 'AUDIT', v: 'Brand, website, and stack scored against one DVCP scorecard.' },
                        { k: 'POSITION', v: 'A single story that branding, web, and social all reinforce.' },
                        { k: 'DEPLOY', v: 'Tactics shipped in the order they compound fastest.' },
                        { k: 'MEASURE', v: 'Pipelines tracked so positioning work shows up in pipeline.' },
                      ].map((s, i) => (
                        <div key={s.k} style={{
                          display: 'grid',
                          gap: 8,
                          paddingTop: 14,
                          borderTop: HOME_SECTION_DIVIDER,
                        }}>
                          <div className="small-text" style={{ letterSpacing: '0.08em', opacity: 0.76 }}>
                            0{i + 1} · {s.k}
                          </div>
                          <div className="small-text" style={{ lineHeight: 1.55, opacity: 0.92 }}>
                            {s.v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
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
