import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import BookCard from '../../components/book/BookCard';
import AuthorCard from '../../components/author/AuthorCard';

export function SpotlightSlide({ book, author }) {
    return (
        <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{
                    mb: 2, fontWeight: 'bold',
                    color: '#F3EDE6',
                }}>Book of the Month</Typography>
                <Box sx={{ maxWidth: '300px', mx: 'auto' }}><BookCard book={book} /></Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#F3EDE6', }}>Author of the Month</Typography>
                <Box sx={{ maxWidth: '300px', mx: 'auto' }}><AuthorCard author={author} /></Box>
            </Grid>
        </Grid>
    );
}