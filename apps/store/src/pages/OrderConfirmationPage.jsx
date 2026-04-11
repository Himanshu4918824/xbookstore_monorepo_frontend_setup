import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function OrderConfirmationPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Box sx={{ p: 4, backgroundColor: 'background.paper', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Thank You!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Your order has been placed successfully.
        </Typography>
        <Button component={Link} to="/store" variant="contained">
          Continue Shopping
        </Button>
        <Button component={Link} to="/dashboard/orders" variant="outlined" sx={{ ml: 2 }}>
          View Order History
        </Button>
      </Box>
    </Container>
  );
}

export default OrderConfirmationPage;