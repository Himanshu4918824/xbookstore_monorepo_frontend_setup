import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export function AuthorCertsSlide({ author }) {
    return (
        <Box sx={{ textAlign: 'center', color: 'text.primary' }}>
            <Paper elevation={6} sx={{ p: 4, backgroundColor: 'background.paper' }}>
                <Typography variant="h2">Certificates</Typography>
                <Typography sx={{ mt: 2 }}>Publication certificates for {author.firstName} {author.lastName} will be shown here.</Typography>
            </Paper>
        </Box>
    );
}