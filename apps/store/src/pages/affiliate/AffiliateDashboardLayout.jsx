import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Paper, useTheme } from '@mui/material';
import { useAuth } from '../../context/useAuth';
import FrostedGlassPanel from '../../components/ui/FrostedGlassPanel';

function AffiliateDashboardLayout() {
  const { user } = useAuth();
  const theme = useTheme();

  // Style for the active sidebar link
  const activeLinkStyle = {
    backgroundColor: theme.palette.action.selected,
    borderRight: `3px solid ${theme.palette.primary.main}`,
    fontWeight: 'bold',
  };

  return (
    // This main container takes up the full available height
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      minHeight: 'calc(100vh - 64px - 75px)', // Full height minus Navbar and Footer
    }}>
      {/* Column 1: Sidebar Navigation */}
      <Paper 
        elevation={3}
        sx={{
          width: { xs: '100%', md: '280px' },
          flexShrink: 0,
          backgroundColor: 'background.paper',
          borderRight: { md: 1 },
          borderColor: 'divider'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Welcome, {user?.firstName || 'Affiliate'}!
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/affiliate/dashboard/overview" style={({isActive}) => isActive ? activeLinkStyle : {}}>
              <ListItemText primary="Overview" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/affiliate/dashboard/sales" style={({isActive}) => isActive ? activeLinkStyle : {}}>
              <ListItemText primary="Sales History" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/affiliate/dashboard/wallet" style={({isActive}) => isActive ? activeLinkStyle : {}}>
              <ListItemText primary="My Wallet" />
            </ListItemButton>
          </ListItem>
          {/* You can add more links here for Payouts, Settings, etc. */}
        </List>
      </Paper>

      {/* Column 2: Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          overflowY: 'auto'
        }}
      >
        {/* We wrap the Outlet in our FrostedGlassPanel to give all dashboard pages a readable background */}
        <FrostedGlassPanel>
          <Outlet />
        </FrostedGlassPanel>
      </Box>
    </Box>
  );
}

export default AffiliateDashboardLayout;