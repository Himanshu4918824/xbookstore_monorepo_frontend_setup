import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

export function DetailsSlide({ book, selectedFormat }) {
  const detailsList = selectedFormat ? [
    { label: 'ISBN', value: book.isbn },
    { label: 'Publication Date', value: book.publication_date },
    { label: 'Language', value: selectedFormat.language },
    { label: 'Pages', value: selectedFormat.pages },
    { label: 'Binding', value: selectedFormat.binding_type },
    { label: 'Paper Quality', value: selectedFormat.paper_quality },
    { label: 'Dimensions', value: `${selectedFormat.length_mm} x ${selectedFormat.width_mm} mm` },
    { label: 'Weight', value: `${selectedFormat.weight_grams}g` },
  ] : [];

  return (
    <Box sx={{ color: 'text.primary', px: { xs: 0, md: '10%' } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
          Full Details
        </Typography>
        <Typography variant="h5" gutterBottom>Product Details</Typography>
        {selectedFormat ? (
          <Grid container spacing={2}>
            {detailsList.map(detail => (
              <React.Fragment key={detail.label}>
                <Grid size={{ xs: 5, sm: 4 }}><Typography variant="body1" sx={{ fontWeight: 'bold' }}>{detail.label}</Typography></Grid>
                <Grid size={{ xs: 7, sm: 8 }}><Typography variant="body1" color="text.secondary">{detail.value}</Typography></Grid>
              </React.Fragment>
            ))}
          </Grid>
        ) : (
          <Typography>Please select a format to see details.</Typography>
        )}
      </Paper>
    </Box>
  );
}