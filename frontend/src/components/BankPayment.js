import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import axios from 'axios';

function BankPayment() {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addFunds } = useWallet();

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get('/api/bank-payment/banks');
      setBanks(response.data.data);
    } catch (error) {
      setError('Failed to fetch banks');
    }
  };

  const handleBankChange = (event) => {
    setSelectedBank(event.target.value);
    setAccountName('');
  };

  const handleAccountNumberChange = async (event) => {
    const number = event.target.value;
    setAccountNumber(number);
    
    if (number.length === 10 && selectedBank) {
      try {
        setLoading(true);
        const response = await axios.get('/api/bank-payment/resolve-account', {
          params: {
            accountNumber: number,
            bankCode: selectedBank
          }
        });
        setAccountName(response.data.data.account_name);
        setError('');
      } catch (error) {
        setError('Could not verify account number');
        setAccountName('');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Initialize payment
      const initResponse = await axios.post('/api/bank-payment/initialize', {
        amount: parseFloat(amount),
        bank: selectedBank,
        accountNumber
      });

      const reference = initResponse.data.data.reference;

      // Poll for payment verification
      const verifyPayment = async () => {
        const verifyResponse = await axios.get(`/api/bank-payment/verify/${reference}`);
        const status = verifyResponse.data.data.status;

        if (status === 'success') {
          await addFunds(parseFloat(amount), 'bank_transfer');
          setSuccess('Payment successful');
          resetForm();
        } else if (status === 'failed') {
          setError('Payment failed');
        } else {
          // Payment pending, continue polling
          setTimeout(verifyPayment, 5000);
        }
      };

      verifyPayment();
    } catch (error) {
      setError(error.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!selectedBank) {
      setError('Please select a bank');
      return false;
    }
    if (!accountNumber || accountNumber.length !== 10) {
      setError('Please enter a valid account number');
      return false;
    }
    if (!accountName) {
      setError('Please verify account number');
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setSelectedBank('');
    setAccountNumber('');
    setAccountName('');
    setAmount('');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Money from Bank
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Bank</InputLabel>
              <Select
                value={selectedBank}
                onChange={handleBankChange}
                label="Select Bank"
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Account Number"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

          {accountName && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Name"
                value={accountName}
                disabled
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount (NGN)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Proceed with Payment'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default BankPayment; 