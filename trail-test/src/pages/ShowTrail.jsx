import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import styles from '../css/TrailShow.module.css';
import ReactCardFlip from 'react-card-flip';

import SliderComponent from '../../components/quiztypes/SliderComponent'
import ShortAnswerComponent from '../../components/quiztypes/ShortAnswerComponent';
import TrueFalseComponent from '../../components/quiztypes/TrueFalseComponent';
import ChoiceComponent from '../../components/quiztypes/ChoiceComponent';
import PairsComponent from '../../components/quiztypes/PairsComponent';
import OrderComponent from '../../components/quiztypes/OrderComponent';
import TrailMap from '../../components/TrailMap';

import filter_button from '../assets/filter_button.svg';

import Cookies from "universal-cookie";

//svg+png import
import backup_trail_image from '../../src/assets/backup_trail_image.png';
import trail_certification_img from '../../src/assets/trail_certification_img.png';
import trail_qr_code_img from '../../src/assets/trail_qr_code_img.png';
import trail_apply from '../../src/assets/trail_apply.svg';
import trail_arrow_show_all from '../../src/assets/trail_arrow_show_all.svg';
import trail_arrow_start from '../../src/assets/trail_arrow_start.svg';
import trail_length from '../../src/assets/trail_length.svg';
import trail_location from '../../src/assets/trail_location.svg';
import trail_certification from '../../src/assets/trail_certification.svg';
import trail_difficulty from '../../src/assets/trail_difficulty.svg';
import trail_language from '../../src/assets/trail_language.svg';
import trail_lock from '../../src/assets/trail_lock.svg';
import trail_points from '../../src/assets/trail_points.svg';
import trail_practice from '../../src/assets/trail_practice.svg';
import trail_prepare_certification from '../../src/assets/trail_prepare_certification.svg';
import trail_qr_code from '../../src/assets/trail_qr_code.svg';
import trail_rating from '../../src/assets/trail_rating.svg';
import trail_time from '../../src/assets/trail_time.svg';
import trail_type from '../../src/assets/trail_type.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const ShowTrail = () => {
  const [trail, setTrail] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0); // re-rendering the modal
  const [currentPoint, setCurrentPoint] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    setLoading(true);
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: `http://localhost:5555/trails/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    axios(configuration)
      .then((response) => {
        setTrail(response.data);
        console.log(trail);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handleChangeAnswer = (index, field, value) => {
    const updatedAnswers = answers.map((answer, i) => {
      if (i === index) {
        if (quizType === 'true-false') { // transform the true/false into the text as there will be the correct answer
          answers[0].text = String(!answers[0].isCorrect);
        }
        //console.log("isCorrect? <" + answers[0].isCorrect + ">");
        return { ...answer, [field]: value };
      }
      //console.log("i !== index..." + answer);
      return answer;
    });
    //setAnswers(updatedAnswers);
    // Store the updated answers to preserve them when switching types
    //setPreviousAnswers((prev) => ({ ...prev, [quizType]: updatedAnswers }));
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const addDefaultImg = event => {
    event.target.src = backup_trail_image;
  };

  const handleCardFlip = e => {
    e.preventDefault();
    setCardFlipped(!cardFlipped);
  }

  return (
    <div className={`${styles.show_trail_bg} d-flex container-fluid mx-0 px-0`}>
      <div className='col-3 pe-4'>
        <Navbar />
      </div>
      <div className={`col-9 ps-4 pe-5 mt-5`}>
        <div className={`${styles.white_bg} p-0`}>
          <div className='mb-5'>
            <ReactCardFlip isFlipped={cardFlipped} flipDirection="horizontal">
              <div /* FRONT CARD */ onClick={e => handleCardFlip(e)} className={`${styles.show_trail_div_border} ${styles.trail_card_div} py-3`}>
                <div className='d-flex p-4'>
                  <div className='col-8 d-flex flex-column pe-4'>
                    <div>
                      <img src={trail_prepare_certification} alt="trail_prepare_certification" className='pe-2' />
                    </div>
                    <div className='d-flex mt-3'>
                      <img src={trail?.thumbnail} alt="trail_img" style={{ width: '5rem', height: '5rem', borderRadius: '0.5rem' }} className='me-2' onError={addDefaultImg} />
                      <h1 className={`${styles.trail_heading} ms-2`}>{trail?.name}</h1>
                    </div>
                    <p className={`${styles.trail_description} mt-3`} dangerouslySetInnerHTML={{ __html: trail?.description }}></p>
                    <div className='mt-auto'>
                      <h2 className={`${styles.trail_content_heading} mb-1`}>Overall Progress</h2>
                      <div className='d-flex'>
                        <div className="progress col-9" style={{ height: '0.8rem', marginTop: '0.33rem' }}>
                          <div className="progress-bar" role="progressbar" style={{ width: '0%' }}></div>
                        </div>
                        <p className={`${styles.trail_card_description} mb-0 col-3 ms-2`}>0%</p>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.show_trail_div_border} ${styles.show_trail_bg} col-4 px-4 pt-4 pb-3`}>
                    <h2 className={styles.trail_content_heading}>Trail Content:</h2>
                    <div className='d-flex justify-content-between mb-2'>
                      <div className='d-flex flex-row'>
                        <img src={trail_type} alt="trail_type" className='pe-2' />
                        <p className={`${styles.trail_card_description} mb-0`}>Trail Type:</p>
                      </div>
                      <p className={`${styles.trail_card_value} mb-0`}>{trail?.season}</p>
                    </div>
                    <div className='d-flex justify-content-between mb-2'>
                      <div className='d-flex flex-row'>
                        <img src={trail_language} alt="trail_language" className='pe-2' />
                        <p className={`${styles.trail_card_description} mb-0`}>Language:</p>
                      </div>
                      <p className={`${styles.trail_card_value} mb-0`}>{trail?.language}</p>
                    </div>
                    <div className='d-flex justify-content-between mb-2'>
                      <div className='d-flex flex-row'>
                        <img src={trail_difficulty} alt="trail_difficulty" className='pe-2' />
                        <p className={`${styles.trail_card_description} mb-0`}>Trail Difficulty:</p>
                      </div>
                      <p className={`${styles.trail_card_value} mb-0`}>{trail?.difficulty}</p>
                    </div>
                    <div className='d-flex justify-content-between mb-2'>
                      <div className='d-flex flex-row'>
                        <img src={trail_location} alt="trail_location" className='pe-2' />
                        <p className={`${styles.trail_card_description} mb-0`}>Location:</p>
                      </div>
                      <p className={`${styles.trail_card_value} mb-0`}>{trail?.locality}</p>
                    </div>
                    <div className='d-flex justify-content-between mb-2'>
                      <div className='d-flex flex-row'>
                        <img src={trail_length} alt="trail_length" className='pe-2' />
                        <p className={`${styles.trail_card_description} mb-0`}>Trail Length:</p>
                      </div>
                      <p className={`${styles.trail_card_value} mb-0`}>{trail?.length.toFixed(2)} km</p>
                    </div>
                    <div className='d-flex justify-content-between mb-2'>
                      <div className='d-flex flex-row'>
                        <img src={trail_time} alt="trail_time" className='pe-2' />
                        <p className={`${styles.trail_card_description} mb-0`}>Estimated Time:</p>
                      </div>
                      <p className={`${styles.trail_card_value} mb-0`}>{trail?.estimatedTime} min.</p>
                    </div>
                    <div className='d-flex justify-content-between mb-2'>
                      <div className='d-flex flex-row'>
                        <img src={trail_points} alt="trail_points" className='pe-2' />
                        <p className={`${styles.trail_card_description} mb-0`}>Total Points of Interest:</p>
                      </div>
                      <p className={`${styles.trail_card_value} mb-0`}>{trail?.points.length}</p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.show_trail_div_border_top} d-flex p-4 pb-2`}>
                  <div className={`${styles.show_trail_div_border_right} col-4 d-flex flex-column align-items-center`}>
                    <div className='d-flex'>
                      <button className={`${styles.rating_practice_apply_button} px-4 py-1`}>RATING</button>
                      <img src={trail_rating} alt="trail_rating" className='ps-2' />
                    </div>
                    <p className={`${styles.rating_practice_apply_text} pt-2 mb-0`}>Review the trail highlights</p>
                  </div>
                  <div className={`${styles.show_trail_div_border_right} col-4 d-flex flex-column align-items-center`}>
                    <div className='d-flex'>
                      <button className={`${styles.rating_practice_apply_button} px-4 py-1`}>PRACTICE</button>
                      <img src={trail_practice} alt="trail_practice" className='ps-2' />
                    </div>
                    <p className={`${styles.rating_practice_apply_text} pt-2 mb-0`}>Practice your trail knowledge</p>
                  </div>
                  <div className={`col-4 d-flex flex-column align-items-center`}>
                    <div className='d-flex'>
                      <button className={`${styles.rating_practice_apply_button} px-4 py-1`}>APPLY</button>
                      <img src={trail_apply} alt="trail_apply" className='ps-2' />
                    </div>
                    <p className={`${styles.rating_practice_apply_text} pt-2 mb-0`}>Apply what you've learned</p>
                  </div>
                </div>
              </div>
              <div /* BACK CARD */ onClick={e => handleCardFlip(e)} className={``}>
                <TrailMap
                  points={trail?.points}
                  height='30rem'
                  editable={false}
                />
              </div>
            </ReactCardFlip>
            <div className={`${styles.show_trail_bg} d-flex`}>
              <img src={trail_certification} alt="trail_certification" className='pe-2 pb-1' />
              <p className={`${styles.lower_card_heading} py-3 m-0`}>Certification</p>
            </div>
            <div className={`${styles.show_trail_div_border} d-flex px-4 py-3`}>
              <div className='col-3 d-flex align-items-center'>
                <img src={trail_certification_img} alt="trail_certification_img" style={{ width: '14rem', height: '9.5rem' }} className='' />
              </div>
              <div className='col-6'>
                <h1 className={`${styles.trail_heading}`}>You're missing out!</h1>
                <p className={`${styles.trail_description} mt-3`}>Complete the journey and receive a certificate celebrating your progress and experience.</p>
                <div className='d-flex'>
                  <div className='col-6 pe-2'>
                    <button className={`${styles.rating_practice_apply_button} d-flex w-100 align-items-center py-2 px-3`}>
                      <img src={trail_lock} alt="trail_lock" className='pe-3' />Environment Guardian
                    </button>
                  </div>
                  <div className='col-6 ps-2'>
                    <button className={`${styles.rating_practice_apply_button} d-flex w-100 align-items-center py-2 px-3`}>
                      <img src={trail_lock} alt="trail_lock" className='pe-3' />Trail Master
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.show_trail_bg} d-flex`}>
              <img src={trail_qr_code} alt="trail_qr_code" className='pe-2 pb-1' />
              <p className={`${styles.lower_card_heading} py-3 m-0`}>QR Code</p>
            </div>
            <div className={`${styles.show_trail_div_border} d-flex px-4 py-3`}>
              <div className='col-3 d-flex align-items-center justify-content-center pe-5'>
                <img src={trail_qr_code_img} alt="trail_qr_code_img" style={{ width: '10rem', height: '9.5rem' }} className='' />
              </div>
              <div className='col-6'>
                <h1 className={`${styles.trail_heading}`}>Grow your trail skills with AvaTrail</h1>
                <p className={`${styles.trail_description} mt-3`}>Scan this QR code to dive deeper into your journey! Unlock real-time insights, quizzes, and exclusive tips for a more immersive trail experience. Ready to explore?</p>
              </div>
              <div className='col-3 d-flex justify-content-end'>
                <div>
                  <button className={`${styles.show_all_button} btn d-flex px-4`} href='/'>
                    Show All
                    <div>
                      <img src={trail_arrow_show_all} alt="trail_arrow_show_all" className='ps-2 pt-1' />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className={`${styles.show_trail_bg} d-flex justify-content-end pt-4`}>
              <div>
                <button className={`${styles.start_button} btn d-flex ps-5 pe-3 align-items-center`} href='/'>
                  START
                  <div>
                    <img src={trail_arrow_start} alt="trail_arrow_start" className='ps-2 pt-0' />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
{/* <div className={`${styles.new_trail_container} ${styles.new_trail_bg} d-flex container-fluid mx-0 px-0`}>
            <div className='col-3 pe-4'>
                <Navbar />
            </div>
            <div className='p-4'>
                {trail ? (
                    <div className='flex flex-col p-4'>
                        <div className='my-4'>
                            <img src={trail.thumbnail} alt='Picture' style={{ width: '300px', height: 'auto' }}></img>
                            <h1 className='text-3xl'>{trail.name}</h1>
                        </div>
                        <div className='my-4'>
                            <div dangerouslySetInnerHTML={{ __html: trail.description }} />
                        </div>
                                {!isFlipped ? (
                        <div className='my-4'>
                            <h4>Trail Contest:</h4>
                            <span className='text-l text-gray-500 mr-4'>Trail Type: </span><span>{trail.season}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Locality: </span><span>{trail.locality}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Total Quizes: </span><span>XY</span><br />
                            <span className='text-l text-gray-500 mr-4'>Total Points of Interest: </span><span>{trail.points.length}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Estimated time: </span><span>{trail.estimatedTime} min</span><br />
                            <span className='text-l text-gray-500 mr-4'>Trail Length: </span><span>{trail.length.toFixed(2)} km</span><br />
                            <span className='text-l text-gray-500 mr-4'>Trail Difficulty: </span><span>{trail.difficulty}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Language: </span><span>{trail.language}</span>
                            <img src={filter_button} alt="filter_button" className='px-2' onClick={handleFlip} />
                        </div>
                                ) : (
                                    <div className='my-4'>
                        <h4>Trail Map:</h4>
                            <TrailMap
                            points={trail.points}
                            height='13rem'
                            editable={false}
                        />
                        <img src={filter_button} alt="filter_button" className='px-2' onClick={handleFlip} />
                                </div>
                        )}
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Points of Interest ({trail.points.length})</span>
                            <span>
                                {trail.points && trail.points.length > 0 ? (
                                    <ul>
                                        {trail.points.map((point, idx) => (
                                            <li key={point._id}>
                                                <div>{point.title}</div>
                                                <label className={`${styles.form_label} form-label mb-1`}>Question</label>
                                                <div>{point.quiz?.question}</div>
                                                {(() => {
                                                    switch (point.quiz?.type) {
                                                        case 'short-answer':
                                                            return (
                                                                <ShortAnswerComponent
                                                                    value=''
                                                                    onChange={(newValue) => handleChangeAnswer(0, 'text', newValue)}
                                                                />
                                                            );
                                                        case 'single':
                                                        case 'multiple':
                                                            return (
                                                                <>
                                                                    <ChoiceComponent
                                                                        quizType={point.quiz?.type}
                                                                        answers={point.quiz?.answers}
                                                                        quizMode={true}
                                                                        handleChangeAnswer={handleChangeAnswer}
                                                                    />
                                                                </>
                                                            );
                                                        case 'slider':
                                                            return (
                                                                <SliderComponent
                                                                    correctValue={0}
                                                                    minValue={point.quiz?.answers[0].minValue}
                                                                    maxValue={point.quiz?.answers[0].maxValue}
                                                                    quizMode={true}
                                                                    setCorrectValue={correctValue => setSliderCorrectValue(correctValue)}
                                                                />
                                                            );
                                                        case 'pairs':
                                                            return (
                                                                <>
                                                                    <PairsComponent
                                                                        answers={point.quiz?.answers}
                                                                        quizMode={true}
                                                                        handleChangeAnswer={handleChangeAnswer}
                                                                    />
                                                                </>
                                                            );
                                                        case 'order':
                                                            return (
                                                                <>
                                                                    <OrderComponent
                                                                        answers={point.quiz?.answers}
                                                                        quizMode={true}
                                                                        handleChangeAnswer={handleChangeAnswer}
                                                                    />
                                                                </>
                                                            );
                                                        case 'true-false':
                                                            return (
                                                                <TrueFalseComponent
                                                                    value={false}
                                                                    quizMode={true}
                                                                    handleChangeAnswer={handleChangeAnswer}
                                                                />
                                                            );
                                                        default:
                                                            return null;
                                                    }
                                                })()}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>No Points</span>
                                )}
                            </span>
                        </div>
                        
                    </div>
                ) : (
                    <div>No Trail Data Available</div>
                )}
            </div>
        </div> */}

export default ShowTrail;