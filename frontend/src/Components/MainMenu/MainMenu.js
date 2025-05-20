// src/components/MainMenu/MainMenu.js
import React from 'react';
import './MainMenu.css';  // as needed

export default function MainMenu({ onStart, onViewLeaderboard }) {
  return (
    <div className="main-menu">
      <img src="/images/trivia-logo.jpg" alt="Trivia Time Logo" className="trivia-logo" />
      <h1>Welcome to Trivia Time</h1>
      <button onClick={onStart}>Start Game</button>
      <button onClick={onViewLeaderboard}>Leaderboard</button>
    </div>
  );
}
