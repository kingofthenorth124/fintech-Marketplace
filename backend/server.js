const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const bankPaymentRoutes = require('./routes/bankPaymentRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productsRouter = require('./routes/products');
const servicesRouter = require('./routes/services');
const suppliersRouter = require('./routes/suppliers');
const authRouter = require('./routes/auth');
const checkoutRouter = require('./routes/checkout');

app.use('/api/products', productsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/auth', authRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/bank-payment', bankPaymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 