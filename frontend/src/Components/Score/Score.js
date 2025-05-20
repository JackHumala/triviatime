import React from 'react';
import './Score.css';

function Score({ score }) {
    return (
        <div className="score">
            <h3>Your Score: {score}</h3>
        </div>
    );
}

export default Score;