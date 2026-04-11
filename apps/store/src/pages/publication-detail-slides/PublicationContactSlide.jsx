import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';

export function PublicationContactSlide({ publication }) {
    return (
        <Grid container spacing={4} alignItems="stretch">
            <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: '100%', minHeight: '400px', backgroundColor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography>Google Map Embed Placeholder</Typography>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper', height: '100%' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Contact Information</Typography>
                    <Typography sx={{ mt: 2, fontWeight: 'medium' }}>India Office</Typography>
                    <Typography color="text.secondary">{publication.contact.indiaAddress}</Typography>
                    <Typography sx={{ mt: 2, fontWeight: 'medium' }}>International Office</Typography>
                    <Typography color="text.secondary">{publication.contact.internationalAddress}</Typography>
                    <Typography sx={{ mt: 2, fontWeight: 'medium' }}>Phone:</Typography>
                    <Typography color="text.secondary">{publication.contact.phone}</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
