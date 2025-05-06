const express = require('express');
const router = express.Router();
const paystackService = require('../services/paystackService');
const { authenticateUser } = require('../middleware/auth');

// Get list of Nigerian banks
router.get('/banks', authenticateUser, async (req, res) => {
  try {
    const banks = await paystackService.getNigerianBanks();
    res.json(banks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve account number
router.get('/resolve-account', authenticateUser, async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.query;
    const accountInfo = await paystackService.resolveAccountNumber(accountNumber, bankCode);
    res.json(accountInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize bank payment
router.post('/initialize', authenticateUser, async (req, res) => {
  try {
    const { amount, bank, accountNumber } = req.body;
    const paymentData = {
      email: req.user.email,
      amount,
      bank,
      accountNumber
    };
    const payment = await paystackService.initializePayment(paymentData);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.get('/verify/:reference', authenticateUser, async (req, res) => {
  try {
    const { reference } = req.params;
    const verification = await paystackService.verifyPayment(reference);
    res.json(verification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 