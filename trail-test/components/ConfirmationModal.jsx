import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className=''>
      <div className=''>
        <p>{message}</p>
        <div className=''>
          <button onClick={onConfirm} className='bg-green-500 px-4 py-2 text-black'>Yes</button>
          <button onClick={onClose} className='bg-red-500 px-4 py-2 text-black'>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;