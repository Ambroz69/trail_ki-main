import React from 'react';
import styles from '../../src/css/TrailCreate.module.css';

const ChoiceComponent = ({ quizType, answers, handleChangeAnswer, handleRemoveAnswer }) => {
  return (
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
  );
};

export default ChoiceComponent;