import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Wallet() {
  const { balance, transactions, addFunds, transferFunds, loading } = useWallet();
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [openTopup, setOpenTopup] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTopup = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const result = await addFunds(parseFloat(amount), 'card');
      if (result) {
        setSuccess('Funds added successfully');
        setAmount('');
        setOpenTopup(false);
      } else {
        setError('Failed to add funds');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!recipientEmail) {
      setError('Please enter recipient email');
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const result = await transferFunds(recipientEmail, parseFloat(amount), description);
      if (result) {
        setSuccess('Transfer successful');
        setAmount('');
        setRecipientEmail('');
        setDescription('');
        setOpenTransfer(false);
      } else {
        setError('Transfer failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Wallet Balance
              </Typography>
              <Typography variant="h3" color="primary">
                ${balance.toFixed(2)}
              </Typography>
              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenTopup(true)}
                  sx={{ mr: 2 }}
                >
                  Add Funds
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setOpenTransfer(true)}
                >
                  Transfer Money
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3}>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="All Transactions" />
                <Tab label="Money In" />
                <Tab label="Money Out" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <TransactionList transactions={transactions} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TransactionList
                  transactions={transactions.filter(t => t.type === 'credit')}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TransactionList
                  transactions={transactions.filter(t => t.type === 'debit')}
                />
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>

        {/* Top-up Dialog */}
        <Dialog open={openTopup} onClose={() => setOpenTopup(false)}>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTopup(false)}>Cancel</Button>
            <Button
              onClick={handleTopup}
              variant="contained"
              disabled={processing}
            >
              {processing ? <CircularProgress size={24} /> : 'Add Funds'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Transfer Dialog */}
        <Dialog open={openTransfer} onClose={() => setOpenTransfer(false)}>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Recipient Email"
              type="email"
              fullWidth
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTransfer(false)}>Cancel</Button>
            <Button
              onClick={handleTransfer}
              variant="contained"
              disabled={processing}
            >
              {processing ? <CircularProgress size={24} /> : 'Transfer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

function TransactionList({ transactions }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Reference</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.reference}>
              <TableCell>
                {new Date(transaction.timestamp).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Typography
                  color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                >
                  {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                </Typography>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Typography
                  color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                >
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell>{transaction.reference}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Wallet; 