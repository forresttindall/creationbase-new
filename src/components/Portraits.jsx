import { useEffect } from 'react';
import { motion } from 'framer-motion';

const portraitImages = [
  '/images/_DSC2145.jpg',
  '/images/_DSC2146.jpg',
  '/images/_DSC2148.jpg',
  '/images/_DSC2151.jpg',
  '/images/_DSC2201.JPG',
  '/images/P2200860.JPG',
  '/images/P2200865.JPG',
  '/images/P2200886.JPG',
  '/images/P2200894.JPG',
  '/images/P2200926.JPG',
  '/images/P2200941.JPG',
  '/images/P2200967.JPG',
  '/images/P2200984.JPG',
  '/images/P2201073.JPG',
  '/images/P2201089.JPG',
  '/images/P2201097.JPG',
  '/images/P2201196.JPG',
  '/images/P2201197.JPG',
  '/images/P2201212.JPG',
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
      style={{
        padding: 0,
        background: '#fff',
        color: '#000',
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
