// MiniatureDashboard.jsx
import { useEffect, useState } from 'react';

export default function MiniatureDashboard() {
  const [miniatures, setMiniatures] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/miniatures')
      .then(res => res.json())
      .then(data => setMiniatures(data))
      .catch(err => console.error('❌ Fetch error:', err));
  }, []);

  return (
    <div className="dashboard">
      <h2>Miniature Collection</h2>
      <div className="grid">
        {miniatures.map(mini => (
          <div className="card" key={mini._id}>
            <h3>{mini.name}</h3>
            <p><strong>Game:</strong> {mini.game}</p>
            <p><strong>Army:</strong> {mini.army}</p>
            <p><strong>Status:</strong> {mini.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}