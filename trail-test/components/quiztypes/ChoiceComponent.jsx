import React from 'react';

const ChoiceComponent = ({ quizType, answers, handleChangeAnswer, handleRemoveAnswer }) => {
    return (
        <div>
            <label className='mr-4 text-gray-500'>Create Answers</label>
            {answers.map((answer, index) => (
                <div className='my-4' key={index}>
                    { index===0 ? (
                    <input
                        type="text"
                        placeholder={`Correct Answer Text`}
                        value={answer.text}
                        onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
                        className='border-2 border-gray-500 px-4 mr-4'
                    /> ) : (
                        <input
                        type="text"
                        placeholder={`Incorrect Answer Text`}
                        value={answer.text}
                        onChange={e => handleChangeAnswer(index, 'text', e.target.value)}
                        className='border-2 border-gray-500 px-4 mr-4'
                    />
                    )}
                    {quizType === 'multiple' && (
                        <>
                            <span className='mr-4'>Correct Answer</span>
                            <input
                                type="checkbox"
                                checked={answer.isCorrect}
                                onChange={e => handleChangeAnswer(index, 'isCorrect', e.target.checked)}
                                className='mr-4'
                            />
                        </>
                    )}
                    <span className="close mr-4" onClick={() => handleRemoveAnswer(index)}>&times;</span>
                </div>
            ))}
        </div>
    );
};

export default ChoiceComponent;