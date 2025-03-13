import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../src/css/TrailCreate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

const OrderComponent = ({ answers, handleChangeAnswer, handleRemoveAnswer, handleQuizAnswer, onDragEnd, quizMode }) => {

  const [dragAnswers, setDragAnswers] = useState([{ text: '', isCorrect: true }]);
  const { t } = useTranslation(); // Hook to access translations

  useEffect(() => {
    if (answers) {
      if (quizMode) {
        setDragAnswers(shuffleArray(answers));
      } else {
        setDragAnswers(answers);
      }
    }
  }, [answers]);

  const shuffleArray = (array) => {
    let shuffledArray = [...array]; 
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; 
    }
    return shuffledArray;
  };

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
      handleQuizAnswer(reorderedAnswers);
      return setDragAnswers(reorderedAnswers);
    }
  };

  return (
    <div>
      <label className={`${styles.form_label} form-label mb-1`}>{t('order_answers')}</label>
      {!quizMode ? (
        answers.map((answer, index) => (
          <div className='d-flex justify-content-between align-items-center mb-3' key={index}>
            <div className='col-11'>
              <input
                type="text"
                value={answer.text}
                onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
                className={`${styles.form_input} form-control`}
              />
            </div>
            <div className='col-1 d-flex justify-content-end'>
              <button className={`btn ${styles.point_delete_button}`} onClick={() => handleRemoveAnswer(index)}>X</button>
            </div>
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
                  background: snapshot.isDraggingOver ? '#FAFBFF' : '#FAFBFF',
                  padding: 8,
                  width: '100%',
                  minHeight: '80px',
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
                        className={`${styles.accordion_point_answers_text} p-0`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          padding: 2,
                          margin: `0 0 8px 0`,
                          maxHeight: '40px',
                          backgroundColor: snapshot.isDragging ? '#191C21' : '#7FCEC6',
                          color: 'white',
                          borderRadius: '4px',
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