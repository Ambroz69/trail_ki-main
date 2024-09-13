import React, { useState } from 'react';
import styles from '../../src/css/TrailCreate.module.css';

const TrueFalseComponent = ({ value, answer, handleChangeAnswer, quizMode }) => {
  const [tempAnswer, setTempAnswer] = useState([{ text: 'false', isCorrect: false }]);
  return (
    <>
      {!quizMode ? (
        <div className='mb-3'>
          <label className={`${styles.form_label} form-label mb-1`}>Correct answer</label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={answer.isCorrect}
              onChange={e => handleChangeAnswer(0, "isCorrect", e.target.checked)}
              id="flexSwitchCheckDefault" />
            <label className={`${styles.form_label} form-check-label`} htmlFor="flexSwitchCheckDefault">{value ? "True" : "False"}</label>
          </div>
        </div>
      ) : (
        <div className='mb-3'>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={tempAnswer.isCorrect}
              onChange={e => setTempAnswer({ text: String(e.target.checked), isCorrect: e.target.checked })}
              id="flexSwitchCheckDefaultQuiz" />
            <label className={`${styles.form_label} form-check-label`} htmlFor="flexSwitchCheckDefaultQuiz">{tempAnswer.isCorrect ? "True" : "False"}</label>
          </div>
        </div>
      )}
    </>
  );
}

export default TrueFalseComponent;