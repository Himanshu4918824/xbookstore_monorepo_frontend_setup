import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button, Paper, Divider, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddressFormModal from '../components/checkout/AddressFormModal'; // Import our new modal

// --- MOCK DATA for saved addresses ---
const mockAddresses = [
  { id: 1, name: 'Home', address: '123 Pixel Lane, Appville, WB 700001', phone: '9876543210' },
  { id: 2, name: 'Work', address: '456 Component Drive, Codeburg, WB 700002', phone: '9876543211' },
];
// --- END MOCK DATA ---

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  
  // --- NEW STATE for all our interactive elements ---
  const [selectedAddressId, setSelectedAddressId] = useState(mockAddresses[0].id);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- PRICE CALCULATION ---
  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0), [cartItems]);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toUpperCase() === 'XOFFENCER10') {
      setDiscount(subtotal * 0.1); // Apply 10% discount
      alert('Coupon applied successfully!');
    } else {
      alert('Invalid coupon code.');
    }
  };

  const handlePlaceOrder = () => {
    alert('Order placed successfully! (No payment processing in Phase 1)');
    clearCart();
    navigate('/order-confirmation');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Checkout
      </Typography>
      <Grid container spacing={4}>
        {/* Left Column: Shipping & Payment Steps */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Step 1: Shipping Address */}
          <Paper sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>1. Select Shipping Address</Typography>
            {mockAddresses.map(addr => (
              <Paper
                key={addr.id}
                variant="outlined"
                onClick={() => setSelectedAddressId(addr.id)}
                sx={{
                  p: 2,
                  mb: 1,
                  cursor: 'pointer',
                  borderColor: selectedAddressId === addr.id ? 'primary.main' : 'divider',
                  borderWidth: selectedAddressId === addr.id ? 2 : 1,
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{addr.name}</Typography>
                <Typography variant="body2">{addr.address}</Typography>
                <Typography variant="body2">{addr.phone}</Typography>
              </Paper>
            ))}
            <Button startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={() => setIsModalOpen(true)}>
              Add a New Address
            </Button>
          </Paper>

          {/* Step 2: Payment Method */}
          <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>2. Select Payment Method</Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel value="online" control={<Radio />} label="Pay Online (UPI, Cards, Netbanking)" />
              <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
            </RadioGroup>
          </Paper>
        </Grid>

        {/* Right Column: Order Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, backgroundColor: 'background.paper', position: 'sticky', top: '88px' }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            {/* Item List */}
            <Box sx={{ my: 2, maxHeight: '200px', overflowY: 'auto' }}>
                {cartItems.map(item => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{item.title} x {item.quantity}</Typography>
                        <Typography variant="body2">₹{parseFloat(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                ))}
            </Box>
            <Divider />
            {/* Coupon Code */}
            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
              <TextField label="Coupon Code" size="small" fullWidth value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <Button variant="outlined" onClick={handleApplyCoupon}>Apply</Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Price Details */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Subtotal</Typography><Typography>₹{subtotal.toFixed(2)}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Shipping</Typography><Typography>₹{shipping.toFixed(2)}</Typography></Box>
            {discount > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}><Typography>Discount</Typography><Typography>- ₹{discount.toFixed(2)}</Typography></Box>}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6">Total</Typography><Typography variant="h6">₹{total.toFixed(2)}</Typography></Box>
            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <AddressFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Container>
  );
}

export default CheckoutPage;