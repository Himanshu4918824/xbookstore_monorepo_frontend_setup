import React from 'react';
import { Grid, Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import PublicationLogo3D from '../../components/publication/PublicationLogo3D';

export function PublicationProfileSlide({ publication }) {
    return (
        <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}><PublicationLogo3D /></Grid>
            <Grid size={{ xs: 12, md: 7 }}>
                <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper' }}>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>{publication.name}</Typography>
                    <Typography variant="h5" color="text.secondary">{publication.nature}</Typography>
                    <Typography variant="body1" sx={{ my: 3 }}>{publication.about}</Typography>
                    <MuiLink href={`mailto:${publication.email}`} display="block">{publication.email}</MuiLink>
                    <MuiLink href={`//${publication.website}`} target="_blank" rel="noopener noreferrer">{publication.website}</MuiLink>
                </Paper>
            </Grid>
        </Grid>
    );
}