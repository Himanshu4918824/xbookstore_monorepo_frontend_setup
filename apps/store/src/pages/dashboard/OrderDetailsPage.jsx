import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, Paper, Grid, Button, Divider, Breadcrumbs, Link as MuiLink, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// We need the same mock data here to find the correct order
const mockOrders = [
  { id: 'OD11235813', date: '11 August 2025', orderNumber: '403-8587807-0483514', total: 361.00, status: 'Delivered', statusDate: '16 August', items: [{ id: 1, title: 'RAHASYA (Hindi edition of The Secret)', imageUrl: 'https://placehold.co/100x150', price: 321.00, soldBy: 'Repro Books-On-Demand' }], tracking: { provider: 'Delhivery', id: 'DEL123456789' }, shipTo: 'Satyam soni\n804, MIG-9, AWASH COLONY...\n474002\nIndia', paymentMethod: 'BHIM UPI' },
  // ... add other detailed mock orders if you want to test them
];


function OrderDetailsPage() {
  const { orderId } = useParams();
  const order = mockOrders.find(o => o.id === orderId);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => { setAnchorEl(event.currentTarget); };
  const handleMenuClose = () => { setAnchorEl(null); };

  if (!order) {
    return <Typography variant="h5">Order not found.</Typography>;
  }

  const orderItem = order.items[0]; // For this demo, we'll just show the first item

  return (
    <Box>
        {/* Breadcrumb Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Breadcrumbs sx={{ mb: {xs: 2, md: 0} }}>
                <MuiLink component={Link} to="/dashboard/orders">Your Orders</MuiLink>
                <Typography color="text.primary">Order Details</Typography>
            </Breadcrumbs>
            {/* --- NEW: INVOICE DROPDOWN BUTTON --- */}
            <Box>
                <Button variant="outlined" onClick={handleMenuClick}>
                    Invoice
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem component={Link} to={`/dashboard/orders/${orderId}/invoice`} onClick={handleMenuClose}>
                        View Invoice (Web)
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>Download Invoice (PDF)</MenuItem>
                </Menu>
            </Box>
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>Order Details</Typography>
        <Typography variant="body2">Order placed {order.date} | Order number {order.orderNumber}</Typography>

        {/* Main Details Box */}
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}><Typography sx={{ fontWeight: 'bold' }}>Ship to</Typography><Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{order.shipTo}</Typography></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><Typography sx={{ fontWeight: 'bold' }}>Payment Methods</Typography><Typography color="text.secondary">{order.paymentMethod}</Typography></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><Typography sx={{ fontWeight: 'bold' }}>Order Summary</Typography> ... </Grid>
            </Grid>
        </Paper>

        {/* Item Details Box */}
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{order.status} {order.statusDate}</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* Item Image & Info */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <img src={orderItem.imageUrl} alt={orderItem.title} style={{ width: '80px', height: 'auto' }} />
                        <Box>
                            <Typography sx={{ fontWeight: 'medium' }}>{orderItem.title}</Typography>
                            <Typography variant="body2" color="text.secondary">Sold by: {orderItem.soldBy}</Typography>
                            <Typography variant="body2" color="text.secondary">Return and replacement windows have closed</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>₹{orderItem.price.toFixed(2)}</Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                <Button variant="contained" size="small" sx={{backgroundColor: '#FFD814', color: 'black', '&:hover': {backgroundColor: '#F7CA00'}}}>Buy it again</Button>
                                <Button variant="outlined" size="small">View your item</Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                {/* Action Buttons */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button component={Link} to={`/dashboard/orders/${order.id}/track`} variant="outlined" fullWidth disabled={!order.tracking}>
                            Track package
                        </Button>
                        <Button variant="outlined" fullWidth>Ask Product Question</Button>
                        <Button variant="outlined" fullWidth>Leave seller feedback</Button>
                        <Button variant="outlined" fullWidth>Write a product review</Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    </Box>
  );
}

export default OrderDetailsPage;