import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import PointModal from '../../components/PointModal';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineDelete } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
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

import Cookies from "universal-cookie";

//svg import
import file_upload from '../assets/file_upload.png';
import accordion_default from '../assets/accordion_default.svg';
import accordion_points from '../assets/accordion_points.svg';
import accordion_question_type from '../assets/accordion_question_type.svg';

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

  const removePoint = (pointId) => {
    setPoints(points => {
      const updatedPoints = points.filter(p => p.id !== pointId);
      updateMapPoints(updatedPoints);
      return updatedPoints;
    });
  }

  // handle for TrailMap component  
  const handleAddPoint = (point) => {
    //setPoints((prevPoints) => [...prevPoints, point]);
    setCurrentPoint(point);
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

  const handleAccordionClick = (pointId) => {
    const pointToEdit = points.find((point) => point.id === pointId || point._id === pointId);
    console.log('accordion id', pointId);
    if (pointToEdit) {
      setTitle(pointToEdit.title || '');
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
                        <div className='mb-3'>
                          <label className={`${styles.form_label} form-label mb-1`}>Content</label>
                          <textarea type='text' rows="3" value={content} onChange={e => setContent(e.target.value)} className={`${styles.form_input} form-control`}></textarea>
                        </div>
                        <div className="d-flex flex-row justify-content-between mt-3">
                          <div className=" form-check col-8">
                            <input className="form-check-input" type="checkbox" value={quizChecked} id="quiz_included" onChange={(e) => setQuizChecked(e.target.checked)} />
                            <label className='form-check-label' htmlFor="quiz_included" >
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
                                      <button onClick={handleAddAnswer} className='p-2 border-2 border-gray-500 m-4'>Add Another Pair</button>
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
                                      <button onClick={handleAddAnswer} className='p-2 border-2 border-gray-500 m-4'>Add Another Answer</button>
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
                    />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="overview" title="Overview">

                <div className={`${styles.tabs_bg} p-0`}>
                  <p>Points of interest</p>
                  <div className='d-flex'>
                    <div className={`${styles.accordion_header} col-6 p-4`}>
                      <Accordion defaultActiveKey={['0']} alwaysOpen>
                        {points.map(point => (
                          <Accordion.Item eventKey={point.id || point._id} key={point.id || point._id}>
                            <Accordion.Header>
                              <div className='d-flex flex-column w-100 p-2'>
                                <img src={accordion_default} alt="publish" className='' style={{ width: '3.1rem', height: '3.1rem' }} />
                                <p className={`${styles.accordion_point_title}`}>{point.title}</p>
                                {/*console.log("undefined or null?" + !(point.quiz !== undefined && point.quiz !== null))*/}
                                <div className='d-flex'>
                                  {point.quiz ? (
                                    <>
                                      <div className='col-6 d-flex'>
                                        <img src={accordion_question_type} alt="accordion_question_type" className='pe-2' />
                                        {(() => {
                                          switch (point.quiz?.type) {
                                            case 'short-answer': return (<p>Short Written Answer</p>);
                                            case 'single': return (<p>Single Correct Answer</p>);
                                            case 'multiple': return (<p>Multiple Correct Answers</p>);
                                            case 'slider': return (<p>Slider</p>);
                                            case 'pairs': return (<p>Matching Pairs</p>);
                                            case 'order': return (<p>Ordering</p>);
                                            case 'true-false': return (<p>True/False</p>);
                                            default: return (<></>);
                                          }
                                        })()}
                                      </div>
                                      <div className='col-6 d-flex'>
                                        <img src={accordion_points} alt="accordion_points" className='pe-2' />
                                        {point.quiz.points} {point.quiz.points === 1 ? " point" : " points"}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p>No Quiz</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body onClick={() => handleAccordionClick(point._id)}>
                              LAT: {point.latitude}, LON: {point.longitude} <br />
                              {point.content}
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </div>
                    <div className='col-6'>
                      <TrailMap
                        points={points}
                        editable={false}
                      /> {/* Second map instance */}
                    </div>
                  </div>
                </div>

              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
};


/* <div className='p-4'>
  <BackButton></BackButton>
  <h1 className='text-3xl my-4'>Create Trail</h1>
  {loading ? <Spinner /> : ''}
  <div className='flex flex-col p-4'>
    {successMessage && (
      <div className='bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3'>
        <p>{successMessage}</p>
      </div>
    )}
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Name</label>
      <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='border-2 border-gray-500 px-4'></input>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Description</label>
      <div style={{ width: 500 }}><div ref={quillRef} /></div>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Difficulty</label>
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)} >
        <option value="Easy">Easy</option>
        <option value="Moderate">Moderate</option>
        <option value="Challenging">Challenging</option>
        <option value="Difficult">Difficult</option>
      </select>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Season</label>
      <select value={season} onChange={e => setSeason(e.target.value)} >
        <option value="All Seasons">All Seasons</option>
        <option value="Spring">Spring</option>
        <option value="Summer">Summer</option>
        <option value="Autumn">Autumn</option>
        <option value="Winter">Winter</option>
      </select>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Locality</label>
      <select value={locality} onChange={e => setLocality(e.target.value)} >
        <option value="Slovakia">Slovakia</option>
        <option value="Czech Republic">Czech Republic</option>
        <option value="Spain">Spain</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Thumbnail</label>
      <input type='text' value={thumbnail} placeholder="Add Link to Image" onChange={(e) => setThumbnail(e.target.value)} className='border-2 border-gray-500 px-4'></input>
    </div>
    <div className='my-4'>
      <label className='text-l mr-4 text-gray-500'>Map points:</label>
      <ul>
        {points.map(point => (
          <li key={point.id}>
            {point.title || 'New Point'} - {point.latitude}, {point.longitude}
            <button onClick={() => handleEditPoint(point)}><AiOutlineEdit className='text-yellow-600'/></button>
            <button onClick={() => removePoint(point.id)}><MdOutlineDelete className='text-red-600'/></button>
          </li>
        ))}
      </ul>
    </div>
    <PointModal key={modalKey} isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSavePoint} editMode={editMode} pointData={currentPoint}></PointModal>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Map - Click to Add Points</label>
      <div ref={mapRef} className='w-full h-96 border-2 border-gray-300' />
    </div>

    <button className='p-2 bg-sky-300 m-8' onClick={handleSaveTrail}>
      Save
    </button>
  </div>
</div> */

export default CreateTrail;