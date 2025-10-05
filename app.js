const dashboard = document.getElementById('dashboard');

async function loadStats() {
  const res = await fetch('http://localhost:3000/api/figures/stats');
  const stats = await res.json();

  const statsDiv = document.createElement('div');
  statsDiv.className = 'stats';
  statsDiv.innerHTML = `
    <h3>Status Breakdown</h3>
    <div class="bar-group">
      <label>Printed vs Primed</label>
      <div class="bar">
        <div class="printed" style="width:${(stats.printed / stats.total) * 100}%">Printed (${stats.printed})</div>
        <div class="primed" style="width:${(stats.primed / stats.total) * 100}%">Primed (${stats.primed})</div>
      </div>
    </div>
    <div class="bar-group">
      <label>Painted vs Ready</label>
      <div class="bar">
        <div class="painted" style="width:${(stats.painted / stats.total) * 100}%">Painted (${stats.painted})</div>
        <div class="ready" style="width:${(stats.ready / stats.total) * 100}%">Ready (${stats.ready})</div>
      </div>
    </div>
  `;

  dashboard.prepend(statsDiv);
}

async function loadDashboard() {
  dashboard.innerHTML = '';

  const system = document.getElementById('filterSystem').value;
  const army = document.getElementById('filterArmy').value;
  const params = new URLSearchParams();

  if (system) params.append('gameSystem', system);
  if (army) params.append('army', army);

  await loadStats();

  const res = await fetch(`http://localhost:3000/api/figures?${params.toString()}`);
  const figures = await res.json();

  figures.forEach(fig => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${fig.name}</strong><br>
      ${fig.modelCount} models<br>
      ${fig.army} (${fig.gameSystem})<br>
      <select data-id="${fig._id}">
        ${[
          'STL file found',
          'Printed',
          'Primed',
          'Painted',
          'Based',
          'Ready for game'
        ].map(status => `<option ${status === fig.status ? 'selected' : ''}>${status}</option>`).join('')}
      </select><br>
      <input type="text" placeholder="Image or STL URL" value="${fig.fileUrl || ''}" data-file="${fig._id}">
      ${fig.fileUrl ? `<a href="${fig.fileUrl}" target="_blank">🔗 View File</a>` : ''}
    `;
    dashboard.appendChild(card);
  });

  // Status update listener
  dashboard.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', async () => {
      const id = select.dataset.id;
      const status = select.value;
      await fetch(`http://localhost:3000/api/figures/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadDashboard(); // Refresh after update
    });
  });

  // File URL update listener
  dashboard.querySelectorAll('input[data-file]').forEach(input => {
    input.addEventListener('change', async () => {
      const id = input.dataset.file;
      const fileUrl = input.value;
      await fetch(`http://localhost:3000/api/figures/${id}/file`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl })
      });
      loadDashboard(); // Refresh after update
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  document.getElementById('applyFilter').addEventListener('click', loadDashboard);
});