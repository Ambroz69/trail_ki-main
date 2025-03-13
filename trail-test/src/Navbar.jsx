import { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import styles from './css/Navbar.module.css';
import { Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next'; // Import translation hook
import i18n from './i18n'; // Import i18n config

// svg import
import sidebar_dashboard from "./assets/sidebar_dashboard.svg";
import sidebar_faq from "./assets/sidebar_faq.svg";
import sidebar_home from "./assets/sidebar_home.svg";
import sidebar_logo from "./assets/avatar_white.png";
import sidebar_logout from "./assets/sidebar_logout.svg";
import sidebar_submenu from "./assets/sidebar_submenu.svg";
import sidebar_profile from "./assets/sidebar_profile.svg";
import sk_flag from './assets/flag-sk.svg';
import gb_flag from './assets/flag-gb.svg';

const cookies = new Cookies();
//const token = cookies.get("SESSION_TOKEN");

function Navbar() {

  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")
  const { t } = useTranslation(); // Hook to access translations

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Store user preference
  };

  const isTokenExpired = (tok) => {
    const arrayToken = tok.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    setUserEmail(tokenPayload?.userEmail || '');
    setUserName(tokenPayload?.userName || '');
    return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
  };

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "explorer"; // Default role
    }
  };

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const logout = () => {
    // destroy the cookie
    cookies.remove("SESSION_TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }

  const getFlag = (lang) => {
    return lang === 'en' ? gb_flag : sk_flag;
  };

  const [token, setToken] = useState(cookies.get("SESSION_TOKEN"));

  const userRole = getUserRole();
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  useEffect(() => {
    isTokenExpired(token);
  }, [token]);

  return (
    <div className={`${styles.sidebar} d-flex flex-column flex-shrink-0 p-3 mx-0 px-0 pt-4`}>
      <a href={`${basePath}`} className="d-flex justify-content-center pt-3 pb-4">
        <img src={sidebar_logo} alt="sidebar_logo" width={150} />
      </a>
      <ul className="nav nav-pills flex-column mb-auto mx-4">
        {/* Home Link (Dynamic for each role) */}
        <li className="nav-item pb-2">
          <NavLink to={`${basePath}/homeuser`} end aria-current="page" className={({ isActive }) =>
            isActive ? `${styles.sidebar_link}  nav-link d-flex` // add when created another home ${styles.sidebar_link_active} ${styles.sidebar_link_active_bg}
              : `${styles.sidebar_link} nav-link d-flex`
          }>
            <img src={sidebar_home} alt='sidebar_home' className='pe-2' />
            {t('home')}
          </NavLink>
        </li>

        {/* Dashboard (Only for creators & managers) */}
        {(userRole === "trail creator" || userRole === "manager") && (
          <>
            <li>
              <NavLink to={`${basePath}`} end className={({ isActive }) =>
                isActive ? `${styles.sidebar_link} ${styles.sidebar_link_active} ${styles.sidebar_link_active_bg} nav-link d-flex`
                  : `${styles.sidebar_link} nav-link d-flex`
              }>
                <img src={sidebar_dashboard} alt='sidebar_dashboard' className={`${styles.icon_active} pe-2`} />
                {t('dashboard')}
              </NavLink>
            </li>
            <div className='d-flex pb-2'>
              <div className={`${styles.sidebar_submenu}`}>
                {/*<img src={sidebar_submenu} alt='sidebar_submenu' className='pe-0' />*/}
              </div>
              <div >
                <ul className={`px-0 ${userRole === "manager" ? "pt-2" : "pt-1"}`}>
                  <li className=''>
                    <NavLink to="/" end className={({ isActive }) =>
                      isActive ? `${styles.sidebar_link} ${styles.sidebar_link_active} nav-link ps-0`
                        : `${styles.sidebar_link} nav-link ps-0`
                    }>
                      {t('trail_management')}
                    </NavLink>
                  </li>
                  {(userRole === "manager") && (
                    <li className=''>
                      <NavLink to={`${basePath}/users`} className={({ isActive }) =>
                        isActive ? `${styles.sidebar_link} ${styles.sidebar_link_active} nav-link ps-0`
                          : `${styles.sidebar_link} nav-link ps-0`
                      }>
                        {t('user_management')}
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
        {<li className="nav-item pb-2">
          <NavLink to={`${basePath}/profile`} className={({ isActive }) =>
            isActive ? `${styles.sidebar_link} ${styles.sidebar_link_active} nav-link d-flex`
              : `${styles.sidebar_link} nav-link d-flex`
          }>
            <img src={sidebar_profile} alt='sidebar_profile' className='pe-2' />
            {t('profile')}
          </NavLink>
        </li>}
        <li className="nav-item pb-2">
          <NavLink to="#" className={({ isActive }) =>
            isActive ? `${styles.sidebar_link}  nav-link d-flex` //add when created ${styles.sidebar_link_active}
              : `${styles.sidebar_link} nav-link d-flex`
          }>
            <img src={sidebar_faq} alt='sidebar_faq' className='pe-2' />
            {t('faq')}
          </NavLink>
        </li>
      </ul>
      <div className='ms-4 me-5 d-flex align-items-center justify-content-between'>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" size="sm" className="d-flex align-items-center">
            <img src={getFlag(selectedLanguage)} width="20px" className="me-2" alt="selected flag" /> {selectedLanguage.toUpperCase()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleLanguageChange('en')} className="d-flex align-items-center"><img src={gb_flag} width="20px" className="me-2" alt="English Flag" /> English</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLanguageChange('sk')} className="d-flex align-items-center"><img src={sk_flag} width="20px" className="me-2" alt="Slovak Flag" /> Slovak</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <a href={`${basePath}/profile`} className="text-decoration-none ">
          <div className={` d-flex align-items-center justify-content-start`}>
            {/*<img src="https://liquipedia.net/commons/images/1/1a/Brawl_Hank.png" referrerPolicy="no-referrer" alt="" width="50" height="50" className="rounded-circle me-3" />*/}
            <div className='d-flex flex-column'>
              <div className={`${styles.sidebar_link_profile_name}`}>
                {userName || 'Hank the Fish'}
              </div>
              <div className={`${styles.sidebar_link_profile_email}`}>
                {userEmail}
              </div>
            </div>
          </div>
        </a>
        <div onClick={() => logout()} className={`${styles.sidebar_logout_btn} ps-2 py-3 pe-2`}>
          <img src={sidebar_logout} alt='sidebar_logout' />
        </div>
      </div>
    </div>
  );
}
export default Navbar;