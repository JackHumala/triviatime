import React, { useState } from 'react';
import './LeaderboardEntry.css';

function LeaderboardEntry({ score, onViewLeaderboard, resetScore, onBackToMenu }) {
    const [name, setName] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter a valid name.');
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
            resetScore(); //Reset score after submission
            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToMenu = () => {
        if (onBackToMenu) {
            onBackToMenu();
        } else {
            onViewLeaderboard();
        }
    };

    return (
        <div className="leaderboard-entry">
            <h1>Game Over</h1>
            <p>Your final score: {score}</p>
            {!submitted ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Enter your name to be added to the leaderboard!</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            ) : (
                <>
                    <div className="success-message">Score submitted! 🎉</div>
                    <button className="back-btn" onClick={handleBackToMenu}>
                        Back to Menu
                    </button>
                </>
            )}
            {error && <div className="error">Error: {error}</div>}
        </div>
    );
}

export default LeaderboardEntry;