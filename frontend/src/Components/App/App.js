import React, { useState } from 'react';
import MainMenu    from '../MainMenu/MainMenu';
import Card        from '../Card/Card';
import Leaderboard from '../Leaderboard/Leaderboard';
import LeaderboardEntry from '../LeaderboardEntry/LeaderboardEntry';

function App() {
  
  const [view, setView] = useState('menu');
  const [score, setScore] = useState(0); // State for game score

  const startGame       = () => setView('game');
  const showLeaderboard = () => setView('leaderboard');
  const backToMenu      = () => setView('menu');
  const gameOver        = () => setView('gameover');
  
  const resetScore = () => setScore(0);

  const exitGame = () => {
    resetScore();
    backToMenu();
  };

  return (
    <div className="App">
      {view === 'menu' && (
        <MainMenu
          onStart={startGame}
          onViewLeaderboard={showLeaderboard}
        />
      )}

      {view === 'game' && (
        <>
          <div className="game-controls">
            <button className="back-btn" onClick={backToMenu}>
              ← Back to Menu
            </button>
            <button className="exit-btn" onClick={exitGame}>
              Exit Game
            </button>
          </div>
          <score className="score">Score: {score}</score>
          <Card score={score} setScore={setScore} onGameOver={gameOver} />
        </>
      )}

      {view === 'leaderboard' && (
        <>
          <button className="back-btn" onClick={backToMenu}>
            ← Back to Menu
          </button>
          <Leaderboard />
        </>
      )}

      {view === 'gameover' && (
        <>
          <LeaderboardEntry score={score} onViewLeaderboard={showLeaderboard} resetScore={resetScore}/>
        </>
      )}

    </div>
  );
}

export default App;
