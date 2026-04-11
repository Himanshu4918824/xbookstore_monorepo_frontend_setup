import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

// A helper component for displaying stats
const StatCard = ({ title, value }) => (
  <Paper sx={{ p: 2, textAlign: 'center', height: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }}>
    <Typography variant="h6" color="text.secondary">{title}</Typography>
    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
  </Paper>
);

function AffiliateOverviewPage() {
  const affiliateLink = "https://xoffencerbooks.com/?ref=AFF123";
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Your Referral Link</Typography>
      <Paper sx={{ p: 2, mb: 4, backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Typography sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{affiliateLink}</Typography>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Clicks" value="1,450" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Sales" value="72" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Conversion Rate" value="4.9%" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Commission Earned" value="₹8,920" /></Grid>
      </Grid>
    </>
  );
}
export default AffiliateOverviewPage;