import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export function PublicationCertsSlide() {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Paper elevation={6} sx={{ p: 4, backgroundColor: 'background.paper' }}>
                <Typography variant="h2">Certificates</Typography>
                <Typography>Publication certificates will be shown here in a carousel.</Typography>
            </Paper>
        </Box>
    );
}