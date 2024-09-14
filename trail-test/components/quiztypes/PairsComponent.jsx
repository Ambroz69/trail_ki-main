import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../src/css/TrailCreate.module.css';

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const PairsComponent = ({ answers, handleChangeAnswer, handleRemoveAnswer, onDragEnd, quizMode }) => {
  const [shuffledLeft, setShuffledLeft] = useState([]);
  const [shuffledRight, setShuffledRight] = useState([]);

  const handleDragDrop = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'leftGroup') {
      const reorderedAnswers = [...shuffledLeft];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedAnswer] = reorderedAnswers.splice(sourceIndex, 1);
      reorderedAnswers.splice(destinationIndex, 0, removedAnswer);
      return setShuffledLeft(reorderedAnswers);
    }
    if (type === 'rightGroup') {
      const reorderedAnswers = [...shuffledRight];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedAnswer] = reorderedAnswers.splice(sourceIndex, 1);
      reorderedAnswers.splice(destinationIndex, 0, removedAnswer);
      return setShuffledRight(reorderedAnswers);
    }
  };

  useEffect(() => {
    if (quizMode) {
      // Shuffle the left (text) and right (pairText) sides independently
      setShuffledLeft(shuffleArray(answers.map(answer => answer.text)));
      setShuffledRight(shuffleArray(answers.map(answer => answer.pairText)));
    }
  }, [quizMode, answers]);

  return (
    <div>
      <label className={`${styles.form_label} form-label mb-1`}>Insert Correct Pairings</label>
      {!quizMode ? (
        /* answers.map((answer, index) => (
          <div className='my-4' key={index}>
            <input
              type="text"
              placeholder={`Left Side`}
              value={answer.text}
              onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
              className='border-2 border-gray-500 px-4 mr-4'
            />
            <input
              type="text"
              placeholder={`Right Side`}
              value={answer.pairText || ''}
              onChange={e => handleChangeAnswer(index, 'pairText', e.target.value)}
              className='border-2 border-gray-500 px-4 mr-4'
            />
            <span className="close mr-4" onClick={() => handleRemoveAnswer(index)} >&times;</span>
          </div>
        )) */
        answers.map((answer, index) => (
          <div className='d-flex justify-content-between align-items-center mb-3' key={index}>
            <div className='d-flex col-11'>
              <div className='col-6 pe-2'>
                <input
                  type="text"
                  value={answer.text}
                  onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
                  className={`${styles.form_input} form-control`}
                />
              </div>
              <div className='col-6 ps-2'>
                <input
                  type="text"
                  value={answer.pairText || ''}
                  onChange={e => handleChangeAnswer(index, 'pairText', e.target.value)}
                  className={`${styles.form_input} form-control`}
                />
              </div>
            </div>
            <div className='col-1 d-flex justify-content-end'>
              <button className={`btn ${styles.point_delete_button}`} onClick={() => handleRemoveAnswer(index)}>X</button>
            </div>
          </div>
        ))
      ) : (
        <DragDropContext onDragEnd={handleDragDrop}>
          <div className="flex">
            <Droppable droppableId="leftColumn" type="leftGroup">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'lightblue' : '#F3F3F3',
                    padding: 8,
                    width: '40%',
                    minHeight: '100px',
                  }}
                >
                  {shuffledLeft.map((text, index) => (
                    <Draggable key={`left-${index}`} draggableId={`left-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            padding: 16,
                            margin: `0 0 8px 0`,
                            minHeight: '50px',
                            backgroundColor: snapshot.isDragging ? '#191C21' : '#007AF7',
                            color: 'white',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <p className={`p-2 m-0 text-center`}>{text}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="rightColumn" type="rightGroup">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'lightblue' : '#F3F3F3',
                    padding: 8,
                    width: '40%',
                    minHeight: '100px',
                  }}
                >
                  {shuffledRight.map((pairText, index) => (
                    <Draggable key={`right-${index}`} draggableId={`right-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            padding: 16,
                            margin: `0 0 8px 0`,
                            minHeight: '50px',
                            backgroundColor: snapshot.isDragging ? '#191C21' : '#007AF7',
                            color: 'white',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <p className={`p-2 m-0 text-center`}>{pairText}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default PairsComponent;