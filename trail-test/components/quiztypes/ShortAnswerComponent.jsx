import React from 'react';
import styles from '../../src/css/TrailCreate.module.css';

const ShortAnswerComponent = ({ value, onChange }) => {
  return (
    <div className='mb-3'>
      <label className={`${styles.form_label} form-label mb-1`}>Insert the correct answer</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${styles.form_input} form-control`}
      />
    </div>
  );
}

export default ShortAnswerComponent;