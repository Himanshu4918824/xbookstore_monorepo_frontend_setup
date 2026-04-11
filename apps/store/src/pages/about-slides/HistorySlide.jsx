import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export function HistorySlide() {
    return (
        <Box sx={{ px: { xs: 0, md: '15%' } }}>
            <Paper elevation={6} sx={{
                p: 4, backgroundColor: "#5D4037",
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
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>Our History</Typography>
                <Typography paragraph>Founded in 2025, Xoffencer began with a simple idea: to create a publishing house for the modern era...</Typography>
                <Typography>More details about the company's journey and milestones will go here.</Typography>
            </Paper>
        </Box>
    );
}