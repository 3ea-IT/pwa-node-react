import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import leftarrow from './assets/leftarrow.png';
import nextIcon from './assets/nextIcon.png';
import skipIcon from './assets/skipIcon.png';
import trophyImage from './assets/trophy.png';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [timer, setTimer] = useState(10);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizId, setQuizId] = useState(null);
    const [answerSaved, setAnswerSaved] = useState([false, false, false, false, false]);
    const [resultSaved, setResultSaved] = useState(false);
    const [answersCount, setAnswersCount] = useState(0);

    const timerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
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
                    setAnswerSaved([false, false, false, false, false]);
                    setResultSaved(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the questions!', error);
                });
            })
            .catch(err => {
                console.error('There was an error fetching the latest quiz ID!', err);
            });
        };

        startQuiz();
    }, []);

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
            setAnswersCount(answersCount + 1);
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
    }, [quizComplete, resultSaved, quizId, score]);

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <button className="back-button" onClick={() => navigate(-1)}><img src={leftarrow}></img></button>
                {!quizComplete && (
                <span className="question-number">Question {currentQuestion + 1}/5</span>
                )}
            </div>
            {quizComplete ? (
                <div className="quiz-complete-container">
                    <div className="result-card">
                        <img src={trophyImage} alt="Trophy" className="trophy-icon" />
                        <h2 className="result-title">Correct Answer</h2>
                        <p className="score">{score}/5</p>
                        <p className="congratulations">Congratulations, you've completed this quiz!</p>
                        <p className="encouragement">Let's keep testing your knowledge by playing more quizzes.</p>
                        <button className="explore-more-btn">Explore More</button>
                    </div>
                </div>
            ) : (
                <div className="question-container">
                    <div className="question-text">
                        {questions[currentQuestion]?.question}
                    </div>
                    <div className="timer-container">
                        <span>Time</span>
                        <div className="timer-bar">
                            <div className="timer-fill" style={{ width: `${(timer / 10) * 100}%` }}></div>
                        </div>
                        <span>{timer}s</span>
                    </div>
                    <div className="options-container">
                        {questions[currentQuestion]?.option1 && (
                            <div
                                className={`option ${selectedAnswer === 1 ? 'selected' : ''}`}
                                onClick={() => setSelectedAnswer(1)}
                            >
                                <span>A) </span>
                                <span>{questions[currentQuestion]?.option1}</span>
                                <span></span>
                            </div>
                        )}
                        {questions[currentQuestion]?.option2 && (
                            <div
                                className={`option ${selectedAnswer === 2 ? 'selected' : ''}`}
                                onClick={() => setSelectedAnswer(2)}
                            >
                                <span>B) </span>
                                <span>{questions[currentQuestion]?.option2}</span>
                                <span></span>
                            </div>
                        )}
                        {questions[currentQuestion]?.option3 && (
                            <div
                                className={`option ${selectedAnswer === 3 ? 'selected' : ''}`}
                                onClick={() => setSelectedAnswer(3)}
                            >
                                <span>C) </span>
                                <span>{questions[currentQuestion]?.option3}</span>
                                <span></span>
                            </div>
                        )}
                        {questions[currentQuestion]?.option4 && (
                            <div
                                className={`option ${selectedAnswer === 4 ? 'selected' : ''}`}
                                onClick={() => setSelectedAnswer(4)}
                            >
                                <span>D) </span>
                                <span>{questions[currentQuestion]?.option4}</span>
                                <span></span>
                            </div>
                        )}
                    </div>
                    <div className="nav-buttons-quiz">
                        <button className="nav-button-quiz answer-count"><span>{answersCount}/5</span><br></br>Answers</button>
                        <button className="nav-button-quiz next" onClick={handleNext}><img src={nextIcon}></img><br></br>Next</button>
                        <button className="nav-button-quiz skip" onClick={handleNext}><img src={skipIcon}></img><br></br>Skip</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
