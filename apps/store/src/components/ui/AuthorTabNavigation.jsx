import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { motion } from 'framer-motion';

const slideTabs = [
  { label: 'Author Profile', icon: <AccountCircleIcon /> },
  { label: 'Biography', icon: <FingerprintIcon /> },
  { label: 'Published Works', icon: <MenuBookIcon /> },
  { label: 'Professional History', icon: <WorkHistoryIcon /> },
  { label: 'Certificates', icon: <WorkspacePremiumIcon /> },
];

function AuthorTabNavigation({ activeSlide, setActiveSlide }) {
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
export default AuthorTabNavigation;