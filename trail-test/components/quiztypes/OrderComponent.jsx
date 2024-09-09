import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const OrderComponent = ({ answers, handleChangeAnswer, handleRemoveAnswer, onDragEnd, quizMode }) => {
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="pairs">
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
                {answers.map((answer, index) => (
                  <Draggable
                    key={answer._id}
                    draggableId={answer._id}
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
                          backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                          color: 'black',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <input
                          type="text"
                          value={answer.text}
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
        </DragDropContext>
      )}
    </div>
  );
};

export default OrderComponent;