import React from 'react';
import { Box } from '@mui/material';
import BookCarousel from '../../components/book/BookCarousel';

export function AuthorWorksSlide({ author, books }) {
  return (
    <Box sx={{ width: '100%' }}>
        <BookCarousel title={`Published Works by ${author.firstName} ${author.lastName}`} books={books} />
    </Box>
  );
}