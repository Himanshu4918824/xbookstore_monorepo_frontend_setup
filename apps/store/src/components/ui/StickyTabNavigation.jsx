import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const slideTabs = [
  { label: 'Product Info', icon: <InfoIcon /> },
  { label: 'Authors & Editors', icon: <PeopleIcon /> },
  { label: 'Full Details', icon: <ListAltIcon /> },
  { label: 'Table of Contents', icon: <MenuBookIcon /> },
  { label: 'Certificates', icon: <WorkspacePremiumIcon /> },
];

function StickyTabNavigation({ activeSlide, setActiveSlide }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box sx={{ position: 'fixed', top: '90%', right: 0, transform: 'translateY(-50%)', zIndex: 1000 }}>
      <motion.div
        animate={{ width: isCollapsed ? 56 : 'auto' }}
      >
        {/* We wrap the content in a Box that can be styled with the sx prop */}
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.paper', // This will now correctly use the theme color
            backdropFilter: 'blur(10px)',      // Add the blur for a frosted glass feel
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
export default StickyTabNavigation;