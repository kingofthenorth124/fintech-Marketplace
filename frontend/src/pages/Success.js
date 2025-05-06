import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CheckCircleOutline
} from '@mui/material';
import { useCart } from '../context/CartContext';

function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleOutline
            color="success"
            sx={{ fontSize: 64, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Order ID: {sessionId}
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/products')}
              sx={{ mr: 2 }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/profile')}
            >
              View Orders
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Success; 