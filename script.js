const state = {
  selectedView: 'Bullish',
  selectedDate: dateArray[0],
  dropdownOpen: false
};

function formatDate(dateStr) {
  return dateStr.replace(/-/g, ' ');
}

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

function renderDropdown() {
  const menu = document.getElementById('dropdownMenu');
  menu.innerHTML = '';
  dateArray.forEach(date => {
    const li = document.createElement('li');
    li.className = 'dropdown-item' + (date === state.selectedDate ? ' selected' : '');
    li.textContent = formatDate(date);
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', date === state.selectedDate);
    li.dataset.date = date;
    li.addEventListener('click', () => {
      state.selectedDate = date;
      document.getElementById('selectedDateLabel').textContent = formatDate(date);
      closeDropdown();
      // Update selected highlight without full re-render
      document.querySelectorAll('.dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.date === date);
        el.setAttribute('aria-selected', el.dataset.date === date);
      });
      renderCards();
    });
    menu.appendChild(li);
  });
}

function renderCards() {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';
  const counts = getStrategyCounts(state.selectedView, state.selectedDate);
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
  Object.entries(counts).forEach(([name, count], index) => {
    const card = document.createElement('div');
    card.className = 'strategy-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'card-name';
    nameSpan.textContent = name;

    const dot = document.createElement('span');
    dot.className = 'count-dot';

    const countSpan = document.createElement('span');
    countSpan.className = 'card-count';
    countSpan.appendChild(dot);
    countSpan.append(` ${count} ${count === 1 ? 'Strategy' : 'Strategies'}`);

    card.appendChild(nameSpan);
    card.appendChild(countSpan);
    container.appendChild(card);
  });
}

document.getElementById('viewToggle').addEventListener('click', (e) => {
  const clickedBtn = e.target.closest('.toggle-btn');
  if (!clickedBtn) return;
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');
  state.selectedView = clickedBtn.dataset.view;
  renderCards();
});

document.getElementById('dropdownBtn').addEventListener('click', () => {
  state.dropdownOpen ? closeDropdown() : openDropdown();
});

document.addEventListener('click', (e) => {
  if (!document.querySelector('.dropdown-wrapper').contains(e.target)) {
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

document.getElementById('selectedDateLabel').textContent = formatDate(state.selectedDate);
renderDropdown();
renderCards();