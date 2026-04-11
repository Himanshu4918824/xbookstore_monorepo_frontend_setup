import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', height: '100%' }}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ duration: 0.2 }}
        style={{ height: '100%' }}
      >
        <Card sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}>
          <CardMedia
            component="img"
            sx={{ height: 280, objectFit: 'cover' }}
            image={book.imageUrl}
            alt={book.title}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              {book.title}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default BookCard;