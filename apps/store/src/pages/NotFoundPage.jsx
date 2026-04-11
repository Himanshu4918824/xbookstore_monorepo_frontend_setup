import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFoundPage() {
  return (
    <Container
      sx={{
        height: 'calc(100vh - 64px - 75px)', // Fill available vertical space
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" color="text.secondary" sx={{ my: 2 }}>
          Page Not Found
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button component={Link} to="/" variant="contained" size="large">
          Go to Homepage
        </Button>
      </motion.div>
    </Container>
  );
}

export default NotFoundPage;