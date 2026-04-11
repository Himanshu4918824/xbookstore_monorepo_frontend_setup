import React from 'react';
import { Typography, Box, Button, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material';

function SecurityPage() {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Login & Security
      </Typography>
      
      <Box>
        <Typography sx={{ fontWeight: 'medium' }}>Change Password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          It's a good idea to use a strong password that you're not using elsewhere.
        </Typography>
        <Button variant="outlined">Change Password</Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography sx={{ fontWeight: 'medium' }}>Two-Factor Authentication</Typography>
        <Typography variant="body2" color="text.secondary">
          Add an extra layer of security to your account.
        </Typography>
        <FormGroup>
            <FormControlLabel control={<Switch />} label="Enable 2FA" />
        </FormGroup>
        <Typography variant="caption" color="text.secondary">
          You will be asked for a code from your authenticator app when you sign in.
        </Typography>
      </Box>
    </>
  );
}
export default SecurityPage;