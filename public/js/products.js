
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₦${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

async function addToCart(productId) {
  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ productId })
    });
    if (response.ok) {
      alert('Product added to cart!');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
