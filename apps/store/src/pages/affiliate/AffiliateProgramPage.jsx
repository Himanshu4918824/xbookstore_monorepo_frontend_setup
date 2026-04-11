import React from 'react';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import PaidIcon from '@mui/icons-material/Paid';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

function AffiliateProgramPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, backgroundColor: 'background.paper', backdropFilter: 'blur(10px)', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Join Our Affiliate Program
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          Partner with Xoffencer and earn commissions by promoting our collection of unique and captivating books.
        </Typography>
        <Button component={Link} to="/affiliate/register" variant="contained" size="large">
          Become an Affiliate Now
        </Button>
      </Paper>

      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={12} md={4}>
            <PaidIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold' }}>Competitive Commissions</Typography>
            <Typography>Earn a generous commission on every sale you refer. The more you sell, the more you earn with our tiered commission structure.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TrackChangesIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold' }}>Real-Time Tracking</Typography>
            <Typography>Our powerful affiliate dashboard provides real-time tracking of your clicks, sales, and commissions. You'll always know how your campaigns are performing.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold' }}>Dedicated Support</Typography>
            <Typography>You'll have access to our dedicated affiliate support team to help you with any questions and to provide you with the creative assets you need to succeed.</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AffiliateProgramPage;