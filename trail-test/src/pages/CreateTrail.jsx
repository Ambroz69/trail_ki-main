import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';
import SliderComponent from '../../components/quiztypes/SliderComponent'
import ShortAnswerComponent from '../../components/quiztypes/ShortAnswerComponent';
import TrueFalseComponent from '../../components/quiztypes/TrueFalseComponent';
import ChoiceComponent from '../../components/quiztypes/ChoiceComponent';
import PairsComponent from '../../components/quiztypes/PairsComponent';
import OrderComponent from '../../components/quiztypes/OrderComponent';
import TrailMap from '../../components/TrailMap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Cookies from "universal-cookie";

//svg import
import file_upload from '../assets/file_upload.png';
import accordion_default from '../assets/accordion_default.svg';
import accordion_points from '../assets/accordion_points.svg';
import accordion_question_type from '../assets/accordion_question_type.svg';
import accordion_action_delete from '../assets/accordion_action_delete.svg';
import accordion_action_edit from '../assets/accordion_action_edit.svg';
import modal_delete from '../assets/modal_delete.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const CreateTrail = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const descriptionRef = useRef(description); // useRef to prevent rerenders
  const [difficulty, setDifficulty] = useState('Easy');
  const [locality, setLocality] = useState('Slovakia');
  const [season, setSeason] = useState('All Seasons');
  const [thumbnail, setThumbnail] = useState('-');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [language, setLanguage] = useState('English');
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempPoint, setTempPoint] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false); // because of the possibility to edit already created point
  const [currentPoint, setCurrentPoint] = useState(null);
  const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState('');
  const [ppoints, setPpoints] = useState('');
  const [quizType, setQuizType] = useState('single');
  const [correctFeedback, setCorrectFeedback] = useState('');
  const [incorrectFeedback, setIncorrectFeedback] = useState('');
  const [quizChecked, setQuizChecked] = useState(false);
  const [pointCreated, setPointCreated] = useState(false);
  const [answers, setAnswers] = useState([{ text: '', isCorrect: true }]);
  const [previousAnswers, setPreviousAnswers] = useState({}); // Store previous answers for each quiz type
  const [sliderCorrectValue, setSliderCorrectValue] = useState(50);
  const [sliderMinValue, setSliderMinValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(100);
  const { id } = useParams(); // Extract id for edit mode
  const hasLoadedInitialContent = useRef(false); // initial loading of description
  const [accordionEdit, setAccordionEdit] = useState(false);
  const [showPointContent, setShowPointContent] = useState(false);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [pointToProcess, setPointToProcess] = useState(null);

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * Math.PI / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  function calculateTrailLength(points) {
    let totalLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const point1 = points[i];
      const point2 = points[i + 1];
      const distance = haversineDistance(point1.latitude, point1.longitude, point2.latitude, point2.longitude);
      totalLength += distance;
    }

    return totalLength; // Length in kilometers
  }

  const handleSaveTrail = () => {
    setLoading(true);
    let trailLength = calculateTrailLength(points);
    // set configurations for the API call here
    const configuration = {
      method: id ? "put" : "post",
      url: id ? `http://localhost:5555/trails/${id}` : "http://localhost:5555/trails",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        description,
        difficulty,
        locality,
        season,
        thumbnail,
        length: trailLength,
        estimatedTime,
        language,
        points
      }
    };

    // make the API call
    axios(configuration)
      .then((response) => {
        setLoading(false);
        console.log(id ? 'Trail updated.' : 'Trail created.');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        alert('An error occured.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      axios({
        method: "get",
        url: `http://localhost:5555/trails/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        // Load data into state for editing
        setName(response.data.name);
        setDescription(response.data.description);
        setLocality(response.data.locality);
        setDifficulty(response.data.difficulty);
        setSeason(response.data.season);
        setThumbnail(response.data.thumbnail);
        setPoints(response.data.points || []);
        setEstimatedTime(response.data.estimatedTime);
        setLanguage(response.data.language);
        //loadExistingPoints(response.data.points || []);
        setLoading(false);
      }).catch(error => {
        console.error(error);
      });
    }
  }, [id]);


  useEffect(() => {
    if (quill) {
      if (!hasLoadedInitialContent.current && description) {
        quill.clipboard.dangerouslyPasteHTML(description); // Set the initial description
        hasLoadedInitialContent.current = true;
      }
      quill.on('text-change', (delta, oldDelta, source) => {
        const currentContent = quill.root.innerHTML;

        // Only update state if the content has actually changed
        if (descriptionRef.current !== currentContent) {
          descriptionRef.current = currentContent;
          setDescription(currentContent);
        }
      });
    }
  }, [quill, description]);

  const handleConfirmDelete = () => {
    setPoints(points => {
      const updatedPoints = points.filter(p => (p.id || p._id) !== pointToProcess);
      //updateMapPoints(updatedPoints);
      return updatedPoints;
    });
    setDeleteModalShow(false);
    setPointToProcess(null);
  }

  const handleDeleteModalShow = (point_id) => {
    setPointToProcess(point_id);
    setDeleteModalShow(true);
  };

  const handleDeleteModalClose = () => {
    setPointToProcess(null);
    setDeleteModalShow(false);
  };

  // handle for TrailMap component  
  const handleAddPoint = (point) => {
    //setPoints((prevPoints) => [...prevPoints, point]);
    setCurrentPoint(point);
    setLongitude(point.longitude);
    setLatitude(point.latitude);
    setTempPoint(point);
    setPointCreated(true);
  };

  // handle for TrailMap component
  const handleEditPoint = (pointId, updatedPoint, pointsTemp) => {
    setPoints(pointsTemp);
    setPoints((prevPoints) =>
      prevPoints.map((point) =>
        point._id === pointId || point.id === pointId ? { ...point, ...updatedPoint } : point
      )
    );
  };

  const handleSavePoint = (data) => {
    if (editMode) {
      let cID = currentPoint.id || currentPoint._id;
      setPoints(points => points.map(p => p.id === cID || p._id === cID ? { ...p, ...data } : p));
      //updateMapPoints(points.map(p => p.id === currentPoint.id ? { ...p, ...data } : p));
    } else {
      const point = { ...data, longitude: tempPoint.longitude, latitude: tempPoint.latitude, id: tempPoint.id };
      setPoints(prevPoints => [...prevPoints, point]);
      //updateMapPoints([...points, point]);
    }
    //setModalOpen(false);
    setEditMode(false);
    if (accordionEdit) {
      // Switch to the "Overview" tab programmatically
      document.getElementById("create-trail-tab-tab-overview").click();
      setAccordionEdit(false);
    }
    setCurrentPoint(null);
  }

  const handleSave = () => {
    if (title) {
      const pointData = {
        title,
        longitude,
        latitude,
        content
      };

      if (quizChecked) {
        if (!question || (!answers[0].text && quizType !== 'slider')) {
          alert('Please fill all quiz fields.');
          return;
        }

        pointData.quiz = {
          question,
          type: quizType,
          points: ppoints,
          answers: quizType === 'slider' ? [{ text: sliderCorrectValue, minValue: sliderMinValue, maxValue: sliderMaxValue, isCorrect: true }] : answers.filter(ans => ans.text.trim() !== ''),
          feedback: {
            correct: correctFeedback,
            incorrect: incorrectFeedback,
          },
        };
      } else {
        pointData.quiz = null;
      }
      console.log(pointData);
      handleSavePoint(pointData);
      resetContent();
      //onClose();
    } else {
      alert('Please fill the title.');
    }
  }

  const resetContent = () => {
    setPointCreated(false);
    setTitle('');
    setLongitude('');
    setLatitude('');
    setContent('');
    setQuizChecked(false);
    setQuestion('');
    setPpoints('');
    setQuizType('single');
    setAnswers([{ text: '', isCorrect: true }]);
    setSliderCorrectValue(50);
    setSliderMinValue(0);
    setSliderMaxValue(100);
    setCorrectFeedback('');
    setIncorrectFeedback('');
    setTempPoint(null);
    setPreviousAnswers({});
  };

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
    setAnswers(updatedAnswers);
    // Store the updated answers to preserve them when switching types
    setPreviousAnswers((prev) => ({ ...prev, [quizType]: updatedAnswers }));
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const handleRemoveAnswer = (index) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const toLetters = (num) => {
    "use strict";
    var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
  };


  const handleAccordionClick = (pointId) => {
    const pointToEdit = points.find((point) => point.id === pointId || point._id === pointId);
    console.log('accordion id:', pointId);
    if (pointToEdit) {
      setTitle(pointToEdit.title || '');
      setLongitude(pointToEdit.longitude || '');
      setLatitude(pointToEdit.latitude || '');
      setContent(pointToEdit.content || '');
      setQuizChecked(!!pointToEdit.quiz);
      setQuestion(pointToEdit.quiz?.question || '');
      setQuizType(pointToEdit.quiz?.type || 'single');
      setPpoints(pointToEdit.quiz?.points || '');
      setAnswers(pointToEdit.quiz?.answers || [{ text: '', isCorrect: true }]);
      setCorrectFeedback(pointToEdit.quiz?.feedback?.correct || '');
      setIncorrectFeedback(pointToEdit.quiz?.feedback?.incorrect || '');
      setSliderCorrectValue(pointToEdit.quiz?.answers[0]?.text || 50);
      setSliderMinValue(pointToEdit.quiz?.answers[0]?.minValue || 0);
      setSliderMaxValue(pointToEdit.quiz?.answers[0]?.maxValue || 100);
      setEditMode(true);
      setCurrentPoint(pointToEdit);

      // Switch to the "Trail Content" tab 
      document.getElementById("create-trail-tab-tab-points").click();

      setPointCreated(true);
      setEditMode(true);
      setAccordionEdit(true);
    }
  };

  return (
    <div className={`${styles.new_trail_container} ${styles.new_trail_bg} d-flex container-fluid mx-0 px-0`}>
      <div className='col-3 pe-4'>
        <Navbar />
      </div>
      <div className={`col-9 px-5`}>
        <div className='py-5 ps-0'>
          <div className='d-flex justify-content-between'>
            <div>
              <h1 className='text-3xl'>{id ? 'Edit the Trail' : 'Add a New Trail'}</h1>
              <p className={`${styles.new_trail_text}`}>Please fill in all the details of your trail.</p>
            </div>
            <div className='d-flex align-items-center pb-4'>
              <button className={`${styles.save_button} btn btn-secondary`} onClick={handleSaveTrail}>Save as Draft</button>
            </div>
          </div>
          <div>
            <Tabs
              defaultActiveKey="general"
              id="create-trail-tab"
              className="mb-3"
              justify
            >
              <Tab eventKey="general" title="General Information">
                <div className={`${styles.tabs_bg} p-4`}>
                  <div className={`${styles.file_upload} d-flex flex-column align-items-center mb-3 w-100`}>
                    <img src={file_upload} alt="file_upload" style={{ width: '8rem', height: '8rem' }} className='mt-5' />
                    <div className='d-flex'>
                      <div className={`${styles.upload_text_black} pe-1`}>Drag and drop or</div>
                      <div className={`${styles.upload_text_blue} pe-1`}>Choose File</div>
                      <div className={`${styles.upload_text_black}`}>to upload</div>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-9 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Trail Name</label>
                      <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={`${styles.form_input} form-control`}></input>
                    </div>
                    <div className='col-3 ps-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Estimated Time (min.)</label>
                      <input type='number' value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} min="0" className={`${styles.form_input} form-control`}></input>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-6 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Location</label>
                      <select value={locality} onChange={e => setLocality(e.target.value)} className={`${styles.form_input} form-select`}>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Spain">Spain</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className='col-6 ps-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Language</label>
                      <select value={language} onChange={e => setLanguage(e.target.value)} className={`${styles.form_input} form-select`} >
                        <option value="English">English</option>
                        <option value="Slovak">Slovak</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-6 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Season</label>
                      <select value={season} onChange={e => setSeason(e.target.value)} className={`${styles.form_input} form-select`} >
                        <option value="All Seasons">All Seasons</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Autumn">Autumn</option>
                        <option value="Winter">Winter</option>
                      </select>
                    </div>
                    <div className='col-6 ps-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Difficulty</label>
                      <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={`${styles.form_input} form-select`}>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Challenging">Challenging</option>
                        <option value="Difficult">Difficult</option>
                      </select>
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>Description</label>
                    <div>
                      <div ref={quillRef} className={`${styles.description_input}`} />
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="points" title="Trail Content">
                <div className={`${styles.tabs_bg} p-0 d-flex`}>
                  <div className='col-6 p-4'>
                    {pointCreated ? (
                      <>
                        <div className='mb-3'>
                          <label className={`${styles.form_label} form-label mb-1`}>Interaction Title</label>
                          <input type='text' value={title} onChange={e => setTitle(e.target.value)} className={`${styles.form_input} form-control`}></input>
                        </div>
                        <div className='mb-3 d-flex'>
                          <div className='col-6 pe-3'>
                            <label className={`${styles.form_label} form-label mb-1`}>Longitude</label>
                            <input type='text' value={longitude} onChange={e => setLongitude(e.target.value)} className={`${styles.form_input} form-control`} disabled></input>
                          </div>
                          <div className='col-6 ps-3'>
                            <label className={`${styles.form_label} form-label mb-1`}>Latitude</label>
                            <input type='text' value={latitude} onChange={e => setLatitude(e.target.value)} className={`${styles.form_input} form-control`} disabled></input>
                          </div>
                        </div>
                        <div className='mb-3'>
                          <label className={`${styles.form_label} form-label mb-1`}>Content</label>
                          <textarea type='text' rows="3" value={content} onChange={e => setContent(e.target.value)} className={`${styles.form_input} form-control`}></textarea>
                        </div>
                        <div className="d-flex flex-row justify-content-between mt-3">
                          <div className=" form-check col-8">
                            <input className="form-check-input" type="checkbox" checked={quizChecked} id="quiz_included" onChange={(e) => setQuizChecked(e.target.checked)} />
                            <label className={`${styles.form_label} form-check-label`} htmlFor="quiz_included" >
                              Do you want to include quiz?
                            </label>
                          </div>
                          <div className="col-4 text-end">
                            <button className='btn btn-primary' onClick={handleSave}>
                              Save Point
                            </button>
                          </div>
                        </div>
                        {quizChecked ? (
                          <>
                            <div className='mb-3'>
                              <label className={`${styles.form_label} form-label mb-1`}>Question</label>
                              <input type='text' value={question} onChange={e => setQuestion(e.target.value)} className={`${styles.form_input} form-control`}></input>
                            </div>
                            <div className='mb-3 d-flex'>
                              <div className='col-4 pe-3'>
                                <label className={`${styles.form_label} form-label mb-1`}>Points</label>
                                <input type='number' value={ppoints} min="0" onChange={e => setPpoints(e.target.value)} className={`${styles.form_input} form-control`}></input>
                              </div>
                              <div className='col-8 ps-3'>
                                <label className={`${styles.form_label} form-label mb-1`}>Question Type</label>
                                <select value={quizType} onChange={e => setQuizType(e.target.value)} className={`${styles.form_input} form-select`}>
                                  <option value="single">Single Correct Answer</option>
                                  <option value="multiple">Multiple Correct Answers</option>
                                  <option value="short-answer">Short Answer</option>
                                  <option value="slider">Slider</option>
                                  <option value="pairs">Pairs</option>
                                  <option value="order">Ordering</option>
                                  <option value="true-false">True/False</option>
                                </select>
                              </div>
                            </div>
                            {(() => {
                              switch (quizType) {
                                case 'short-answer':
                                  return (
                                    <ShortAnswerComponent
                                      value={answers[0].text}
                                      onChange={(newValue) => handleChangeAnswer(0, 'text', newValue)}
                                    />
                                  );
                                case 'single':
                                case 'multiple':
                                  return (
                                    <>
                                      <ChoiceComponent
                                        quizType={quizType}
                                        answers={answers}
                                        handleChangeAnswer={handleChangeAnswer}
                                        handleRemoveAnswer={handleRemoveAnswer}
                                      />
                                      <button onClick={handleAddAnswer} className={`btn ${styles.point_save_button} mb-3`}>Add Answer</button>
                                    </>
                                  );
                                case 'slider':
                                  return (
                                    <SliderComponent
                                      correctValue={sliderCorrectValue}
                                      minValue={sliderMinValue}
                                      maxValue={sliderMaxValue}
                                      setCorrectValue={correctValue => setSliderCorrectValue(correctValue)}
                                      setMinValue={minValue => setSliderMinValue(minValue)}
                                      setMaxValue={maxValue => setSliderMaxValue(maxValue)}
                                    />
                                  );
                                case 'pairs':
                                  return (
                                    <>
                                      <PairsComponent
                                        answers={answers}
                                        handleChangeAnswer={handleChangeAnswer}
                                        handleRemoveAnswer={handleRemoveAnswer}
                                      />
                                      <button onClick={handleAddAnswer} className={`btn ${styles.point_save_button} mb-3`}>Add Answer</button>
                                    </>
                                  );
                                case 'order':
                                  return (
                                    <>
                                      <OrderComponent
                                        answers={answers}
                                        handleChangeAnswer={handleChangeAnswer}
                                        handleRemoveAnswer={handleRemoveAnswer}
                                      />
                                      <button onClick={handleAddAnswer} className={`btn ${styles.point_save_button} mb-3`}>Add Answer</button>
                                    </>
                                  );
                                case 'true-false':
                                  return (
                                    <TrueFalseComponent
                                      value={answers[0].isCorrect}
                                      answer={answers[0]}
                                      handleChangeAnswer={handleChangeAnswer}
                                    />
                                  );
                                default:
                                  return null;
                              }
                            })()}
                            <div className='mb-3'>
                              <label className={`${styles.form_label} form-label mb-1`}>Correct Answer Feedback</label>
                              <input type='text' value={correctFeedback} onChange={e => setCorrectFeedback(e.target.value)} className={`${styles.form_input} form-control`}></input>
                            </div>
                            <div className='mb-3'>
                              <label className={`${styles.form_label} form-label mb-1`}>Incorrect Answer Feedback</label>
                              <input type='text' value={incorrectFeedback} onChange={e => setIncorrectFeedback(e.target.value)} className={`${styles.form_input} form-control`}></input>
                            </div>
                          </>
                        )
                          : <></>
                        }
                      </>
                    ) : (
                      <>
                        <div className={`${styles.map_container}  d-flex justify-content-center align-items-center`}>
                          <p className={`${styles.map_left_text} text-center`}>Create new Interactive Point by clicking on the map.</p>
                        </div>
                      </>
                    )}

                  </div>
                  <div className='col-6'>
                    <TrailMap
                      points={points}
                      onPointAdd={handleAddPoint}
                      onPointEdit={handleEditPoint}
                      editable={true}
                      height='38rem'
                    />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="overview" title="Overview">

                <div className={`${styles.tabs_bg} p-0`}>
                  <p className={`${styles.overview_heading} pb-2 mx-4 mt-4 mb-4`}>Points of Interest</p>
                  <div className='d-flex'>
                    <div className={`col-6 p-4 pt-0`}>
                      <Accordion defaultActiveKey={['0']} alwaysOpen>
                        {points.map(point => (
                          <Accordion.Item eventKey={point.id || point._id} key={point.id || point._id}>
                            <Accordion.Header className={`${styles.accordion_header}`}>
                              <div className='d-flex flex-column w-100 p-2'>
                                <img src={accordion_default} alt="publish" className='mb-3' style={{ width: '3.1rem', height: '3.1rem' }} />
                                <p className={`${styles.accordion_point_title} mb-2`}>{point.title}</p>
                                <div className='d-flex'>
                                  {point.quiz ? (
                                    <>
                                      <div className='col-6 d-flex'>
                                        <div>
                                          <img src={accordion_question_type} alt="accordion_question_type" className='pe-2' style={{ width: '1.3rem', height: '1.3rem' }} />
                                        </div>
                                        <p className={`${styles.accordion_point_question_type} m-0`}>
                                          {(() => {
                                            switch (point.quiz?.type) {
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
                                        <p className={`${styles.accordion_point_question_type} m-0`}>{point.quiz.points} {point.quiz.points === 1 ? " point" : " points"}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className={`${styles.accordion_point_question_type} m-0`}>No Quiz</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className='p-2 pt-0'>
                                <div className={`${styles.accordion_divider_bottom} d-flex pb-2 mb-2`}>
                                  <div className='col-9'>
                                    <div className='d-flex'>
                                      <div className='col-3'>
                                        <p className={`${styles.accordion_point_coords} m-0`}>Latitude:</p>
                                      </div>
                                      <div className='col-9'>
                                        <p className={`${styles.accordion_point_coords} m-0`}>{point.latitude}</p>
                                      </div>
                                    </div>
                                    <div className='d-flex'>
                                      <div className='col-3'>
                                        <p className={`${styles.accordion_point_coords} m-0`}>Longitude:</p>
                                      </div>
                                      <div className='col-9'>
                                        <p className={`${styles.accordion_point_coords} m-0`}>{point.longitude}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-3 d-flex justify-content-end'>
                                    <button className={`${styles.accordion_buttons} btn p-1`} onClick={() => handleAccordionClick(point._id || point.id)}>
                                      <img src={accordion_action_edit} alt="delete" className='m-2' style={{ width: '1.2rem', height: '1.2rem', color: '#6C7885' }} />
                                    </button>
                                    <button className={`${styles.accordion_buttons} btn p-1`} onClick={() => handleDeleteModalShow(point._id || point.id)}>
                                      <img src={accordion_action_delete} alt="delete" className='m-2' style={{ width: '1.2rem', height: '1.2rem', color: '#6C7885' }} />
                                    </button>
                                  </div>
                                </div>
                                <div className="form-check form-switch mb-1 mt-3">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={showPointContent}
                                    onChange={e => setShowPointContent(e.target.checked)}
                                    id="show_content_checkbox" />
                                  <label className={`${styles.form_label} form-check-label`} htmlFor="show_content_checkbox">{showPointContent ? "Hide Content" : "Show Content"}</label>
                                </div>
                                <div className={showPointContent ? "d-block" : "d-none"}>
                                  <p className={`${styles.accordion_text_gray}`}>{point.content}</p>
                                </div>
                                {point.quiz ? (
                                  <>
                                    {(() => {
                                      switch (point.quiz.type) {
                                        case 'short-answer': return (
                                          <>
                                            <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                              <p className={`${styles.accordion_text_gray} my-2`}>{point.quiz.question}</p>
                                              <div className='my-1'>
                                                <p className={`${styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{point.quiz.answers[0].text}</p>
                                              </div>
                                            </div>
                                          </>);
                                        case 'single':
                                        case 'multiple': return (
                                          <>
                                            <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                              <p className={`${styles.accordion_text_gray} my-2`}>{point.quiz.question}</p>
                                              {point.quiz.answers.map((answer, index) => (
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
                                            </div>
                                          </>);
                                        case 'slider': return (
                                          <>
                                            <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                              <p className={`${styles.accordion_text_gray} my-2`}>{point.quiz.question}</p>
                                              <div className='d-flex justify-content-between mt-2'>
                                                <p className={`${styles.accordion_text_gray} mb-0`}>{point.quiz.answers[0].minValue}</p>
                                                <p className={`${styles.accordion_slider_value} mb-0`}>{point.quiz.answers[0].text}</p>
                                                <p className={`${styles.accordion_text_gray} mb-0`}>{point.quiz.answers[0].maxValue}</p>
                                              </div>
                                              <div className='d-flex align-items-center justify-content-center'>
                                                <input
                                                  type="range"
                                                  min={point.quiz.answers[0].minValue}
                                                  max={point.quiz.answers[0].maxValue}
                                                  value={point.quiz.answers[0].text}
                                                  readOnly
                                                  className='form-range'
                                                />
                                              </div>
                                            </div>
                                          </>);
                                        case 'pairs': return (
                                          <>
                                            <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                              <p className={`${styles.accordion_text_gray} my-2`}>{point.quiz.question}</p>
                                              {point.quiz.answers.map((answer) => (
                                                <div className='d-flex my-1'>
                                                  <div className='col-6 pe-2'>
                                                    <p className={`${styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer.text}</p>
                                                  </div>
                                                  <div className='col-6 ps-2'>
                                                    <p className={`${styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer.pairText}</p>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </>);
                                        case 'order': return (
                                          <>
                                            <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                              <p className={`${styles.accordion_text_gray} my-2`}>{point.quiz.question}</p>
                                              {point.quiz.answers.map((answer) => (
                                                <div className='my-1'>
                                                  <p className={`${styles.accordion_point_answers_text} p-2 ps-2 m-0`}>{answer.text}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </>);
                                        case 'true-false': return (
                                          <>
                                            <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                              <p className={`${styles.accordion_text_gray} my-2`}>{point.quiz.question}</p>
                                              <div className="form-check">
                                                <input className="form-check-input" type="radio" name="trueFalseRadio" id="optionTrue" value="true" readOnly checked={point.quiz.answers[0]?.isCorrect} />
                                                <label className={`${styles.form_label} form-check-label`} htmlFor="optionTrue">
                                                  True
                                                </label>
                                              </div>
                                              <div className="form-check">
                                                <input className="form-check-input" type="radio" name="trueFalseRadio" id="optionFalse" value="false" readOnly checked={!point.quiz.answers[0]?.isCorrect} />
                                                <label className={`${styles.form_label} form-check-label`} htmlFor="optionFalse">
                                                  False
                                                </label>
                                              </div>
                                            </div>
                                          </>);
                                        default: return (<></>);
                                      }
                                    })()}
                                    {(point.quiz.feedback && ((point.quiz.feedback?.correct !== "" && point.quiz.feedback?.correct !== null) || (point.quiz.feedback?.incorrect !== "" && point.quiz.feedback?.incorrect !== null))) ? (
                                      <>
                                        <div className={`${styles.accordion_divider_top} d-flex flex-column mt-3 pt-2`}>
                                          <p className={`${styles.accordion_text_gray} my-2`}>Answer Feedback</p>
                                          <div className={(point.quiz.feedback.correct !== "" && point.quiz.feedback.correct !== null) ? 'my-1' : 'my-1 d-none'}>
                                            <p className={`${styles.accordion_correct_feedback} p-2 ps-2 m-0`}>{point.quiz.feedback.correct}</p>
                                          </div>
                                          <div className={(point.quiz.feedback.incorrect !== "" && point.quiz.feedback.incorrect !== null) ? 'my-1' : 'my-1 d-none'}>
                                            <p className={`${styles.accordion_incorrect_feedback} p-2 ps-2 m-0`}>{point.quiz.feedback.incorrect}</p>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </div>
                    <div className='col-6'>
                      <TrailMap
                        points={points}
                        editable={false}
                        height='32rem'
                      /> {/* Second map instance */}
                    </div>
                  </div>
                </div>

              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal
            show={deleteModalShow}
            onHide={handleDeleteModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className='d-flex flex-column align-items-center p-4'>
              <img src={modal_delete} alt="modal_delete" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>Delete Point</h1>
              <p className={`${styles.modal_text} mb-0`}>Are you sure you want to delete this point?</p>
              <p className={`${styles.modal_text} `}>This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handleDeleteModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => handleConfirmDelete()} className={`${styles.modal_delete_button} flex-fill ms-2 me-5`}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
    </div>
  )
};

export default CreateTrail;