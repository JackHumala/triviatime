import React, { useState, useEffect } from 'react';
import './Card.css';

function Card({ score, setScore, onGameOver }) {

    // State variables
    const [answer, setAnswer] = useState(null);
    const [correct, setCorrect] = useState(false);
    const [question, setQuestion] = useState("");
    const [choices, setChoices] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [questionsDB, setQuestionsDB] = useState([]);

    //fetch questions
    useEffect(() => {
    fetch('/api/questions')
        .then(res => res.json())
        .then(data => {
            setQuestionsDB(data);
        })
        .catch(err => console.error('Error fetching questions:', err));
    }, []);

    //state variable to prevent 2 questions loading on startup
    const [questionLoaded, setQuestionLoaded] = useState(false);

    useEffect(() => {
        if (questionsDB.length > 0 && !questionLoaded) {
            loadNewQuestion(questionsDB);
            setQuestionLoaded(true); //prevent multiple calls
        }
    }, [questionsDB, questionLoaded]);

    const shuffleArray = (arr) => {
        return arr.sort(() => Math.random() - 0.5);
    };

    const loadNewQuestion = (data = questionsDB) => {
        const randomQ = data[Math.floor(Math.random() * data.length)];
        const allChoices = shuffleArray([...randomQ.choices, randomQ.answer]); //Combine and shuffle choices and answer
        setQuestion(randomQ.question);
        setChoices(allChoices);
        setCorrectAnswer(randomQ.answer);
        setAnswer(null);
        setCorrect(false);
    };

    const handleAnswerClick = (choice) => {
        if (answer) return;

        setAnswer(choice);
        if (choice === correctAnswer) {
            setCorrect(true);
            setScore(score + 1);
            setTimeout(() => loadNewQuestion(), 2000);
        } else {
            setCorrect(false);
            setTimeout(() => onGameOver(), 2000);
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">Question</h2>
            <p className="card-content">{question}</p>

            {choices.map((c, i) => (
                <button key={i} onClick={() => handleAnswerClick(c)} disabled={answer !== null}>
                    {c}
                </button>
            ))}

            {answer && (
                <p className="feedback">
                    {correct ? "Correct! Get ready for the next question..." : "Wrong answer! Game over!"}
                </p>
            )}
        </div>
    );
}

export default Card;