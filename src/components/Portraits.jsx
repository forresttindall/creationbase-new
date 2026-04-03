import { useEffect } from 'react';
import { motion } from 'framer-motion';

const portraitImages = [
  '/images/_DSC2145.webp',
  '/images/_DSC2146.webp',
  '/images/_DSC2148.webp',
  '/images/_DSC2151.webp',
  '/images/_DSC2201.webp',
  '/images/P2200860.webp',
  '/images/P2200865.webp',
  '/images/P2200886.webp',
  '/images/P2200894.webp',
  '/images/P2200926.webp',
  '/images/P2200941.webp',
  '/images/P2200967.webp',
  '/images/P2200984.webp',
  '/images/P2201073.webp',
  '/images/P2201089.webp',
  '/images/P2201097.webp',
  '/images/P2201196.webp',
  '/images/P2201197.webp',
  '/images/P2201212.webp',
];

const Portraits = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="dark"
      style={{
        padding: 0,
        background: '#0F0F0F',
        color: '#E2E2E0',
        minHeight: '100vh',
      }}
    >
      <div className="full-bleed">
        <div className="mosaic-masonry">
          {portraitImages.map((src) => (
            <div className="mosaic-tile" key={src}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Portraits;
