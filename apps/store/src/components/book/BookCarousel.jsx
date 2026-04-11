import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BookCard from './BookCard'; // We use our existing BookCard

const CARD_WIDTH = 220; // A fixed width for each card
const CARD_SPACING = 24; // Spacing between cards

function BookCarousel({ title, books }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const [maxVisible, setMaxVisible] = useState(6); // Default to 6, will be recalculated

  // This effect calculates how many cards can fit in the container
  useEffect(() => {
    const calculateMaxVisible = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // We calculate how many cards can fit, up to a maximum of 6.
        const howManyFit = Math.floor(containerWidth / (CARD_WIDTH + CARD_SPACING));
        setMaxVisible(Math.min(howManyFit, 6)); 
      }
    };
    calculateMaxVisible();
    window.addEventListener('resize', calculateMaxVisible);
    return () => window.removeEventListener('resize', calculateMaxVisible);
  }, []);
  
  if (!books || books.length === 0) {
    // You might want to show a message if there are no related books
    return (
         <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
            <Typography color="text.secondary">No related books found.</Typography>
         </Box>
    );
  }
  
  const isSlider = books.length > maxVisible; // Slider is active if we have more books than can be seen
  const maxIndex = Math.max(0, books.length - maxVisible);

  const handleNext = () => setIndex(prev => Math.min(prev + 1, maxIndex));
  const handlePrev = () => setIndex(prev => Math.max(prev - 1, 0));

  return (
    <Box sx={{ my: 4, position: 'relative' }}>
      {/* We only show the title if it's provided */}
      {title && (
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      )}

      <Box ref={containerRef} sx={{ overflow: 'hidden', position: 'relative', py: '10px', my: '-10px' }}>
        <motion.div
          style={{
            display: 'flex',
            gap: `${CARD_SPACING}px`,
            width: '100%',
            // This is the key: center the content if it's not a slider
            justifyContent: isSlider ? 'flex-start' : 'center',
          }}
          animate={{ x: `-${index * (CARD_WIDTH + CARD_SPACING)}px` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {books.map(book => (
            <Box key={book.id} py='10px' sx={{ flex: `0 0 ${CARD_WIDTH}px` }}>
              <BookCard book={book} />
            </Box>
          ))}
        </motion.div>
      </Box>
      
      <AnimatePresence>
        {isSlider && (
          <>
            {index > 0 && (
              <IconButton onClick={handlePrev} sx={{ position: 'absolute', top: '55%', left: -16, backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' }}}>
                <ArrowBackIosNewIcon />
              </IconButton>
            )}
            {index < maxIndex && (
               <IconButton onClick={handleNext} sx={{ position: 'absolute', top: '55%', right: -16, backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' }}}>
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default BookCarousel;