import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';
import AlertComponent from '../../components/AlertComponent';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${backendUrl}/users/me`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then((response) => {
        const { name, email } = response.data.user || {};
        setName(name || '');
        setEmail(email || '');
      })
      .catch((error) => {
        setAlert({ message: 'Failed to load the profile.', type: 'error' });
        console.error(error);
      });
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const data = {};
      if (name) { data.name = name; }
      if (password) { data.password = password; }
      await api.put(`${backendUrl}/users/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ message: 'The profile was updated.', type: 'success' });
    } catch (error) {
      setAlert({ message: 'Failed to update the profile.', type: 'error' });
      console.error(error);
    }
  };

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000); // Hide alert after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  return (
    <div className='d-flex container-fluid mx-0 px-0'>
      <div className='col-3 pe-3'>
        <Navbar />
      </div>
      <div className='col-9 px-5'>
        <div className='py-4 ps-0'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>User Profile</h1>
          </div>
        </div>
        {alert.message && (
          <AlertComponent message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
        )}
        <div className={`${styles.tabs_bg} p-4`}>
          <form onSubmit={handleUpdateProfile}>
            <div className='mb-3 d-flex'>
              <div className='col-9 pe-3'>
                <label className={`${styles.form_label} form-label mb-1`}>Name</label>
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={`${styles.form_input} form-control`}></input>
              </div>
            </div>
            <div className='mb-3 d-flex'>
              <div className='col-9 pe-3'>
                <label className={`${styles.form_label} form-label mb-1`}>Email</label>
                <input type='text' value={email} disabled className={`${styles.form_input} form-control`}></input>
              </div>
            </div>
            <div className='mb-3 d-flex'>
              <div className='col-9 pe-3'>
                <label className={`${styles.form_label} form-label mb-1`}>New Password (leave empty to keep current password)</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className={`${styles.form_input} form-control`}></input>
              </div>
            </div>
            <div className='mb-3 d-flex'>
              <div className='col-9 pe-3'>
                <button className={`${styles.save_button} btn btn-secondary`} type="submit">Update Profile</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;