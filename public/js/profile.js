
async function loadProfile() {
  try {
    const response = await fetch('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const profile = await response.json();
    
    document.querySelector('[name="fullName"]').value = profile.fullName;
    document.querySelector('[name="email"]').value = profile.email;
    document.querySelector('[name="country"]').value = profile.country;
    
    document.getElementById('total-orders').textContent = profile.totalOrders;
    document.getElementById('profile-wallet-balance').textContent = `₦${profile.walletBalance.toFixed(2)}`;
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadProfile);
