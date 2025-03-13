import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import styles from '../css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';

import Cookies from "universal-cookie";

import SliderComponent from '../../components/quiztypes/SliderComponent'
import ShortAnswerComponent from '../../components/quiztypes/ShortAnswerComponent';
import TrueFalseComponent from '../../components/quiztypes/TrueFalseComponent';
import ChoiceComponent from '../../components/quiztypes/ChoiceComponent';
import PairsComponent from '../../components/quiztypes/PairsComponent';
import OrderComponent from '../../components/quiztypes/OrderComponent';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';

// svg import
import accordion_points from '../assets/accordion_points.svg';
import accordion_question_type from '../assets/accordion_question_type.svg';
import title_page_logo from '../../src/assets/title_page_logo.svg';
import practice_correct from '../../src/assets/practice_correct.svg';
import practice_incorrect from '../../src/assets/practice_incorrect.svg';
import practice_result_xp from '../../src/assets/practice_result_xp.svg';
import practice_result_weight from '../../src/assets/practice_result_weight.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Practice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tempAnswer, setTempAnswer] = useState(null);
  const [rightPairAnswer, setRightPairAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { t } = useTranslation(); // Hook to access translations

  useEffect(() => {
    const storedQuestions = localStorage.getItem("practiceQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
      return;
    }
    // fetch random querstions from all trails
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configuration)
      .then((response) => {
        const allQuestions = response.data.data
          .filter((trail) => trail.points && trail.points.length > 0)
          .flatMap((trail) =>
            trail.points
              .filter((point) => point.quiz)
              .map((point) => ({
                trailName: trail.name,
                ...point.quiz,
              })))
          .filter((quiz) => quiz); // Remove undefined quizzes

        // Randomly select 5 questions
        const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestions(shuffledQuestions);
        localStorage.setItem("practiceQuestions", JSON.stringify(shuffledQuestions));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const toLetters = (num) => {
    "use strict";
    var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
  };

  const handleAnswerSubmit = () => {
    if (!questions[currentQuestionIndex]) return;
    let isCorrect = false;
    const question = questions[currentQuestionIndex];

    switch (question?.type) {
      case 'short-answer': {
        const correctAnswer = question.answers[0].text.trim().toLowerCase();
        isCorrect = tempAnswer.trim().toLowerCase() === correctAnswer;
        break;
      }
      case 'single': {
        const correcAnswer = question.answers.find((answer) => answer.isCorrect);
        isCorrect = tempAnswer.length === 1 && tempAnswer[0] === correcAnswer.text;
        break;
      }
      case 'multiple': {
        const correctAnswers = question.answers
          .filter((answer) => answer.isCorrect)
          .map((answer) => answer.text);
        isCorrect =
          tempAnswer.length === correctAnswers.length &&
          tempAnswer.every((index) => correctAnswers.includes(index));
        break;
      }
      case 'slider': {
        isCorrect = tempAnswer === question.answers[0].text;
        break;
      }
      case 'pairs': {
        const leftAnswers = question.answers
          .map((answer) => answer.text);
        const rightAnswers = question.answers
          .map((answer) => answer.pairText);
        isCorrect =
          tempAnswer.length === leftAnswers.length &&
          tempAnswer.every((value, index) => value === leftAnswers[index]) &&
          rightPairAnswer.length === rightAnswers.length &&
          rightPairAnswer.every((value, index) => value === rightAnswers[index]);
        break;
      }
      case 'order': {
        const correctAnswers = question.answers
          .map((answer) => answer.text);
        const sentAnswers = tempAnswer.map((answer) => answer.text);
        isCorrect =
          sentAnswers.length === correctAnswers.length &&
          sentAnswers.every((value, index) => value === correctAnswers[index]);
        break;
      }
      case 'true-false': {
        isCorrect = tempAnswer === question.answers[0].isCorrect;
        break;
      }
      default: break;
    }

    // Save answer
    setUserAnswers((prev) => [...prev, { questionId: question._id, isCorrect }]);
    setFeedback(isCorrect ? t("correct") : t("incorrect"));

    setShowFeedback(true);

    /*setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setShowSummary(true);
      }
    }, 2000); */
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setTempAnswer(null);
    setRightPairAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
      localStorage.removeItem("practiceQuestions");
    }
  };
  const progress = Math.round((currentQuestionIndex / questions.length) * 100);

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "explorer"; // Default role
    }
  };
  const userRole = getUserRole();
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  useEffect(() => {
    setTempAnswer(null);
    setRightPairAnswer(null);
  }, [currentQuestionIndex]);

  return (
    <div className='row d-flex mx-0 px-0'>
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg} ${styles.full_height}`}>
        <div className={`py-4 px-0 offset-lg-3 col-lg-6 col-md-8 offset-md-2`}>
          <div className='col-12'>
            {showSummary ? (
              <div className='d-flex flex-column align-items-center justify-content-center mt-5'>
                <div className="rounded-circle d-flex align-items-center justify-content-center align-self-center mt-lg-5 mb-4"
                  style={{ minWidth: "110px", maxWidth: "110px", height: "110px", backgroundColor: "#4783B5" }}>
                  <img className="text-white fs-5" src={practice_result_weight} placeholder="practice_result_weight"></img>
                </div>
                <img className="text-white fs-5 mb-4" src={practice_result_xp} placeholder="practice_result_xp"></img>
                <h2 className='fs-3 mt-2 mb-3 font-bold'>Practice completed!</h2>
                <p className='fs-5 mb-0 text-center'>Practicing on a daily basis increases your knowledge and understanding.</p>
                <div className={`d-flex pt-4 gap-3`}>
                  <Button className={`${styles.show_all_button} flex-fill btn py-3 px-lg-4 px-5`} href={`${basePath}/journey`}>
                    Take Me Back
                  </Button>
                  <Button className={`${styles.my_journey_button} flex-fill btn py-3 px-lg-4 px-5`} href={`${basePath}/practice`}>
                    Practice Again
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h5 className='fs-5 font-bold text-center mb-3 mt-4'>Practice</h5>
                <ProgressBar now={progress} label={`${progress}%`} className={`${styles.progress_bar} col-12 mb-3 m-lg-0`} />
                <h5 className='mt-5 fs-5 font-bold'>
                  {t("task")} {currentQuestionIndex + 1} / {questions.length}
                </h5>
                <p className={`fs-5 font-bold mb-2`}>{questions[currentQuestionIndex]?.question}</p>
                <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                  {/* Render quiz type */}
                  {(() => {
                    switch (questions[currentQuestionIndex]?.type) {
                      case "short-answer":
                        return <ShortAnswerComponent value={tempAnswer || ""} quizMode handleAnswer={setTempAnswer} />;
                      case "single":
                      case "multiple":
                        return (
                          <ChoiceComponent
                            quizType={questions[currentQuestionIndex]?.type}
                            answers={questions[currentQuestionIndex]?.answers}
                            quizMode
                            handleQuizAnswer={setTempAnswer}

                          />
                        );
                      case "slider":
                        return (
                          <SliderComponent
                            correctValue={questions[currentQuestionIndex]?.answers[0].minValue}
                            minValue={questions[currentQuestionIndex]?.answers[0].minValue}
                            maxValue={questions[currentQuestionIndex]?.answers[0].maxValue}
                            setCorrectValue={setTempAnswer}
                            quizMode
                          />
                        );
                      case "pairs":
                        return (
                          <PairsComponent
                            answers={questions[currentQuestionIndex]?.answers}
                            handleQuizAnswer={setTempAnswer}
                            handleRightSideQuizAnswer={setRightPairAnswer}
                            quizMode
                          />
                        );
                      case "order":
                        return <OrderComponent answers={questions[currentQuestionIndex]?.answers} handleQuizAnswer={setTempAnswer} quizMode />;
                      case "true-false":
                        return (
                          <TrueFalseComponent
                            quizMode
                            value={tempAnswer}
                            answer={questions[currentQuestionIndex]?.answers[0]}
                            handleChangeAnswer={setTempAnswer}
                          />
                        );
                      default:
                        return <p>{t("no_questions_available")}</p>;
                    }
                  })()}
                </div>
                {/* Show Feedback after submitting the answer */}
                {showFeedback ? (
                  <>
                    {/* CORRECT feedback */}
                    <div className={`${feedback === t("correct") ? 'd-block' : 'd-none'} ${styles.sticky_correct} fixed-bottom px-3 pb-3 px-lg-0 pb-lg-0`}>
                      <div className={`d-flex py-4 px-0 offset-lg-3 col-lg-6 col-md-8 offset-md-2 align-items-center`}>
                        <div className='me-auto d-flex flex-row align-items-center'>
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                            style={{ minWidth: "50px", height: "50px", backgroundColor: "#05192D" }}>
                            <img className="text-white fs-5" src={practice_correct} placeholder="practice_correct"></img>
                          </div>
                          <p className={`${styles.feedback_correct} mb-0`}>{t("correct")}</p>
                        </div>
                        <p className={`${styles.feedback_correct} d-none d-lg-block mb-0 pe-3`}>CLICK BUTTON TO</p>
                        <button className={`${styles.practice_check_button_correct} px-4 py-3`} onClick={handleNextQuestion}>
                          Continue
                        </button>
                      </div>
                    </div>
                    {/* INCORRECT feedback */}
                    <div className={`${feedback === t("incorrect") ? 'd-block' : 'd-none'} ${styles.sticky_incorrect} fixed-bottom px-3 pb-3 px-lg-0 pb-lg-0`}>
                      <div className={`d-flex py-4 px-0 offset-lg-3 col-lg-6 col-md-8 offset-md-2 align-items-center`}>
                        <div className='me-auto d-flex flex-row align-items-center'>
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                            style={{ minWidth: "50px", height: "50px", backgroundColor: "#FCEAFF" }}>
                            <img className="text-white fs-5" src={practice_incorrect} placeholder="practice_incorrect"></img>
                          </div>
                          <p className={`${styles.feedback_incorrect} mb-0`}>{t("incorrect")}</p>
                        </div>
                        <p className={`${styles.feedback_incorrect} d-none d-lg-block mb-0 pe-3`}>CLICK BUTTON TO</p>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Practice;