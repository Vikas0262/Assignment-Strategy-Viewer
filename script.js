const state = {
  selectedView: 'Bullish',       // default view
  selectedDate: dateArray[0],    // default = first date
  dropdownOpen: false
};


/* ── 3. Helper Functions ─────────────────────────────────── */

/**
 * Converts '24-Apr-2024' → '24 Apr 2024' for display
 */
function formatDate(dateStr) {
  return dateStr.replace(/-/g, ' ');
}

/**
 * Finds strategies for the currently selected view + date.
 * Returns an object like: { 'Bull Call Spread': 3, 'Long Call': 1 }
 * Returns null if no data found.
 */
function getStrategyCounts(view, date) {
  // Find the matching view entry (case-insensitive just to be safe)
  const viewEntry = strategyArray.find(
    item => item.View.toLowerCase() === view.toLowerCase()
  );

  if (!viewEntry) return null;

  // Get the array of strategy names for the selected date
  const strategies = viewEntry.Value[date];

  if (!strategies || strategies.length === 0) return null;

  // Count how many times each strategy name appears
  const counts = {};
  strategies.forEach(name => {
    counts[name] = (counts[name] || 0) + 1;
  });

  return counts;
}


/* ── 4. Render Functions ─────────────────────────────────── */

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

      // Update the button label
      document.getElementById('selectedDateLabel').textContent = formatDate(date);

      closeDropdown();
      renderDropdown();   // refresh selected highlight
      renderCards();      // refresh cards for new date
    });

    menu.appendChild(li);
  });
}

function renderCards() {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';

  const counts = getStrategyCounts(state.selectedView, state.selectedDate);

  // No strategies found → show empty state
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

  // Strategies found → render one card per unique strategy
  Object.entries(counts).forEach(([name, count], index) => {
    const card = document.createElement('div');
    card.className = 'strategy-card';

    // Staggered animation so cards slide in one by one
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


/* ── 5. Event Listeners ──────────────────────────────────── */

document.getElementById('viewToggle').addEventListener('click', (e) => {
  const clickedBtn = e.target.closest('.toggle-btn');
  if (!clickedBtn) return;

  // Remove active class from all, add to clicked
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  state.selectedView = clickedBtn.dataset.view;
  renderCards();
});

/**
 * Dropdown Button — open/close toggle
 */
document.getElementById('dropdownBtn').addEventListener('click', () => {
  state.dropdownOpen ? closeDropdown() : openDropdown();
});

/**
 * Click outside dropdown → close it
 */
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


/* ── 6. App Init ─────────────────────────────────────────── */
// Set the initial date label in the dropdown button
document.getElementById('selectedDateLabel').textContent = formatDate(state.selectedDate);

// Build dropdown list
renderDropdown();

// Render initial cards
renderCards();