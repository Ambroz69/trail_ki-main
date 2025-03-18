import { React, useState } from "react";
import Button from 'react-bootstrap/Button';
import { Dropdown } from "react-bootstrap";
import { useTranslation } from 'react-i18next'; // Import translation hook
import { useNavigate } from "react-router-dom";
import sk_flag from '../assets/flag-sk.svg';
import gb_flag from '../assets/flag-gb.svg';
import styles from '../css/TitlePage.module.css';
import Hamburger from '../../components/Hamburger';
import Footer from "../../components/Footer";
import i18n from '../i18n'; // Import i18n config

//svg+png import
import avatar_white from '../../src/assets/avatar_white.png';
import desc_bullet_point from '../../src/assets/desc_bullet_point.svg';
import svabatar from '../../src/assets/svabatar.png';
import title_page_boxes_left from '../../src/assets/title_page_boxes_left.svg';
import title_page_boxes_right from '../../src/assets/title_page_boxes_right.svg';
import title_page_progress_1 from '../../src/assets/title_page_progress_1.svg';
import title_page_progress_2 from '../../src/assets/title_page_progress_2.svg';
import title_page_progress_3 from '../../src/assets/title_page_progress_3.svg';
import title_page_progress_4 from '../../src/assets/title_page_progress_4.svg';
import title_page_trusted_by_logo_1 from '../../src/assets/title_page_trusted_by_logo_1.png';
import title_page_trusted_by_logo_2 from '../../src/assets/title_page_trusted_by_logo_2.png';
import title_page_trusted_by_logo_3 from '../../src/assets/title_page_trusted_by_logo_3.png';
import teta from '../../src/assets/teta.png';
import ujo from '../../src/assets/ujo.png';
import hipster from '../../src/assets/hipster.png';
import hamburger from '../../src/assets/hamburger.svg';

