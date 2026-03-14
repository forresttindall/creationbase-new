import React from 'react';
import { motion } from 'framer-motion';

const BoiseAnalogClubCaseStudy = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        padding: 'var(--spacing-xxl) var(--spacing-md)',
        background: '#fff',
        color: '#000',
        minHeight: '100vh'
      }}
    >
      <button 
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase',
          cursor: 'pointer',
          marginBottom: 'var(--spacing-xl)',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}
      >
        [ BACK TO CASE STUDIES ]
      </button>

      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid #000' }}>
        <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
          CASE STUDY
        </h2>
        <span className="small-text">Index (04.A)</span>
      </div>

      {/* Top Row: Title/Intro + 2x2 Info Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        
        {/* Left: Title & Intro */}
        <div>
          <h3 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'var(--fs-xxl)', 
            lineHeight: 0.9,
            marginBottom: 'var(--spacing-md)',
            textTransform: 'uppercase'
          }}>
            Boise Analog Club
          </h3>
          <p className="small-text" style={{ maxWidth: '90%' }}>
            A community for film photography enthusiasts in Boise. Forrest Tindall led a retro redesign of the brand identity inspired by an iconic camera brand, delivering a cohesive visual system and supporting assets.
          </p>
        </div>

        {/* Right: 2x2 Info Grid */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div style={{ borderTop: '1px solid #000', paddingTop: 'var(--spacing-sm)' }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', marginBottom: 'var(--spacing-sm)' }}>The Problem</h4>
            <p className="small-text">Boise Analog Club needed a refreshed identity that reflected film photography roots and felt timeless, while supporting community events.</p>
          </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: 'var(--spacing-sm)' }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', marginBottom: 'var(--spacing-sm)' }}>The Solution</h4>
            <p className="small-text">Forrest Tindall delivered a retro brand redesign inspired by an iconic camera brand, with crisp typography and a badge‑style mark.</p>
          </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: 'var(--spacing-sm)' }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', marginBottom: 'var(--spacing-sm)' }}>Deliverables</h4>
              <ul className="small-text" style={{ listStyle: 'none', padding: 0 }}>
                <li>+ Full brand identity rebrand</li>
                <li>+ Logo</li>
                <li>+ Event flyer designs</li>
                <li>+ Infographic social media assets</li>
              </ul>
           </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: 'var(--spacing-sm)' }}>
             <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', marginBottom: 'var(--spacing-sm)' }}>Role & Tools</h4>
             <p className="small-text">
               Brand identity, logo creation, web mockups, and community assets. Used Figma, Affinity, React, Illustrator, Procreate.
             </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: 1x3 Image Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }}>
        <div style={{ border: '1px solid #000', aspectRatio: '3/4', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img src="/images/analog2.png" alt="Boise Analog Club Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ border: '1px solid #000', aspectRatio: '3/4', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img src="/images/BAC january.png" alt="Flyer Asset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ border: '1px solid #000', aspectRatio: '3/4', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img src="/images/bac.png" alt="Social Assets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </motion.div>
  );
};

export default BoiseAnalogClubCaseStudy;
