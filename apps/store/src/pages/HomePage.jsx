import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import { HeroSlide } from './home-slides/HeroSlide';
import { FeaturedBooksSlide } from './home-slides/FeaturedBooksSlide';
import { SpotlightSlide } from './home-slides/SpotlightSlide';
import { BestSellersSlide } from './home-slides/BestSellersSlide';
import { PartnersSlide } from './home-slides/PartnersSlide';
import HomeTabNavigation from '../components/ui/HomeTabNavigation';
import { useEffect } from 'react';

// --- MOCK DATA ---
const mockHomepageData = {
  featuredBooks: [ { id: 1, title: 'The Silent Observer', imageUrl: 'https://placehold.co/300x400/162735/BDC1C8?text=Featured+1' }, { id: 2, title: 'Echoes of Eternity', imageUrl: 'https://placehold.co/300x400/406E86/FFFFFF?text=Featured+2' }, { id: 3, title: 'Whispers in the Void', imageUrl: 'https://placehold.co/300x400/94B3CA/162735?text=Featured+3' }, { id: 4, title: 'City of Shifting Sands', imageUrl: 'https://placehold.co/300x400/900C3F/FFFFFF?text=Featured+4' }, { id: 5, title: 'The Last Cipher', imageUrl: 'https://placehold.co/300x400/581845/FFFFFF?text=Featured+5' }, { id: 11, title: 'Another Tale', imageUrl: 'https://placehold.co/300x400/1ABC9C/FFFFFF?text=Featured+6' }, ],
  bestSellingBooks: [ { id: 6, title: 'Aria of the Forgotten', imageUrl: 'https://placehold.co/300x400/F39C12/FFFFFF?text=Bestseller+1' }, { id: 7, title: 'Chronicles of the Sunstone', imageUrl: 'https://placehold.co/300x400/2ECC71/FFFFFF?text=Bestseller+2' }, { id: 8, title: 'The Gilded Cage', imageUrl: 'https://placehold.co/300x400/E74C3C/FFFFFF?text=Bestseller+3' }, { id: 9, title: 'River of Lost Souls', imageUrl: 'https://placehold.co/300x400/3498DB/FFFFFF?text=Bestseller+4' }, ],
  bookOfTheMonth: { id: 1, title: 'The Silent Observer', imageUrl: 'https://placehold.co/400x600/162735/BDC1C8?text=Book+of+the+Month' },
  authorOfTheMonth: { id: 1, firstName: 'Elena', lastName: 'Rodriguez', designation: 'Lead Novelist', imageUrl: 'https://placehold.co/250/FFC300/808080?text=E.R' },
};
// --- END MOCK DATA ---

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100vw' : '-100vw', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100vw' : '-100vw', opacity: 0 }),
};

function HomePage() {

  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(false);

  // Prevent the browser's page scroll while HomePage is mounted so the
  // footer cannot be revealed by scrolling. Restore previous value on unmount.
  useEffect(() => {
    const previous = document.body.style.overflowY;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous || ''; };
  }, []);

  // slide list for rendering
  const slides = [
    { component: <HeroSlide key="hero" />, hasPadding: false },
    { component: <SpotlightSlide key="spotlight" book={mockHomepageData.bookOfTheMonth} author={mockHomepageData.authorOfTheMonth} />, hasPadding: true },
    { component: <FeaturedBooksSlide key="featured" books={mockHomepageData.featuredBooks} />, hasPadding: true },
    { component: <BestSellersSlide key="bestsellers" books={mockHomepageData.bestSellingBooks} />, hasPadding: true },
    { component: <PartnersSlide key="partners" />, hasPadding: true },
  ];

  const setSlide = (newSlide) => {
    if (newSlide < 0 || newSlide >= slides.length) return;
    const newDirection = newSlide > activeSlide ? 1 : -1;
    setDirection(newDirection);
    setActiveSlide(newSlide);
  };

  // wheel handler for desktop scroll navigation
  const handleWheel = (e) => {
    if (scrollLocked) return;
    if (e.deltaY > 20) {
      setScrollLocked(true);
      setSlide(activeSlide + 1);
    } else if (e.deltaY < -20) {
      setScrollLocked(true);
      setSlide(activeSlide - 1);
    }
    // unlock after animation duration (~500ms)
    if (!scrollLocked) {
      setTimeout(() => setScrollLocked(false), 600);
    }
  };

  return (
    <>
      <HomeTabNavigation activeSlide={activeSlide} setActiveSlide={setSlide} />
      <Container
        maxWidth={false}
        disableGutters
        onWheel={handleWheel}
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              width: '100%',
              padding: slides[activeSlide].hasPadding ? '0 5%' : '0',
            }}
          >
            {/* --- THIS IS THE FIX --- */}
            {/* We render the .component property from our slide object */}
            {slides[activeSlide].component}
            {/* --- END OF FIX --- */}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
}

export default HomePage;