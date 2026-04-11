import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import our new slide components and navigation
import { MissionSlide } from './about-slides/MissionSlide';
import { HistorySlide } from './about-slides/HistorySlide';
import { TeamSlide } from './about-slides/TeamSlide';
import AboutTabNavigation from '../components/ui/AboutTabNavigation';
import { useEffect } from 'react';

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100vw' : '-100vw', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100vw' : '-100vw', opacity: 0 }),
};

function AboutPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(false);

 useEffect(() => {
    const previous = document.body.style.overflowY;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous || ''; };
  }, []);

  const handleWheel = (e) => {
    if (scrollLocked) return;
    if (e.deltaY > 50) {
      setScrollLocked(true);
      setSlide(activeSlide + 1);
    } else if (e.deltaY < -50) {
      setScrollLocked(true);
      setSlide(activeSlide - 1);
    }
    // unlock after animation duration (~500ms)
    if (!scrollLocked) {
      setTimeout(() => setScrollLocked(false), 600);
    }
  };

  const slides = [
    <MissionSlide key="mission" />,
    <HistorySlide key="history" />,
    <TeamSlide key="team" />,
  ];

  const setSlide = (newSlide) => {
    // Guard against out-of-range indices which cause `slides[activeSlide]` to be undefined
    if (newSlide < 0 || newSlide >= slides.length) return;
    const newDirection = newSlide > activeSlide ? 1 : -1;
    setDirection(newDirection);
    setActiveSlide(newSlide);
  };

  return (
    <>
      <AboutTabNavigation activeSlide={activeSlide} setActiveSlide={setSlide} />
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
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            style={{
              position: 'absolute',
              width: '100%',
              padding: '0 5%',
            }}
          >
            {slides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
}

export default AboutPage;