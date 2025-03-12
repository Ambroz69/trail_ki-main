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
import Footer from '../../components/Footer';

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
  const [showFeedback, setShowFeedback] = useState(false);
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
    }
  };

  return (
    <div className='row d-flex mx-0 px-0'>
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg}`}>
        <div className={`py-4 px-0 offset-lg-2 col-lg-8`}>
          <h2 className={`${styles.overview_heading} fs-4 pb-3`}>{t('practice')}</h2>
          <div className='col-12 p-2 pt-2'>
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
                    <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                      <p className={`${styles.accordion_text_gray} my-2`}>{t('answer_feedback')}</p>
                      <div className={feedback === t("correct") ? 'my-1' : 'my-1 d-none'}>
                        <p className={`${styles.accordion_correct_feedback} p-2 ps-2 m-0`}>{feedback}</p>
                      </div>
                      <div className={feedback === t("incorrect") ? 'my-1' : 'my-1 d-none'}>
                        <p className={`${styles.accordion_incorrect_feedback} p-2 ps-2 m-0`}>{feedback}</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary mt-3" onClick={handleNextQuestion}>
                      {t("next_question")}
                    </button>
                  </>
                ) : (
                  <button className='btn btn-primary mt-3' onClick={handleAnswerSubmit} disabled={tempAnswer === null && rightPairAnswer === null}>
                    {t('submit_answer')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Practice;