
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData);
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('token', result.token);
          window.location.href = '/profile';
        } else {
          const error = await response.json();
          alert(error.message);
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
});

function updateAuthButtons() {
  const token = localStorage.getItem('token');
  const authButtons = document.getElementById('auth-buttons');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (token) {
    document.querySelectorAll('.auth-btn').forEach(btn => btn.style.display = 'none');
    logoutBtn.style.display = 'inline-block';
  }
}

updateAuthButtons();
