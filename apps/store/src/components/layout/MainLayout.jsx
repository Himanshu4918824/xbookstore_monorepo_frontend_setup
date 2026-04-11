import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook

function MainLayout({ children }) {
  const location = useLocation(); // Get the current URL information

  // --- THIS IS THE FIX ---
  // We create a list of all the pages that should be full-width, edge-to-edge.
  const fullWidthPages = [
    '/', // The Homepage
    '/contact',
    '/about',
    // We also check if the path STARTS WITH these, to include detail pages
    '/books/', 
    '/authors/',
    '/publications/',
  ];

  // We check if the current page's path is one of our full-width pages.
  const isFullWidthPage = fullWidthPages.some(path => location.pathname.startsWith(path));
  // --- END OF FIX ---

  return (
    // The main structure is the same
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* 
        This is the main content area.
        Its padding is now CONDITIONAL. If it's a full-width page, padding is 0.
        Otherwise, it's the default padding of 3.
      */}
      <Box component="main" sx={{ flexGrow: 1, p: isFullWidthPage ? 0 : 3 }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}

export default MainLayout;