const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const productsCollection = db.collection('products');

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice } = req.query;
    let query = productsCollection;

    if (category) {
      query = query.where('category', '==', category);
    }

    if (location) {
      query = query.where('location', '==', location);
    }

    if (minPrice) {
      query = query.where('price', '>=', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.where('price', '<=', parseFloat(maxPrice));
    }

    const snapshot = await query.get();
    const products = [];
    
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await productsCollection.doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      location,
      supplierId,
      imageUrl
    } = req.body;

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      location,
      supplierId,
      imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await productsCollection.add(newProduct);
    
    res.status(201).json({
      id: docRef.id,
      ...newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      location,
      supplierId,
      imageUrl
    } = req.body;

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      location,
      supplierId,
      imageUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await productsCollection.doc(req.params.id).update(updateData);
    
    res.json({
      id: req.params.id,
      ...updateData
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await productsCollection.doc(req.params.id).delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router; 
 