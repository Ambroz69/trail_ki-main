import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const DeleteTrail = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteTrail = () => {
    setLoading(true);
    // set configurations for the API call here
    const configuration = {
      method: "delete",
      url: `http://localhost:5555/trails/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    // make the API call
    axios(configuration)
      .then((response) => {
        setLoading(false);
        setSuccessMessage('Trail removed.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        alert('An error occured.');
        setLoading(false);
      });
  };
  
  return (
    <div className='p-4'>
      <BackButton></BackButton>
      <h1 className='text-3xl my-4'>Remove Trail</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col'>
        {successMessage && (
          <div className='bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3'>
            <p>{successMessage}</p>
          </div>
        )}
        <h3 className='text-2xl'>Are you sure you want to remove this trail?</h3>
        <button className='p-4 bg-red-600' onClick={handleDeleteTrail}>Yes, remove it</button>
      </div>
    </div>
  )
};

export default DeleteTrail;