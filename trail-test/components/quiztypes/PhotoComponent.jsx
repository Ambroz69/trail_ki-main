import React from 'react';

const PhotoComponent = ({ value, onChange }) => {
    return (
        <div>
            <label className='mr-4 text-gray-500'>Provide Instructions for the Photo</label>
            <textarea
                placeholder="Instructions"
                value={value}
                onChange={e => onChange(0, 'text', e.target.value)}
                className='border-2 border-gray-500 px-4 mr-4'
            />
        </div>
    );
}

export default PhotoComponent;