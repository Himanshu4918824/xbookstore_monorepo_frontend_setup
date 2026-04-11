import React from 'react';
import { Card, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function PublicationCard({ publication }) {
  return (
    <Link to={`/publications/${publication.id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ duration: 0.2 }}
        style={{ height: '100%' }}
      >
        <Card sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2, // Add some padding
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}>
          <CardMedia
            component="img"
            sx={{
              width: '90%', // Logo won't touch the edges
              height: 'auto',
              objectFit: 'contain', // Ensure logo is not stretched
            }}
            image={publication.logoUrl}
            alt={publication.name}
          />
        </Card>
      </motion.div>
    </Link>
  );
}

export default PublicationCard;