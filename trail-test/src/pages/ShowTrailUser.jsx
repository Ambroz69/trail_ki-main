import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import styles from '../css/TrailShow.module.css';
import ReactCardFlip from 'react-card-flip';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import Hamburger from '../../components/Hamburger';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';
import Button from 'react-bootstrap/Button';
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

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
import trail_prepare_certification from '../../src/assets/my_journey_certification.svg';
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
  const [reviews, setReviews] = useState([]);

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
  const originURL = window.location.hostname;

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

    const configurationRW = {
      method: "get",
      url: `${backendUrl}/reviews/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configurationRW)
      .then((response) => {
        setReviews(response.data);
        console.log(response.data);
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
      {/* Navbar */}
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg} d-flex container-fluid mx-0 px-0`}>
        <div className={`offset-lg-2 col-lg-8 px-0 mx-lg-auto m-3 mt-lg-5`}>
          <div className={`${styles.white_bg} p-0`}>
            <div className='mx-lg-0'>
              <ReactCardFlip isFlipped={cardFlipped} flipDirection="horizontal">
                <div /* FRONT CARD */ onClick={e => handleCardFlip(e)} className={`${styles.show_trail_div_border} ${styles.trail_card_div} py-lg-3`}>
                  <div className='d-flex flex-column flex-lg-row p-4'>
                    <div className='col-lg-8 col-12 d-flex flex-column pe-4'>
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
                          <div className="progress col-11 col-lg-9 mb-4 mb-lg-0" style={{ height: '0.8rem', marginTop: '0.33rem' }}>
                            <div className="progress-bar" role="progressbar" style={{ width: '0%' }}></div>
                          </div>
                          <p className={`${styles.trail_card_description} mb-0 col-1 col-lg-3 ms-2`}>0%</p>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.show_trail_div_border} ${styles.show_trail_bg} col-lg-4 col-12 px-4 pt-4 pb-3`}>
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
                  <div className={`${styles.show_trail_div_border_top} d-lg-flex d-none p-4 pb-2`}>
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
              <div className={`${styles.show_trail_div_border} d-flex flex-lg-row flex-column px-4 py-3`}>
                <div className='col-12 col-lg-4 d-flex align-items-center'>
                  <img src={trail_certification_img} alt="trail_certification_img" className={styles.certification_image} />
                </div>
                <div className='col-12 col-lg-8'>
                  <h1 className={`${styles.trail_heading} d-none d-lg-block`}>{t('certification_text1')}</h1>
                  <h1 className={`${styles.trail_heading} d-block d-lg-none fs-4 mt-3`}>{t('certification_text1')}</h1>
                  <p className={`${styles.trail_description} mt-3`}>{t('certification_text2')}</p>
                  <div className='d-flex flex-column flex-lg-row'>
                    <div className='col-lg-6 col-12 pe-lg-2 mb-2'>
                      <button className={`${styles.rating_practice_apply_button} d-flex w-100 align-items-center py-2 px-3`}>
                        <img src={trail_lock} alt="trail_lock" className='pe-3' />{t('environment_guardian')}
                      </button>
                    </div>
                    <div className='col-lg-6 col-12 ps-lg-2'>
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
              <div className={`${styles.show_trail_div_border} ${styles.show_trail_bg} d-flex flex-column flex-lg-row px-4 py-3`}>
                <div className='col-lg-4 col-12 d-flex align-items-center justify-content-center pe-5'>
                  <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                    <QRCode
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={`${originURL}/explorer/trails/details/${trail?._id}`}
                    />
                  </div>
                </div>
                <div className='d-none d-lg-block col-lg-8'>
                  <h1 className={`${styles.trail_heading}`}>{t('qr_code_text1')}</h1>
                  <p className={`${styles.trail_description} mt-3`}>{t('qr_code_text2')}</p>
                </div>
              </div>
              <div className={`${styles.show_trail_bg} d-flex`}>
                <img src={trail_rating} alt="trail_rating" className='pe-2 pb-1' />
                <p className={`${styles.lower_card_heading} py-3 m-0`}>{t('rating')}</p>
              </div>
              <div className={`${styles.show_trail_bg} d-flex flex-column flex-lg-row pe-4 ps-0 py-0`}>
                <div className={`col-12`}>
                  {!reviews || reviews.length === 0 ? (
                    <p className={`${styles.trail_description} mt-3`}>{t('no_reviews')}</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="mb-4 d-flex flex-row">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "50px", height: "50px", backgroundColor: "#D9D9D9" }}>
                        </div>
                        <div>
                          <p className='m-0'>{review.userId.name} </p>
                          <div className='mb-2'>
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} style={{ color: i < review.rating ? "gold" : "gray" }}>★</span>
                            ))}
                          </div>
                          {review.comment ? (
                            <p className={`mb-0`}>
                              {review.comment}
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* DESKTOP */}
              <div className={`${styles.show_trail_bg} d-none d-lg-flex justify-content-end pt-4 gap-3`}>
                <Button className={`${styles.show_all_button} btn px-5 py-2`} href={`${basePath}`}>
                  {t('show_all')}
                </Button>
                <Button className={`${styles.start_button} btn px-5 py-2`} href={`${basePath}/trails/certification/${trail?._id}`}>
                  {t('start')}
                </Button>
              </div>
              {/* MOBILE */}
              <div className={`${styles.show_trail_bg} d-flex d-lg-none justify-content-end pt-4 gap-3`}>
                <Button className={`${styles.show_all_button} flex-fill btn py-2`} href={`${basePath}`}>
                  {t('show_all')}
                </Button>
                <Button className={`${styles.start_button} flex-fill btn py-2`} href={`${basePath}/trails/certification/${trail?._id}`}>
                  {t('start')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  )
};

export default ShowTrailUser;