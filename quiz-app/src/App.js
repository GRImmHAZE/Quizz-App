import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar, Button } from 'react-bootstrap';
import './App.css'

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);

  useEffect(() => {
    axios.get('assets/questions.json')
      .then(response => setQuizData(response.data))
      .catch(error => console.error('Error fetching quiz data:', error));
  }, []);

  const handleOptionSelect = (optionIndex) => {
    // Add a delay to simulate the animation
    setTimeout(() => {
      const updatedUserAnswers = [...userAnswers];
      updatedUserAnswers[currentQuestionIndex] = optionIndex;
      setUserAnswers(updatedUserAnswers);
      setOptionSelected(true);
  
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setOptionSelected(false); // Reset optionSelected state
      } else {
        calculateScore();
        setQuizCompleted(true);
      }
    }, 500); // Adjust this delay to match your animation duration
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1 && optionSelected) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setOptionSelected(false); // Reset optionSelected state
    } else if (optionSelected) {
      calculateScore();
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((userAnswerIndex, questionIndex) => {
      const correctAnswerIndex = quizData.questions[questionIndex].options.findIndex(option => option.isCorrect);
      if (userAnswerIndex === correctAnswerIndex) {
        score++;
      }
    });
    setTotalScore(score);
  };

  const progress = quizData ? ((currentQuestionIndex + 1) / quizData.questions.length) * 100 : 0;

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTotalScore(0);
    setQuizCompleted(false);
    setOptionSelected(false);
  };

  return (
    <div className="container">
      <div className="header">
        {quizData && (
          <div className="question-nav">
            <div className="nav-button w-100">
              <button className="navbutt" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>{'<'}</button>
              <span><strong>{currentQuestionIndex + 1}</strong> / {quizData.questions.length}</span>
              <button className="navbutt" onClick={handleNextQuestion} disabled={currentQuestionIndex === quizData.questions.length - 1 || !optionSelected}>{'>'}</button>
            </div>
            <ProgressBar now={progress} />
            {quizCompleted && (
              <div>
                <p>Quiz completed! Your score: {totalScore}</p>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            )}
          </div>
        )}
      </div>
      {quizData && !quizCompleted ? (
        <div className="body">
          <div className="question-container">
            <h3 className="question mt-5">{quizData.questions[currentQuestionIndex].question}</h3>
          </div>
          <div className="options-container">
            <ul className='liststyle d-grid gap-2'>
              {quizData.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <li key={optionIndex} className='d-grid gap-2'>
                  <Button size="lg"
                    className={`option-button ${userAnswers[currentQuestionIndex] === optionIndex ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(optionIndex)}
                    disabled={optionSelected}
                  >
                    {option.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading quiz data...</p>
      )}
    </div>
  );
};

export default Quiz;
