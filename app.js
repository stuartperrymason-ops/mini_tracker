// app.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-form');
  const nameInput = document.getElementById('name');
  const gameInput = document.getElementById('game');
  const armyInput = document.getElementById('army');
  const statusSelect = document.getElementById('status');
  const gallery = document.getElementById('gallery');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const game = gameInput.value.trim();
    const army = armyInput.value.trim();
    const status = statusSelect.value;

    console.log('🚀 Submitting:', { name, game, army, status });

    const res = await fetch('http://localhost:3000/api/miniatures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, game, army, status })
    });

    if (res.ok) {
      showMessage(`✅ "${name}" added successfully!`);
      nameInput.value = '';
      gameInput.value = '';
      armyInput.value = '';
      statusSelect.selectedIndex = 0;
      loadMiniatures();
    } else {
      showMessage('❌ Failed to add miniature. Check all fields.');
    }
  });

  async function loadMiniatures() {
    const res = await fetch('http://localhost:3000/api/miniatures');
    const data = await res.json();
    gallery.innerHTML = '';
    data.forEach(mini => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <strong>${mini.name}</strong><br>
        ${mini.game} <br>
        ${mini.army}<br>
        <em>${mini.status}</em>
      `;
      gallery.appendChild(card);
    });
  }

  function showMessage(text) {
    let msg = document.getElementById('message');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'message';
      msg.style.marginTop = '10px';
      msg.style.padding = '10px';
      msg.style.backgroundColor = '#dff0d8';
      msg.style.border = '1px solid #3c763d';
      msg.style.color = '#3c763d';
      msg.style.borderRadius = '5px';
      form.appendChild(msg);
    }
    msg.textContent = text;
    setTimeout(() => msg.remove(), 3000);
  }

  loadMiniatures();
});