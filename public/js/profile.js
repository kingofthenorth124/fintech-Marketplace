
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();

  const setup2FABtn = document.getElementById('setup-2fa');
  const resetPasswordBtn = document.getElementById('reset-password');

  setup2FABtn?.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/auth/setup-2fa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.qrCode) {
        // Show QR code modal for 2FA setup
        showQRCodeModal(data.qrCode);
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
    }
  });

  resetPasswordBtn?.addEventListener('click', async () => {
    try {
      const email = document.querySelector('[name="email"]').value;
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        alert('Password reset instructions sent to your email');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
    }
  });
});


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
