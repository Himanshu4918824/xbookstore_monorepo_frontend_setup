import React from 'react';
import { Box } from '@mui/material';
import ParticipantsCarousel from '../../components/book/ParticipantsCarousel';

export function PublicationAuthorsSlide({ authors }) {
    return <Box sx={{ width: '100%' }}><ParticipantsCarousel participants={authors} /></Box>;
}