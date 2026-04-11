import React from 'react';
import { Typography, Paper } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Admin!
      </Typography>
      <Typography paragraph>
        Select a management option from the sidebar to get started.
      </Typography>
    </Paper>
  );
};

export default AdminDashboard;