// app.js
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('add-form');
  const dashboard = document.getElementById('dashboard');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      modelCount: parseInt(form.modelCount.value),
      army: form.army.value,
      gameSystem: form.gameSystem.value,
      status: form.status.value
    };

    const res = await fetch('http://localhost:3000/api/figures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      form.reset();
      loadDashboard();
    }
  });

  async function loadDashboard() {
    const res = await fetch('http://localhost:3000/api/figures');
    const figures = await res.json();
    dashboard.innerHTML = '';

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
        </select>
      `;
      dashboard.appendChild(card);
    });

    dashboard.querySelectorAll('select').forEach(select => {
      select.addEventListener('change', async () => {
        const id = select.dataset.id;
        const status = select.value;
        await fetch(`http://localhost:3000/api/figures/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      });
    });
  }


 // Load stats and display

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
  await loadStats(); // ✅ This must be here
  // ... then load model cards
}

loadDashboard();

});