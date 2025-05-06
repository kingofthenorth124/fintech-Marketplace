const axios = require('axios');
const config = require('../config/paystack');

class PaystackService {
  constructor() {
    this.axios = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async initializePayment(data) {
    try {
      const response = await this.axios.post(config.initializeEndpoint, {
        email: data.email,
        amount: data.amount * 100, // Convert to kobo
        bank: data.bank,
        account_number: data.accountNumber,
        currency: 'NGN'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment initialization failed');
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await this.axios.get(`${config.verifyEndpoint}/${reference}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  async getNigerianBanks() {
    try {
      const response = await this.axios.get(`${config.getBanksEndpoint}?country=nigeria`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch banks');
    }
  }

  async resolveAccountNumber(accountNumber, bankCode) {
    try {
      const response = await this.axios.get(
        `${config.resolveAccountEndpoint}?account_number=${accountNumber}&bank_code=${bankCode}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Account resolution failed');
    }
  }
}

module.exports = new PaystackService(); 