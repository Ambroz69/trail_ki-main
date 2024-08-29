import React from 'react';

const SliderComponent = ({ value, onChange }) => {
    return (
        <div>
            <label className='mr-4 text-gray-500'>Set Slider Range</label>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={e => onChange(e.target.value)}
                className='border-2 border-gray-500 px-4 mr-4'
            />
            <input
                type="number"
                placeholder="Correct Value"
                value={value}
                onChange={e => onChange(e.target.value)}
                className='border-2 border-gray-500 px-4 mr-4'
            />
        </div>
    );
}

export default SliderComponent;