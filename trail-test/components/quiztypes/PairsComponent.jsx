import React from 'react';

const PairsComponent = ({ answers, handleChangeAnswer, handleRemoveAnswer }) => {
    return (
        <div>
            <label className='mr-4 text-gray-500'>Insert Correct Pairings</label>
            {answers.map((answer, index) => (
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
            ))}
        </div>
    );
};

export default PairsComponent;