import React from 'react';
import styles from '../../src/css/TrailCreate.module.css';

const SliderComponent = ({ correctValue, minValue, maxValue, setCorrectValue, setMinValue, setMaxValue }) => {
  return (
    <>
      <div className='mb-3 d-flex'>
        <div className='col-6 pe-3'>
          <label className={`${styles.form_label} form-label mb-1`}>Minimum value</label>
          <input
            type="number"
            value={minValue}
            onChange={e => setMinValue(e.target.value)}
            className={`${styles.form_input} form-control`}
          />
        </div>
        <div className='col-6 ps-3'>
          <label className={`${styles.form_label} form-label mb-1`}>Maximum value</label>
          <input
            type="number"
            value={maxValue}
            onChange={e => setMaxValue(e.target.value)}
            className={`${styles.form_input} form-control`}
          />
        </div>
      </div>
      <div className='mb-3 d-flex'>
        <div className='col-6 pe-3'>
          <label className={`${styles.form_label} form-label mb-1`}>Correct Value</label>
          <input
            type="number"
            value={correctValue}
            onChange={e => setCorrectValue(e.target.value)}
            className={`${styles.form_input} form-control`}
          />
        </div>
        <div className='col-6 d-flex align-items-center justify-content-center pt-4'>
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={correctValue}
            onChange={e => setCorrectValue(e.target.value)}
            className='form-range ps-3'
          />
        </div>
      </div>
    </>
  );
}

export default SliderComponent;