const TitlePage = () => {

  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")
  const [menuModalShow, setMenuModalShow] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getFlag = (lang) => {
    return lang === 'en' ? gb_flag : sk_flag;
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Store user preference
  };

  const closeMenuModalShow = () => {
    setMenuModalShow(false);
  };

  const handleMenuModalShow = () => {
    setMenuModalShow(true);
  };

  const goTo = (url) => {
    navigate(url);
  };

  return (
    <div className="bg-[#416A65] text-white pt-lg-4 px-lg-0">
      {/* Navbar */}
      <nav className="d-flex justify-content-between mt-lg-1 pt-3 px-3 p-lg-0 bg-transparent offset-lg-2 col-lg-8">
        <div className="">
          <img src={avatar_white} alt="avatar_white" className='' width={110} />
        </div>
        <div className="d-flex align-items-start space-x-3 pt-2">
          {/* Language Dropdown */}
          <Dropdown className="bg-[#416A65]">
            <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center text-white pt-2">
              <img src={getFlag(selectedLanguage)} width="20px" className="me-2" alt="selected flag" /> {selectedLanguage.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleLanguageChange('en')} className="d-flex align-items-center"><img src={gb_flag} width="20px" className="me-2" alt="English Flag" />English</Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('sk')} className="d-flex align-items-center"><img src={sk_flag} width="20px" className="me-2" alt="Slovak Flag" />Slovenčina</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <button className={`${styles.login_button} d-none d-lg-block px-lg-4 py-lg-2`} onClick={() => goTo("users/login")}>{t("login")}</button>
          <button className={`${styles.get_started_button} d-none d-lg-block px-lg-4 py-lg-2`} onClick={() => goTo("users/register")}>{t("get_started")}</button>
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
      {/* Hero Section */}
      <section className="d-flex justify-content-between align-items-center offset-lg-2 col-lg-8 mb-5 px-3 px-lg-0 mt-lg-5 mb-lg-5">
        <div className="d-flex">
          <div className="col-12 col-lg-6 pt-5 pt-lg-0">
            <h1 className="fs-4 fs-lg-1 font-bold mb-4">{t("hero_title")}</h1>
            <div className="d-flex justify-content-center align-items-start">
              <img src={desc_bullet_point} alt="desc_bullet_point" className='pe-2 pt-2' />
              <p className={`${styles.desc_font}`}>{t("hero_description_1")}</p>
            </div>
            <div className="d-flex justify-content-center align-items-start">
              <img src={desc_bullet_point} alt="desc_bullet_point" className='pe-2 pt-2' />
              <p className={`${styles.desc_font}`}>{t("hero_description_2")}</p>
            </div>
            <div className="d-lg-flex mt-4">
              <button className={`${styles.explore_button} col-12 col-lg-6 py-2 mb-3 mb-lg-0 px-lg-5 py-lg-2 me-lg-3`} onClick={() => goTo("users/login")}>{t("explore")}</button>
              <button className={`${styles.login_button} col-12 col-lg-6 py-2 px-lg-3 py-lg-2`} onClick={() => goTo("users/register")}>{t("request_access")}</button>
            </div>
          </div>
          {/*<div className="d-none d-lg-block col-lg-6">
            <div className="rounded-full h-80 mx-auto ps-5 pt-5">
              <img src={svabatar} alt="svabatar" className='pe-2 pt-5' width={410} />
            </div>
          </div>*/}
        </div>
      </section>

      <div className={`${styles.div_boxes_parent} d-none d-lg-block`}>
        <div className={`${styles.div_boxes} d-flex justify-content-between align-items-start`}>
          <img src={title_page_boxes_left} alt="title_page_boxes_left" className='d-none d-lg-block' />
          <img src={title_page_boxes_right} alt="title_page_boxes_right" className='d-none d-lg-block' />
        </div>
      </div>

      <div className={` d-block d-lg-none`}>
        <div className={`${styles.div_boxes_mobile} d-flex justify-content-between align-items-start`}>
          <div className="col-4">
            <img src={title_page_boxes_left} alt="title_page_boxes_left" className='' />
          </div>
          <div className="col-4"></div>
          <div className="col-4">
            <img src={title_page_boxes_right} alt="title_page_boxes_right" className='' />
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <section className={`${styles.how_it_works_section} text-start`}>
        <div className="offset-lg-2 col-lg-8 px-3 px-lg-0">
          <h1 className="fs-1 font-bold mt-0 mt-lg-3">{t("how_it_works")}</h1>
          <div className="d-lg-flex justify-content-center pt-3">
            <div className="col-12 col-lg-3">
              <div className="d-flex">
                <div className={`col-3 ${styles.progress_div} ${styles.progress_1} d-grid justify-content-center align-items-center`}>
                  <img src={title_page_progress_1} alt="title_page_progress_1" className='' />
                </div>
                <div className="col-9 d-flex flex-column justify-content-center">
                  <div className={`${styles.progress_line_1}`}></div>
                </div>
              </div>
              <p className="mt-3 mt-lg-4 text-black pe-lg-5">{t("how_step_1")}</p>
            </div>
            <div className="col-12 col-lg-3">
              <div className="d-flex">
                <div className={`col-3 ${styles.progress_div} ${styles.progress_2} d-grid justify-content-center align-items-center`}>
                  <img src={title_page_progress_2} alt="title_page_progress_2" className='' />
                </div>
                <div className="col-9 d-flex flex-column justify-content-center">
                  <div className={`${styles.progress_line_2}`}></div>
                </div>
              </div>
              <p className="mt-3 mt-lg-4 text-black pe-lg-5">{t("how_step_2")}</p>
            </div>
            <div className="col-12 col-lg-3">
              <div className="d-flex">
                <div className={`col-3 ${styles.progress_div} ${styles.progress_3} d-grid justify-content-center align-items-center`}>
                  <img src={title_page_progress_3} alt="title_page_progress_3" className='' />
                </div>
                <div className="col-9 d-flex flex-column justify-content-center">
                  <div className={`${styles.progress_line_3}`}></div>
                </div>
              </div>
              <p className="mt-3 mt-lg-4 text-black pe-lg-5">{t("how_step_3")}</p>
            </div>
            <div className="col-12 col-lg-3">
              <div className="d-flex">
                <div className={`col-3 ${styles.progress_div} ${styles.progress_4} d-grid justify-content-center align-items-center`}>
                  <img src={title_page_progress_4} alt="title_page_progress_4" className='' />
                </div>
                <div className="col-9 d-flex flex-column justify-content-center">
                  <div className={`${styles.progress_line_4}`}></div>
                </div>
              </div>
              <p className="mt-3 mt-lg-4 text-black pe-lg-5">{t("how_step_4")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className={`${styles.trusted_by_section} text-center px-lg-0 px-4 py-lg-5 pt-5 pb-3`}>
        <h1 className="fs-3 fs-lg-1 pb-4">{t("trusted_by")}</h1>
        {/* DESKTOP */}
        <div className="d-none d-lg-flex offset-lg-3 col-12 col-lg-6 flex-column flex-lg-row justify-content-between">
          <img src={title_page_trusted_by_logo_1} alt="title_page_trusted_by_logo_1" className='' />
          <img src={title_page_trusted_by_logo_2} alt="title_page_trusted_by_logo_2" className='' />
          <img src={title_page_trusted_by_logo_3} alt="title_page_trusted_by_logo_3" className='' />
        </div>
        { /* MOBILE */}
        <div className="d-flex d-lg-none offset-lg-3 col-12 col-lg-6 flex-lg-row justify-content-between">
          <img src={title_page_trusted_by_logo_1} alt="title_page_trusted_by_logo_1" className='col-4 p-3' />
          <img src={title_page_trusted_by_logo_2} alt="title_page_trusted_by_logo_2" className='col-4 p-3' />
          <img src={title_page_trusted_by_logo_3} alt="title_page_trusted_by_logo_3" className='col-4 p-3' />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-4 py-lg-5">
        <div className="d-lg-flex offset-1 col-10 offset-lg-2 col-lg-8 pt-5">
          <div className="col-12 col-lg-4 pe-lg-3 mb-5 pb-5">
            <div className={`${styles.card_div} ${styles.card_border_1} d-flex flex-column justify-content-between`}>
              <div>
                <div className={`${styles.thumbnail_photo}`}>
                  <img src={teta} alt="teta" className='' />
                </div>
                <div className={`${styles.thumbnail_photo_bg} ${styles.photo_bg_1}`}></div>
                <p className={`${styles.card_text}`}>{t(`testimonial_1`)}</p>
              </div>
              <div>
                <p className={`${styles.card_author}`}>{t(`testimonial_author_1`)}</p>
                <p className={`${styles.card_author}`}>{t(`testimonial_desc_1`)}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 pe-lg-3 mb-5 pb-5">
            <div className={`${styles.card_div} ${styles.card_border_2} d-flex flex-column justify-content-between`}>
              <div>
                <div className={`${styles.thumbnail_photo}`}>
                  <img src={ujo} alt="ujo" className='' />
                </div>
                <div className={`${styles.thumbnail_photo_bg} ${styles.photo_bg_2}`}></div>
                <p className={`${styles.card_text}`}>{t(`testimonial_2`)}</p>
              </div>
              <div>
                <p className={`${styles.card_author}`}>{t(`testimonial_author_2`)}</p>
                <p className={`${styles.card_author}`}>{t(`testimonial_desc_2`)}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 pe-lg-3 mb-3">
            <div className={`${styles.card_div} ${styles.card_border_3} d-flex flex-column justify-content-between`}>
              <div>
                <div className={`${styles.thumbnail_photo}`}>
                  <img src={hipster} alt="hipster" className='' />
                </div>
                <div className={`${styles.thumbnail_photo_bg} ${styles.photo_bg_3}`}></div>
                <p className={`${styles.card_text}`}>{t(`testimonial_3`)}</p>
              </div>
              <div>
                <p className={`${styles.card_author}`}>{t(`testimonial_author_3`)}</p>
                <p className={`${styles.card_author}`}>{t(`testimonial_desc_3`)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
};

export default TitlePage;