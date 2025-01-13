import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';

import Cookies from "universal-cookie";

import TrailMap from '../../components/TrailMap';
import SliderComponent from '../../components/quiztypes/SliderComponent'
import ShortAnswerComponent from '../../components/quiztypes/ShortAnswerComponent';
import TrueFalseComponent from '../../components/quiztypes/TrueFalseComponent';
import ChoiceComponent from '../../components/quiztypes/ChoiceComponent';
import PairsComponent from '../../components/quiztypes/PairsComponent';
import OrderComponent from '../../components/quiztypes/OrderComponent';

// svg import
import accordion_points from '../assets/accordion_points.svg';
import accordion_question_type from '../assets/accordion_question_type.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CertificationTrail = () => {
  const [trail, setTrail] = useState(null);
  const [point, setPoint] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [tempAnswer, setTempAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configuration)
      .then((response) => {
        setTrail(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const toLetters = (num) => {
    "use strict";
    var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
  };

  const handleProximityTask = (pointProximity) => {
    setPoint(pointProximity);
    setFeedback(null); // clear feedback on new point
    setTempAnswer(null); // clear temp answer
  }

  const handleAnswerSubmit = () => {
    if (!point || !point.quiz) return;
    let isCorrect = null;
    switch (point?.quiz?.type) {
      case 'short-answer': {
        const correctAnswer = point.quiz.answers[0].text.trim().toLowerCase();
        console.log(correctAnswer);
        isCorrect = tempAnswer.trim().toLowerCase() === correctAnswer;
      }
      case 'single': break;
      case 'multiple': break;
      case 'slider': {
        isCorrect = tempAnswer === point.quiz.answers[0].text; 
        break;
      }
      case 'pairs': break;
      case 'order': break;
      case 'true-false': {
        isCorrect = tempAnswer === point.quiz.answers[0].isCorrect; 
        break;
      }
      default: break;
    }

    // add users answer to state
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: point.quiz._id,
        providedAnswer: tempAnswer,
        isCorrect,
      },
    ]);
    console.log(isCorrect);
    // update score
    if (isCorrect) {
      setScore((prev) => prev + point.quiz.points);
      setFeedback(point.quiz.feedback.correct);
    } else {
      setFeedback(point.quiz.feedback.incorrect);
    }
  }

  return (
    <div className={`${styles.show_trail_bg} d-flex container-fluid mx-0 px-0`}>
      <div className='col-3 pe-4'>
        <Navbar />
      </div>
      <div className={`col-9 ps-4 pe-5 mt-5`}>
        <div className={`${styles.white_bg} p-0`}>
          <div className='mb-5'>
            <TrailMap
              points={trail?.points}
              height='30rem'
              editable={false}
              useGPS={true}
              onProximityTask={handleProximityTask}
            />
          </div>
          <p className={`${styles.overview_heading} pb-2 mx-4 mt-4 mb-4`}>Points of Interest</p>
          <div className={`col-12 p-4 pt-0`}>
            <div className='d-flex flex-column w-100 p-2'>
              <p className={`${styles.accordion_point_title} mb-2`}>{point?.title}</p>
              <div className='d-flex'>
                {point?.quiz ? (
                  <>
                    <div className='col-6 d-flex'>
                      <div>
                        <img src={accordion_question_type} alt="accordion_question_type" className='pe-2' style={{ width: '1.3rem', height: '1.3rem' }} />
                      </div>
                      <p className={`${styles.accordion_point_question_type} m-0`}>
                        {(() => {
                          switch (point?.quiz?.type) {
                            case 'short-answer': return ("Short Written Answer");
                            case 'single': return ("Single Correct Answer");
                            case 'multiple': return ("Multiple Correct Answers");
                            case 'slider': return ("Slider");
                            case 'pairs': return ("Matching Pairs");
                            case 'order': return ("Ordering");
                            case 'true-false': return ("True/False");
                            default: return (<></>);
                          }
                        })()}
                      </p>
                    </div>
                    <div className='col-6 d-flex'>
                      <img src={accordion_points} alt="accordion_points" className='pe-2 pt-0' />
                      <p className={`${styles.accordion_point_question_type} m-0`}>{point?.quiz.points} {point?.quiz.points === 1 ? " point" : " points"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className={`${styles.accordion_point_question_type} m-0`}>Keep looking for points of interest</p>
                  </>
                )}
              </div>
              <div className='p-2 pt-0'>
                <p className={`${styles.accordion_text_gray}`}>{point?.content}</p>
                {point?.quiz ? (
                  <>
                    <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                      <p className={`${styles.accordion_text_gray} my-2`}>{point?.quiz.question}</p>
                      {(() => {
                        switch (point?.quiz.type) {
                          case 'short-answer': return (
                            <>
                              <div className='my-1'>
                                <ShortAnswerComponent
                                  value={tempAnswer || ''}
                                  quizMode={true}
                                  handleAnswer={(userAnswer) => { setTempAnswer(userAnswer); }}
                                />
                              </div>
                            </>);
                          case 'single':
                          case 'multiple': return (
                            <>
                              {point?.quiz.answers.map((answer, index) => (
                                <div className='d-flex my-1'>
                                  <div className='col-1 d-flex justify-content-start'>
                                    <p className={`${answer.isCorrect ? styles.accordion_point_answers_index_correct : styles.accordion_point_answers_index} p-2 m-0 text-center`}>{toLetters(index + 1)}</p>
                                  </div>
                                  <div className='col-11'>
                                    <p className={`${answer.isCorrect ? styles.accordion_point_answers_text_correct : styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer.text}</p>
                                    {/*  <p className={answer.isCorrect? styles.test1 : styles.test2}>{answer.text}</p> */}
                                  </div>
                                </div>
                              ))}
                            </>);
                          case 'slider': return (
                              <SliderComponent 
                                correctValue={point?.quiz.answers[0].minValue}
                                minValue={point?.quiz.answers[0].minValue}
                                maxValue={point?.quiz.answers[0].maxValue}
                                setCorrectValue={correctValue => setTempAnswer(correctValue)}
                                quizMode={true}
                              />
                            );
                          case 'pairs': return (
                            <>
                              {point?.quiz.answers.map((answer) => (
                                <div className='d-flex my-1'>
                                  <div className='col-6 pe-2'>
                                    <p className={`${styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer.text}</p>
                                  </div>
                                  <div className='col-6 ps-2'>
                                    <p className={`${styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer.pairText}</p>
                                  </div>
                                </div>
                              ))}
                            </>);
                          case 'order': return (
                            <>
                              {point?.quiz.answers.map((answer) => (
                                <div className='my-1'>
                                  <p className={`${styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer.text}</p>
                                </div>
                              ))}
                            </>);
                          case 'true-false': return (
                            <>
                              <TrueFalseComponent
                                quizMode={true}
                                value={tempAnswer}
                                answer={point?.quiz.answers[0]}
                                handleChangeAnswer={setTempAnswer}
                              />                              
                            </>);
                          default: return (<></>);
                        }

                      }
                      )()}
                    </div>
                    <button className='btn btn-primary mt-3' onClick={handleAnswerSubmit} disabled={tempAnswer === null}>Submit Answer</button>
                    {feedback && (
                      <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                        <p className={`${styles.accordion_text_gray} my-2`}>Answer Feedback</p>
                        <div className={feedback === point.quiz.feedback.correct ? 'my-1' : 'my-1 d-none'}>
                          <p className={`${styles.accordion_correct_feedback} p-2 ps-2 m-0`}>{feedback}</p>
                        </div>
                        <div className={feedback !== point.quiz.feedback.correct ? 'my-1' : 'my-1 d-none'}>
                          <p className={`${styles.accordion_incorrect_feedback} p-2 ps-2 m-0`}>{feedback}</p>
                        </div>
                      </div>

                    )}
                  </>
                ) : (
                  <>

                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationTrail;