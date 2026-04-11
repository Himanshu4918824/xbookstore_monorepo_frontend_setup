import React from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function SlideNavigation({ onNext, onPrev, isPrevDisabled, isNextDisabled }) {
  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      transform: 'translateY(-50%)',
      zIndex: 10, // Ensure buttons are on top
      pointerEvents: 'none', // Allow clicks to pass through the container
    }}>
      <IconButton
        onClick={onPrev}
        disabled={isPrevDisabled}
        sx={{ pointerEvents: 'auto', ml: -2, backgroundColor: 'rgba(0,0,0,0.3)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' } }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        onClick={onNext}
        disabled={isNextDisabled}
        sx={{ pointerEvents: 'auto', mr: -2, backgroundColor: 'rgba(0,0,0,0.3)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' } }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}
export default SlideNavigation;