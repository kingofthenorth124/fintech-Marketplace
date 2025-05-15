
async function loadCart() {
  try {
    const response = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const cart = await response.json();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>₦${item.price.toFixed(2)}</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
        </div>
      </div>
    `).join('');
    
    cartTotal.textContent = `₦${cart.total.toFixed(2)}`;
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadCart);
