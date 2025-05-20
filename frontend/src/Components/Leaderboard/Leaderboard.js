  // src/components/Leaderboard.js
  import React, { useState, useEffect } from 'react';
  import './Leaderboard.css';

  const Leaderboard = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [score, setScore] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch top scores
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
        const data = await res.json();
        setScores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchLeaderboard();
    }, []);

    // Handle new score submissions
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!name.trim() || score === '' || isNaN(score)) {
        setError('Please enter a valid name and numeric score.');
        return;
      }

      setSubmitting(true);
      setError('');
      try {
        const res = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), score: Number(score) }),
        });
        if (!res.ok) {
          const errBody = await res.json();
          throw new Error(errBody.error || res.statusText);
        }
        setName('');
        setScore('');
        await fetchLeaderboard();
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    };

    if (loading) return <div>Loading leaderboard...</div>;
    return (
      <div className="leaderboard glass">
        <h2>Trivia Time Leaderboard</h2>

        {/* <form onSubmit={handleSubmit} className="score-form">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Your Score"
            value={score}
            onChange={e => setScore(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Add Score'}
          </button>
        </form>

        {error && <div className="error">Error: {error}</div>} */}

        <table>
          <thead>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((item, idx) => (
              <tr key={item._id} className={
                idx === 0 ? 'top-1' : idx === 1 ? 'top-2' : idx === 2 ? 'top-3' : ''
              }>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default Leaderboard;