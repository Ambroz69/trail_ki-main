import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import styles from '../css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

import Cookies from "universal-cookie";

import TrailMap from '../../components/TrailMap';
import SliderComponent from '../../components/quiztypes/SliderComponent'
import ShortAnswerComponent from '../../components/quiztypes/ShortAnswerComponent';
import TrueFalseComponent from '../../components/quiztypes/TrueFalseComponent';
import ChoiceComponent from '../../components/quiztypes/ChoiceComponent';
import PairsComponent from '../../components/quiztypes/PairsComponent';
import OrderComponent from '../../components/quiztypes/OrderComponent';
import NavbarExplorer from '../NavbarExplorer';

// svg import
import accordion_points from '../assets/accordion_points.svg';
import accordion_question_type from '../assets/accordion_question_type.svg';
import title_page_logo from '../../src/assets/title_page_logo.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CertificationTrail = () => {
  const [trail, setTrail] = useState(null);
  const [point, setPoint] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [tempAnswer, setTempAnswer] = useState(null);
  const [rightPairAnswer, setRightPairAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const { id } = useParams();
  const { t } = useTranslation(); // Hook to access translations
  const [certificationId, setCertificationId] = useState(null); // store id if exists
  const [totalPoints, setTotalPoints] = useState(0);

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
        setTotalPoints(response.data.points.reduce((sum, point) => sum + (point.quiz?.points || 0), 0));
      })
      .catch((error) => {
        console.log(error);
      });
    
    // check if a certification already exists for this user and trail
    const configurationC = {
      method: "get",
      url: `${backendUrl}/certifications/user/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    api(configurationC)
      .then((response) => {
        if(response.data) {
          if(response.data.status === null) {
            setCertificationId(response.data._id);
            setUserAnswers(response.data.answers || []);
            setScore(response.data.score || 0);
            setAnsweredQuestions(new Set(response.data.answers.map(ans => ans.questionId)));
          } else {
            setCertificationId(null);
            setUserAnswers([]);
            setScore(0);
            setAnsweredQuestions(new Set());
          }
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("No existing certification found, starting new.");
      })
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
    const questionId = point.quiz._id;
    // prevent answering the same question multiple times
    if (answeredQuestions.has(questionId)) {
      setFeedback(t('already_answered'));
      return;
    }

    let isCorrect = null;
    switch (point?.quiz?.type) {
      case 'short-answer': {
        const correctAnswer = point.quiz.answers[0].text.trim().toLowerCase();
        console.log(correctAnswer);
        isCorrect = tempAnswer.trim().toLowerCase() === correctAnswer;
      }
      case 'single': {
        const correcAnswer = point.quiz.answers.find((answer) => answer.isCorrect);
        isCorrect = tempAnswer.length === 1 && tempAnswer[0] === correcAnswer.text;
        break;
      }
      case 'multiple': {
        const correctAnswers = point.quiz.answers
          .filter((answer) => answer.isCorrect)
          .map((answer) => answer.text);
        isCorrect =
          tempAnswer.length === correctAnswers.length &&
          tempAnswer.every((index) => correctAnswers.includes(index));
        break;
      }
      case 'slider': {
        isCorrect = tempAnswer === point.quiz.answers[0].text;
        break;
      }
      case 'pairs': {
        const leftAnswers = point.quiz.answers
          .map((answer) => answer.text);
        const rightAnswers = point.quiz.answers
          .map((answer) => answer.pairText);
        isCorrect =
          tempAnswer.length === leftAnswers.length &&
          tempAnswer.every((value, index) => value === leftAnswers[index]) &&
          rightPairAnswer.length === rightAnswers.length &&
          rightPairAnswer.every((value, index) => value === rightAnswers[index]);
        break;
      }
      case 'order': {
        const correctAnswers = point.quiz.answers
          .map((answer) => answer.text);
        const sentAnswers = tempAnswer.map((answer) => answer.text);
        isCorrect =
          sentAnswers.length === correctAnswers.length &&
          sentAnswers.every((value, index) => value === correctAnswers[index]);
        break;
      }
      case 'true-false': {
        isCorrect = tempAnswer === point.quiz.answers[0].isCorrect;
        break;
      }
      default: break;
    }

    // add users answer to state
    const updatedAnswer = { questionId, providedAnswer: tempAnswer, isCorrect, };
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: questionId,
        providedAnswer: tempAnswer,
        isCorrect,
      },
    ]);
    // update score
    const newScore = isCorrect ? score + point.quiz.points : score;
    if (isCorrect) {
      setScore((prev) => prev + point.quiz.points);
      setFeedback(point.quiz.feedback.correct);
    } else {
      setFeedback(point.quiz.feedback.incorrect);
    }
    setShowFeedback(true);
    setTimeout(() => {
      // save answered question in state
      setAnsweredQuestions((prev) => new Set(prev).add(questionId));
      setShowFeedback(false);
      // check if user already has all questions answered, if not, save progress
      if (userAnswers.length + 1 === trail.points.length) {
        submitCertificationResults();
      } else {
        saveAnswerToDatabase(updatedAnswer, newScore);
      }
    }, 1000); // 10 seconds
  };

  const saveAnswerToDatabase = async (updatedAnswer, newScore) => {
    const certificationData = {
      userId: token ? JSON.parse(atob(token.split('.')[1])).userId : null,
      trail: id,
      score: newScore,
      status: null,
      answers: [...userAnswers, updatedAnswer],
    };

    try {
      if (certificationId) {
        const configuration = {
          method: "put",
          url: `${backendUrl}/certifications/${certificationId}`,
          data: certificationData,
          headers: { Authorization: `Bearer ${token}` },
        };

        api(configuration)
          .then()
          .catch((error) => {
            console.error("Error saving answer:", error);
          });
      } else {
        const configuration = {
          method: "post",
          url: `${backendUrl}/certifications`,
          data: certificationData,
          headers: { Authorization: `Bearer ${token}` },
        };

        api(configuration)
          .then((response) => {
            setCertificationId(response.data._id);
          })
          .catch((error) => {
            console.error("Error saving answer:", error);
          });
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const submitCertificationResults = () => {
    const totalQuestions = trail.points.length;
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const status = score >= totalPoints * 0.7 ? 'Passed' : 'Failed';

    const certificationData = {
      userId: token ? JSON.parse(atob(token.split('.')[1])).userId : null,
      trail: id,
      score: score,
      status,
      answers: userAnswers,
    }

    const configuration = {
      method: "post",
      url: `${backendUrl}/certifications`,
      data: certificationData,
      headers: { Authorization: `Bearer ${token}` },
    };

    api(configuration)
      .then(() => {
        setShowSummary(true); // Show summary after saving results
      })
      .catch((error) => {
        console.error("Error saving certification results:", error);
      });
  };

  return (
    <>
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg} py-3 px-0 offset-lg-2 col-lg-8`}>
        <div className={`col-12 ps-4 pe-5 mt-5`}>
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
            <p className={`${styles.overview_heading} pb-2 mx-4 mt-4 mb-4`}>{t('points_of_interest')}</p>
            <div className={`col-12 p-4 pt-0`}>
              <div className='d-flex flex-column w-100 p-2'>
                {showSummary ? (
                  <>
                    <div className='d-flex'>
                      <h2>{t('certification_results')}</h2>
                      <ul>
                        {trail.points.map((p, index) => (
                          <li key={p._id} className='d-flex justify-content-between'>
                            <span>{p.title}</span>
                            <span>{userAnswers[index]?.isCorrect ? '✔️' : '❌'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='d-flex'>
                      <div className='col-9 p-2'>
                        <p><strong>{t('total_score')}:</strong> {score} / {totalPoints}</p>
                        <p><strong>{t('status')}:</strong> {score >= totalPoints * 0.7 ? t('passed') : t('failed')}</p>
                      </div>
                      <div className='p-2'>
                        <Button variant="outline-dark">{t("get_certificate")}</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                                  case 'short-answer': return (`${t('short_answer')}`);
                                  case 'single': return (`${t('single')}`);
                                  case 'multiple': return (`${t('multiple')}`);
                                  case 'slider': return (`${t('slider')}`);
                                  case 'pairs': return (`${t('pairs')}`);
                                  case 'order': return (`${t('order')}`);
                                  case 'true-false': return (`${t('true_false')}`);
                                  default: return (<></>);
                                }
                              })()}
                            </p>
                          </div>
                          <div className='col-6 d-flex'>
                            <img src={accordion_points} alt="accordion_points" className='pe-2 pt-0' />
                            <p className={`${styles.accordion_point_question_type} m-0`}>{point?.quiz.points} {point?.quiz.points === 1 ? ` ${t('point').toLowerCase()}` : ` ${t('points').toLowerCase()}`}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className={`${styles.accordion_point_question_type} m-0`}>{t('certification_look')}</p>
                        </>
                      )}
                    </div>
                    <div className='p-2 pt-0'>
                      <p className={`${styles.accordion_text_gray}`}>{point?.content}</p>
                      {answeredQuestions.has(point?.quiz?._id) ? (
                        <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                          <p className={`${styles.accordion_correct_feedback} p-2 ps-2 m-0`}>
                            {t('already_answered')}
                          </p>
                        </div>
                      ) : (
                        <>
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
                                        <ChoiceComponent
                                          quizType={point?.quiz?.type}
                                          answers={point?.quiz.answers}
                                          quizMode={true}
                                          handleQuizAnswer={(userAnswer) => setTempAnswer(userAnswer)}
                                        />
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
                                        <PairsComponent
                                          answers={point?.quiz.answers}
                                          handleQuizAnswer={(userAnswer) => setTempAnswer(userAnswer)}
                                          handleRightSideQuizAnswer={(rightPair) => setRightPairAnswer(rightPair)}
                                          quizMode={true}
                                        />
                                      </>);
                                    case 'order': return (
                                      <>
                                        <OrderComponent
                                          answers={point?.quiz.answers}
                                          handleQuizAnswer={(userAnswer) => setTempAnswer(userAnswer)}
                                          quizMode={true}
                                        />
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
                              {showFeedback ? (
                                <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                  <p className={`${styles.accordion_text_gray} my-2`}>{t('answer_feedback')}</p>
                                  <div className={feedback === point.quiz.feedback.correct ? 'my-1' : 'my-1 d-none'}>
                                    <p className={`${styles.accordion_correct_feedback} p-2 ps-2 m-0`}>{feedback}</p>
                                  </div>
                                  <div className={feedback !== point.quiz.feedback.correct ? 'my-1' : 'my-1 d-none'}>
                                    <p className={`${styles.accordion_incorrect_feedback} p-2 ps-2 m-0`}>{feedback}</p>
                                  </div>
                                </div>
                              ) : (
                                <button className='btn btn-primary mt-3' onClick={handleAnswerSubmit} disabled={tempAnswer === null && rightPairAnswer === null}>{t('submit_answer')}</button>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className={`bg-white px-0`}>
        <div className={`${styles.footer_bg} py-5 px-3 px-lg-0`}>
          <div className={`offset-lg-2`}>
            <div className="d-flex">
              <img src={title_page_logo} alt="title_page_logo" className='ps-2' />
              <div className="col-lg-3 pe-5">
                <p className={`${styles.footer_text} pt-3 ps-4 text-white`}>{t("footer_description")}</p>
              </div>
            </div>
            <p className="mt-5 mb-0 text-white">© 2024 AVA Trail | {t("university_name")}</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CertificationTrail;