import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const sections = [
  "1.0 BRAND OVERVIEW",
  "2.0 LOGO SYSTEM",
  "3.0 COLOR PALETTE",
  "4.0 TYPOGRAPHY",
  "5.0 GRAPHIC ELEMENTS",
  "6.0 PHOTOGRAPHY DIRECTION",
  "7.0 LAYOUTS",
  "8.0 APPLICATIONS",
];

const BLUE = "#172EFF";
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const GRAY1 = "#676767";
const GRAY2 = "#353535";

function SectionNav({ active }) {
  const scrollToSection = (index) => {
    // Each ScrollSection is 150vh, starting after the hero (100vh) and brand info (approx 200px)
    // Actually, it's better to just let the scroll tracking work and make the nav look correct.
    // The user wants it to LOOK like the provided snippet.
    const sectionsElements = document.querySelectorAll('section, [data-section]');
    if (sectionsElements[index + 1]) { // +1 because hero is index 0 in DOM usually
      sectionsElements[index + 1].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: 260,
      height: "100vh",
      background: BLACK,
      borderLeft: `1px solid ${GRAY2}`,
      padding: "48px 24px",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}>
      <p style={{ fontFamily: "'SF Mono', 'Courier New', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, marginBottom: 16, textTransform: "uppercase" }}>SECTIONS</p>
      {sections.map((s, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          style={{
            background: "none",
            border: "none",
            borderBottom: `1px solid ${GRAY2}`,
            padding: "10px 0",
            textAlign: "left",
            fontFamily: "'SF Mono', 'Courier New', monospace",
            fontSize: 11,
            letterSpacing: 1,
            cursor: "pointer",
            color: active === i ? WHITE : GRAY1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "color 0.2s",
          }}
        >
          {active === i && <span style={{ color: WHITE }}>▶</span>}
          {s}
        </button>
      ))}
    </nav>
  );
}

function PageHeader({ number, title }) {
  return (
    <div style={{ marginBottom: "clamp(16px, 3vh, 24px)" }}>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400, // Match site regular weight
        fontSize: "var(--fs-xl)", // Match site section title size
        letterSpacing: "-0.04em",
        lineHeight: 0.85,
        color: WHITE,
        margin: 0,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase'
      }}>
        {number} {title}
      </h2>
      <div style={{ height: 1, background: GRAY2, marginTop: 12 }} />
    </div>
  );
}

function LogoMark({ size = 80, color = WHITE, bg = BLUE }) {
  // Use exact PNG file names as requested by the user
  const logoSrc = 
    color === BLACK || color === 'black' || color === '#000000' ? '/images/open netizen logo black.png' :
    color === BLUE || color === 'blue' || color === '#172EFF' ? '/images/open netizen logo blue.png' :
    color === GRAY1 || color === 'gray medium' || color === '#676767' ? '/images/open netizen logo gray medium.png' :
    color === GRAY2 || color === 'gray dark' || color === '#353535' ? '/images/open netizen logo gray dark.png' :
    '/images/open netizen logo white.png';

  return (
    <div style={{
      width: size,
      height: bg === 'transparent' ? 'auto' : size * 1.15,
      background: bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: bg === 'transparent' ? 0 : size * 0.12,
      boxSizing: "border-box",
    }}>
      <img 
        src={logoSrc} 
        alt="Open Netizen Logo" 
        style={{ 
          width: '100%', 
          height: 'auto',
          display: 'block'
        }} 
      />
    </div>
  );
}

function ColorSwatch({ label, letter, num, hex, cmyk, rgb, bg, textColor }) {
  return (
    <div style={{
      background: bg,
      border: `1px solid ${GRAY2}`,
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "clamp(100px, 14vh, 180px)",
      position: "relative",
      marginTop: "-1px", // Make blocks touch top-to-bottom
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "var(--fs-xl)", 
          fontWeight: 400, 
          color: textColor, 
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          textTransform: "uppercase"
        }}>{letter}</span>
        <span style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "var(--fs-xl)", 
          fontWeight: 400, 
          color: textColor, 
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          textTransform: "uppercase"
        }}>{num}</span>
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "48px", 
        fontFamily: "'SF Mono', monospace", 
        fontSize: "10px", 
        color: textColor,
        opacity: 0.8,
        letterSpacing: "1px"
      }}>
        <span>{cmyk}</span>
        <span>{rgb}</span>
        <span>HEX {hex}</span>
      </div>
    </div>
  );
}

