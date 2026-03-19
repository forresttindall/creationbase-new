import { useEffect } from 'react';
import { motion } from 'framer-motion';

const streetImages = [
  '/images/55E4EA24-2F4F-475B-900E-F28C87C97D57-labbet-app.webp',
  '/images/E835B0D6-201F-4948-A6A3-E46DCF86E8EE-labbet-app.webp',
  '/images/P2200839.webp',
  '/images/P3061294.webp',
  '/images/P3061303.webp',
  '/images/P3061304.webp',
  '/images/_DSC1892.webp',
  '/images/_DSC1921.webp',
  '/images/_DSC1924.webp',
  '/images/_DSC2025-2.webp',
  '/images/_DSC2048.webp',
  '/images/_DSC2122-2.webp',
  '/images/_DSC2123-2.webp',
  '/images/IMG_4027-3.webp',
  '/images/IMG_4146.webp',
  '/images/IMG_8242.webp',
  '/images/img20251108_19531420-2.webp',
  '/images/img20251110_12523690-2.webp',
  '/images/img20251118_16533191-2 2.webp',
  '/images/img20251118_18322149-2.webp',
  '/images/img20251125_18430948.webp',
  '/images/img20251125_21591134.webp',
  '/images/img20251209_14141383.webp',
  '/images/img20251209_14161547.webp',
  '/images/img20251209_14242178.webp',
  '/images/img20260303_22201340.webp',
  '/images/img20260303_22412412.webp',
];

const StreetPhotography = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        padding: 0,
        background: '#fff',
        color: '#000',
        minHeight: '100vh',
      }}
    >
      <div className="full-bleed">
        <div className="mosaic-masonry mosaic-masonry--bw">
          {streetImages.map((src) => (
            <div className="mosaic-tile" key={src}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StreetPhotography;
