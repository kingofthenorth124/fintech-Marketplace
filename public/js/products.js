
let products = [];

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    products = await response.json();
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">₦${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})" class="primary-button">Add to Cart</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

async function addProduct(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const productData = Object.fromEntries(formData);

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      document.getElementById('add-product-modal').style.display = 'none';
      loadProducts();
    }
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

async function checkout() {
  try {
    const response = await fetch('/api/cart/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    
    const handler = PaystackPop.setup({
      key: 'YOUR_PAYSTACK_PUBLIC_KEY',
      email: data.email,
      amount: data.amount * 100,
      ref: data.reference,
      onClose: function() {
        alert('Transaction cancelled');
      },
      callback: async function(response) {
        await verifyPayment(response.reference);
      }
    });
    handler.openIframe();
  } catch (error) {
    console.error('Error during checkout:', error);
  }
}

async function verifyPayment(reference) {
  try {
    const response = await fetch(`/api/cart/verify-payment/${reference}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      alert('Payment successful!');
      window.location.href = '/orders';
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  const addProductBtn = document.getElementById('add-product-btn');
  const modal = document.getElementById('add-product-modal');
  const addProductForm = document.getElementById('add-product-form');

  addProductBtn.onclick = () => modal.style.display = 'block';
  addProductForm.onsubmit = addProduct;
  
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
});
