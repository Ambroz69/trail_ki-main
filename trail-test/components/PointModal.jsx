import React, { useEffect, useState } from 'react';
import SliderComponent from './quiztypes/SliderComponent';
import ShortAnswerComponent from './quiztypes/ShortAnswerComponent';
import TrueFalseComponent from './quiztypes/TrueFalseComponent';
import ChoiceComponent from './quiztypes/ChoiceComponent';
import PairsComponent from './quiztypes/PairsComponent';
import OrderComponent from './quiztypes/OrderComponent';

function PointModal({ isOpen, onClose, onSave, pointData, quizMode }) {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [quizType, setQuizType] = useState('single');
  const [content, setContent] = useState('');
  const [ppoints, setPpoints] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [correctFeedback, setCorrectFeedback] = useState('');
  const [incorrectFeedback, setIncorrectFeedback] = useState('');
  const [answers, setAnswers] = useState([{ text: '', isCorrect: true }]);
  const [previousAnswers, setPreviousAnswers] = useState({}); // Store previous answers for each quiz type
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // to have the answers shuffled for quiz mode
  const [userSelections, setUserSelections] = useState([]); // what answers the user selected in quiz mode
  const [quizEnabled, setQuizEnabled] = useState(false); // create quiz?

  useEffect(() => { // if in quiz mode you need the point information and populate the modal        
    if (pointData) {
      setTitle(pointData.title);
      setContent(pointData.content);
      if (pointData.quiz) {
        setQuestion(pointData.quiz.question);
        setQuizType(pointData.quiz.type);
        setAnswers(pointData.quiz.answers);
        setPpoints(pointData.quiz.points);
        setCorrectFeedback(pointData.quiz.feedback.correct || null);
        setIncorrectFeedback(pointData.quiz.feedback.incorrect || null);
      }
      if (!quizMode) {
        setQuizEnabled(true);
      }
    }
  }, [pointData, quizMode]);

  useEffect(() => {
    if (quizType !== 'pairs' && quizType !== 'order') {
      // Only reset if it's not pairs to prevent overwriting when switching modes
      if (quizType in previousAnswers) {
        setAnswers(previousAnswers[quizType]);
      } else {
        resetAnswers();
      }
    }
  }, [quizType]);

  useEffect(() => { // shuffle the answers only once
    if (answers.length > 0 && quizMode) {
      //console.log('zmena');
      setShuffledAnswers(shuffleAnswers([...answers]));
    }
  }, [quizMode, answers]);

  const resetAnswers = () => {
    if (!previousAnswers[quizType]) {
      setAnswers([{ text: '', isCorrect: true }]);
      if (quizType === 'pairs') {
        setShuffledAnswers(shuffleAnswers([...answers]));  // Reset shuffled answers for pairs
      }
      setSliderValue(50); // Reset slider value for slider type
    }
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const handleRemoveAnswer = (index) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleChangeAnswer = (index, field, value) => {
    const updatedAnswers = answers.map((answer, i) => {
      if (i === index) {
        return { ...answer, [field]: value };
      }
      return answer;
    });
    setAnswers(updatedAnswers);
    // Store the updated answers to preserve them when switching types
    setPreviousAnswers((prev) => ({ ...prev, [quizType]: updatedAnswers }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedAnswers = Array.from(answers);
    const [movedAnswer] = reorderedAnswers.splice(result.source.index, 1);
    reorderedAnswers.splice(result.destination.index, 0, movedAnswer);

    setAnswers(reorderedAnswers);

    //console.log('drag');
  };

  const handleSave = () => {
    if (title) {
      const pointData = {
        title,
        content,
      };

      if (quizEnabled) {
        if (!question || (!answers[0].text && quizType !== 'slider')) {
          alert('Please fill all quiz fields.');
          return;
        }

        pointData.quiz = {
          question,
          type: quizType,
          points: ppoints,
          answers: quizType === 'slider' ? [{ text: sliderValue, isCorrect: true }] : answers.filter(ans => ans.text.trim() !== ''),
          feedback: {
            correct: correctFeedback,
            incorrect: incorrectFeedback,
          },
        };
      }

      onSave(pointData);
      onClose();
    } else {
      alert('Please fill the title.');
    }
  }

  const handleSelectionChange = (answerId) => {
    if (quizType === 'multiple') {
      setUserSelections(prev => {
        const newState = { ...prev, [answerId]: !prev[answerId] };
        return newState;
      });
    } else {
      setUserSelections({ [answerId]: true });
    }
  };

  const handleInputChange = (answerId, value) => {
    setUserSelections(prev => ({
      ...prev,
      [answerId]: value
    }));
  };

  const evaluateAnswers = () => { // toto uprav to musi byt inak
    if (quizType === 'short-answer') {
      let correctCount = 0;
      answers.forEach(answer => {
        if (userSelections[answer._id] && userSelections[answer._id].trim().toLowerCase() === answer.text.toLowerCase()) {
          correctCount++;
        }
      });

      alert(`You answered ${correctCount} out of ${answers.length} questions correctly.`);
    } else {
      let correctCount = answers.filter(answer => userSelections[answer._id] === answer.isCorrect).length;
      let totalCorrect = answers.filter(answer => answer.isCorrect).length;

      alert(`You got ${correctCount} out of ${totalCorrect} correct.`);
      correctCount = 0;
    }
  };

  function shuffleAnswers(answers) {
    let idx = answers.length, randomIndex;
    while (idx !== 0) {
      randomIndex = Math.floor(Math.random() * idx);
      idx--;
      [answers[idx], answers[randomIndex]] = [answers[randomIndex], answers[idx]];
    }
    return answers;
  }

  if (!isOpen) return null;

  return (
    <div className="p-4 border-2 border-gray-500">
      <div className="my-4 flex flex-col">
        <span className="close" onClick={onClose}>&times;</span>
        <div className='my-4'>
          {!quizMode ? (
            <>
              <label className='text-l mr-4 text-gray-500'>Interaction title</label>
              <input type="text" placeholder="Point Title" value={title} onChange={e => setTitle(e.target.value)} className='border-2 border-gray-500 px-4' readOnly={quizMode} />
            </>
          ) : (
            <>
              <span className='text-xl mr-4 text-gray-500'>{title}</span>
            </>
          )}
        </div>
        <div className='my-4'>
          {!quizMode ? (
            <>
              <label className='text-l mr-4 text-gray-500'>Content</label>
              <textarea placeholder="Content for this point" value={content} onChange={e => setContent(e.target.value)} className='border-2 border-gray-500 px-4' rows="4" readOnly={quizMode} />
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
        <div className='my-4'>
          {!quizMode ? (
            <>
              <label className='text-l mr-4 text-gray-500'>Include Quiz/Task?</label>
              <input type="checkbox" checked={quizEnabled} onChange={e => setQuizEnabled(e.target.checked)} disabled={quizMode} />
            </>
          ) : (
            <>
              {pointData.quiz ? (
                <>
                  <span className='text-xl mr-4 text-gray-500'>Task ({ppoints} points)</span><br />
                  <div className="my-2">
                    <span className='text-l mr-4'><strong>{question}</strong></span>
                  </div>
                </>
              ) : (<></>)}
            </>
          )}
        </div>
        {quizEnabled && !quizMode && ( // edit-mode by creation or editing
          <>
            <div className='my-4'>
              <label className='text-l mr-4 text-gray-500'>Question/Task </label>
              <input type="text" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} className='border-2 border-gray-500 px-4' readOnly={quizMode} />
            </div>
            <div className='my-4'>
              <label className='text-l mr-4 text-gray-500'>Points per Question/Task </label>
              <input type="number" placeholder="Points for question" value={ppoints} min="0" max="100" onChange={e => setPpoints(e.target.value)} className='border-2 border-gray-500 px-4' readOnly={quizMode} />
            </div>
            <div className='my-4'>
              <label className='text-l mr-4 text-gray-500'>Type of Question/Task </label>
              <select value={quizType} onChange={e => setQuizType(e.target.value)} disabled={quizMode}>
                <option value="single">Single Correct Answer</option>
                <option value="multiple">Multiple Correct Answers</option>
                <option value="short-answer">Short Answer</option>
                <option value="slider">Slider</option>
                <option value="pairs">Pairs</option>
                <option value="order">Ordering</option>
                <option value="foto">Make a photo</option>
              </select>
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
                      <button onClick={handleAddAnswer} className='p-2 border-2 border-gray-500 m-4'>Add Another Answer</button>
                    </>
                  );
                case 'slider':
                  return (
                    <SliderComponent
                      value={sliderValue}
                      setCorrectValue={value => setSliderValue(value)}
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
                case 'foto':
                  return (
                    <TrueFalseComponent
                      value={answers[0].text}
                      onChange={value => handleChangeAnswer(0, 'text', value)}
                    />
                  );
                default:
                  return null;
              }
            })()}
            <div className='my-4'>
              <label className='text-l mr-4 text-gray-500'>Correct Answer Feedback</label>
              <input type="text" placeholder="Correct feedback" value={correctFeedback} onChange={e => setCorrectFeedback(e.target.value)} className='border-2 border-gray-500 px-4' readOnly={quizMode} />
            </div>
            <div className='my-4'>
              <label className='text-l mr-4 text-gray-500'>Incorrect Answer Feedback</label>
              <input type="text" placeholder="Incorrect feedback" value={incorrectFeedback} onChange={e => setIncorrectFeedback(e.target.value)} className='border-2 border-gray-500 px-4' readOnly={quizMode} />
            </div>
          </>
        )}
        {quizMode && pointData.quiz && ( // quiz mode
          (() => {
            switch (quizType) {
              case 'short-anwser':
                return (
                  answers.map((answer, index) => (
                    <div className='my-4' key={answer._id || index}>
                      <input type="text" checked={userSelections[answer._id] || ''} onChange={(e) => handleInputChange(answer._id, e.target.value)} placeholder="Type your answer" className='border-2 border-gray-500 px-4' />
                    </div>
                  ))
                );
              case 'single':
              case 'multiple':

                { console.log(shuffledAnswers) }
                return (
                  shuffledAnswers.map((answer, index) => (
                    <div className='my-4' key={answer._id || index}>
                      {quizType === 'multiple' ?
                        <label>
                          <input type="checkbox" checked={!!userSelections[answer._id]} onChange={() => handleSelectionChange(answer._id)} /> {answer.text}
                        </label>
                        :
                        <label>
                          <input type="radio" name='singleChoice' checked={userSelections[answer._id] === true} onChange={() => handleSelectionChange(answer._id)} /> {answer.text}
                        </label>
                      }
                    </div>
                  ))
                );

              case 'slider':
                return (
                  <SliderComponent
                    value={sliderValue}
                    setCorrectValue={value => setSliderValue(value)}
                  />
                );
              case 'pairs':
                return (
                  <>
                    <PairsComponent
                      answers={quizMode ? shuffledAnswers : answers}
                      handleChangeAnswer={handleChangeAnswer}
                      handleRemoveAnswer={handleRemoveAnswer}
                      onDragEnd={handleDragEnd}
                      quizMode={quizMode}
                    />
                  </>
                );
              case 'order':
                return (
                  <OrderComponent
                    answers={quizMode ? shuffledAnswers : answers}
                    handleChangeAnswer={handleChangeAnswer}
                    handleRemoveAnswer={handleRemoveAnswer}
                    onDragEnd={handleDragEnd}
                    quizMode={quizMode}
                  />
                );
              case 'true-false':
                return (
                  <TrueFalseComponent
                    value={answers[0].text}
                    onChange={value => handleChangeAnswer(0, 'text', value)}
                  />
                );
              default:
                return null;
            }
          })()
        )}
        {quizMode ? (
          <button className='p-2 bg-sky-300 m-4' onClick={evaluateAnswers}>Check Answers</button>
        ) : (
          <button className='p-2 bg-sky-300 m-4' onClick={handleSave}>Save Point</button>
        )}
      </div>
    </div>
  );
}

export default PointModal;