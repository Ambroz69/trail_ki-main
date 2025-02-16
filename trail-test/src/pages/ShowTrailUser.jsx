import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import styles from '../css/TrailShow.module.css';
import ReactCardFlip from 'react-card-flip';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import Hamburger from '../../components/Hamburger';

import TrailMap from '../../components/TrailMap';

//import filter_button from '../assets/filter_button.svg';

import Cookies from "universal-cookie";

//svg+png import
import backup_trail_image from '../../src/assets/backup_trail_image.png';
import trail_certification_img from '../../src/assets/trail_certification_img.png';
import trail_qr_code_img from '../../src/assets/trail_qr_code_img.png';
import trail_apply from '../../src/assets/trail_apply.svg';
import trail_arrow_show_all from '../../src/assets/trail_arrow_show_all.svg';
import trail_arrow_start from '../../src/assets/trail_arrow_start.svg';
import trail_length from '../../src/assets/trail_length.svg';
import trail_location from '../../src/assets/trail_location.svg';
import trail_certification from '../../src/assets/trail_certification.svg';
import trail_difficulty from '../../src/assets/trail_difficulty.svg';
import trail_language from '../../src/assets/trail_language.svg';
import trail_lock from '../../src/assets/trail_lock.svg';
import trail_points from '../../src/assets/trail_points.svg';
import trail_practice from '../../src/assets/trail_practice.svg';
import trail_prepare_certification from '../../src/assets/trail_prepare_certification.svg';
import trail_qr_code from '../../src/assets/trail_qr_code.svg';
import trail_rating from '../../src/assets/trail_rating.svg';
import trail_time from '../../src/assets/trail_time.svg';
import trail_type from '../../src/assets/trail_type.svg';
import explore_page_logo from '../../src/assets/explore_page_logo.svg';
import sk_flag from '../assets/flag-sk.svg';
import gb_flag from '../assets/flag-gb.svg';
import hamburger from '../../src/assets/hamburger.svg';
import profile_photo_placeholder from '../../src/assets/profile_photo_placeholder.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ShowTrailUser = () => {
  const [trail, setTrail] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const { id } = useParams();
  const [cardFlipped, setCardFlipped] = useState(false);
  const { t } = useTranslation(); // Hook to access translations
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [menuModalShow, setMenuModalShow] = useState(false);

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
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";


  useEffect(() => {
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configuration)
      .then((response) => {
        setTrail(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const addDefaultImg = event => {
    event.target.src = backup_trail_image;
  };

  const handleCardFlip = e => {
    e.preventDefault();
    setCardFlipped(!cardFlipped);
  }

  const closeMenuModalShow = () => {
    setMenuModalShow(false);
  };

  const handleMenuModalShow = () => {
    setMenuModalShow(true);
  };

  const getFlag = (lang) => {
    return lang === 'en' ? gb_flag : sk_flag;
  };

  return (
    <>
      {/* Navbar 1*/}
      < div className='bg-[#416A65] px-0 py-3 py-lg-0' >
        <nav className="d-flex justify-content-between align-items-center px-3 px-lg-0 py-lg-0 offset-lg-2 col-lg-8">
          <div className="py-0 py-lg-3">
            <img src={explore_page_logo} alt="explore_page_logo" className='' />
          </div>
          <div className="d-flex align-items-center">
            {/* Language Dropdown */}
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

      {/* Navbar 2*/}
      < div className='d-none d-lg-flex align-items-center px-0 offset-lg-2 col-lg-8' >
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item_current}`} href='#'>{t("explore_nav_explore")}</a></div>
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item}`} href='#'>{t("explore_nav_about")}</a></div>
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item}`} href='#'>{t("explore_nav_community")}</a></div>
        <div className={`pe-4 py-4`}><a className={`${styles.nav_2_item}`} href='#'>{t("explore_nav_my_journey")}</a></div>
      </div >
      <div className={`${styles.show_trail_bg} d-flex container-fluid mx-0 px-0`}>
        <div className={`offset-lg-2 col-lg-8 px-0 mt-5`}>
          <div className={`${styles.white_bg} p-0`}>
            <div className='mb-5'>
              <ReactCardFlip isFlipped={cardFlipped} flipDirection="horizontal">
                <div /* FRONT CARD */ onClick={e => handleCardFlip(e)} className={`${styles.show_trail_div_border} ${styles.trail_card_div} py-3`}>
                  <div className='d-flex p-4'>
                    <div className='col-8 d-flex flex-column pe-4'>
                      <div>
                        <img src={trail_prepare_certification} alt="trail_prepare_certification" className='pe-2' />
                      </div>
                      <div className='d-flex mt-3'>
                        <img src={trail?.thumbnail ? `${backendUrl}/${trail?.thumbnail}` : backup_trail_image} alt="trail_img" style={{ width: '5rem', height: '5rem', borderRadius: '0.5rem' }} className='me-2' onError={addDefaultImg} />
                        <h1 className={`${styles.trail_heading} ms-2`}>{trail?.name}</h1>
                      </div>
                      <p className={`${styles.trail_description} mt-3`} dangerouslySetInnerHTML={{ __html: trail?.description }}></p>
                      <div className='mt-auto'>
                        <h2 className={`${styles.trail_content_heading} mb-1`}>{t('overall_progress')}</h2>
                        <div className='d-flex'>
                          <div className="progress col-9" style={{ height: '0.8rem', marginTop: '0.33rem' }}>
                            <div className="progress-bar" role="progressbar" style={{ width: '0%' }}></div>
                          </div>
                          <p className={`${styles.trail_card_description} mb-0 col-3 ms-2`}>0%</p>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.show_trail_div_border} ${styles.show_trail_bg} col-4 px-4 pt-4 pb-3`}>
                      <h2 className={styles.trail_content_heading}>{t('trail_content')}:</h2>
                      <div className='d-flex justify-content-between mb-2'>
                        <div className='d-flex flex-row'>
                          <img src={trail_type} alt="trail_type" className='pe-2' />
                          <p className={`${styles.trail_card_description} mb-0`}>{t('trail_type')}:</p>
                        </div>
                        <p className={`${styles.trail_card_value} mb-0`}>{t(trail?.season.toLowerCase())}</p>
                      </div>
                      <div className='d-flex justify-content-between mb-2'>
                        <div className='d-flex flex-row'>
                          <img src={trail_language} alt="trail_language" className='pe-2' />
                          <p className={`${styles.trail_card_description} mb-0`}>{t('language')}:</p>
                        </div>
                        <p className={`${styles.trail_card_value} mb-0`}>{t(trail?.language.toLowerCase())}</p>
                      </div>
                      <div className='d-flex justify-content-between mb-2'>
                        <div className='d-flex flex-row'>
                          <img src={trail_difficulty} alt="trail_difficulty" className='pe-2' />
                          <p className={`${styles.trail_card_description} mb-0`}>{t('trail_difficulty_title')}:</p>
                        </div>
                        <p className={`${styles.trail_card_value} mb-0`}>{t(`trail_difficulty.${trail?.difficulty.toLowerCase()}`)}</p>
                      </div>
                      <div className='d-flex justify-content-between mb-2'>
                        <div className='d-flex flex-row'>
                          <img src={trail_location} alt="trail_location" className='pe-2' />
                          <p className={`${styles.trail_card_description} mb-0`}>{t('location')}:</p>
                        </div>
                        <p className={`${styles.trail_card_value} mb-0`}>{t(trail?.locality.toLowerCase())}</p>
                      </div>
                      <div className='d-flex justify-content-between mb-2'>
                        <div className='d-flex flex-row'>
                          <img src={trail_length} alt="trail_length" className='pe-2' />
                          <p className={`${styles.trail_card_description} mb-0`}>{t('trail_length')}:</p>
                        </div>
                        <p className={`${styles.trail_card_value} mb-0`}>{trail?.length.toFixed(2)} km</p>
                      </div>
                      <div className='d-flex justify-content-between mb-2'>
                        <div className='d-flex flex-row'>
                          <img src={trail_time} alt="trail_time" className='pe-2' />
                          <p className={`${styles.trail_card_description} mb-0`}>{t('estimated_time')}:</p>
                        </div>
                        <p className={`${styles.trail_card_value} mb-0`}>{trail?.estimatedTime} min.</p>
                      </div>
                      <div className='d-flex justify-content-between mb-2'>
                        <div className='d-flex flex-row'>
                          <img src={trail_points} alt="trail_points" className='pe-2' />
                          <p className={`${styles.trail_card_description} mb-0`}>{t('total_points')}:</p>
                        </div>
                        <p className={`${styles.trail_card_value} mb-0`}>{trail?.points.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.show_trail_div_border_top} d-flex p-4 pb-2`}>
                    <div className={`${styles.show_trail_div_border_right} col-4 d-flex flex-column align-items-center`}>
                      <div className='d-flex'>
                        <button className={`${styles.rating_practice_apply_button} px-4 py-1`}>{t('rating')}</button>
                        <img src={trail_rating} alt="trail_rating" className='ps-2' />
                      </div>
                      <p className={`${styles.rating_practice_apply_text} pt-2 mb-0`}>{t('review_trail_highlights')}</p>
                    </div>
                    <div className={`${styles.show_trail_div_border_right} col-4 d-flex flex-column align-items-center`}>
                      <div className='d-flex'>
                        <button className={`${styles.rating_practice_apply_button} px-4 py-1`}>{t('practice')}</button>
                        <img src={trail_practice} alt="trail_practice" className='ps-2' />
                      </div>
                      <p className={`${styles.rating_practice_apply_text} pt-2 mb-0`}>{t('practice_text')}</p>
                    </div>
                    <div className={`col-4 d-flex flex-column align-items-center`}>
                      <div className='d-flex'>
                        <button className={`${styles.rating_practice_apply_button} px-4 py-1`}>{t('apply')}</button>
                        <img src={trail_apply} alt="trail_apply" className='ps-2' />
                      </div>
                      <p className={`${styles.rating_practice_apply_text} pt-2 mb-0`}>{t('apply_text')}</p>
                    </div>
                  </div>
                </div>
                <div /* BACK CARD */ onClick={e => handleCardFlip(e)} className={``}>
                  <TrailMap
                    points={trail?.points}
                    height='30rem'
                    editable={false}
                    useGPT={false}
                  />
                </div>
              </ReactCardFlip>
              <div className={`${styles.show_trail_bg} d-flex`}>
                <img src={trail_certification} alt="trail_certification" className='pe-2 pb-1' />
                <p className={`${styles.lower_card_heading} py-3 m-0`}>{t('certification')}</p>
              </div>
              <div className={`${styles.show_trail_div_border} d-flex px-4 py-3`}>
                <div className='col-4 d-flex align-items-center'>
                  <img src={trail_certification_img} alt="trail_certification_img" style={{ width: '14rem', height: '9.5rem' }} className='' />
                </div>
                <div className='col-8'>
                  <h1 className={`${styles.trail_heading}`}>{t('certification_text1')}</h1>
                  <p className={`${styles.trail_description} mt-3`}>{t('certification_text2')}</p>
                  <div className='d-flex'>
                    <div className='col-6 pe-2'>
                      <button className={`${styles.rating_practice_apply_button} d-flex w-100 align-items-center py-2 px-3`}>
                        <img src={trail_lock} alt="trail_lock" className='pe-3' />{t('environment_guardian')}
                      </button>
                    </div>
                    <div className='col-6 ps-2'>
                      <button className={`${styles.rating_practice_apply_button} d-flex w-100 align-items-center py-2 px-3`}>
                        <img src={trail_lock} alt="trail_lock" className='pe-3' />{t('trail_master')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.show_trail_bg} d-flex`}>
                <img src={trail_qr_code} alt="trail_qr_code" className='pe-2 pb-1' />
                <p className={`${styles.lower_card_heading} py-3 m-0`}>{t('qr_code')}</p>
              </div>
              <div className={`${styles.show_trail_div_border} d-flex px-4 py-3`}>
                <div className='col-4 d-flex align-items-center justify-content-center pe-5'>
                  <img src={trail_qr_code_img} alt="trail_qr_code_img" style={{ width: '10rem', height: '9.5rem' }} className='' />
                </div>
                <div className='col-5'>
                  <h1 className={`${styles.trail_heading}`}>{t('qr_code_text1')}</h1>
                  <p className={`${styles.trail_description} mt-3`}>{t('qr_code_text2')}</p>
                </div>
                <div className='col-3 d-flex justify-content-end'>
                  <div>
                    <button className={`${styles.show_all_button} btn d-flex px-4`} href='/'>
                      {t('show_all')}
                      <div>
                        <img src={trail_arrow_show_all} alt="trail_arrow_show_all" className='ps-2 pt-1' />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${styles.show_trail_bg} d-flex justify-content-end pt-4`}>
                <div>
                  <form action={`${basePath}/trails/certification/${trail?._id}`}>
                    <button className={`${styles.start_button} btn d-flex ps-5 pe-3 align-items-center`} href={`${basePath}/trails/certification/${trail?._id}`} type='submit'>
                      {t('start')}
                      <div>
                        <img src={trail_arrow_start} alt="trail_arrow_start" className='ps-2 pt-0' />
                      </div>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default ShowTrailUser;