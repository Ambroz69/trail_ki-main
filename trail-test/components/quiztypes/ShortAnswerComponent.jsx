import React from 'react';

const ShortAnswerComponent = ({ value, onChange }) => {
    return (
        <div>
            <label className='mr-4 text-gray-500'>Insert the correct answer</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Correct Answer"
                className='border-2 border-gray-500 px-4 mr-4'
            />
        </div>
    );
}

export default ShortAnswerComponent;