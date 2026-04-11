import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

// --- MOCK DATA ---
// In a real app, this array of logos would come from your API.
// We are using placeholders from a logo service.
const mockPartners = [
    { name: 'Research Partner A', logoUrl: 'https://logo.clearbit.com/google.com' },
    { name: 'Research Partner B', logoUrl: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Featured Partner C', logoUrl: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Research Partner D', logoUrl: 'https://logo.clearbit.com/meta.com' },
    { name: 'Featured Partner E', logoUrl: 'https://logo.clearbit.com/apple.com' },
    { name: 'Research Partner F', logoUrl: 'https://logo.clearbit.com/ibm.com' },
];
// --- END MOCK DATA ---

export function PartnersSlide() {
  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 4, fontWeight: 'bold', color: '#F3EDE6', }}>
            Our Partners
        </Typography>
        <Paper 
            elevation={6}
            sx={{
                p: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.2)', // A slightly darker, more transparent glass for contrast
                backdropFilter: 'blur(5px)',
                borderRadius: 2
            }}
        >
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                {mockPartners.map((partner) => (
                    <Grid size={{ xs: 6, sm: 4, md: 2 }} key={partner.name}>
                        <Box
                            component="img"
                            src={partner.logoUrl}
                            alt={partner.name}
                            sx={{
                                maxWidth: '100px',
                                filter: 'grayscale(100%) brightness(200%)', // Makes logos white/grey for a uniform look
                                transition: 'filter 0.3s ease-in-out',
                                '&:hover': {
                                    filter: 'grayscale(0%) brightness(100%)', // Color appears on hover
                                }
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    </Box>
  );
}