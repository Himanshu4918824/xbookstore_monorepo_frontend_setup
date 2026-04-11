import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { requestPasswordReset } from '../api/authService';

function ForgotPasswordPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const email = data.get('email');

    try {
      // We call our new API function
      await requestPasswordReset(email);
      setSubmitted(true); // On success, show the confirmation message
    } catch (err) {
      console.error('Password reset request error:', err.response?.data);
      setError('Failed to send reset link. Please check the email address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, backgroundColor: 'background.paper', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Reset Password
        </Typography>

        {submitted ? (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            If an account with this email exists, a password reset link has been sent.
          </Alert>
        ) : (
          <>
            <Typography color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Enter your email address and we will send you a link to reset your password.
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
export default ForgotPasswordPage;