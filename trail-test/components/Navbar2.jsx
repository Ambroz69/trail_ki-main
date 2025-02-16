import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import translation hook
import i18n from '../src/i18n'; // Import i18n config
import Modal from 'react-bootstrap/Modal';
import styles from '../src/css/Hamburger.module.css';

function Navbar2({ userLoggedIn, menuModalShow, closeMenuModalShow, handleMenuModalShow, selectedLanguage }) {
  const { t } = useTranslation();
  const getFlag = (lang) => {
    return lang === 'en' ? gb_flag : sk_flag;
  };

  return (
    <>
    {}
      {/* Navbar 1}
      < div className='bg-[#416A65] px-0 py-3 py-lg-0' >
        <nav className="d-flex justify-content-between align-items-center px-3 px-lg-0 py-lg-0 offset-lg-2 col-lg-8">
          <div className="py-0 py-lg-3">
            <img src={explore_page_logo} alt="explore_page_logo" className='' />
          </div>
          <div className="d-flex align-items-center">
            {/* Language Dropdown }
            <Dropdown className="bg-[#416A65]">
              <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center text-white pt-lg-2">
                <img src={getFlag(selectedLanguage)} width="20px" className="me-2" alt="selected flag" /> {selectedLanguage.toUpperCase()}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLanguageChange('en')} className="d-flex align-items-center"><img src={gb_flag} width="20px" className="me-2" alt="English Flag" />English</Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange('sk')} className="d-flex align-items-center"><img src={sk_flag} width="20px" className="me-2" alt="Slovak Flag" />Slovenčina</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className='ps-3 pe-1 d-none d-lg-block'>
              <img src={profile_photo_placeholder} alt="profile_photo_placeholder" className='' />
            </div>
            <Dropdown className="bg-[#416A65] d-none d-lg-block">
              <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center text-white pt-2">
                meno priezvisko
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className="d-flex align-items-center">Profile</Dropdown.Item>
                <Dropdown.Item className="d-flex align-items-center">Logout</Dropdown.Item>
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
      </div >

      {/* Navbar 2}
      < div className='d-none d-lg-flex align-items-center px-0 offset-lg-2 col-lg-8' >
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item_current}`} href='#'>{t("explore_nav_explore")}</a></div>
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item}`} href='#'>{t("explore_nav_about")}</a></div>
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item}`} href='#'>{t("explore_nav_community")}</a></div>
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item}`} href='#'>{t("explore_nav_my_journey")}</a></div>
      </div >
       {*/}
    </>
   
  );
}
export default Navbar2;