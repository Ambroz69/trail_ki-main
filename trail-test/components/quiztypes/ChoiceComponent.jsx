import React, { useState, useEffect } from 'react';
import styles from '../../src/css/TrailCreate.module.css';

const ChoiceComponent = ({ quizType, answers, handleChangeAnswer, handleRemoveAnswer, quizMode }) => {

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedMultiAnswers, setSelectedMultiAnswers] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const handleSelectAnswer = (index) => {
    if(quizType === 'multiple') {
      setSelectedMultiAnswers(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    } else {
      setSelectedAnswer(index);
    }
  };  

  const toLetters = (num) => {
    "use strict";
    var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
  };

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    if (quizMode) {
      setShuffledAnswers(shuffleArray(answers.map(answer => answer.text)));
    }
  }, [quizMode, answers]);

  return (
    <>
      {!quizMode ? (
        <div>
          <label className={`${styles.form_label} form-label mb-1`}>{quizType === 'multiple' ? "Create Answers (check the correct asnwers)" : "Create Answers (first is correct)"}</label>
          {answers.map((answer, index) => (
            <div className='d-flex justify-content-between align-items-center mb-3' key={index}>
              {index === 0 ? (
                <div className={quizType === 'multiple' ? 'col-10' : 'col-11'}>
                  <input
                    type="text"
                    value={answer.text}
                    onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
                    className={`${styles.form_input} form-control`}
                  />
                </div>
              ) : (
                <div className={quizType === 'multiple' ? 'col-10' : 'col-11'}>
                  <input
                    type="text"
                    value={answer.text}
                    onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
                    className={`${styles.form_input} form-control`}
                  />
                </div>
              )}
              {quizType === 'multiple' && (
                <div className='col-1 d-flex justify-content-center'>
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={e => handleChangeAnswer(index, 'isCorrect', e.target.checked)}
                    className={`form-check-input`}
                  />
                </div>
              )}
              <div className='col-1 d-flex justify-content-end'>
                <button className={`btn ${styles.point_delete_button}`} onClick={() => handleRemoveAnswer(index)}>X</button>
              </div>
            </div>
          ))}
        </div>
      ) : ( // quizMode true
        <div>
          <label className={`${styles.form_label} form-label mb-1`}>{quizType === 'multiple' ? "Find the Correct Answers" : "Find the Correct Answer (one is correct)"}</label>
          {shuffledAnswers.map((answer, index) => (
            <div className='d-flex justify-content-between align-items-center mb-3' key={index} onClick={() => handleSelectAnswer(index)} style={{ cursor: 'pointer' }}>
              <div className='col-1 d-flex justify-content-start'>
                <p className={`${(selectedAnswer === index || selectedMultiAnswers.includes(index)) ? styles.accordion_point_answers_index_correct : styles.accordion_point_answers_index} p-2 m-0 text-center`}>{toLetters(index + 1)}</p>
              </div>
              <div className='col-11'>
                <p className={`${(selectedAnswer === index || selectedMultiAnswers.includes(index)) ? styles.accordion_point_answers_text_correct : styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChoiceComponent;