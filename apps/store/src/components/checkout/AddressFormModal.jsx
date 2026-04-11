import React from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';

// This is the style for the modal pop-up
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function AddressFormModal({ open, onClose }) {
  const handleSave = (e) => {
    e.preventDefault();
    alert('New address saved! (This is a demo)');
    onClose(); // Close the modal after saving
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSave}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add a New Shipping Address
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}><TextField label="Full Name" fullWidth required /></Grid>
          <Grid size={12}><TextField label="Address Line 1" fullWidth required /></Grid>
          <Grid size={12}><TextField label="City" fullWidth required /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField label="State" fullWidth required /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField label="Pincode" fullWidth required /></Grid>
        </Grid>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Address</Button>
      </Box>
    </Modal>
  );
}
export default AddressFormModal;