import React, { useState } from 'react';
import styles from '../../src/css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

const ShortAnswerComponent = ({ value, onChange, quizMode, handleAnswer }) => {
  const [tempAnswer, setTempAnswer] = useState(value || '');
  const { t } = useTranslation(); // Hook to access translations

  const handleChange = (e) => {
    setTempAnswer(e.target.value);
    handleAnswer(e.target.value);
  }

  return (
    <div className='mb-3'>
      <label className={`${styles.form_label} form-label mb-1`}>{t('short_title_answers')}</label>
      {quizMode ? (
        <input
          type="text"
          value={tempAnswer}
          onChange={handleChange}
          className={`${styles.form_input} form-control`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${styles.form_input} form-control`}
        />
      )}

    </div>
  );
}

export default ShortAnswerComponent;