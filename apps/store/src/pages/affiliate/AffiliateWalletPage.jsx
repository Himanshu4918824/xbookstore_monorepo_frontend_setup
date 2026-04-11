import React from 'react';
import { Typography, Box, Button, Paper, Divider } from '@mui/material';

function AffiliateWalletPage() {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Your Wallet</Typography>
      <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" color="text.secondary">Current Balance</Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>₹5,450.00</Typography>
        <Divider sx={{ my: 2 }} />
        <Button variant="contained">Request Withdrawal</Button>
        <Typography variant="body2" sx={{ mt: 1 }}>Minimum withdrawal amount: ₹1000</Typography>
      </Paper>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Transaction History</Typography>
      {/* Transaction history table will be added here */}
    </>
  );
}
export default AffiliateWalletPage;