import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { motion } from 'framer-motion';

// This array defines the icons and tooltips for our 6 slides
const slideTabs = [
  { label: 'Publication Info', icon: <BusinessIcon /> },
  { label: 'Contact Info', icon: <ContactMailIcon /> },
  { label: 'Director Details', icon: <AccountCircleIcon /> },
  { label: 'Published Works', icon: <MenuBookIcon /> },
  { label: 'Our Authors', icon: <PeopleIcon /> },
  { label: 'Publish With Us', icon: <ConnectWithoutContactIcon /> },
];

function PublicationTabNavigation({ activeSlide, setActiveSlide }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box sx={{ position: 'fixed', top: '90%', right: 0, transform: 'translateY(-50%)', zIndex: 1000 }}>
      <motion.div
        animate={{ width: isCollapsed ? 56 : 'auto' }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px 0 0 16px',
            boxShadow: 3,
          }}
        >
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          
          {!isCollapsed && (
            <Box sx={{ display: 'flex', pr: 2 }}>
              {slideTabs.map((tab, index) => (
                <Tooltip title={tab.label} key={tab.label} placement="top">
                  <IconButton
                    onClick={() => setActiveSlide(index)}
                    color={activeSlide === index ? 'primary' : 'default'}
                  >
                    {tab.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}

export default PublicationTabNavigation;