import React from 'react';

const OrderComponent = ({ answers, handleChangeAnswer, handleRemoveAnswer }) => {
    return (
        <div>
            <label className='mr-4 text-gray-500'>Insert Correct Order</label>
            {answers.map((answer, index) => (
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
            ))}
        </div>
    );
};

export default OrderComponent;