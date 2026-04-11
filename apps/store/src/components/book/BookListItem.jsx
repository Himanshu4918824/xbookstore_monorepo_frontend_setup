import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Rating, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

function BookListItem({ book }) {
  return (
    <Card sx={{ height: '100%', backgroundColor: 'background.paper', backdropFilter: 'blur(10px)' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid size={{ xs: 4, sm: 3 }}> {/* <-- UPDATED */}
          <CardMedia component={Link} to={`/books/${book.id}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} image={book.imageUrl} alt={book.title} />
        </Grid>
        <Grid size={{ xs: 8, sm: 9 }}> {/* <-- UPDATED */}
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', p: 2 }}>
            <Typography component={Link} to={`/books/${book.id}`} variant="h6" sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { textDecoration: 'underline' } }}>{book.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>by {book.author}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <Rating name="read-only" value={book.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>({book.reviews} reviews)</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 'auto' }}>₹{book.price}</Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
export default BookListItem;