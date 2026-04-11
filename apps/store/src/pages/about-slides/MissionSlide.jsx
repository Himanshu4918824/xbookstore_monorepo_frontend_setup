import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';

export function MissionSlide() {
    return (
        <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
                {/* Placeholder for a dynamic brand element, like your 3D logo */}
                <Box sx={{ width: '100%', height: '300px', backgroundColor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Typography>Brand Image/Logo Placeholder</Typography>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
                <Paper elevation={6} sx={{
                    p: { xs: 2, md: 4 }, backgroundColor: "#5D4037",
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
                    backgroundSize: "200px 200px, 300px 300px, cover" }}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>About Xoffencer</Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                        Your Gateway to New Worlds and Timeless Stories.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Welcome to the Xoffencer International Book Publication House. Our mission is to discover and champion both new and established voices in the literary world. We believe a great book is a conversation, and our goal is to publish works that inspire, challenge, and entertain.
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}