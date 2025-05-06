import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const steps = ['Shopping Cart', 'Shipping Details', 'Payment'];

function Checkout() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: ''
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingDetailsChange = (event) => {
    const { name, value } = event.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, parseInt(newQuantity));
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Initialize Stripe
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

      // Create a payment session on your backend
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          shipping: shippingDetails,
          userId: currentUser.uid
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCartItems = () => (
    <Grid container spacing={3}>
      {cart.map((item) => (
        <Grid item xs={12} key={item.id}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    style={{ width: '100%', maxWidth: '100px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Typography variant="h5" align="right">
          Total: ${total.toFixed(2)}
        </Typography>
      </Grid>
    </Grid>
  );

  const renderShippingForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Full Name"
          name="fullName"
          value={shippingDetails.fullName}
          onChange={handleShippingDetailsChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Address"
          name="address"
          value={shippingDetails.address}
          onChange={handleShippingDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={shippingDetails.city}
          onChange={handleShippingDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Country"
          name="country"
          value={shippingDetails.country}
          onChange={handleShippingDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Postal Code"
          name="postalCode"
          value={shippingDetails.postalCode}
          onChange={handleShippingDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Phone"
          name="phone"
          value={shippingDetails.phone}
          onChange={handleShippingDetailsChange}
        />
      </Grid>
    </Grid>
  );

  const renderPaymentSection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Typography variant="body1" gutterBottom>
        Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Total Amount: ${total.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
      </Button>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderCartItems();
      case 1:
        return renderShippingForm();
      case 2:
        return renderPaymentSection();
      default:
        return 'Unknown step';
    }
  };

  if (cart.length === 0 && activeStep === 0) {
    return (
      <Container maxWidth="lg">
        <Box my={4} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button variant="contained" color="primary" href="/products">
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 2 ? 'Review Order' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Checkout; 