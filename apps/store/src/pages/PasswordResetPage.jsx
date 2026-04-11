import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { confirmPasswordReset } from '../api/authService';

function PasswordResetPage() {
  const { uid, token } = useParams(); // Get the tokens from the URL
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const new_password1 = data.get('password');
    const new_password2 = data.get('password2');

    if (new_password1 !== new_password2) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const resetData = { uid, token, new_password1, new_password2 };
      await confirmPasswordReset(resetData);
      // On success, redirect to login with a success message
      navigate('/login', { state: { message: 'Password has been reset successfully! Please log in.' } });
    } catch (err) {
      console.error('Password reset confirm error:', err.response?.data);
      setError('Failed to reset password. The link may be invalid or expired.');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, backgroundColor: 'background.paper', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Create New Password
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth name="password" label="New Password" type="password" />
          <TextField margin="normal" required fullWidth name="password2" label="Confirm New Password" type="password" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? 'Saving...' : 'Set New Password'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
export default PasswordResetPage;