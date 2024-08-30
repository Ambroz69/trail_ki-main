import React from 'react';
//import { DragDropContext, Droppable, Draggable } from 'react-beaufitul-dnd';

const PairsComponent = ({ answers, handleChangeAnswer, handleRemoveAnswer, onDragEnd, quizMode }) => {
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
                /*
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="pairs">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {answers.map((answer, index) => (
                                    <Draggable key={answer._id || index} draggableId={answer._id || index.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className='my-4 flex items-center'
                                            >
                                                <input
                                                    type="text"
                                                    placeholder={`Left Side`}
                                                    value={answer.text}
                                                    readOnly
                                                    className='border-2 border-gray-500 px-4 mr-4'
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={`Right Side`}
                                                    value={answer.pairText || ''}
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
                */
               <></>
            )}
        </div>
    );
};

export default PairsComponent;