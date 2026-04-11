import React from 'react';
import { Box } from '@mui/material';
import BookCarousel from '../../components/book/BookCarousel';

export function FeaturedBooksSlide({ books }) {
    return <Box sx={{ width: '100%', color: '#F3EDE6', }}><BookCarousel title="Featured Books" books={books} /></Box>;
}