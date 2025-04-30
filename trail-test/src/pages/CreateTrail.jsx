import React, { useEffect, useState, useRef } from 'react';
import api from '../axiosConfig';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
import AlertComponent from '../../components/AlertComponent';
import TrailMap from '../../components/TrailMap';
import AudioRecorder from '../../components/AudioRecorder';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next'; // Import translation hook
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';

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

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CreateTrail = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [locality, setLocality] = useState('Slovakia');
  const [season, setSeason] = useState('All Seasons');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [language, setLanguage] = useState('Slovak');
  const [points, setPoints] = useState([]);
  const [tempPoint, setTempPoint] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false); // because of the possibility to edit already created point
  const [currentPoint, setCurrentPoint] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState('');
  const [ppoints, setPpoints] = useState(0);
  const [quizType, setQuizType] = useState('single');
  const [correctFeedback, setCorrectFeedback] = useState('');
  const [incorrectFeedback, setIncorrectFeedback] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [quizChecked, setQuizChecked] = useState(false);
  const [pointCreated, setPointCreated] = useState(false);
  const [answers, setAnswers] = useState([{ text: '', isCorrect: true }]);
  //const [previousAnswers, setPreviousAnswers] = useState({}); // Store previous answers for each quiz type
  const [sliderCorrectValue, setSliderCorrectValue] = useState(50);
  const [sliderMinValue, setSliderMinValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(100);
  const { id } = useParams(); // Extract id for edit mode
  const [accordionEdit, setAccordionEdit] = useState(false);
  const [showPointContent, setShowPointContent] = useState(false);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [pointToProcess, setPointToProcess] = useState(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { t } = useTranslation(); // Hook to access translations
  const [tempAudios, setTempAudios] = useState({});
  const [tempPointId, setTempPointId] = useState(null);
  const [audioB, setAudioB] = useState(null);
  //const [selectedLanguageVersion, setSelectedLanguageVersion] = useState('Slovak');
  const query = useQuery();
  const translationLang = query.get('lang');
  const [isTranslationMode, setIsTranslationMode] = useState(false);
  const [existingTranslation, setExistingTranslation] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState('');
  // translation placeholder variables
  const [showOriginalDescription, setShowOriginalDescription] = useState(false);
  const [storedOriginalTrail, setStoredOriginalTrail] = useState({ name: '', description: '' });
  const [placeTitle, setPlaceTitle] = useState('');
  const [placeContent, setPlaceContent] = useState('');
  const [showOriginalContent, setShowOriginalContent] = useState(false);
  const [placeQuestion, setPlaceQuestion] = useState('');
  const [placeAnswers, setPlaceAnswers] = useState([]);
  const [placeCorrect, setPlaceCorrect] = useState('');
  const [placeIncorrect, setPlaceIncorrect] = useState('');
  const [placeFeedbackContent, setPlaceFeedbackContent] = useState('');
  const [showOriginalFeedbackContent, setShowOriginalFeedbackContent] = useState(false);

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

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  // return userId from cookie
  const getUserIDFromToken = (token) => {
    try {
      const [header, payload, signature] = token.split('.');
      if (!header || !payload || !signature) {
        throw new Error('Invalid token structure');
      }

      const tokenPayload = JSON.parse(atob(payload));
      return tokenPayload?.userId || null; // Return the userID if available
    } catch (error) {
      console.error('Error decoding token:', error);
      return null; // Return null if the token is invalid or userID is not present
    }
  };

  const handleFileChange = (event) => {
    let file = event.target.files[0];
    if (!file) return;
    setThumbnail(file);
    let fileURL = URL.createObjectURL(file);
    setThumbnailPreview(fileURL);
  };

  // Save the whole trail into DB
  const handleSaveTrail = async () => {
    let trailLength = calculateTrailLength(points);
    const userId = getUserIDFromToken(token);
    if (!userId) {
      setAlert({ message: `${t('error_userid')}`, type: 'error' });
      return;
    }
    if (!name.trim()) {
      setAlert({ message: `${t('missing_trail_name')}`, type: 'error' });
      return;
    }
    if (!description.trim()) {
      setAlert({ message: `${t('missint_trail_description')}`, type: 'error' });
      return;
    }
    const formData = new FormData();

    if (isTranslationMode) { // if saving translation
      for (const point of points) {
        const pt = point.translation || point;
        if (!pt.title?.trim() || !pt.content?.trim()) {
          setAlert({ message: t('missing_point_translation'), type: 'error' });
          return;
        }
    
        // If quiz exists, validate quiz translation
        if (point.quiz && point.quiz.translation) {
          const qt = point.quiz.translation;
    
          if (!qt.question?.trim()) {
            setAlert({ message: t('missing_quiz_question_translation'), type: 'error' });
            return;
          }
    
          // Optional: Check number of answers matches original
          const originalAnswersCount = point.quiz.answers?.length || 0;
          const translatedAnswers = qt.answers || [];
          if (translatedAnswers.length !== originalAnswersCount) {
            setAlert({ message: t('mismatch_answers_translation'), type: 'error' });
            return;
          }
    
          for (const answer of translatedAnswers) {
            if (!answer.text?.trim() && point.quiz.type !== 'slider') {
              setAlert({ message: t('missing_answer_text_translation'), type: 'error' });
              return;
            }
          }
    
          // Optional feedback validation
          if (!qt.feedback?.correct?.trim() || !qt.feedback?.incorrect?.trim()) {
            setAlert({ message: t('missing_feedback_translation'), type: 'error' });
            return;
          }
        }
      }
      formData.append('translation', JSON.stringify({
        language: translationLang,
        name,
        description
      }));

      const translatedPoints = points.map(p => {
        const quiz = p.quiz;
        return {
          pointId: p._id || p.id,
          translation: {
            language: translationLang,
            title: p.title || '',
            content: p.content || ''
          },
          quizTranslation: quiz ? {
            language: translationLang,
            question: quiz.question || '',
            answers: quiz.answers || [],
            feedback: quiz.feedback || {},
            feedbackContent: quiz.feedbackContent || ''
          } : null
        }
      });

      formData.append('pointsTranslation', JSON.stringify(translatedPoints));

      const url = existingTranslation ? `${backendUrl}/trails/${id}/translate` : `${backendUrl}/trails/${id}/translate?lang=${translationLang}`;
      const method = existingTranslation ? 'put' : 'post';

      const configuration = {
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      };

      api(configuration)
        .then((response) => {
          console.log('Trail translated.');
          setAlert({ message: `${t('trail_updated')}`, type: 'success' });
          setPoints([]);
          setTempAudios({});
          setTimeout(() => { navigate('/'); }, 1500);
        })
        .catch((error) => {
          console.log(error);
          setAlert({ message: `${t('error_trail_save')}`, type: 'error' });
        });
    } else { // saving original trail

      const uploadedAudios = {};

      for (const pointId in tempAudios) {
        const audioBlob = tempAudios[pointId];
        if (!audioBlob || !(audioBlob instanceof Blob)) continue;
        const audioForm = new FormData();
        audioForm.append('audio', audioBlob, `${pointId}.wav`);
        try {
          const response = await fetch(`${backendUrl}/trails/upload-audio`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: audioForm,
          });
          const data = await response.json();
          uploadedAudios[tempPointId || pointId] = data.audioPath; // store returned file path
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }

      const updatedPoints = points.map((point) => ({
        ...point,
        audioPath: uploadedAudios[point.id] || uploadedAudios[point._id] || point.audioPath || null,
      }));

      formData.append('name', name);
      formData.append('description', description);
      formData.append('difficulty', difficulty);
      formData.append('locality', locality);
      formData.append('season', season);
      formData.append('thumbnail', thumbnail);
      formData.append('length', trailLength);
      formData.append('estimatedTime', estimatedTime);
      formData.append('language', language);
      formData.append('points', JSON.stringify(updatedPoints));

      const url = id ? `${backendUrl}/trails/${id}` : `${backendUrl}/trails`;
      const method = id ? 'put' : 'post';

      const configuration = {
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      };

      api(configuration)
        .then((response) => {
          console.log(id ? 'Trail updated.' : 'Trail created.');
          setAlert({ message: id ? `${t('trail_updated')}` : `${t('trail_created')}`, type: 'success' });
          setPoints([]);
          setTempAudios({});
          setTimeout(() => { navigate('/'); }, 1500);
        })
        .catch((error) => {
          console.log(error);
          if(error.response.data.message === "multer_file_limit") setAlert({ message: `${t('error_multer_file_limit')}`, type: 'error'});
          else setAlert({ message: `${t('error_trail_save')}`, type: 'error' });
        });
    }
  };

  // If editing, load existing trail
  useEffect(() => {
    if (id) {
      const configuration = {
        method: "get",
        url: `${backendUrl}/trails/${id}${isTranslationMode ? `?lang=${translationLang}` : ''}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      api(configuration)
        .then(response => {
          // Load data into state for editing
          const data = response.data;
          setName(data.name);
          setDescription(data.description);
          setLocality(data.locality);
          setDifficulty(data.difficulty);
          setSeason(data.season);
          setThumbnail(data.thumbnail);
          setPoints(data.points || []);
          setEstimatedTime(data.estimatedTime);
          setLanguage(data.language);
          //setSelectedLanguageVersion(data.language);

          if (isTranslationMode) {
            const translation = data.translated || false;
            setExistingTranslation(translation);
            //console.log(data);
            setStoredOriginalTrail({ name: data.name, description: data.description });
            setName(translation ? data.name : '');
            setDescription(translation ? data.description : '');

            const loadedPoints = data.points.map(point => {
              const originalPoint = { title: point.title, content: point.content };
              //const pointTranslation = point.translations?.find(tl => tl.language === translationLang);
              point.title = translation ? point.title : '';
              point.content = translation ? point.content : '';
              point.language = translation ? point.language : translationLang;

              let originalQuiz = null;
              let updatedQuiz = null;

              if (point.quiz) {
                originalQuiz = {
                  question: point.quiz.question,
                  answers: point.quiz.answers,
                  feedback: point.quiz.feedback,
                  feedbackContent: point.quiz.feedbackContent,
                };
                //const qt = point.quiz.translations?.find(tl => tl.language === translationLang) || null;
                updatedQuiz = {
                  ...point.quiz,
                  language: translationLang,
                  question: translation ? point.quiz.question : '',
                  answers: point.quiz.answers.map((a, index) => ({
                    text: translation ? point.quiz?.answers?.[index]?.text : '',
                    pairText: translation ? point.quiz?.answers?.[index]?.pairText : '',
                    minValue: a.minValue || null,
                    maxValue: a.maxValue || null,
                    isCorrect: a.isCorrect || false,
                  })),
                  feedback: {
                    correct: translation ? point.quiz?.feedback?.correct : '',
                    incorrect: translation ? point.quiz?.feedback?.incorrect : '',
                  },
                  feedbackContent: translation ? point.quiz?.feedbackContent : '',
                };

              }
              return { ...point, quiz: updatedQuiz, originalPoint, originalQuiz };
            });
            //console.log(loadedPoints);
            setPoints(loadedPoints);
          }

          //loadExistingPoints(response.data.points || []);
        }).catch(error => {
          console.error(error);
        });
    }
  }, [id, isTranslationMode]);

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
    const newPointId = Date.now();
    setTempPointId(newPointId);
    setCurrentPoint({ ...point, id: newPointId });
    setLongitude(point.longitude);
    setLatitude(point.latitude);
    setTempPoint({ ...point, id: newPointId });
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

  // save point to temp 
  const handleSavePoint = (data, audioBlob) => {
    if (editMode) {
      let cID = currentPoint.id || currentPoint._id;
      setPoints(points => points.map(p => p.id === cID || p._id === cID ? { ...p, ...data, audioPath: audioBlob ? p.audioPath : null } : p));
      if (audioBlob) {
        setTempAudios((prev) => ({
          ...prev,
          [cID]: audioBlob,
        }));
      } else {
        setTempAudios((prev) => {
          const updated = { ...prev };
          delete updated[cID];
          return updated;
        });
      }
      //updateMapPoints(points.map(p => p.id === currentPoint.id ? { ...p, ...data } : p));
    } else {
      if (tempPoint === null) {
        const pointId = tempPointId || Date.now();
        const point = { ...data, longitude: longitude, latitude: latitude, id: pointId, audioFile: audioBlob || null };
        setPoints(prevPoints => [...prevPoints, point]);
        if (audioBlob) {
          setTempAudios((prev) => ({
            ...prev,
            [pointId]: audioBlob,
          }));
        }
      } else {
        const point = { ...data, longitude: longitude, latitude: latitude, id: tempPoint.id, audioFile: audioBlob || null };
        setPoints(prevPoints => [...prevPoints, point]);
        if (audioBlob) {
          setTempAudios((prev) => ({
            ...prev,
            [tempPoint.id]: audioBlob,
          }));
        }
        //updateMapPoints([...points, point]);
      }
    }
    //setModalOpen(false);
    setEditMode(false);
    if (accordionEdit) {
      // Switch to the "Overview" tab programmatically
      document.getElementById("create-trail-tab-tab-overview").click();
      setAccordionEdit(false);
    }
    setCurrentPoint(null);
    setTempPointId(null);
    setTempPoint(null);
    setAudioB(null);
  }

  // point save checks before saving
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
          setAlert({ message: `${t('missing_quiz_fields')}`, type: 'error' });
          return;
        }

        pointData.quiz = {
          question: question,
          type: quizType,
          points: ppoints,
          answers: quizType === 'slider' ? [{ text: sliderCorrectValue, minValue: sliderMinValue, maxValue: sliderMaxValue, isCorrect: true }] : answers.filter(ans => ans.text.trim() !== ''),
          feedback: {
            correct: correctFeedback,
            incorrect: incorrectFeedback,
          },
          feedbackContent: feedbackContent,
        };

      } else {
        pointData.quiz = null;
      }
      handleSavePoint(pointData, audioB);
      resetContent();
      //onClose();
    } else {
      setAlert({ message: `${t('missing_point_title')}`, type: 'error' });
    }
  }

  // reset variables 
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
    setFeedbackContent('');
    setTempPoint(null);
    setStoredOriginalTrail({ name: '', description: '' });
    //setPreviousAnswers({});
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
    //setPreviousAnswers((prev) => ({ ...prev, [quizType]: updatedAnswers }));
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

  // load point for editing from accordion
  const handleAccordionClick = (pointId) => {
    const pointToEdit = points.find((point) => point.id === pointId || point._id === pointId);
    console.log('accordion id:', pointId);
    if (pointToEdit) {
      setTitle(pointToEdit.title || '');
      setContent(pointToEdit.content || '');
      setLongitude(pointToEdit.longitude || '');
      setLatitude(pointToEdit.latitude || '');
      setQuizChecked(!!pointToEdit.quiz);
      setQuestion(pointToEdit.quiz?.question || '');
      setQuizType(pointToEdit.quiz?.type || 'single');
      setPpoints(pointToEdit.quiz?.points || '');
      setAnswers(pointToEdit.quiz?.answers || [{ text: '', isCorrect: true }]);
      setCorrectFeedback(pointToEdit.quiz?.feedback?.correct || '');
      setIncorrectFeedback(pointToEdit.quiz?.feedback?.incorrect || '');
      setFeedbackContent(pointToEdit.quiz?.feedbackContent || '');
      setSliderCorrectValue(pointToEdit.quiz?.answers[0]?.text || 50);
      setSliderMinValue(pointToEdit.quiz?.answers[0]?.minValue || 0);
      setSliderMaxValue(pointToEdit.quiz?.answers[0]?.maxValue || 100);
      setEditMode(true);
      setTempPointId(pointToEdit._id || pointToEdit.id);
      setCurrentPoint(pointToEdit);
      setAudioB(pointToEdit.audioFile || null);

      if (isTranslationMode) {
        setPlaceTitle(pointToEdit.originalPoint.title);
        setPlaceContent(pointToEdit.originalPoint.content);
        setPlaceQuestion(pointToEdit.originalQuiz.question);
        setPlaceAnswers(pointToEdit.originalQuiz.answers)
        setPlaceCorrect(pointToEdit.originalQuiz.feedback.correct);
        setPlaceIncorrect(pointToEdit.originalQuiz.feedback.incorrect);
        setPlaceFeedbackContent(pointToEdit.originalQuiz.feedbackContent);
      }

      // Switch to the "Trail Content" tab 
      document.getElementById("create-trail-tab-tab-points").click();

      setPointCreated(true);
      setEditMode(true);
      setAccordionEdit(true);
    }
  };

  const handleAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAreaDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleAreaDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleAreaDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file) {
        setThumbnail(file);
        let fileURL = URL.createObjectURL(file);
        setThumbnailPreview(fileURL);
      }
    }
  };

  const handleAudioSave = (audioBlob) => {
    const pointId = tempPointId || Date.now();
    setTempAudios((prev) => ({
      ...prev,
      [pointId]: audioBlob,
    }));
    setTempPointId(pointId);
    setAudioB(audioBlob);
    console.log("Audio saved for point:", pointId);
  };

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 12000); // Hide alert after 12 seconds
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  // Quill modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  // detect translation mode
  useEffect(() => {
    if (translationLang) {
      setIsTranslationMode(true);
      console.log('translation on');
      setEditingLanguage(translationLang);
    }
  }, [translationLang]);

  return (
    <>
      {/*<div className={`${styles.new_trail_container} ${styles.new_trail_bg} d-flex container-fluid mx-0 px-0`}>
      <div className='col-3 pe-4'>
        <Navbar />
      </div>*/}
      <NavbarExplorer />
      {/*<div className={`col-9 px-5`}>*/}
      <div className={`py-lg-3 px-0 offset-lg-2 col-lg-8`}>
        <div className='py-5 ps-0'>
          <div className='d-flex justify-content-between'>
            <div>
              {isTranslationMode ? (
                <h1 className='text-3xl'>{`${t('translate')} ${editingLanguage}`}</h1>
              ) : (
                <h1 className='text-3xl'>{id ? `${t('edit_new_trail')}` : `${t('add_new_trail')}`}</h1>
              )}
              <p className={`${styles.new_trail_text}`}>{t('new_trail_text')}</p>
            </div>
            <div className='d-flex align-items-center pb-4'>
              <button className={`${styles.save_button} btn btn-secondary`} onClick={handleSaveTrail}>{t('save_draft')}</button>
            </div>
          </div>
          {alert.message && (
            <AlertComponent message={alert.message} type={alert.type} />
          )}
          <div>
            <Tabs
              defaultActiveKey="general"
              id="create-trail-tab"
              className="mb-3"
              justify
            >
              <Tab eventKey="general" title={t('general_information')}>
                <div className={`${styles.tabs_bg} p-4`}>
                  <div className={`${styles.file_upload} d-flex flex-column align-items-center mb-3 w-100`} onClick={handleAreaClick} onDragOver={handleAreaDragOver} onDragLeave={handleAreaDragLeave} onDrop={handleAreaDrop}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    {thumbnailPreview ? ( // preview the selected file
                      <img src={thumbnailPreview} alt="preview" style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '1rem', marginTop: '0.5rem' }} />
                    ) : thumbnail ? ( // show thumbnail in edit 
                      <img src={`${backendUrl}/${thumbnail}`} alt="thumbnail" style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '1rem', marginTop: '0.5rem' }} />
                    ) : (
                      <img src={file_upload} alt="file_upload" style={{ width: '8rem', height: '8rem' }} className='mt-5' />
                    )}
                    <div className='d-flex'>
                      <div className={`${styles.upload_text_black} pe-1`}>{t('drag_drop')}</div>
                      <div className={`${styles.upload_text_blue} pe-1`}>{t('choose_file')}</div>
                      <div className={`${styles.upload_text_black}`}>{t('to_upload')}</div>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-9 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('trail_name')}</label>
                      <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={`${styles.form_input} form-control`} placeholder={storedOriginalTrail.name}></input>
                    </div>
                    <div className='col-3 ps-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('estimated_time')}</label>
                      <input type='number' value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} min="0" className={`${styles.form_input} form-control`} disabled={isTranslationMode}></input>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-6 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('locality')}</label>
                      <select value={locality} onChange={e => setLocality(e.target.value)} className={`${styles.form_input} form-select`} disabled={isTranslationMode}>
                        <option value="Slovakia">{t('slovakia')}</option>
                        <option value="Czech Republic">{t('czech')}</option>
                        <option value="Spain">{t('spain')}</option>
                        <option value="Other">{t('other')}</option>
                      </select>
                    </div>
                    <div className='col-6 ps-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('language')}</label>
                      <select value={language} onChange={e => setLanguage(e.target.value)} className={`${styles.form_input} form-select`} disabled={isTranslationMode}>
                        <option value="Slovak">{t('lang_sk')}</option>
                        <option value="English">{t('lang_en')}</option>
                        <option value="Czech">{t('lang_cz')}</option>
                        <option value="Spanish">{t('lang_es')}</option>
                        <option value="Other">{t('other')}</option>
                      </select>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-6 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('season')}</label>
                      <select value={season} onChange={e => setSeason(e.target.value)} className={`${styles.form_input} form-select`} disabled={isTranslationMode}>
                        <option value="All Seasons">{t('all_seasons')}</option>
                        <option value="Spring">{t('spring')}</option>
                        <option value="Summer">{t('summer')}</option>
                        <option value="Autumn">{t('autumn')}</option>
                        <option value="Winter">{t('winter')}</option>
                      </select>
                    </div>
                    <div className='col-6 ps-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('difficulty')}</label>
                      <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={`${styles.form_input} form-select`} disabled={isTranslationMode}>
                        <option value="Easy">{t('diff_easy')}</option>
                        <option value="Moderate">{t('diff_mod')}</option>
                        <option value="Challenging">{t('diff_chal')}</option>
                        <option value="Difficult">{t('diff_dif')}</option>
                      </select>
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>{t('description')} <small>({t('do_not_upload_big')})</small></label>
                    {isTranslationMode && (
                      <div className="mb-2" >
                        <button className="btn btn-outline-secondary btn-sm mb-2" onClick={() => setShowOriginalDescription(!showOriginalDescription)}>
                          {showOriginalDescription ? 'Hide Original Description' : 'Show Original Description'}
                        </button>
                        {showOriginalDescription && (
                          <div className="border rounded p-2 bg-light" dangerouslySetInnerHTML={{ __html: storedOriginalTrail.description }} />
                        )}
                      </div>
                    )}
                    <div>
                      <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} className={`${styles.description_input}`} />
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="points" title={t('trail_content')}>
                <div className={`${styles.tabs_bg} p-0 d-flex`}>
                  <div className='col-6 p-4'>
                    {/*{pointCreated ? (*/}
                    <>
                      <div className='mb-3'>
                        <label className={`${styles.form_label} form-label mb-1`}>{t('interaction_title')}</label>
                        <input type='text' value={title} onChange={e => setTitle(e.target.value)} className={`${styles.form_input} form-control`}
                          placeholder={isTranslationMode ? placeTitle : ''}></input>
                      </div>
                      <div className='mb-3 d-flex'>
                        <div className='col-6 pe-3'>
                          <label className={`${styles.form_label} form-label mb-1`}>{t('longitude')}</label>
                          <input type='text' value={longitude} onChange={e => setLongitude(e.target.value)} className={`${styles.form_input} form-control`} disabled={isTranslationMode}></input>
                        </div>
                        <div className='col-6 ps-3'>
                          <label className={`${styles.form_label} form-label mb-1`}>{t('latitude')}</label>
                          <input type='text' value={latitude} onChange={e => setLatitude(e.target.value)} className={`${styles.form_input} form-control`} disabled={isTranslationMode}></input>
                        </div>
                      </div>
                      <div className='mb-3'>
                        <label className={`${styles.form_label} form-label mb-1`}>{t('content')} <small>({t('do_not_upload_big')})</small></label>
                        {isTranslationMode && (
                          <div className="mb-2" >
                            <button className="btn btn-outline-secondary btn-sm mb-2" onClick={() => setShowOriginalContent(!showOriginalContent)}>
                              {showOriginalContent ? 'Hide Original Content' : 'Show Original Content'}
                            </button>
                            {showOriginalContent && (
                              <div className="border rounded p-2 bg-light" dangerouslySetInnerHTML={{ __html: placeContent }} />
                            )}
                          </div>
                        )}
                        <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className={`${styles.description_input}`} />
                        {/*<textarea type='text' rows="3" value={content} onChange={e => setContent(e.target.value)} className={`${styles.form_input} form-control`}></textarea>*/}
                      </div>
                      <div className='mb-3'>
                        <AudioRecorder onSave={handleAudioSave} existingAudio={currentPoint?.audioPath} blob={audioB} reset={!pointCreated} />
                      </div>
                      <div className="d-flex flex-row justify-content-between mt-3">
                        <div className=" form-check col-8">
                          <input className="form-check-input" type="checkbox" checked={quizChecked} id="quiz_included" onChange={(e) => setQuizChecked(e.target.checked)} disabled={isTranslationMode} />
                          <label className={`${styles.form_label} form-check-label`} htmlFor="quiz_included" >
                            {t('quiz_text')}
                          </label>
                        </div>
                        <div className="col-4 text-end">
                          <button className='btn btn-primary' onClick={handleSave}>
                            {t('save_point')}
                          </button>
                        </div>
                      </div>
                      {quizChecked ? (
                        <>
                          <div className='mb-3'>
                            <label className={`${styles.form_label} form-label mb-1`}>{t('question')}</label>
                            <input type='text' value={question} onChange={e => setQuestion(e.target.value)} className={`${styles.form_input} form-control`}
                              placeholder={isTranslationMode ? placeQuestion : ''}></input>
                          </div>
                          <div className='mb-3 d-flex'>
                            <div className='col-4 pe-3'>
                              <label className={`${styles.form_label} form-label mb-1`}>{t('points')}</label>
                              <input type='number' value={ppoints} min="0" onChange={e => setPpoints(e.target.value)} className={`${styles.form_input} form-control`} disabled={isTranslationMode}></input>
                            </div>
                            <div className='col-8 ps-3'>
                              <label className={`${styles.form_label} form-label mb-1`}>{t('question_type')}</label>
                              <select value={quizType} onChange={e => setQuizType(e.target.value)} className={`${styles.form_input} form-select`} disabled={isTranslationMode}>
                                <option value="single">{t('single')}</option>
                                <option value="multiple">{t('multiple')}</option>
                                <option value="short-answer">{t('short_answer')}</option>
                                <option value="slider">{t('slider')}</option>
                                <option value="pairs">{t('pairs')}</option>
                                <option value="order">{t('order')}</option>
                                <option value="true-false">{t('true_false')}</option>
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
                                    placeholder={placeAnswers[0]?.text}
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
                                      disabled={isTranslationMode}
                                      placeholder={placeAnswers}
                                    />
                                    <button onClick={handleAddAnswer} className={`btn ${styles.point_save_button} mb-3`} disabled={isTranslationMode}>{t('add_answer')}</button>
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
                                    disabled={isTranslationMode}
                                  />
                                );
                              case 'pairs':
                                return (
                                  <>
                                    <PairsComponent
                                      answers={answers}
                                      handleChangeAnswer={handleChangeAnswer}
                                      handleRemoveAnswer={handleRemoveAnswer}
                                      disabled={isTranslationMode}
                                      placeholder={placeAnswers}
                                    />
                                    <button onClick={handleAddAnswer} className={`btn ${styles.point_save_button} mb-3`} disabled={isTranslationMode}>{t('add_answer')}</button>
                                  </>
                                );
                              case 'order':
                                return (
                                  <>
                                    <OrderComponent
                                      answers={answers}
                                      handleChangeAnswer={handleChangeAnswer}
                                      handleRemoveAnswer={handleRemoveAnswer}
                                      disabled={isTranslationMode}
                                      placeholder={placeAnswers}
                                    />
                                    <button onClick={handleAddAnswer} className={`btn ${styles.point_save_button} mb-3`} disabled={isTranslationMode}>{t('add_answer')}</button>
                                  </>
                                );
                              case 'true-false':
                                return (
                                  <TrueFalseComponent
                                    value={answers[0].isCorrect}
                                    answer={answers[0]}
                                    handleChangeAnswer={handleChangeAnswer}
                                    disabled={isTranslationMode}
                                  />
                                );
                              default:
                                return null;
                            }
                          })()}
                          <div className='mb-3'>
                            <label className={`${styles.form_label} form-label mb-1`}>{t('correct_answer_feedback')}</label>
                            <input type='text' value={correctFeedback} onChange={e => setCorrectFeedback(e.target.value)} className={`${styles.form_input} form-control`}
                              placeholder={isTranslationMode ? placeCorrect : ''}></input>
                          </div>
                          <div className='mb-3'>
                            <label className={`${styles.form_label} form-label mb-1`}>{t('incorrect_answer_feedback')}</label>
                            <input type='text' value={incorrectFeedback} onChange={e => setIncorrectFeedback(e.target.value)} className={`${styles.form_input} form-control`}
                              placeholder={isTranslationMode ? placeIncorrect : ''}></input>
                          </div>
                          <div className='mb-3'>
                            <label className={`${styles.form_label} form-label mb-1`}>{t('feedback_content')}</label>
                            {isTranslationMode && (
                              <div className="mb-2" >
                                <button className="btn btn-outline-secondary btn-sm mb-2" onClick={() => setShowOriginalFeedbackContent(!showOriginalFeedbackContent)}>
                                  {showOriginalFeedbackContent ? 'Hide Original Feedback Content' : 'Show Original Feedback Content'}
                                </button>
                                {showOriginalFeedbackContent && (
                                  <div className="border rounded p-2 bg-light" dangerouslySetInnerHTML={{ __html: placeFeedbackContent }} />
                                )}
                              </div>
                            )}
                            <ReactQuill theme="snow" value={feedbackContent} onChange={setFeedbackContent} modules={modules} className={`${styles.description_input}`} />
                          </div>
                        </>
                      )
                        : <></>
                      }
                    </>
                    {/*) : (
                      <>
                        <div className={`${styles.map_container}  d-flex justify-content-center align-items-center`}>
                          <p className={`${styles.map_left_text} text-center`}>{t('map_text_left')}</p>
                        </div>
                      </> 
                    )} */}

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
              <Tab eventKey="overview" title={t('overview')}>

                <div className={`${styles.tabs_bg} p-0`}>
                  <p className={`${styles.overview_heading} pb-2 mx-4 mt-4 mb-4`}>{t('points_of_interest')}</p>
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
                                        <p className={`${styles.accordion_point_question_type} m-0`}>{point.quiz.points} {point.quiz.points === 1 ? ` ${t('point').toLowerCase()}` : `${t('points').toLowerCase()}`}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className={`${styles.accordion_point_question_type} m-0`}>{t('no_quiz')}</p>
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
                                        <p className={`${styles.accordion_point_coords} m-0`}>{t('latitude')}:</p>
                                      </div>
                                      <div className='col-9'>
                                        <p className={`${styles.accordion_point_coords} m-0`}>{point.latitude}</p>
                                      </div>
                                    </div>
                                    <div className='d-flex'>
                                      <div className='col-3'>
                                        <p className={`${styles.accordion_point_coords} m-0`}>{t('longitude')}:</p>
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
                                    <button className={`${styles.accordion_buttons} btn p-1`} onClick={() => handleDeleteModalShow(point._id || point.id)} disabled={isTranslationMode}>
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
                                  <label className={`${styles.form_label} form-check-label`} htmlFor="show_content_checkbox">{showPointContent ? `${t('hide_content')}` : `${t('show_content')}`}</label>
                                </div>
                                <div className={showPointContent ? "d-block" : "d-none"}>
                                  <p className={`${styles.accordion_text_gray}`} dangerouslySetInnerHTML={{ __html: point.content }}></p>
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
                                              {(point.quiz.answers || []).map((answer, index) => (
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
                                              {(point.quiz.answers || []).map((answer) => (
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
                                              {(point.quiz.answers || []).map((answer) => (
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
                                                  {t('true')}
                                                </label>
                                              </div>
                                              <div className="form-check">
                                                <input className="form-check-input" type="radio" name="trueFalseRadio" id="optionFalse" value="false" readOnly checked={!point.quiz.answers[0]?.isCorrect} />
                                                <label className={`${styles.form_label} form-check-label`} htmlFor="optionFalse">
                                                  {t('false')}
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
                                          <p className={`${styles.accordion_text_gray} my-2`}>{t('answer_feedback')}</p>
                                          <div className={(point.quiz.feedback.correct !== "" && point.quiz.feedback.correct !== null) ? 'my-1' : 'my-1 d-none'}>
                                            <p className={`${styles.accordion_correct_feedback} p-2 ps-2 m-0`}>{point.quiz.feedback.correct}</p>
                                          </div>
                                          <div className={(point.quiz.feedback.incorrect !== "" && point.quiz.feedback.incorrect !== null) ? 'my-1' : 'my-1 d-none'}>
                                            <p className={`${styles.accordion_incorrect_feedback} p-2 ps-2 m-0`}>{point.quiz.feedback.incorrect }</p>
                                          </div>
                                          <div className='my-1'>
                                            <p className={`${styles.accordion_text_gray} p-2 ps-2 m-0`} dangerouslySetInnerHTML={{ __html: point.quiz.feedbackContent }}></p>
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
          <h1 className={`${styles.modal_heading}`}>{t('delete_point')}</h1>
          <p className={`${styles.modal_text} mb-0`}>{t('delete_point_text1')}</p>
          <p className={`${styles.modal_text} `}>{t('delete_point_text2')}</p>
        </Modal.Body>
        <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
          <Button variant="secondary" onClick={() => handleDeleteModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={() => handleConfirmDelete()} className={`${styles.modal_delete_button} flex-fill ms-2 me-5`}>
            {t('delete')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </>
  )
};

export default CreateTrail;