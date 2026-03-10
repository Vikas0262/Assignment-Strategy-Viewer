const state = {
  selectedView: 'Bullish',
  selectedDate: dateArray[0],
  dropdownOpen: false
};

// Format date: '24-Apr-2024' → '24 Apr 2024'
function formatDate(dateStr) {
  return dateStr.replace(/-/g, ' ');
}

// Get strategy count by view and date
function getStrategyCounts(view, date) {
  const viewEntry = strategyArray.find(item => item.View.toLowerCase() === view.toLowerCase());
  if (!viewEntry) return null;
  const strategies = viewEntry.Value[date];
  if (!strategies || strategies.length === 0) return null;
  const counts = {};
  strategies.forEach(name => {
    counts[name] = (counts[name] || 0) + 1;
  });

  return counts;
}


// Render dropdown menu with dates
function renderDropdown() {
  const menu = document.getElementById('dropdownMenu');
  menu.innerHTML = '';

  dateArray.forEach(date => {
    const li = document.createElement('li');
    li.className = 'dropdown-item' + (date === state.selectedDate ? ' selected' : '');
    li.textContent = formatDate(date);
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', date === state.selectedDate);

    li.addEventListener('click', () => {
      state.selectedDate = date;
      document.getElementById('selectedDateLabel').textContent = formatDate(date);
      closeDropdown();
      renderDropdown();
      renderCards();
    });

    menu.appendChild(li);
  });
}

function renderCards() {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';

  const counts = getStrategyCounts(state.selectedView, state.selectedDate);
  // Show empty state if no strategies
  if (!counts) {
    container.innerHTML = `
      <div class="empty-state">
        <p>
          There are no strategies for
          <strong>${formatDate(state.selectedDate)}</strong>
        </p>
      </div>
    `;
    return;
  }
  // Render one card per unique strategy
  Object.entries(counts).forEach(([name, count], index) => {
    const card = document.createElement('div');
    card.className = 'strategy-card';
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
      <span class="card-name">${name}</span>
      <span class="card-count">
        <span class="count-dot"></span>
        ${count} ${count === 1 ? 'Strategy' : 'Strategies'}
      </span>
    `;

    container.appendChild(card);
  });
}


// View toggle click handler
document.getElementById('viewToggle').addEventListener('click', (e) => {
  const clickedBtn = e.target.closest('.toggle-btn');
  if (!clickedBtn) return;
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  state.selectedView = clickedBtn.dataset.view;
  renderCards();
});

// Dropdown toggle
document.getElementById('dropdownBtn').addEventListener('click', () => {
  state.dropdownOpen ? closeDropdown() : openDropdown();
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.dropdown-wrapper');
  if (!wrapper.contains(e.target)) {
    closeDropdown();
  }
});

function openDropdown() {
  state.dropdownOpen = true;
  document.getElementById('dropdownMenu').classList.remove('hidden');
  document.getElementById('dropdownBtn').classList.add('open');
  document.getElementById('dropdownBtn').setAttribute('aria-expanded', 'true');
}

function closeDropdown() {
  state.dropdownOpen = false;
  document.getElementById('dropdownMenu').classList.add('hidden');
  document.getElementById('dropdownBtn').classList.remove('open');
  document.getElementById('dropdownBtn').setAttribute('aria-expanded', 'false');
}


// Initialize app
document.getElementById('selectedDateLabel').textContent = formatDate(state.selectedDate);
renderDropdown();
renderCards();