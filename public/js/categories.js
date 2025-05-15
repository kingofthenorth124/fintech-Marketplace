
document.addEventListener('DOMContentLoaded', () => {
  const categories = [
    {
      name: 'Payment & Money Transfer',
      description: 'Send and receive money securely',
      icon: '💸'
    },
    {
      name: 'Banking & Network',
      description: 'Digital banking solutions',
      icon: '🏦'
    },
    {
      name: 'Personal Finance Management',
      description: 'Track and manage your finances',
      icon: '📊'
    },
    {
      name: 'Investment & Trading',
      description: 'Trade stocks and manage investments',
      icon: '📈'
    },
    {
      name: 'Lending & Borrowing',
      description: 'Access loans and credit services',
      icon: '💰'
    },
    {
      name: 'Insurance Technology',
      description: 'Digital insurance solutions',
      icon: '🛡️'
    },
    {
      name: 'Wealth Management',
      description: 'Grow and protect your wealth',
      icon: '💎'
    },
    {
      name: 'Cryptocurrency & Blockchain',
      description: 'Digital assets and blockchain tech',
      icon: '🔗'
    }
  ];

  const categoriesGrid = document.getElementById('categories-grid');
  categories.forEach(category => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card';
    categoryCard.innerHTML = `
      <div class="category-icon">${category.icon}</div>
      <h3>${category.name}</h3>
      <p>${category.description}</p>
      <a href="/categories/${category.name.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}" 
         class="category-link">Explore</a>
    `;
    categoriesGrid.appendChild(categoryCard);
  });
});
