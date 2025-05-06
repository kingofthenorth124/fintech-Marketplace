const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

module.exports = {
  secretKey: PAYSTACK_SECRET_KEY,
  publicKey: PAYSTACK_PUBLIC_KEY,
  baseUrl: 'https://api.paystack.co',
  verifyEndpoint: '/transaction/verify',
  initializeEndpoint: '/transaction/initialize',
  getBanksEndpoint: '/bank',
  resolveAccountEndpoint: '/bank/resolve'
}; 