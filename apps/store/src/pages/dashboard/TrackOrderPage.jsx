import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, Paper, Stepper, Step, StepLabel, StepContent, Breadcrumbs, Link as MuiLink } from '@mui/material';

// Mock tracking data for a specific order
const mockTrackingHistory = {
    id: 'DEL123456789',
    status: 'Delivered',
    steps: [
        { label: 'Delivered', description: 'Package was handed to resident.', date: '16 August 2025' },
        { label: 'Out for Delivery', description: 'Your package is on its way to you.', date: '16 August 2025' },
        { label: 'Arrived at Delhivery Facility', description: 'MAHALGAON, MADHYA PRADESH', date: '15 August 2025' },
        { label: 'Shipped', description: 'Package has been shipped from the seller.', date: '12 August 2025' },
        { label: 'Order Placed', description: 'We have received your order.', date: '11 August 2025' },
    ]
};


function TrackOrderPage() {
  const { trackingId } = useParams(); // Get tracking ID from the URL
  const trackingInfo = mockTrackingHistory; // Use mock data for now

  return (
    <Box>
        <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink component={Link} to="/dashboard/orders">Your Orders</MuiLink>
            <MuiLink component={Link} to={`/dashboard/orders/OD11235813`}>Order Details</MuiLink>
            <Typography color="text.primary">Track Package</Typography>
        </Breadcrumbs>
        
        <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Tracking ID: {trackingId}</Typography>
            <Typography variant="h6" color="success.main" sx={{ mb: 3 }}>{trackingInfo.status}</Typography>
            
            {/* This Stepper component is perfect for showing tracking history */}
            <Stepper orientation="vertical" activeStep={0}>
                {trackingInfo.steps.map((step) => (
                    <Step key={step.label} active={true}>
                        <StepLabel>{step.label}</StepLabel>
                        <StepContent>
                            <Typography variant="body2">{step.description}</Typography>
                            <Typography variant="caption" color="text.secondary">{step.date}</Typography>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Paper>
    </Box>
  );
}

export default TrackOrderPage;