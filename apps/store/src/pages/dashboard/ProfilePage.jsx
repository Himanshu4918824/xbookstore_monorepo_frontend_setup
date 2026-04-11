import React from 'react';
import { Typography, Box, Grid, TextField, Button, Card, CardContent, Avatar } from '@mui/material';
import { useAuth } from '../../context/useAuth';
import PhoneInput from 'react-phone-input-2'; // Import the new phone input

function ProfilePage() {
  const { user } = useAuth();

  const handleProfileUpdate = (event) => {
    event.preventDefault();
    alert('Profile update submitted! (Phase 2 will connect this)');
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Account Settings
      </Typography>
      
      <Grid container spacing={4}>
        {/* Column 1: Profile Picture and Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, backgroundColor: 'transparent', border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar 
                src="https://placehold.co/128/94B3CA/162735?text=JD" // Placeholder avatar
                sx={{ width: 128, height: 128, mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                Allowed *.jpeg, *.jpg, *.png, *.gif<br />
                max size of 3 Mb
              </Typography>
              <Button variant="contained" component="label">
                Upload Photo
                <input type="file" hidden />
              </Button>
              <Button variant="text" color="error" sx={{ mt: 4 }}>
                Delete user
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Column 2: Main Profile Form */}
        <Grid size={{ xs: 12, md: 8 }}>
           <Card sx={{ p: 2, backgroundColor: 'transparent', border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box component="form" onSubmit={handleProfileUpdate}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Name" fullWidth defaultValue={`${user?.firstName || 'Jaydon'} ${user?.lastName || 'Frankie'}`} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Email Address" type="email" fullWidth defaultValue={user?.email || 'demo@minimals.cc'} disabled />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {/* The phone input component */}
                    <PhoneInput
                      country={'us'} // Default country
                      inputStyle={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Address" fullWidth defaultValue="90210 Broadway Blvd" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Country" fullWidth defaultValue="Canada" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="State/Region" fullWidth defaultValue="California" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="City" fullWidth defaultValue="San Francisco" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Zip/Code" fullWidth defaultValue="94116" />
                  </Grid>
                  <Grid size={12}>
                    <TextField label="About" multiline rows={3} fullWidth defaultValue="Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus." />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button type="submit" variant="contained">
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ProfilePage;