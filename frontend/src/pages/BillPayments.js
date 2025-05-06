import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useWallet } from '../context/WalletContext';

const billCategories = [
  {
    name: 'Utilities',
    providers: [
      { id: 'electricity', name: 'Electricity' },
      { id: 'water', name: 'Water' },
      { id: 'gas', name: 'Gas' }
    ]
  },
  {
    name: 'Internet & TV',
    providers: [
      { id: 'internet', name: 'Internet Service' },
      { id: 'cable', name: 'Cable TV' },
      { id: 'streaming', name: 'Streaming Services' }
    ]
  },
  {
    name: 'Mobile & Airtime',
    providers: [
      { id: 'mobile_prepaid', name: 'Mobile Prepaid' },
      { id: 'mobile_postpaid', name: 'Mobile Postpaid' },
      { id: 'data_bundle', name: 'Data Bundle' }
    ]
  }
];

function BillPayments() {
  const { balance, deductFunds } = useWallet();
  const [category, setCategory] = useState('');
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);

  const selectedCategory = billCategories.find(cat => 
    cat.providers.some(p => p.id === provider)
  );

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setProvider('');
  };

  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };

  const validatePayment = () => {
    if (!provider) {
      setError('Please select a service provider');
      return false;
    }
    if (!accountNumber) {
      setError('Please enter account number');
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (parseFloat(amount) > balance) {
      setError('Insufficient balance');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await deductFunds(
        parseFloat(amount),
        `Bill Payment - ${selectedCategory?.name} - ${accountNumber}`
      );

      if (result) {
        setSuccess('Payment successful');
        setAccountNumber('');
        setAmount('');
        setOpenConfirm(false);
      } else {
        setError('Payment failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Bill Payments
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={handleCategoryChange}
                    >
                      {billCategories.map((cat) => (
                        <MenuItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Service Provider</InputLabel>
                    <Select
                      value={provider}
                      label="Service Provider"
                      onChange={handleProviderChange}
                      disabled={!category}
                    >
                      {category &&
                        billCategories
                          .find((cat) => cat.name === category)
                          ?.providers.map((prov) => (
                            <MenuItem key={prov.id} value={prov.id}>
                              {prov.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Account/Phone Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    disabled={!provider}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!accountNumber}
                  />
                </Grid>

                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}

                {success && (
                  <Grid item xs={12}>
                    <Alert severity="success">{success}</Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => setOpenConfirm(true)}
                    disabled={loading || !amount || !accountNumber}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Pay Bill'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Available Balance
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ${balance.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can pay bills directly from your wallet balance
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Please confirm the following payment details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Service: {selectedCategory?.providers.find(p => p.id === provider)?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Account: {accountNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Amount: ${parseFloat(amount).toFixed(2)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
            <Button
              onClick={handlePayment}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm Payment'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default BillPayments; 