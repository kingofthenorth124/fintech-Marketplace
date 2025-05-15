
async function loadWallet() {
  try {
    const response = await fetch('/api/transactions', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    document.getElementById('wallet-amount').textContent = `₦${data.balance.toFixed(2)}`;
    
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = data.transactions.map(transaction => `
      <div class="transaction-item">
        <span>${transaction.date}</span>
        <span>${transaction.description}</span>
        <span class="${transaction.type}">${transaction.type === 'credit' ? '+' : '-'}₦${transaction.amount.toFixed(2)}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading wallet:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadWallet);
