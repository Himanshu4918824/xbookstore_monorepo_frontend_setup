import React from 'react';
import { Box } from '@mui/material';
import BookCarousel from '../../components/book/BookCarousel';

// This component receives a list of your best-selling books as a prop
export function BestSellersSlide({ books }) {
  return (
    <Box sx={{ width: '100%', color: '#F3EDE6', }}>
      {/* 
        We are reusing our powerful BookCarousel component.
        It will automatically handle the layout (centering or sliding)
        based on the number of books provided.
      */}
      <BookCarousel title="Best-Selling Books" books={books} />
    </Box>
  );
}