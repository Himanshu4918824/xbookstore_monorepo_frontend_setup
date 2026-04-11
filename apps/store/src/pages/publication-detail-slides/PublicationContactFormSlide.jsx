import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

export function PublicationContactFormSlide({ publication }) {
    return (
        <Box sx={{ px: { xs: 0, md: '15%' } }}>
            <Paper elevation={6} sx={{ p: 4, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Contact {publication.name}</Typography>
                <Typography>For book publication inquiries, please fill out the form below.</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField label="Your Name" fullWidth required margin="normal" />
                    <TextField label="Your Email" type="email" fullWidth required margin="normal" />
                    <TextField label="Subject" fullWidth required margin="normal" />
                    <TextField label="Your Message" multiline rows={4} fullWidth required margin="normal" />
                    <Button variant="contained" sx={{ mt: 2 }}>Send Message</Button>
                </Box>
            </Paper>
        </Box>
    );
}