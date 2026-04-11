import React from 'react';
import { Typography, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';

// Mock data for saved addresses
const mockAddresses = [
  { id: 1, name: 'Home', address: '123 Pixel Lane, Appville, WB 700001', isDefault: true },
  { id: 2, name: 'Work', address: '456 Component Drive, Codeburg, WB 700002', isDefault: false },
];

function AddressBookPage() {
  const handleAddAddress = () => {
    alert('Add new address form would open here!');
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Your Addresses
        </Typography>
        <Button variant="contained" onClick={handleAddAddress}>
          Add New Address
        </Button>
      </Box>
      <List>
        {mockAddresses.map((addr, index) => (
          <React.Fragment key={addr.id}>
            <ListItem>
              <ListItemText
                primary={`${addr.name} ${addr.isDefault ? '(Default)' : ''}`}
                secondary={addr.address}
              />
              {/* In a real app, we'd add Edit/Delete buttons here */}
            </ListItem>
            {index < mockAddresses.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </>
  );
}

export default AddressBookPage;