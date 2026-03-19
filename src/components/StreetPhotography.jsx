import { useEffect } from 'react';
import { motion } from 'framer-motion';

const streetImages = [
  '/images/55E4EA24-2F4F-475B-900E-F28C87C97D57-labbet-app.JPG',
  '/images/E835B0D6-201F-4948-A6A3-E46DCF86E8EE-labbet-app.JPG',
  '/images/P2200839.JPG',
  '/images/P3061294.JPG',
  '/images/P3061303.JPG',
  '/images/P3061304.JPG',
  '/images/_DSC1892.JPG',
  '/images/_DSC1921.JPG',
  '/images/_DSC1924.JPG',
  '/images/_DSC2025-2.JPG',
  '/images/_DSC2048.JPG',
  '/images/_DSC2122-2.JPG',
  '/images/_DSC2123-2.JPG',
  '/images/IMG_4027-3.jpg',
  '/images/IMG_4146.jpg',
  '/images/IMG_8242.jpg',
  '/images/img20251108_19531420-2.jpg',
  '/images/img20251110_12523690-2.jpg',
  '/images/img20251118_16533191-2 2.jpg',
  '/images/img20251118_18322149-2.jpg',
  '/images/img20251125_18430948.JPG',
  '/images/img20251125_21591134.jpg',
  '/images/img20251209_14141383.JPG',
  '/images/img20251209_14161547.JPG',
  '/images/img20251209_14242178.JPG',
  '/images/img20260303_22201340.jpg',
  '/images/img20260303_22412412.jpg',
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
