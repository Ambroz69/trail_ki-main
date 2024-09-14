import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const OrderComponent = ({ answers, handleChangeAnswer, handleRemoveAnswer, onDragEnd, quizMode }) => {

  const [dragAnswers, setDragAnswers] = useState([{ text: '', isCorrect: true }]);

  useEffect(() => {
    if (answers) {
      setDragAnswers(answers);
    }
  }, [answers]);

  const handleDragDrop = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'orderGroup') {
      const reorderedAnswers = [...dragAnswers];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedAnswer] = reorderedAnswers.splice(sourceIndex, 1);
      reorderedAnswers.splice(destinationIndex, 0, removedAnswer);
      return setDragAnswers(reorderedAnswers);
    }
  };

  // evaluation of quiz will have to be here


  return (
    <div>
      <label className='mr-4 text-gray-500'>Insert Correct Order</label>
      {!quizMode ? (
        answers.map((answer, index) => (
          <div className='my-4' key={index}>
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={answer.text}
              onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
              className='border-2 border-gray-500 px-4 mr-4'
            />
            <span className="close mr-4" onClick={() => handleRemoveAnswer(index)} >&times;</span>
          </div>
        ))
      ) : (
        <DragDropContext onDragEnd={handleDragDrop}>
          <Droppable droppableId="root" type="orderGroup">
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
                {dragAnswers.map((answer, index) => (
                  <Draggable
                    key={`order-${answer._id}`}
                    draggableId={`order-${answer._id}`}
                    index={index}
                  >
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
                        <p className={`p-2 m-0 text-center`}>{answer.text}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default OrderComponent;