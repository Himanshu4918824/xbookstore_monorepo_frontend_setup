import React from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

// Mock data for past orders
const mockOrders = [
  { 
    id: 'OD11235813', 
    date: '2023-10-26', 
    total: 450.50, 
    status: 'Delivered',
    items: [{ title: 'The Silent Observer', qty: 1 }],
    tracking: { provider: 'Delhivery', id: 'DEL123456789' } 
  },
  { 
    id: 'OD21348921', 
    date: '2023-09-15', 
    total: 1299.00, 
    status: 'Shipped',
    items: [{ title: 'Echoes of Eternity', qty: 1 }, { title: 'City of Shifting Sands', qty: 1 }],
    tracking: { provider: 'Delhivery', id: 'DEL987654321' } 
  },
  { 
    id: 'OD34551442', 
    date: '2023-08-01', 
    total: 799.75, 
    status: 'Processing',
    items: [{ title: 'The Gilded Cage', qty: 1 }],
    tracking: null 
  },
];



// Helper to get a color for the status chip
const getStatusChipColor = (status) => {
    switch (status.toLowerCase()) {
        case 'delivered': return 'success';
        case 'shipped': return 'info';
        case 'processing': return 'warning';
        case 'cancelled': return 'error';
        default: return 'default';
    }
};




function OrderHistoryPage() {
  const handleTrackOrder = (trackingId) => {
    // In a real app, this would open the Delhivery tracking page
    window.open(`https://www.delhivery.com/track/package/${trackingId}`, '_blank');
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Your Orders</Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            {/* ... */}
          </TableHead>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                {/* --- THIS IS THE FIX --- */}
                <TableCell sx={{ fontWeight: 'medium' }}>
                  <MuiLink component={Link} to={`/dashboard/orders/${order.id}`}>
                    {order.id}
                  </MuiLink>
                </TableCell>
                {/* --- END OF FIX --- */}
                <TableCell>{order.date}</TableCell>
                <TableCell><Chip label={order.status} color={getStatusChipColor(order.status)} size="small" /></TableCell>
                <TableCell>₹{order.total.toFixed(2)}</TableCell>
                <TableCell align="right">
                  {/* We will move the main buttons to the detail page */}
                  <Button component={Link} to={`/dashboard/orders/${order.id}`} size="small">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default OrderHistoryPage;