import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

  useEffect(() => {
    if (quizMode) {
      // Shuffle the left (text) and right (pairText) sides independently
      setShuffledLeft(shuffleArray(answers.map(answer => answer.text)));
      setShuffledRight(shuffleArray(answers.map(answer => answer.pairText)));
    }
  }, [quizMode, answers]);

  return (
    <div>
      <label className='mr-4 text-gray-500'>Insert Correct Pairings</label>
      {!quizMode ? (
        answers.map((answer, index) => (
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
        ))
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex">
            <Droppable droppableId="leftColumn">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                    padding: 8,
                    width: '25%',
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
                            backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                            color: 'black',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <input
                            type="text"
                            value={text}
                            readOnly
                            className='border-2 border-gray-500 px-4 mr-4'
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="rightColumn">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                    padding: 8,
                    width: '25%',
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
                            backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                            color: 'black',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <input
                            type="text"
                            value={pairText}
                            readOnly
                            className='border-2 border-gray-500 px-4 mr-4'
                          />
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