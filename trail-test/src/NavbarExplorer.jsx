import { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import styles from './css/TrailGrid.module.css';
import Hamburger from '../components/Hamburger';
import Cookies from "universal-cookie";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next'; // Import translation hook
import i18n from './i18n'; // Import i18n config

// svg import
import explore_page_logo from '../src/assets/explore_page_logo.svg';
import hamburger from '../src/assets/hamburger.svg';
import profile_photo_placeholder from '../src/assets/profile_photo_placeholder.svg';
import sk_flag from './assets/flag-sk.svg';
import gb_flag from './assets/flag-gb.svg';
import cz_flag from './assets/flag-cz.svg';
import es_flag from './assets/flag-es.svg';
import avatar_white from '../src/assets/avatar_white.png';

const cookies = new Cookies();
//const token = cookies.get("SESSION_TOKEN");

function NavbarExplorer() {
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")
  const { t } = useTranslation(); // Hook to access translations
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [menuModalShow, setMenuModalShow] = useState(false);
  const [primaryLanguage, setPrimaryLanguage] = useState('');

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Store user preference
  };

  const isTokenExpired = (tok) => {
    if (!tok) {
      setUserLoggedIn(false);
      return true;  // No token = Not logged in
    }
    const arrayToken = tok.split('.');
    //const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const tokenPayload = JSON.parse(decodeURIComponent(escape(atob(arrayToken[1]))));
    setUserEmail(tokenPayload?.userEmail || '');
    setUserName(tokenPayload?.userName || '');
    setPrimaryLanguage(tokenPayload?.primaryLanguage || '');
    const isExpired = Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
    setUserLoggedIn(!isExpired);
    return isExpired;
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
    if (lang === 'en') return gb_flag;
    if (lang === 'sk') return sk_flag;
    if (lang === 'cz') return cz_flag;
    if (lang === 'es') return es_flag;
    return gb_flag;
  };

  const closeMenuModalShow = () => {
    setMenuModalShow(false);
  };

  const handleMenuModalShow = () => {
    setMenuModalShow(true);
  };

  const [token, setToken] = useState(cookies.get("SESSION_TOKEN"));

  const userRole = getUserRole();
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  useEffect(() => {
    isTokenExpired(token);
  }, [token]);

  return (
    <>
      <div className='bg-[#416A65] px-0 py-3 py-lg-0'>
        <nav className="d-flex justify-content-between align-items-center px-3 px-lg-0 py-lg-0 offset-lg-2 col-lg-8">
          <div className="py-0 py-lg-3">
            <a href={`${basePath}`}><img src={avatar_white} alt="avatar_white" className='' width={80} /></a>
          </div>
          <div className="d-flex align-items-center">
            {/* Language Dropdown */}
            <Dropdown className="bg-[#416A65]">
              <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center text-white pt-lg-2">
                <img src={getFlag(selectedLanguage)} width="20px" className="me-2" alt="selected flag" /> {selectedLanguage.toUpperCase()}
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleLanguageChange('en')} className="d-flex align-items-center"><img src={gb_flag} width="20px" className="me-2" alt="English Flag" />English</Dropdown.Item>
                { primaryLanguage === "Slovak" && (
                  <Dropdown.Item onClick={() => handleLanguageChange('sk')} className="d-flex align-items-center"><img src={sk_flag} width="20px" className="me-2" alt="Slovak Flag" />Slovenčina</Dropdown.Item>
                )}
                { primaryLanguage === "Czech" && (
                  <Dropdown.Item onClick={() => handleLanguageChange('cz')} className="d-flex align-items-center"><img src={cz_flag} width="20px" className="me-2" alt="Czech Flag" />Čeština</Dropdown.Item>
                )}
                { primaryLanguage === "Spanish" && (
                  <Dropdown.Item onClick={() => handleLanguageChange('es')} className="d-flex align-items-center"><img src={es_flag} width="20px" className="me-2" alt="Espania Flag" />Español</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <div className='ps-3 pe-1 d-none d-lg-block'>
              <img src={profile_photo_placeholder} alt="profile_photo_placeholder" className='' />
            </div>
            <Dropdown className="bg-[#416A65] d-none d-lg-block">
              <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center text-white pt-2">
                {userName}
              </Dropdown.Toggle>              
              <Dropdown.Menu>
                {(userRole === "trail creator" || userRole === "manager") && (
                  <Dropdown.Item className="d-flex align-items-center">
                    <NavLink to={`${basePath}`} className={`${styles.sidebar_link} nav-link d-flex`}>
                      {t('dashboard')}
                    </NavLink>
                  </Dropdown.Item>
                )}
                <Dropdown.Item className="d-flex align-items-center">
                  <NavLink to={`${basePath}/profile`} className={`${styles.sidebar_link} nav-link d-flex`}>
                    {t('profile')}
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item className="d-flex align-items-center"><div onClick={() => logout()}>{t('logout')}</div></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button type="button" className="btn d-block d-lg-none" onClick={() => handleMenuModalShow()}>
              <img src={hamburger} alt="hamburger" className='' />
            </button>
          </div>
        </nav>
        <Hamburger
          userLoggedIn={userLoggedIn}
          menuModalShow={menuModalShow}
          closeMenuModalShow={closeMenuModalShow}
        />
      </div>

      {/* Navbar 2*/}
      <div className='d-none d-lg-flex align-items-center px-0 offset-lg-2 col-lg-8'>
        <div className={`pe-4 py-4`}>
          <NavLink to={`${basePath}/journey`} end aria-current="page" className={({ isActive }) =>
            isActive ? `${styles.nav_2_item_current}`
              : `${styles.nav_2_item}`
          }>
            {t("explore_nav_my_journey")}
          </NavLink>
        </div>
        <div className={`pe-4 py-4`}>
        {(userRole === "trail creator" || userRole === "manager") ? (
          <NavLink to={`${basePath}/homeuser`} end aria-current="page" className={({ isActive }) =>
            isActive ? `${styles.nav_2_item_current}`
              : `${styles.nav_2_item}`
          }>
            {t("explore_nav_explore")}
          </NavLink>
        ) : (
          <NavLink to={`${basePath}`} end aria-current="page" className={({ isActive }) =>
            isActive ? `${styles.nav_2_item_current}`
              : `${styles.nav_2_item}`
          }>
            {t("explore_nav_explore")}
          </NavLink>
        )}
        </div>
        <div className={`pe-4 py-4`}>
          <NavLink to={`${basePath}/certificates`} end aria-current="page" className={({ isActive }) =>
            isActive ? `${styles.nav_2_item_current}` 
              : `${styles.nav_2_item}`
          }>
            {t("explore_nav_certificates")}
          </NavLink>
        </div>
        <div className={`pe-4 py-4`}>
          <NavLink to={`${basePath}/leaderboard`} end aria-current="page" className={({ isActive }) =>
            isActive ? `${styles.nav_2_item_current}` 
              : `${styles.nav_2_item}`
          }>
            {t("explore_nav_hall_of_fame")}
          </NavLink>
        </div>
      </div>
    </>
  );

};
export default NavbarExplorer;
