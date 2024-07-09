import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import './PlayAndEarn.css';
import axios from 'axios';

const PlayAndEarn = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [timer, setTimer] = useState(10);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizId, setQuizId] = useState(null);
    const [answerSaved, setAnswerSaved] = useState([false, false, false, false, false]); // Track answer saved state for each question
    const [resultSaved, setResultSaved] = useState(false);

    const timerRef = useRef(null);

    const startQuiz = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/latest-quiz-id', {
            headers: { 'x-access-token': token }
        })
        .then(res => {
            setQuizId(res.data.latestQuizId + 1);
            axios.get('http://localhost:5000/get-questions', {
                headers: { 'x-access-token': token }
            })
            .then(response => {
                setQuestions(response.data);
                setQuizStarted(true);
                setAnswerSaved([false, false, false, false, false]); // Reset answer saved state when starting the quiz
                setResultSaved(false); // Reset result saved state
            })
            .catch(error => {
                console.error('There was an error fetching the questions!', error);
            });
        })
        .catch(err => {
            console.error('There was an error fetching the latest quiz ID!', err);
        });
    };

    useEffect(() => {
        if (quizStarted && !quizComplete) {
            timerRef.current = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer === 1) {
                        handleNext();
                        return 10;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(timerRef.current);
        }
    }, [quizStarted, currentQuestion, quizComplete]);

    const handleNext = () => {
        if (quizId === null) {
            console.error('Quiz ID is null, answer not saved!');
            return;
        }

        const token = localStorage.getItem('token');
        const correctAnswer = questions[currentQuestion]?.ans;
        const isCorrect = selectedAnswer === correctAnswer ? 1 : 0;

        const answerData = {
            ques_id: questions[currentQuestion].id,
            ans: selectedAnswer !== null ? selectedAnswer : 0,
            is_correct: isCorrect,
            quiz_id: quizId,
        };

        // Prevent multiple submissions
        if (!answerSaved[currentQuestion]) {
            axios.post('http://localhost:5000/save-answer', answerData, {
                headers: { 'x-access-token': token }
            })
            .then(response => {
                console.log('Answer saved successfully');
                setAnswerSaved(prevState => {
                    const newState = [...prevState];
                    newState[currentQuestion] = true;
                    return newState;
                });
            })
            .catch(error => {
                console.error('There was an error saving the answer!', error);
            });
        }

        if (selectedAnswer !== null && selectedAnswer === correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestion < 4) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setTimer(10);
        } else {
            setQuizComplete(true);
        }
    };

    useEffect(() => {
        if (quizComplete && !resultSaved) {
            const token = localStorage.getItem('token');
            const result = `${score}/5`;
            const points = score * 10;
            setResultSaved(true);
            axios.post('http://localhost:5000/save-quiz-result', { score: result, points, quiz_id: quizId }, {
                headers: { 'x-access-token': token }
            })
            .then(response => {
                console.log('Quiz result saved successfully');
            })
            .catch(error => {
                console.error('There was an error saving the quiz result!', error);
            });
        }
    }, [quizComplete, resultSaved, quizId, score]); // Only run when quizComplete changes

    return (
        <div className="play-and-earn-container">
            <Navbar />
            {quizComplete ? (
                <div>
                    <h1>Quiz Complete!</h1>
                    <p>Your score: {score} / 5</p>
                </div>
            ) : (
                <div>
                    <h1>QUIZ</h1>
                    {!quizStarted ? (
                        <button onClick={startQuiz}>Play Quiz</button>
                    ) : (
                        questions.length > 0 && (
                            <div className="question-container">
                                <h2>{questions[currentQuestion]?.question}</h2>
                                <div className="options">
                                    <button onClick={() => setSelectedAnswer(1)} className={selectedAnswer === 1 ? 'selected' : ''}>{questions[currentQuestion]?.option1}</button>
                                    <button onClick={() => setSelectedAnswer(2)} className={selectedAnswer === 2 ? 'selected' : ''}>{questions[currentQuestion]?.option2}</button>
                                    <button onClick={() => setSelectedAnswer(3)} className={selectedAnswer === 3 ? 'selected' : ''}>{questions[currentQuestion]?.option3}</button>
                                    <button onClick={() => setSelectedAnswer(4)} className={selectedAnswer === 4 ? 'selected' : ''}>{questions[currentQuestion]?.option4}</button>
                                </div>
                                <div className="timer">Time left: {timer}s</div>
                                <button onClick={handleNext}>Next</button>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default PlayAndEarn;
