import React from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

function AffiliateRegisterPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Affiliate application submitted! You will be notified via email upon approval.');
    // In Phase 2, this will send the application data to the backend.
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Affiliate Application
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="firstName" label="First Name" required fullWidth autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="lastName" label="Last Name" required fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField type="email" name="email" label="Email Address" required fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField type="password" name="password" label="Password" required fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField name="website" label="Your Website or Social Media URL" fullWidth helperText="How you plan to promote our books." />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Apply Now
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default AffiliateRegisterPage;