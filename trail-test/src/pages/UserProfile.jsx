import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

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
    } catch (error) {
      console.error(error);
    }
  };

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