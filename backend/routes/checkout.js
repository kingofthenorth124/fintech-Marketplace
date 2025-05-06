const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

const db = admin.firestore();

// Create a Stripe checkout session
router.post('/create-session', async (req, res) => {
  try {
    const { items, shipping, userId } = req.body;

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add more countries as needed
      },
      metadata: {
        userId,
      },
    });

    // Store order details in Firestore
    await db.collection('orders').add({
      userId,
      items,
      shipping,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      sessionId: session.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Update order status in Firestore
      const orderSnapshot = await db
        .collection('orders')
        .where('sessionId', '==', session.id)
        .get();

      if (!orderSnapshot.empty) {
        const orderId = orderSnapshot.docs[0].id;
        await db.collection('orders').doc(orderId).update({
          status: 'completed',
          paymentId: session.payment_intent,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).send('Error updating order status');
    }
  }

  res.json({ received: true });
});

// Get order history for a user
router.get('/orders/:userId', async (req, res) => {
  try {
    const ordersSnapshot = await db
      .collection('orders')
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router; 