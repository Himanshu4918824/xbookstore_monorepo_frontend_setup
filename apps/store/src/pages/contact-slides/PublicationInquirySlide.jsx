import React from 'react';
import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';

export function PublicationInquirySlide() {
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
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>Publish With Us</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>Authors and agents are welcome to submit their manuscripts for consideration.</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField label="Author Name" fullWidth required /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField label="Book Title" fullWidth required /></Grid>
                        <Grid size={12}><TextField label="Genre" fullWidth required /></Grid>
                        <Grid size={12}><TextField label="Brief Synopsis" multiline rows={4} fullWidth required /></Grid>
                        {/* In a real app, you would have a file upload button here */}
                    </Grid>
                    <Button variant="contained" sx={{ mt: 2 }}>Submit Proposal</Button>
                </Box>
            </Paper>
        </Box>
    );
}