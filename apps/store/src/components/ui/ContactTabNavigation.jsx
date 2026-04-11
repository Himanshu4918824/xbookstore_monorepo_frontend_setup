import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';

const slideTabs = [
  { label: 'General Inquiry', icon: <ContactMailIcon /> },
  { label: 'Publication Inquiry', icon: <DriveFileRenameOutlineIcon /> },
  { label: 'Our Locations', icon: <LocationOnIcon /> },
];

function ContactTabNavigation({ activeSlide, setActiveSlide }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Box sx={{ position: 'fixed', top: '90%', right: 0, transform: 'translateY(-50%)', zIndex: 1000 }}>
      <motion.div animate={{ width: isCollapsed ? 56 : 'auto' }}>
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', backgroundColor: 'background.paper', backdropFilter: 'blur(10px)', borderRadius: '16px 0 0 16px', boxShadow: 3 }}>
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          {!isCollapsed && (
            <Box sx={{ display: 'flex', pr: 2 }}>
              {slideTabs.map((tab, index) => (
                <Tooltip title={tab.label} key={tab.label} placement="top">
                  <IconButton onClick={() => setActiveSlide(index)} color={activeSlide === index ? 'primary' : 'default'}>{tab.icon}</IconButton>
                </Tooltip>
              ))}
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
export default ContactTabNavigation;