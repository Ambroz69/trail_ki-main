import React, { useState } from 'react';
import styles from '../../src/css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

const TrueFalseComponent = ({ value, answer, handleChangeAnswer, quizMode }) => {
  const [tempAnswer, setTempAnswer] = useState([{ text: 'false', isCorrect: false }]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { t } = useTranslation(); // Hook to access translations

  const handleChange = (isCorrect) => {
    setSelectedAnswer(isCorrect);
    handleChangeAnswer(isCorrect);
  }

  return (
    <>
      {!quizMode ? (
        <>
          {answer.text = String(answer.isCorrect)}
          <div className='mb-3'>
            <label className={`${styles.form_label} form-label mb-1`}>{t('truefalse_correct_answer')}</label>
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
        </>
      ) : (

        <>
          < div className='d-flex justify-content-between align-items-center mb-3' onClick={() => handleChange(true)} style={{ cursor: 'pointer' }}>
            <div className={`flex-fill`}>
              <p className={`${selectedAnswer ? styles.accordion_point_answers_text_correct : styles.accordion_point_answers_text} px-4 py-3 mb-0`}>TRUE</p>
            </div>
          </div >
          < div className='d-flex justify-content-between align-items-center mb-3'onClick={() => handleChange(false)} style={{ cursor: 'pointer' }}>
            <div className={`flex-fill`}>
              <p className={`${!selectedAnswer ? styles.accordion_point_answers_text_correct : styles.accordion_point_answers_text} px-4 py-3 mb-0`}>FALSE</p>
            </div>
          </div >
          {/*<div className='mb-3'>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="trueFalseRadio" id="optionTrue" value="true" readOnly checked={selectedAnswer === true} onChange={() => handleChange(true)} />
            <label className={`${styles.form_label} form-check-label`} htmlFor="optionTrue">
              {t('true')}
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="trueFalseRadio" id="optionFalse" value="false" readOnly checked={selectedAnswer === false} onChange={() => handleChange(false)} />
            <label className={`${styles.form_label} form-check-label`} htmlFor="optionFalse">
              {t('false')}
            </label>
          </div>
        </div>*/}
        </>
      )}
    </>
  );
}

export default TrueFalseComponent;