function FontCard({ num, name, label, description }) {
  return (
    <div style={{ borderBottom: `1px solid ${GRAY2}`, paddingBottom: 40, marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
        <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1 }}>{num}</span>
        <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, textTransform: "uppercase", letterSpacing: 2 }}>{label}</span>
      </div>
      <h3 style={{
        fontFamily: name === "PP Neue Machina" ? "'PP Neue Machina', 'Arial Black', sans-serif"
          : name === "SF Mono" ? "'SF Mono', 'Courier New', monospace"
          : "'Geist', 'Helvetica Neue', sans-serif",
        fontWeight: name === "PP Neue Machina" ? 900 : 400,
        fontSize: 48,
        color: WHITE,
        margin: "0 0 16px",
        letterSpacing: name === "PP Neue Machina" ? -1 : 0,
      }}>
        {name}
      </h3>
      <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, maxWidth: 600 }}>{description}</p>
    </div>
  );
}

const ScrollSection = ({ children, index, setActive }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const isInView = useInView(containerRef, { 
    amount: 0.5,
  });

  useEffect(() => {
    if (isInView) {
      setActive(index);
    }
  }, [isInView, index, setActive]);

  // Restore simple "Card Flip" without extra dwell time
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

  return (
    <div ref={containerRef} style={{ 
      height: "100vh", 
      scrollSnapAlign: "start",
      position: "relative"
    }}>
      <motion.section
        style={{
          height: "100vh",
          padding: "clamp(32px, 6vh, 64px) 56px",
          perspective: "1200px",
          transformStyle: "preserve-3d",
          rotateX,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          background: BLACK,
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </motion.section>
    </div>
  );
};

const OpenNetizenCaseStudy = ({ onBack }) => {
  const [active, setActive] = useState(0);
  const mainRef = useRef(null);

  useEffect(() => {
    // Force scroll to top on mount
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      ref={mainRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        background: BLACK,
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        fontFamily: "'SF Mono', monospace",
        color: WHITE,
        position: 'relative'
      }}>
      <SectionNav active={active} />

      <div style={{ marginRight: 260 }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: BLACK,
          scrollSnapAlign: "start"
        }}>
          <div 
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <img 
              src="/images/open netizen background.jpg" 
              alt="Open Netizen Background" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 56px',
            }}
          >
            <div style={{ marginTop: 'auto', marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 16 }}>
                <LogoMark size={56} color={WHITE} bg="transparent" />
                <h1 style={{
                  fontFamily: "'PP Neue Machina', 'Arial Black', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(48px, 6vw, 96px)",
                  color: WHITE,
                  letterSpacing: -2,
                  lineHeight: 0.85,
                  margin: 0,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  Open Netizen
                </h1>
              </div>
              <p style={{ 
                fontFamily: "'SF Mono', monospace", 
                fontSize: 14, 
                color: WHITE, 
                maxWidth: '600px',
                lineHeight: 1.6,
                letterSpacing: 0
              }}>
                A 501(c)(3) non-profit established to promote the free web, decentralized infrastructure, and open-source principles. Protecting the web as a public commons.
              </p>
            </div>
          </div>
        </section>

        {/* Continuous Scroll Sections */}
        <main>
          {/* 1.0 BRAND OVERVIEW */}
          <ScrollSection index={0} setActive={setActive}>
            <PageHeader number="1.0" title="BRAND OVERVIEW" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
              <div>
                <div style={{
                  background: BLUE,
                  padding: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: '1/1',
                  width: '100%',
                }}>
                  <LogoMark size={120} color={WHITE} bg="transparent" />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>ABOUT</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: WHITE, lineHeight: 1.8 }}>
                    OPEN NETIZEN is a 501(c)(3) non-profit organization established in 2023 to promote the free web, decentralized web and open source web.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>1.1 MISSION</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: WHITE, lineHeight: 1.8 }}>
                    Open Netizen exists to protect the web as a public commons. Open to everyone, owned by no one, built to last beyond any single company's interests.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>1.2 POSITIONING</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: WHITE, lineHeight: 1.8 }}>
                    Open Netizen is the civic voice of the open web. Not a tech startup. Not a government agency. A community organization that holds the web's future accountable to the public.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 48 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>1.3 BRAND PERSONALITY</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: GRAY2 }}>
                {[
                  { n: "1", label: "PRINCIPLED", subs: ["Firm Convictions", "Grounded in Values", "Justice for All"] },
                  { n: "2", label: "ACCESSIBLE", subs: ["Open Means Everyone", "Easy to Understand", "Welcoming of All"] },
                  { n: "3", label: "OPTIMISTIC", subs: ["Firm Convictions", "Grounded in Values", "Justice for All"] },
                  { n: "4", label: "INDEPENDENT", subs: ["Firm Convictions", "Grounded in Values", "Justice for All"] },
                ].map((p) => (
                  <div key={p.n} style={{ background: BLACK, padding: "24px 20px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontFamily: "'PP Neue Machina', 'Arial Black', sans-serif", fontSize: 28, fontWeight: 900, color: BLUE }}>{p.n}</span>
                      <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: WHITE, letterSpacing: 1 }}>{p.label}</span>
                    </div>
                    {p.subs.map((s, i) => (
                      <p key={i} style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: GRAY1, margin: "4px 0" }}>{s}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </ScrollSection>

          {/* 2.0 LOGO SYSTEM */}
          <ScrollSection index={1} setActive={setActive}>
            <PageHeader number="2.0" title="LOGO SYSTEM" />
            
            {/* 2.1 LOGOMARK GRID */}
            <div style={{ marginBottom: "clamp(12px, 2vh, 24px)" }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: "clamp(6px, 1vh, 12px)" }}>2.1 LOGOMARK</p>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: 1, 
                background: GRAY2,
                width: "100%" 
              }}>
                {[
                  { bg: BLUE, color: WHITE },
                  { bg: WHITE, color: BLUE },
                  { bg: GRAY1, color: WHITE },
                ].map((v, i) => (
                  <div key={i} style={{
                    background: v.bg,
                    aspectRatio: "1/1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "clamp(16px, 3vh, 32px)",
                  }}>
                    <LogoMark size="var(--on-logo-size)" color={v.color} bg="transparent" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2.2 TYPEMARK BARS */}
            <div>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: "clamp(6px, 1vh, 12px)" }}>2.2 TYPEMARK</p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { bg: BLUE, color: WHITE },
                  { bg: WHITE, color: BLUE },
                  { bg: GRAY1, color: WHITE },
                ].map((v, i) => (
                  <div key={i} style={{
                    background: v.bg,
                    border: `1px solid ${GRAY2}`,
                    padding: "0 28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "clamp(60px, 9vh, 120px)",
                    marginTop: "-1px",
                  }}>
                    <span style={{ 
                      fontFamily: "var(--font-display)", 
                      fontSize: "var(--fs-xl)", 
                      fontWeight: 400, 
                      color: v.color, 
                      lineHeight: 0.85,
                      letterSpacing: "-0.04em",
                      textTransform: "uppercase"
                    }}>{i + 1}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                      <span style={{
                        fontFamily: "'PP Neue Machina', 'Arial Black', sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(20px, 3.8vw, 44px)",
                        color: v.color,
                        letterSpacing: -1,
                        lineHeight: 1,
                        textTransform: "uppercase"
                      }}>OPEN NETIZEN</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollSection>

          {/* 3.0 COLOR PALETTE */}
          <ScrollSection index={2} setActive={setActive}>
            <PageHeader number="3.0" title="COLOR PALETTE" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ColorSwatch
                letter="A" num="01" label="Primary"
                hex="172EFF"
                cmyk="CMYK C85 M74 Y0 K0"
                rgb="RGB R23 G46 B255"
                bg={BLUE} textColor={WHITE}
              />
              <ColorSwatch
                letter="B" num="02" label="Secondary"
                hex="FFFFFF"
                cmyk="CMYK C0 M0 Y0 K0"
                rgb="RGB R255 G255 B255"
                bg={WHITE} textColor={BLACK}
              />
              <ColorSwatch
                letter="C" num="03" label="Gray Mid"
                hex="676767"
                cmyk="CMYK C58 M58 Y51 K20"
                rgb="RGB R103 G103 B103"
                bg={GRAY1} textColor={WHITE}
              />
              <ColorSwatch
                letter="D" num="04" label="Gray Dark"
                hex="353535"
                cmyk="CMYK C67 M63 Y62 K57"
                rgb="RGB R53 G53 B53"
                bg={GRAY2} textColor={WHITE}
              />
              <ColorSwatch
                letter="E" num="05" label="Black"
                hex="000000"
                cmyk="CMYK C72 M68 Y67 K88"
                rgb="RGB R0 G0 B0"
                bg="#111" textColor={WHITE}
              />
            </div>
          </ScrollSection>

          {/* 4.0 TYPOGRAPHY */}
          <ScrollSection index={3} setActive={setActive}>
            <PageHeader number="4.0" title="TYPOGRAPHY" />
            <FontCard
              num="1" name="PP Neue Machina" label="Primary Font"
              description="A contemporary grotesque typeface that blends mechanical precision with expressive character. Its slightly unconventional proportions and technical tone give it a strong, modern presence for bold headlines and brand moments."
            />
            <FontCard
              num="2" name="SF Mono" label="Secondary Font"
              description="A monospaced typeface designed for clarity and consistency in technical environments. Each character occupies the same width, creating an organized and structured rhythm ideal for data, labeling, and system-oriented information."
            />
            <FontCard
              num="3" name="Geist Sans" label="Tertiary Font"
              description="A modern sans-serif designed with simplicity and performance in mind. Clean structure and balanced proportions allow it to work comfortably across both digital interfaces and printed materials."
            />
          </ScrollSection>

          {/* 5.0 GRAPHIC ELEMENTS */}
          <ScrollSection index={4} setActive={setActive}>
            <PageHeader number="5.0" title="GRAPHIC ELEMENTS" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: GRAY2 }}>
              <div style={{ background: BLACK, padding: 40 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>1 — PHOSPHOR REACT ICONS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                  {["⬡", "◈", "⬢", "◉", "⬟", "◎", "⬠", "◈"].map((ic, i) => (
                    <span key={i} style={{ fontSize: 32, color: BLUE }}>{ic}</span>
                  ))}
                </div>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, marginTop: 24 }}>
                  Phosphor is a flexible icon family for interfaces, diagrams, and presentations. Consistent stroke weight and clear metaphors align with the brand's technical clarity.
                </p>
              </div>
              <div style={{ background: BLACK, padding: 40 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>2 — ISOMETRIC ILLUSTRATION</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120 }}>
                  <svg viewBox="0 0 120 80" width="180" height="120">
                    <polygon points="60,5 110,32 110,58 60,85 10,58 10,32" fill="none" stroke={BLUE} strokeWidth="1.5"/>
                    <polygon points="60,20 95,38 95,58 60,75 25,58 25,38" fill="none" stroke={BLUE} strokeWidth="1" opacity="0.5"/>
                    <line x1="60" y1="5" x2="60" y2="85" stroke={BLUE} strokeWidth="0.5" opacity="0.3"/>
                    <line x1="10" y1="32" x2="110" y2="58" stroke={BLUE} strokeWidth="0.5" opacity="0.3"/>
                    <line x1="110" y1="32" x2="10" y2="58" stroke={BLUE} strokeWidth="0.5" opacity="0.3"/>
                  </svg>
                </div>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, marginTop: 24 }}>
                  Isometric illustration brings technical concepts to life with geometric precision. Used for conceptual diagrams representing network infrastructure, data flows, and open systems.
                </p>
              </div>
            </div>
          </ScrollSection>

          {/* Placeholder Sections */}
          <ScrollSection index={5} setActive={setActive}>
            <PageHeader number="6.0" title="PHOTOGRAPHY DIRECTION" />
            <div style={{ border: `1px solid ${GRAY2}`, padding: 64, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY2, letterSpacing: 2 }}>6.0 PHOTOGRAPHY DIRECTION — CONTENT TBD</p>
            </div>
          </ScrollSection>
          <ScrollSection index={6} setActive={setActive}>
            <PageHeader number="7.0" title="LAYOUTS" />
            <div style={{ border: `1px solid ${GRAY2}`, padding: 64, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY2, letterSpacing: 2 }}>7.0 LAYOUTS — CONTENT TBD</p>
            </div>
          </ScrollSection>
          <ScrollSection index={7} setActive={setActive}>
            <PageHeader number="8.0" title="APPLICATIONS" />
            <div style={{ border: `1px solid ${GRAY2}`, padding: 64, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY2, letterSpacing: 2 }}>8.0 APPLICATIONS — CONTENT TBD</p>
            </div>
          </ScrollSection>
        </main>
      </div>

      <style>{`
        :root {
          --on-logo-size: clamp(50px, 7vh, 120px);
        }

        /* Large Screen / iMac Optimizations only apply to wide, tall viewports */
        @media (min-width: 1800px) and (min-height: 900px) {
          :root {
            --on-logo-size: clamp(80px, 12vh, 180px);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        button:hover { color: white !important; }
      `}</style>
    </motion.div>
  );
};

export default OpenNetizenCaseStudy;
