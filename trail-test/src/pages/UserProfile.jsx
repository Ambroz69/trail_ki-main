import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';
import AlertComponent from '../../components/AlertComponent';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next'; // Import translation hook
import Button from 'react-bootstrap/Button';

import title_page_logo from '../../src/assets/title_page_logo.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('');
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
        const { name, email, country, primaryLanguage } = response.data.user || {};
        setName(name || '');
        setEmail(email || '');
        setCountry(country || '');
        setPrimaryLanguage(primaryLanguage || '');
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
      if (primaryLanguage) { data.primaryLanguage = primaryLanguage; }
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

  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  return (
    <>
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg}`}>
        <div className={`py-lg-3 px-0 offset-lg-3 col-lg-6`}>
          <div className='offset-lg-1 col-lg-10 p-3 p-lg-0'>
            <h1 className='fs-3 mt-3 my-8 font-bold'>{t('user_profile')}</h1>
            {alert.message && (
              <AlertComponent message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
            <div className='d-flex mb-3'>
              <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                style={{ minWidth: "70px", maxWidth: "70px", height: "70px", backgroundColor: "#7FCEC6" }}>
              </div>
              <div className='align-content-center'>
                <Button className={`${styles.upload_button} d-flex py-3 px-5 btn py-2`} href={``}>
                  Upload New Picture
                </Button>
              </div>
            </div>
            <form onSubmit={handleUpdateProfile} className='w-100'>
              <div className='mb-3 d-flex'>
                <div className='flex-fill'>
                  <label className={`${styles.form_label_2} fs-6 form-label mb-1`}>{t('name')}</label>
                  <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={`${styles.form_input} form-control`}></input>
                </div>
              </div>
              <div className='mb-3 d-flex'>
                <div className='flex-fill'>
                  <label className={`${styles.form_label_2} fs-6 form-label mb-1`}>E-mail</label>
                  <input type='text' value={email} disabled className={`${styles.form_input} form-control`}></input>
                </div>
              </div>
              <div className='mb-3 d-flex'>
                <div className='flex-fill'>
                  <label className={`${styles.form_label_2} fs-6 form-label mb-1`}>{t('new_password_profile')}</label>
                  <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className={`${styles.form_input} form-control`}></input>
                </div>
              </div>
              <div className='mb-3 d-flex'>
                <div className='flex-fill'>
                  <label className={`${styles.form_label_2} fs-6 form-label mb-1`}>{t('country')}</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className={`${styles.form_input} form-select`}>
                    <option value="Slovakia">{t('slovakia')}</option>
                    <option value="Czech Republic">{t('czech')}</option>
                    <option value="Spain">{t('spain')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>
              </div>
              <div className='mb-3 d-flex'>
                <div className='flex-fill'>
                  <label className={`${styles.form_label_2} fs-6 form-label mb-1`}>{t('primary_language')}</label>
                  <select value={primaryLanguage} onChange={e => setPrimaryLanguage(e.target.value)} className={`${styles.form_input} form-select`}>
                    <option value="Slovak">{t('slovak')}</option>
                    <option value="Czech">{t('czechis')}</option>
                    <option value="Spanish">{t('spanish')}</option>
                    <option value="English">{t('english')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>
              </div>
              {/* DESKTOP */}
              <div className='mb-3 d-none d-lg-flex justify-content-between'>
                <div className=''>
                  <Button className={`${styles.show_all_button} btn btn-secondary px-5 py-3`} href={`${basePath}/journey`}>Cancel</Button>
                </div>
                <div className=''>
                  <Button className={`${styles.save_changes_button} btn btn-secondary px-5 py-3`} type="submit">{t('update_profile')}</Button>
                </div>
              </div>
              {/* MOBILE */}
              <div className='mb-3 d-flex d-lg-none'>
                <div className='col-6 d-flex'>
                  <Button className={`${styles.show_all_button} btn btn-secondary py-3 me-2 flex-fill`} href={`${basePath}/journey`}>Cancel</Button>
                </div>
                <div className='col-6 d-flex'>
                  <Button className={`${styles.save_changes_button} btn btn-secondary py-3 ms-2 flex-fill`} type="submit">{t('update_profile')}</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserProfile;