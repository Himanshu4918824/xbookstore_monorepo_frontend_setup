import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';

export function LocationsSlide() {
    return (
        <Grid container spacing={4} alignItems="stretch">
            <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: '100%', minHeight: '400px', backgroundColor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography>Google Map Embed Placeholder</Typography>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={6} sx={{
                    p: { xs: 2, md: 4 },
                    backgroundColor: "#5D4037",
                    backgroundImage: `
          repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.08) 0px,
            rgba(0, 0, 0, 0.08) 1px,
            transparent 1px,
            transparent 4px
          ),
          repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(0, 0, 0, 0.05) 3px,
            rgba(255, 255, 255, 0.02) 6px
          ),
          linear-gradient(
            135deg,
            #4E342E,
            #5D4037,
            #6D4C41,
            #4E342E
          )
        `,
                    backgroundBlendMode: "overlay, multiply, normal",
                    backgroundSize: "200px 200px, 300px 300px, cover", height: '100%'
                }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Our Offices</Typography>
                    <Typography sx={{ mt: 2, fontWeight: 'medium' }}>India Office</Typography>
                    <Typography color="text.secondary">123 Bookworm Avenue, Reader's City, New Delhi, India 110001</Typography>
                    <Typography sx={{ mt: 2, fontWeight: 'medium' }}>International Office</Typography>
                    <Typography color="text.secondary">456 Global Avenue, London, UK SW1A 0AA</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}