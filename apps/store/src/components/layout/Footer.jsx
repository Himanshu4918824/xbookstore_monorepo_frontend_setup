import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    // Box is a general-purpose container component from MUI.
    <Box 
      component="footer" 
      sx={{
        py: 3, // 'py' means padding on the y-axis (top and bottom)
        px: 2, // 'px' means padding on the x-axis (left and right)
        mt: 'auto', // 'mt' means margin-top. 'auto' pushes it to the bottom.
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} Xoffencer International Book Publication House
      </Typography>

      <MuiLink component={Link} to="/affiliate" variant="body2" color="inherit">
        Become an Affiliate
      </MuiLink>
    </Box>
  );
}

export default Footer;