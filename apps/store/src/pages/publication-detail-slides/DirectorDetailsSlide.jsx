import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';

export function DirectorDetailsSlide({ director }) {
    return (
        <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
                <Box component="img" sx={{ width: '100%', maxWidth: '300px', borderRadius: '50%', boxShadow: 6, mx: 'auto' }} src={director.profilePic} alt={director.name} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper' }}>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>{director.name}</Typography>
                    <Typography variant="h5" color="text.secondary">{director.designation}</Typography>
                    <Typography sx={{ mt: 2 }}>{director.organization}</Typography>
                    <Typography>Email: {director.email}</Typography>
                    <Typography>Phone: {director.contact}</Typography>
                    <Typography>Address: {director.address}</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}