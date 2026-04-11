import React from 'react';
import { Box } from '@mui/material';
import BookCarousel from '../../components/book/BookCarousel';

export function PublicationWorksSlide({ publication, books }) {
  return (
    <Box sx={{ width: '100%' }}>
        <BookCarousel title={`Published Works from ${publication.name}`} books={books} />
    </Box>
  );
}