import React from 'react';
import styles from '../src/css/TrailCreate.module.css';

const AlertComponent = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`d-flex flex-column mt-1 pt-2`}>
      <div className={type === "success" ? "my-1" : "my-1 d-none"}>
        <p className={`${styles.accordion_correct_feedback} p-2 ps-2 m-0`}>{type === "success" ? "Success" : "Error"}: {message}</p>
      </div>
      <div className={type === "error" ? "my-1" : "my-1 d-none"}>
        <p className={`${styles.accordion_incorrect_feedback} p-2 ps-2 m-0`}>{type === "success" ? "Success" : "Error"}: {message}</p>
      </div>
    </div>
  );
};

export default AlertComponent;