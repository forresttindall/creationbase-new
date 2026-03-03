import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    description: "Desktop RSS feed reader interface design in figma and dev in ELECTRON",
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
    title: "Local Photographer",
    category: "Social Media",
    image: "/images/getportraits.jpg",
    description: "Promotional Asset Design",
    year: "2026"
  },
      {
    title: "Boise Analog Club",
    category: "Brand Identity",
    image: "/images/BAC March.jpg",
    description: "Event Flyer Design",
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
    title: "Boise Analog Club",
    category: "Brand Identity",
    image: "/images/BAC january.png",
    description: "Event Flyer Design",
    year: "2026"
  },

  {
    title: "Boise Analog Club",
    category: "Brand Identity",
    image: "/images/BAC FEBUARY.png",
    description: "Event Flyer Design",
    year: "2026"
  },
  {
    title: "Gee Tee",
    category: "Album Art Design",
    image: "/images/geetee.jpg",
    description: "Concept album artwork design.",
    year: "2025"
  },
  {
    title: "Creationbase",
    category: "Asset Design",
    image: "/images/launch art.png",
    description: "Digital assets for launch campaign.",
    year: "2025"
  },

    {
    title: "Boise Analog Club",
    category: "Poster Design",
    image: "/images/propagranda 3.png",
    description: "Promotional poster design.",
    year: "2025"
  },

  {
    title: "Open Netizen",
    category: "Brand Identity",
    image: "/images/OPEN NETIZEN.jpg",
    description: "Logo, Branding and visual system.",
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
    stars: "★★★★★",
    headline: "FIVE STARS!!!",
    text: "I put off rebranding my business and building out a new website because I just didn't have the time or inclination to do it all myself. Working with Forrest was easy and fun because he was able to draw information out of me that helped make the design and layout reflect my values. He also built elements into my website that gets it ranked higher in search engines and it gets noticed."
  },
  {
    name: "Jackie Beauchaine",
    stars: "★★★★★",
    headline: "I couldn't be happier!",
    text: "Forrest did a fantastic job on my website. It's now ranking higher on Google and bringing in more business. He gave my site the professional look I always wanted!"
  },
  {
    name: "Douglas Herlocker",
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
            color: '#fff',
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
          color: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 className="section-title" style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--spacing-xs)', color: '#fff' }}>{project.title}</h2>
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
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          padding: 'var(--spacing-md)', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 100,
          mixBlendMode: 'difference',
          color: '#fff',
          pointerEvents: 'none'
        }}
      >
        <div className="logo small-text" style={{ pointerEvents: 'auto' }}>
          Forrest Tindall<br />
          Design & Dev
        </div>
        <div className="small-text" style={{ textAlign: 'right', pointerEvents: 'auto' }}>
          Boise, ID<br />
          {time}
        </div>
      </motion.header>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Hero */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-end', 
        padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-xl)',
        borderBottom: '1px solid #000'
      }}>
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'var(--fs-display)', 
          lineHeight: 1,
          textTransform: 'uppercase',
          letterSpacing: '-0.04em',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Visual
            </motion.div>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              System
            </motion.div>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              Design
            </motion.div>
          </div>
        </h1>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex" 
          style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <p className="small-text" style={{ maxWidth: '300px' }}>
            Specializing in brand identity, interface design, and full-stack development. Creating cutting-edge digital experiences with a focus on typography and performance.
          </p>
          <div className="small-text">
            (SCROLL)
          </div>
        </motion.div>
      </section>

      {/* Graphic Design */}
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
        <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>Graphic Design</h2>
          <span className="small-text">Index (01)</span>
        </div>

        <div className="project-grid" style={{ alignItems: 'start' }}>
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
                <div style={{ 
                 marginBottom: 'var(--spacing-sm)', 
                 overflow: 'hidden',
                 border: '1px solid #000',
                 aspectRatio: '1/1',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 backgroundColor: 'transparent'
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
              <div className="flex" style={{ justifyContent: 'space-between', borderTop: '1px solid #000', paddingTop: 'var(--spacing-xs)' }}>
                <div>
                  <h3 className="small-text" style={{ fontWeight: 'bold' }}>{project.title}</h3>
                  <p className="small-text" style={{ opacity: 0.7 }}>{project.description}</p>
                </div>
                <div className="small-text" style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ whiteSpace: 'nowrap' }}>{project.category}</div>
                  <div>{project.year}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Selected Work */}
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: '#000', color: '#fff' }}>
        <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: '#fff' }}>Web Design</h2>
          <span className="small-text">Index (02)</span>
        </div>
        
        <div className="project-grid">
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
              <div style={{ 
                marginBottom: 'var(--spacing-sm)', 
                overflow: 'hidden',
                border: '1px solid #333',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000'
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
              <div className="flex" style={{ justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: 'var(--spacing-xs)' }}>
                <div>
                  <h3 className="small-text" style={{ fontWeight: 'bold' }}>{project.title}</h3>
                  <p className="small-text" style={{ opacity: 0.7 }}>{project.description}</p>
                </div>
                <div className="small-text" style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ whiteSpace: 'nowrap' }}>{project.category}</div>
                  <div>{project.year}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section style={{ 
        padding: '0',
        background: '#ffffff',
        color: '#000',
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Split Layout */}
        <div className="studio-split-layout">
          {/* Left: Typography */}
          <div className="studio-typography-column">
            <div>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', borderBottom: '1px solid #000', paddingBottom: 'var(--spacing-sm)' }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>Studio Practice</h2>
                <span className="small-text">Index (03)</span>
              </div>

              <div className="small-text" style={{ maxWidth: '300px', marginTop: 'var(--spacing-lg)' }}>
                J. F. Tindall is a Fullstack Creative from Boise, Idaho, raised in the wide landscapes of the American West. His work spans photography, design, art, and web development, blending technical precision with visual storytelling. He began making art early, first through drawing and writing, then discovering film photography at thirteen. In 2012, he began designing logos, websites, and he launched <em>Tindall Knives</em>, beginning an over decade-long career as a bladesmith. Around the same time, he started a parallel path in photography, focusing on outdoor and product photography for the knife and tool industry. His photography has been featured in multiple publications, including <em>Popular Mechanics Magazine</em>. Years spent shaping steel by hand in the mountains became a study in patience, discipline, and craftsmanship, qualities that continue to define his creative work today. Through photography, design, writing, illustration, and mixed media, Tindall explores identity, society, and the subtle contradictions of modern life, examining the space between what we call things and what they truly are. His work has appeared in exhibitions, global publications, and bespoke retailers, reflecting an ongoing effort to bridge the personal and the universal.
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="studio-portrait-wrapper">
            <img 
              src="/images/me2.jpg" 
              alt="Portrait" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: 'grayscale(100%) contrast(1.1)',
                display: 'block'
              }} 
            />
            <div style={{
              position: 'absolute',
              bottom: 'var(--spacing-md)',
              left: 'var(--spacing-md)',
              background: '#000',
              color: '#fff',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-xs)',
              textTransform: 'uppercase'
            }}>
              Figure 01. Portrait
            </div>
          </div>
        </div>

      </section>

      {/* Selected Clients & Testimonials */}
      <section style={{ 
        padding: '0',
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Selected Clients Marquee/Grid */}
        <div style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
           <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline' }}>
             <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: '#fff' }}>Clients & Partners</h2>
             <span className="small-text">Index (04)</span>
           </div>

          <div className="studio-client-grid">
            {/* Micron */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ borderTop: '2px solid #fff', paddingTop: 'var(--spacing-md)' }}
            >
              <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                <img src="/images/micron.png" alt="Micron" style={{ height: '100%', filter: 'grayscale(100%) invert(1)' }} />
              </div>
              <h4 style={{ 
                fontSize: 'var(--fs-lg)', 
                margin: '0 0 var(--spacing-sm) 0',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)'
              }}>
                Micron Technology
              </h4>
              <p className="small-text" style={{ maxWidth: '90%' }}>
                Designed over 1000 ADA-compliant signs for the massive 2026 Boise expansion. Creating a cohesive wayfinding system that merges strict regulatory standards with architectural harmony.
              </p>
              <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                [WAYFINDING] [ENVIRONMENTAL] [ADA]
              </div>
            </motion.div>

            {/* Ricochet */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ borderTop: '2px solid #fff', paddingTop: 'var(--spacing-md)' }}
            >
              <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                <img src="/images/ricochet.png" alt="Ricochet" style={{ height: '100%', filter: 'grayscale(100%) invert(1)' }} />
              </div>
              <h4 style={{ 
                fontSize: 'var(--fs-lg)', 
                margin: '0 0 var(--spacing-sm) 0',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)'
              }}>
                Ricochet Consignment
              </h4>
              <p className="small-text" style={{ maxWidth: '90%' }}>
                Partnered with Superbase to design a completely new marketing website and digital experience. Elevating the brand presence for a leading consignment SaaS platform.
              </p>
              <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                [WEB DESIGN] [DIGITAL EXPERIENCE] [PARTNERSHIP]
              </div>
            </motion.div>

            {/* Superbase */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{ borderTop: '2px solid #fff', paddingTop: 'var(--spacing-md)' }}
            >
              <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                <img src="/images/superbase.jpg" alt="Superbase" style={{ height: '100%', filter: 'grayscale(100%)' }} />
              </div>
              <h4 style={{ 
                fontSize: 'var(--fs-lg)', 
                margin: '0 0 var(--spacing-sm) 0',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)'
              }}>
                Superbase
              </h4>
              <p className="small-text" style={{ maxWidth: '90%' }}>
                Continued partner for high-level UI/UX and design. Collaborating on scalable digital products and design systems for a leading design agency.
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
              style={{ borderTop: '2px solid #fff', paddingTop: 'var(--spacing-md)' }}
            >
              <div style={{ marginBottom: 'var(--spacing-md)', height: '40px' }}>
                <img src="/images/cmyk.jpg" alt="CMYK Graffix" style={{ height: '100%', filter: 'grayscale(100%) invert(1)' }} />
              </div>
              <h4 style={{ 
                fontSize: 'var(--fs-lg)', 
                margin: '0 0 var(--spacing-sm) 0',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)'
              }}>
                CMYK Graffix
              </h4>
              <p className="small-text" style={{ maxWidth: '90%' }}>
                Strategic graphic design partner for large-format print and branding projects. Delivering print-ready assets and visual identities for a premier design and print agency.
              </p>
              <div style={{ marginTop: 'var(--spacing-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                [GRAPHIC DESIGN] [PRINT] [AGENCY PARTNER]
              </div>
            </motion.div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline' }}>
            <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: '#fff' }}>Client Feedback</h2>
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
                  justifyContent: 'space-between',
                  borderTop: '2px solid #fff',
                  paddingTop: 'var(--spacing-md)'
                }}
              >
                <div>
                   <div style={{ 
                      fontSize: 'var(--fs-lg)', 
                      color: '#fff', 
                      marginBottom: 'var(--spacing-sm)',
                      letterSpacing: '-2px'
                    }}>
                      {testimonial.stars}
                   </div>
                   <h4 style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: 'var(--fs-lg)', 
                      textTransform: 'uppercase',
                      marginBottom: 'var(--spacing-sm)',
                      lineHeight: 1
                   }}>
                      {testimonial.headline}
                   </h4>
                   <p className="small-text" style={{ 
                      fontSize: 'var(--fs-sm)', 
                      lineHeight: 1.5,
                      marginBottom: 'var(--spacing-md)',
                      textTransform: 'none',
                      maxWidth: '90%'
                   }}>
                      "{testimonial.text}"
                   </p>
                </div>
                <div style={{ 
                  marginTop: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-xs)',
                  textTransform: 'uppercase'
                }}>
                  [{testimonial.name}]
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <div>
          <h2 className="section-title">Let's Work<br />Together</h2>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-xl)' }}>
          <div>
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)' }}>CONTACT</p>
            <ul className="small-text">
              <li><a href="mailto:hello@forresttindall.com" style={{ wordBreak: 'break-all' }}>FORREST.TINDALL@GMAIL.COM</a></li>
              <li><a href="www.instagram.com/forrest.tindall/">INSTAGRAM</a></li>
              <li><a href="https://www.linkedin.com/in/forrest-tindall/">LINKEDIN</a></li>
            </ul>
          </div>
          <div>
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)' }}>SERVICES</p>
            <ul className="small-text">
              <li>VISUAL SYSTEM DESIGN</li>
              <li>WEB DEVELOPMENT</li>
              <li>BRAND IDENTITY</li>
              <li>ART DIRECTION</li>
            
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-xxl)', borderTop: '1px solid #000', paddingTop: 'var(--spacing-sm)' }} className="flex">
          <p className="small-text" style={{ flex: 1 }}>© 2026 FORREST TINDALL</p>
          <p className="small-text">DESIGNED & CODED IN BOISE, ID</p>
        </div>
      </motion.section>
    </div>
  )
}

export default App
