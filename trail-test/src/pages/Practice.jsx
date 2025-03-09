import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import styles from '../css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

import Cookies from "universal-cookie";

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

const Practice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tempAnswer, setTempAnswer] = useState(null);
  const [rightPairAnswer, setRightPairAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const { t } = useTranslation(); // Hook to access translations

  useEffect(() => {
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
          .flatMap((trail) => trail.points?.map((point) => ({
            trailName: trail.name,
            ...point.quiz,
          })))
          .filter((quiz) => quiz); // Remove undefined quizzes

        // Randomly select 5 questions
        const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestions(shuffledQuestions);
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

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setShowSummary(true);
      }
    }, 2000); // Show feedback for 10 seconds
  };

  return (
    <div className='row d-flex mx-0 px-0'>
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg} py-3 px-0 offset-lg-2 col-lg-8`}>
        <div className={`col-12 ps-4 pe-5 mt-5`}>
          <div className={`${styles.white_bg} p-0`}>
            <p className={`${styles.overview_heading} pb-2 mx-4 mt-4 mb-4`}>{t('practice')}</p>
            <div className={`col-12 p-4 pt-0`}>
              <div className='d-flex flex-column w-100 p-2'>
                {showSummary ? (
                  <>
                    <div className='d-flex'>
                      <h2>{t('practice_results')}</h2>
                      <ul>
                        {questions.map((q, index) => (
                          <li key={q._id} className='d-flex justify-content-between'>
                            <span>{q.question}</span>
                            <span>{userAnswers[index]?.isCorrect ? '✔️' : '❌'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='p-2'>
                      <strong>{t("correct_answers")}:</strong> {userAnswers.filter((a) => a.isCorrect).length} / {questions.length}
                    </div>
                  </>
                ) : (
                  <>
                    <h5>
                      {t("task")} {currentQuestionIndex + 1} / {questions.length}
                    </h5>
                    <p className={`${styles.accordion_point_title} mb-2`}>{questions[currentQuestionIndex]?.question}</p>
                    <div className='d-flex'>
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

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <p className="text-muted">{feedback && <span>{feedback}</span>}</p>
                        <button className="btn btn-primary" onClick={handleAnswerSubmit} disabled={tempAnswer === null}>
                          {t("check")}
                        </button>
                      </div>
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
    </div>
  );
};

export default Practice;