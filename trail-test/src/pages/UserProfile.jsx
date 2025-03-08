import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';
import AlertComponent from '../../components/AlertComponent';
import NavbarExplorer from '../NavbarExplorer';
import { useTranslation } from 'react-i18next'; // Import translation hook

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { t } = useTranslation(); // Hook to access translations

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "user";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "user"; // Default role
    }
  };

  const userRole = getUserRole();

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
        const { name, email, country } = response.data.user || {};
        setName(name || '');
        setEmail(email || '');
        setCountry(country || '');
      })
      .catch((error) => {
        setAlert({ message: `${t('error_profile')}`, type: 'error' });
        console.error(error);
      });
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const data = {};
      if (name) { data.name = name; }
      if (password) { data.password = password; }
      if (country) { data.country = country; }
      await api.put(`${backendUrl}/users/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ message: `${t('success_profile_update')}`, type: 'success' });
    } catch (error) {
      setAlert({ message: `${t('error_profile_update')}`, type: 'error' });
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
    <>
      {userRole === "explorer" ? (
        <>
          <NavbarExplorer />
          <div className={`${styles.show_trail_bg} py-3 px-0 offset-lg-2 col-lg-8`}>
            <div className='col-9'>
              <div className='py-2 ps-0'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-3xl my-8'>{t('user_profile')}</h1>
                </div>
              </div>
              {alert.message && (
                <AlertComponent message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
              )}
              <div className={`${styles.tabs_bg} p-4`}>
                <form onSubmit={handleUpdateProfile}>
                  <div className='mb-3 d-flex'>
                    <div className='col-9 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('name')}</label>
                      <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={`${styles.form_input} form-control`}></input>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-9 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>E-mail</label>
                      <input type='text' value={email} disabled className={`${styles.form_input} form-control`}></input>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-9 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('new_password_profile')}</label>
                      <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className={`${styles.form_input} form-control`}></input>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-9 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>{t('country')}</label>
                      <select value={country} onChange={e => setCountry(e.target.value)} className={`${styles.form_input} form-select`}>
                        <option value="Slovakia">{t('slovakia')}</option>
                        <option value="Czech Republic">{t('czech')}</option>
                        <option value="Spain">{t('spain')}</option>
                        <option value="Other">{t('other')}</option>
                      </select>
                    </div>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-9 pe-3'>
                      <button className={`${styles.save_button} btn btn-secondary`} type="submit">{t('update_profile')}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='d-flex container-fluid mx-0 px-0'>
          <div className='col-3 pe-3'>
            <Navbar />
          </div>
          <div className='col-9 px-5'>
            <div className='py-4 ps-0'>
              <div className='flex justify-between items-center'>
                <h1 className='text-3xl my-8'>{t('user_profile')}</h1>
              </div>
            </div>
            {alert.message && (
              <AlertComponent message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
            <div className={`${styles.tabs_bg} p-4`}>
              <form onSubmit={handleUpdateProfile}>
                <div className='mb-3 d-flex'>
                  <div className='col-9 pe-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>{t('name')}</label>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={`${styles.form_input} form-control`}></input>
                  </div>
                </div>
                <div className='mb-3 d-flex'>
                  <div className='col-9 pe-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>E-mail</label>
                    <input type='text' value={email} disabled className={`${styles.form_input} form-control`}></input>
                  </div>
                </div>
                <div className='mb-3 d-flex'>
                  <div className='col-9 pe-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>{t('new_password_profile')}</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className={`${styles.form_input} form-control`}></input>
                  </div>
                </div>
                <div className='mb-3 d-flex'>
                  <div className='col-9 pe-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>{t('country')}</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className={`${styles.form_input} form-select`}>
                      <option value="Slovakia">{t('slovakia')}</option>
                      <option value="Czech Republic">{t('czech')}</option>
                      <option value="Spain">{t('spain')}</option>
                      <option value="Other">{t('other')}</option>
                    </select>
                  </div>
                </div>
                <div className='mb-3 d-flex'>
                  <div className='col-9 pe-3'>
                    <button className={`${styles.save_button} btn btn-secondary`} type="submit">{t('update_profile')}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>


  );
};

export default UserProfile;