import React, { useState, useEffect } from 'react';
import styles from '../../src/css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

const ChoiceComponent = ({ quizType, answers, handleChangeAnswer, handleRemoveAnswer, handleQuizAnswer, quizMode }) => {

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedMultiAnswers, setSelectedMultiAnswers] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState([]);
  const { t } = useTranslation(); // Hook to access translations

  const handleSelectAnswer = (index) => {
    if (quizType === 'multiple') {
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

  // Handle selecting/deselecting answers
  const handleSelectQuizAnswer = (index) => {
    let newSelectedAnswers;
    if (quizType === 'multiple') {
      newSelectedAnswers = selectedQuizAnswers.includes(index)
        ? selectedQuizAnswers.filter((i) => i !== index) // Remove if already selected
        : [...selectedQuizAnswers, index]; // Add if not selected
    } else {
      newSelectedAnswers = [index]; // Only one answer can be selected
    }
    setSelectedQuizAnswers(newSelectedAnswers); // Update the state
    //console.log(shuffledAnswers);
    // Use the new state to get the selected answers
    const selected = newSelectedAnswers.map((i) => shuffledAnswers[i]);
    //console.log(selected);
    //if (JSON.stringify(selectedQuizAnswers) !== JSON.stringify(newSelectedAnswers)) {
      handleQuizAnswer(selected); // Pass updated answers to the parent
    //}
  };

  const handleSubmit = () => {
    const selected = selectedQuizAnswers.map((index) => shuffledAnswers[index]);
    handleQuizAnswer(selected);
  }

  useEffect(() => {
    if (quizMode) {
      setShuffledAnswers(shuffleArray(answers.map(answer => answer.text)));
    }
  }, [quizMode, answers]);

  return (
    <>
      {!quizMode ? (
        <div>
          <label className={`${styles.form_label} form-label mb-1`}>{quizType === 'multiple' ? `${t('choice_create_correct_answers')}` : `${t('choice_create_first_answers')}`}</label>
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
          <label className={`${styles.form_label_2} my-2`}>{quizType === 'multiple' ? `${t('choice_find_correct_answers')}` : `${t('choice_find_correct_answer')}`}</label>
          {shuffledAnswers.map((answer, index) => (
            <div className='d-flex justify-content-between align-items-center mb-3' key={index} onClick={() => handleSelectQuizAnswer(index)} style={{ cursor: 'pointer' }}>
              <div className={`me-3`} >
                <p className={`${(selectedQuizAnswers.includes(index)) ? styles.accordion_point_answers_index_correct : styles.accordion_point_answers_index} px-4 py-3 mb-0`}>{toLetters(index + 1)}</p>
              </div>
              <div className={`flex-fill`}>
                <p className={`${(selectedQuizAnswers.includes(index)) ? styles.accordion_point_answers_text_correct : styles.accordion_point_answers_text} px-4 py-3 mb-0`}>{answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChoiceComponent;