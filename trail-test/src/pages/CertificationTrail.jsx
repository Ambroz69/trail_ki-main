import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import styles from '../css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook
import ProgressBar from 'react-bootstrap/ProgressBar';
import Modal from 'react-bootstrap/Modal';

import Cookies from "universal-cookie";

import TrailMap from '../../components/TrailMap';
import SliderComponent from '../../components/quiztypes/SliderComponent'
import ShortAnswerComponent from '../../components/quiztypes/ShortAnswerComponent';
import TrueFalseComponent from '../../components/quiztypes/TrueFalseComponent';
import ChoiceComponent from '../../components/quiztypes/ChoiceComponent';
import PairsComponent from '../../components/quiztypes/PairsComponent';
import OrderComponent from '../../components/quiztypes/OrderComponent';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';
import Rating from "../../components/Rating";

// svg import
import accordion_points from '../assets/accordion_points.svg';
import accordion_question_type from '../assets/accordion_question_type.svg';
import title_page_logo from '../../src/assets/title_page_logo.svg';
import modal_delete from '../assets/modal_delete.svg';
import practice_correct from '../../src/assets/practice_correct.svg';
import practice_incorrect from '../../src/assets/practice_incorrect.svg';
import practice_result_xp from '../../src/assets/practice_result_xp.svg';
import practice_result_weight from '../../src/assets/practice_result_weight.svg';

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
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [forfeitModalShow, setForfeitModalShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [updatedAnswer, setUpdatedAnswer] = useState(null);
  const [newScore, setNewScore] = useState(0);
  const [progress, setProgress] = useState(0);

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
        const trailData = response.data;
        const validQuestions = trailData.points.filter(p => p.quiz); // only points with quizes

        setTrail(trailData);
        setQuizQuestions(validQuestions);
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
        if (response.data) {
          if (response.data.status === null) {
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

    const configurationRW = {
      method: "get",
      url: `${backendUrl}/reviews/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configurationRW)
      .then((response) => {
        const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;
        const userReview = response.data.find(review => review.userId._id === userId);
        if (userReview) {
          setReviewSubmitted(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleSkipPOI = () => {
    if (answeredQuestions.size === quizQuestions.length) {
      submitCertificationResults(userAnswers, score);
    }
  };

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
        break;
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
    //setUpdatedAnswer({ questionId, providedAnswer: tempAnswer, isCorrect, });
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: questionId,
        providedAnswer: tempAnswer,
        isCorrect,
      },
    ]);
    // update score
    setNewScore(isCorrect ? score + point.quiz.points : score);
    if (isCorrect) {
      setScore((prev) => prev + point.quiz.points);
      setFeedback(point.quiz.feedback.correct);
    } else {
      setFeedback(point.quiz.feedback.incorrect);
    }
    setShowFeedback(true);
  };

  const saveAnswerToDatabase = async (newScore, newAnswers) => {
    const certificationData = {
      userId: token ? JSON.parse(atob(token.split('.')[1])).userId : null,
      trail: id,
      score: newScore,
      status: null,
      answers: newAnswers,
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

  const submitCertificationResults = (finalAnswers, finalScore) => {
    const status = finalScore >= totalPoints * 0.7 ? 'Passed' : 'Failed';

    const certificationData = {
      userId: token ? JSON.parse(atob(token.split('.')[1])).userId : null,
      trail: id,
      score: finalScore,
      status,
      answers: finalAnswers,
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

  //const progress = 0;
  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "explorer"; // Default role
    }
  };

  const handleForfeitModalShow = () => {
    setForfeitModalShow(true);
  };

  const handleForfeitModalClose = () => {
    setForfeitModalShow(false);
  };

  const handleConfirmForfeit = () => {
    if (!trail) return;

    const allQuestionIds = quizQuestions.map((point) => point.quiz._id);

    // Fill in the missing answers as incorrect
    const finalAnswers = allQuestionIds.map((questionId) => {
      const existingAnswer = userAnswers.find((ans) => ans.questionId === questionId);

      if (existingAnswer) return existingAnswer; // Keep answered ones

      // Find the question type to provide an appropriate default answer
      const point = trail.points.find((p) => p.quiz?._id === questionId);
      const defaultAnswer = point?.quiz?.type === "multiple" ? [] : "Not answered";

      return {
        questionId,
        providedAnswer: defaultAnswer,  // Prevents validation error
        isCorrect: false
      };
    });
    handleForfeitModalClose();
    submitCertificationResults(finalAnswers, score);

    //TESTING ONLY
    //setReviewSubmitted(false);
  };

  const handleNextQuestion = () => {
    const questionId = point.quiz._id;
    // save answered question in state
    setAnsweredQuestions((prev) => new Set(prev).add(questionId));
    setShowFeedback(false);
    setProgress(Math.round((userAnswers.length/trail.points.length)*100));
    // check if user already has all questions answered, if not, save progress
    if (userAnswers.length === trail.points.length) {
      submitCertificationResults([...userAnswers], newScore);
    } else {
      saveAnswerToDatabase(newScore, [...userAnswers]);
    }
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: token ? JSON.parse(atob(token.split('.')[1])).userId : null,
          trail: id,
          rating,
          comment: reviewText,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setReviewSubmitted(true);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const userRole = getUserRole();
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  return (
    <>
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg}`}>
        <div className={`py-3 px-0 offset-lg-2 col-lg-8`}>
          <div className={`col-12 px-3 px-lg-4 mt-3`}>
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
              <div className={`${styles.full_height} col-lg-10 offset-lg-1`}>
                <h5 className='fs-5 font-bold text-center mb-3 mt-4'>{trail?.name}</h5>
                <div className='px-3 px-lg-4 mt-5 mb-3'>
                  <button className={`${styles.show_all_button} d-none d-lg-inline py-3 px-5 btn py-2`} onClick={() => handleForfeitModalShow()}>
                    Forfeit
                  </button>
                </div>
                <ProgressBar now={progress} label={`${progress}%`} className={`${styles.progress_bar} col-12 mb-3 m-lg-0`} />
                <div className={`col-12 pt-0`}>
                  <div className='d-flex flex-column w-100'>
                    {showSummary ? (
                      <>
                        <div className='d-flex justify-content-between pt-4'>
                          <div className=''>
                            <h2 className='fs-4 font-bold'>{t('certification_results')}</h2>
                            <p className='mb-2'><strong>{t('total_score')}:</strong> {score} / {totalPoints}</p>
                            <p className='mb-2'><strong>{t('status')}:</strong> {score >= totalPoints * 0.7 ? t('passed') : t('failed')}</p>
                          </div>
                          <div className=''>
                            <Button variant="outline-dark" onClick={() => window.open(`${basePath}/certificate/${trail?._id || trail?.id}`, "_blank")}>{t("get_certificate")}</Button>
                          </div>
                        </div>
                        {!reviewSubmitted ? (
                          <>
                            <div className='col-12'>
                              <Rating onRate={setRating} />
                            </div>
                            <div className='col-12'>
                              <p className={`${styles.accordion_text_gray} mb-1 mt-4`} >Leave a comment (optional)</p>
                              <textarea
                                className="form-control"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                maxLength={100}
                              />
                              <small className="text-muted d-block text-end">
                                {reviewText.length}/100
                              </small>
                              <div className={`${styles.sticky_default} fixed-bottom px-3 pb-3 px-lg-0 pb-lg-0`}>
                                <div className={`d-flex py-4 px-0 offset-lg-3 col-lg-6 col-md-8 offset-md-2 justify-content-end align-items-center`}>
                                  <p className='d-none d-lg-block mb-0 pe-3'>CLICK BUTTON TO</p>
                                  <button className={`${styles.practice_check_button} px-4 py-3`} onClick={handleSubmitReview}>
                                    {t('submit_review')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className={`${styles.accordion_text_gray}`} >{t('thank_you_review')}</p>
                            <div className={`${styles.sticky_default} fixed-bottom px-3 pb-3 px-lg-0 pb-lg-0`}>
                              <div className={`d-flex py-4 px-0 offset-lg-3 col-lg-6 col-md-8 offset-md-2 justify-content-end align-items-center`}>
                                <p className='d-none d-lg-block mb-0 pe-3'>CLICK BUTTON TO</p>
                                <Button className={`${styles.practice_check_button} px-4 py-3`} href={`${basePath}`}>
                                  Finish
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {point?.quiz ? (
                          <>
                            <p className={`${styles.accordion_point_title} mb-2 mt-3`}>Task {userAnswers?.length+1||1}: {point?.title}</p>
                          </>
                        ) : (point ? (
                          <button className="btn btn-secondary mt-3" onClick={handleSkipPOI}>
                            {t('skip_this_poi')}
                          </button>
                        ) : (
                          <div className='d-flex flex-column pt-4'>
                            <p className={`${styles.accordion_point_title} mb-2`}>Task 0: Head to the starting point of the trail to begin your journey.</p>
                            <div className={`${styles.show_trail_div_border_top} d-flex pt-3`}>
                              <p className={`${styles.form_label_2} mb-0`}>Follow the path and uncover unique spots that make this journey special.</p>
                            </div>
                          </div>
                        )
                        )}
                        <div className='pt-0'>
                          <div className={`${styles.show_trail_div_border_top} d-flex pt-3`}>
                            <p className={`${styles.accordion_text_gray}`} dangerouslySetInnerHTML={{ __html: point?.content }}></p>
                          </div>
                          {point?.audioPath && (
                            <audio controls src={backendUrl + point?.audioPath} type="audio/wav"></audio>
                          )}
                          {answeredQuestions.has(point?.quiz?._id) ? (
                            <div className={`${styles.accordion_divider_top}`}>
                              <p className={`${styles.form_label_2} mb-0 pt-2`}>
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
                                    <>
                                      {/* CORRECT feedback */}
                                      <div className={`${feedback === point?.quiz?.feedback?.correct ? 'd-block' : 'd-none'} ${styles.sticky_correct} fixed-bottom px-3 pb-3 px-lg-0 pb-lg-0`}>
                                        <div className={`d-flex py-4 px-0 offset-lg-2 col-lg-8 align-items-center`}>
                                          <div className='me-auto d-flex flex-row align-items-center'>
                                            <div className="rounded-circle d-flex align-items-center justify-content-center me-2 me-lg-4"
                                              style={{ minWidth: "50px", height: "50px", backgroundColor: "#05192D" }}>
                                              <img className="text-white fs-5" src={practice_correct} placeholder="practice_correct"></img>
                                            </div>
                                            <p className={`${styles.feedback_correct} mb-0 me-2 me-lg-0`}>{feedback}</p>
                                          </div>
                                          <p className={`${styles.feedback_correct} d-none d-lg-block mb-0 px-2`}>CLICK BUTTON TO</p>
                                          <button className={`${styles.practice_check_button_correct} px-4 py-3`} onClick={handleNextQuestion}>
                                            Continue
                                          </button>
                                        </div>
                                      </div>
                                      {/* INCORRECT feedback */}
                                      <div className={`${feedback === point?.quiz?.feedback?.incorrect ? 'd-block' : 'd-none'} ${styles.sticky_incorrect} fixed-bottom px-3 pb-3 px-lg-0 pb-lg-0`}>
                                        <div className={`d-flex py-4 px-0 offset-lg-2 col-lg-8 align-items-center`}>
                                          <div className='me-auto d-flex flex-row align-items-center'>
                                            <div className="rounded-circle d-flex align-items-center justify-content-center me-2 me-lg-4"
                                              style={{ minWidth: "50px", height: "50px", backgroundColor: "#FCEAFF" }}>
                                              <img className="text-white fs-5" src={practice_incorrect} placeholder="practice_incorrect"></img>
                                            </div>
                                            <p className={`${styles.feedback_incorrect} mb-0 me-2 me-lg-0`}>{feedback}</p>
                                          </div>
                                          <p className={`${styles.feedback_incorrect} d-none d-lg-block mb-0 px-2`}>CLICK BUTTON TO</p>
                                          <button className={`${styles.practice_check_button_incorrect} px-4 py-3`} onClick={handleNextQuestion}>
                                            Continue
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className={`${styles.sticky_default} fixed-bottom px-3 pb-3 px-lg-0 pb-lg-0`}>
                                        <div className={`d-flex py-4 px-0 offset-lg-3 col-lg-6 col-md-8 offset-md-2 justify-content-end align-items-center`}>
                                          <p className='d-none d-lg-block mb-0 pe-3'>CLICK BUTTON TO</p>
                                          <button className={`${styles.practice_check_button} px-4 py-3`} onClick={handleAnswerSubmit} disabled={tempAnswer === null && rightPairAnswer === null}>
                                            Check
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {/*showFeedback ? (
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
                                  )*/}
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
          {/*
          <div className=''>
            <Button className={`${styles.show_all_button} d-none d-lg-inline py-3 px-5 btn py-2`} href={`${basePath}`}>
              Take Me Back
            </Button>
            <Button className={`${styles.show_all_button} d-flex d-lg-none py-2 flex-fill btn py-2 justify-content-center`} href={`${basePath}`}>
              Take Me Back
            </Button>
          </div>
          <div className='px-3 px-lg-4 mt-5 mb-3'>
            <button className={`${styles.show_all_button} d-none d-lg-inline py-3 px-5 btn py-2`} onClick={() => handleForfeitModalShow()}>
              Forfeit
            </button>
          </div>
          */}
        </div>
        <Modal
          show={forfeitModalShow}
          onHide={handleForfeitModalClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body className='d-flex flex-column align-items-center p-4'>
            <img src={modal_delete} alt="modal_delete" className='px-2 pb-2' />
            <h1 className={`${styles.modal_heading}`}>{t('forfeit_trail')}</h1>
            <p className={`${styles.modal_text} mb-0`}>{t('forfeit_trail_text1')}</p>
            <p className={`${styles.modal_text} `}>{t('forfeit_trail_text2')}</p>
          </Modal.Body>
          <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
            <Button variant="secondary" onClick={() => handleForfeitModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
              {t('cancel')}
            </Button>
            <Button variant="primary" onClick={() => handleConfirmForfeit()} className={`${styles.modal_delete_button} flex-fill ms-2 me-5`}>
              {t('forfeit')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default CertificationTrail;