import React from 'react';
import { Box } from '@mui/material';
import ParticipantsCarousel from '../../components/book/ParticipantsCarousel';

export function ParticipantsSlide({ participants }) {
    return (
        <Box sx={{ width: '100%' }}>
            <ParticipantsCarousel participants={participants} />
        </Box>
    );
}