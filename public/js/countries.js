
const countries = [
  "Afghanistan", "Albania", /* Add all countries here */ "Zimbabwe"
];

document.addEventListener('DOMContentLoaded', () => {
  const countrySelect = document.getElementById('country-select');
  if (countrySelect) {
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  }
});
