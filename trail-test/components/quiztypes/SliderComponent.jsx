import React, { useState } from 'react';
import styles from '../../src/css/TrailCreate.module.css';

const SliderComponent = ({ correctValue, minValue, maxValue, setCorrectValue, setMinValue, setMaxValue, quizMode }) => {
const [userValue, setUserValue] = useState(0);

const handleSliderChange = (e) => {
  const newValue = e.target.value;
  console.log(minValue);
  console.log(maxValue);
  setUserValue(newValue);
  //setCorrectValue(newValue); // Updates parent component if necessary
};

  return (
    <>
      {!quizMode ? (
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
      ) : (
        <div className='col-6 d-flex align-items-center justify-content-center pt-4'>
          <div className="mb-2">
            <strong>Current Value: {userValue}</strong>
          </div>
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={userValue}
            onChange={handleSliderChange}
            className='form-range ps-3'
          />
          <div className="d-flex justify-content-between w-100 mt-2">
            <span>Min: {minValue}</span>
            <span>Max: {maxValue}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default SliderComponent;