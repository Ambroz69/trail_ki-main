import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import translation hook
import Cookies from "universal-cookie";
import i18n from '../src/i18n'; // Import i18n config
import Modal from 'react-bootstrap/Modal';
import styles from '../src/css/Hamburger.module.css';

import hamburger_close from '../src/assets/hamburger_close.svg';
import hamburger_logo from '../src/assets/avatar_color.png';
import hamburger_logout from '../src/assets/hamburger_logout.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

function Hamburger({ userLoggedIn, menuModalShow, closeMenuModalShow }) {
  const { t } = useTranslation();

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "explorer"; // Default role
    }
  };

  const userRole = getUserRole();
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";


  return (
    <Modal
      show={menuModalShow}
      onHide={closeMenuModalShow}
      backdrop="static"
      keyboard={false}
      className={`${styles.hamburger_modal} modal-fullscreen`}
    >
      <Modal.Body className={`d-flex flex-column`}>
        <div className='d-flex justify-content-between p-3'>
          <img src={hamburger_logo} alt="hamburger_logo" className='' width={100} />
          <button className={`${styles.hamburger_close_button} px-3 py-0`} onClick={closeMenuModalShow}>
            <img src={hamburger_close} alt="hamburger_close" className='' />
          </button>
        </div>
        <ul className="d-flex flex-column px-3 mb-0">
          {(userRole === "trail creator" || userRole === "manager") ? (
            <>
              <li className="py-2 mt-1">
                <a className={`${styles.hamburger_link}`} href={`${basePath}/homeuser`}>{t('home')}</a>
              </li>
              <li className="py-2 mt-1">
                <a className={`${styles.hamburger_link}`} href={`${basePath}`}>{t('dashboard')}</a>
              </li>
              <li className="py-2 mt-1">
                <a className={`${styles.hamburger_link}`} href={`${basePath}/homeuser`}>{t('explore_nav_explore')}</a>
              </li>
            </>
          ) : (
            <>
              <li className="py-2 mt-1">
                <a className={`${styles.hamburger_link}`} href={`${basePath}`}>{t('home')}</a>
              </li>
              <li className="py-2 mt-1">
                <a className={`${styles.hamburger_link}`} href={`${basePath}`}>{t('explore_nav_explore')}</a>
              </li>
            </>
          )}
          <li className="py-2 mt-1">
            <a className={`${styles.hamburger_link}`} href="#about">{t('explore_nav_about')}</a>
          </li>
          <li className="py-2 mt-1">
            <a className={`${styles.hamburger_link}`} href="#community" >{t('explore_nav_community')}</a>
          </li>
        </ul>
      </Modal.Body>
      <Modal.Footer className={`d-flex flex-column p-3 pt-2 align-items-start`}>
        <ul className={`${userLoggedIn ? "" : styles.hidden} d-flex flex-column px-3 m-0`}>
          <li className="py-2 mt-1">
            <a className={`${styles.hamburger_link}`} href={`${basePath}/journey`}>{t('explore_nav_my_journey')}</a>
          </li>
          <li className="py-2 mt-1">
            <a className={`${styles.hamburger_link}`} href={`${basePath}/leaderboard`}>{t('hall_of_fame')}</a>
          </li>
          <li className="py-2 mt-1">
            <a className={`${styles.hamburger_link}`} href={`${basePath}/certificates`}>{t('explore_nav_certificates')}</a>
          </li>
          <li className="py-2 mt-1">
            <a className={`${styles.hamburger_link}`} href={`${basePath}/profile`} >{t('profile')}</a>
          </li>
        </ul>
      </Modal.Footer>
      <div className='px-3'>
        {userLoggedIn ? (
          <Modal.Footer className={`d-flex justify-content-start p-3`}>
            <Link to="/users/login" className='col-5 d-flex text-decoration-none m-0'>
              <button className={`${styles.hamburger_logout_button} flex-fill d-flex`}>
                <img src={hamburger_logout} alt="hamburger_logout" className='pe-3' />
                {t('logout')}
              </button>
            </Link>
          </Modal.Footer>
        ) : (
          <Modal.Footer className={`d-flex justify-content-between p-3`}>
            <Link to="/users/login" className='col-5 d-flex text-decoration-none m-0'>
              <button className={`${styles.hamburger_login_button} flex-fill`}>{t('login')}</button>
            </Link>
            <Link to="/users/register" className='col-5 d-flex text-decoration-none m-0'>
              <button className={`${styles.hamburger_get_started_button} flex-fill`}>{t('get_started')}</button>
            </Link>
          </Modal.Footer>
        )}
      </div>
    </Modal>
  );
}
export default Hamburger;