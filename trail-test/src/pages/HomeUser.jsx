import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import styles from '../css/TrailGrid.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Hamburger from '../../components/Hamburger';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';

// SVG imports
import backup_trail_image from '../assets/backup_trail_image.png';
import explore_search_button from '../assets/explore_search_button.svg';
import explore_filter_button from '../assets/explore_filter_button.svg';
import sort_button from '../assets/sort_button.svg';
import explore_page_logo from '../../src/assets/explore_page_logo.svg';
import sk_flag from '../assets/flag-sk.svg';
import gb_flag from '../assets/flag-gb.svg';
import profile_photo_placeholder from '../../src/assets/profile_photo_placeholder.svg';
import trail_card_icon from '../../src/assets/trail_card_icon.svg';
import trail_card_time from '../../src/assets/trail_card_time.svg';
import trail_card_location from '../../src/assets/trail_card_location.svg';
import trail_card_arrow_right from '../../src/assets/trail_card_arrow_right.svg';
import title_page_logo from '../../src/assets/title_page_logo.svg';
import svabatar from '../../src/assets/svabatar.png';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HomeUser = () => {
  const [trails, setTrails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [localityFilter, setLocalityFilter] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { t } = useTranslation(); // Hook for translations
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [menuModalShow, setMenuModalShow] = useState(false);
  const navigate = useNavigate();

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "explorer"; // Default role
    }
  };

  const getFlag = (lang) => {
    return lang === 'en' ? gb_flag : sk_flag;
  };

  const userRole = getUserRole();
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    api(configuration)
      .then((response) => {
        const publishedTrails = response.data.data.filter(trail => trail.published === true);
        setTrails(publishedTrails)
      })
      .catch((error) => {
        setAlert({ message: `${t('error_trail')}`, type: 'error' });
        console.log(error);
      });

    // set locality filter based on country
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      setLocalityFilter(tokenPayload?.userCountry || "");
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const closeMenuModalShow = () => {
    setMenuModalShow(false);
  };

  const handleMenuModalShow = () => {
    setMenuModalShow(true);
  };

  const goTo = (url) => {
    navigate(url);
  };

  // Create maps for filters
  const trailDifficulties = Array.from(new Set(trails.map((t) => t.difficulty)));
  const trailLocalities = Array.from(new Set(trails.map((t) => t.locality)));

  // Filter and sort trails
  const getDisplayedTrails = () => {
    let filtered = trails
      .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((t) => (difficultyFilter ? t.difficulty === difficultyFilter : true))
      .filter((t) => (localityFilter ? t.locality === localityFilter : true));

    switch (sortOption) {
      case 'name-asc':
        filtered.sort((t1, t2) => t1.name.localeCompare(t2.name));
        break;
      case 'name-desc':
        filtered.sort((t1, t2) => t2.name.localeCompare(t1.name));
        break;
      case 'length-asc':
        filtered.sort((t1, t2) => t1.length - t2.length);
        break;
      case 'length-desc':
        filtered.sort((t1, t2) => t2.length - t1.length);
        break;
      default:
        break;
    }

    return filtered;
  };

  const displayedTrails = getDisplayedTrails();

  return (
    <div className='row d-flex mx-0 px-0'>
      {/* Navbar */}
      <NavbarExplorer />

      <section className={`${styles.section_ava_bg} d-flex justify-content-between align-items-center mb-2 px-0 px-lg-0 mt-0`}>
        <div className="d-flex offset-lg-2 col-lg-8">
          <div className="col-6 pt-0 pt-lg-0 ps-3 ps-lg-0 d-flex flex-column justify-content-center">
            <h1 className={`d-none d-lg-block fs-3 text-white mb-4`}>{t("explore_ava_title_1")}<span className={`${styles.ava_yellow} ps-2 pe-0 font-bold`}>AVA</span>{t("explore_ava_title_2")}</h1>
            <h1 className={`d-block d-lg-none fs-6 text-white mb-4`}>{t("explore_ava_title_1")}<span className={`${styles.ava_yellow} ps-2 pe-0 font-bold`}>AVA</span>{t("explore_ava_title_2")}</h1>
            <p className={`d-none d-lg-block fs-6 text-white`}>{t("explore_ava_description")}</p>
            <p className={`d-block d-lg-none ${styles.desc_ava_font} text-white`}>{t("explore_ava_description")}</p>
          </div>
          {/* hidden, they don't like him*/}
          {/*<div className={`${styles.div_ava_parent} col-6 d-none d-lg-block`}>
            <div className={`${styles.div_ava}`}>
              <img src={svabatar} alt="svabatar" className='' />
            </div>
          </div>
          <div className={`col-6 d-block d-lg-none`}>
            <img src={svabatar} alt="svabatar" className='w-100' />
          </div>*/}
        </div>
      </section>

      <div className='py-3 px-0 offset-lg-2 col-lg-8'>
        <div className='d-flex flex-column flex-lg-row justify-content-between align-items-center'>
          <h1 className='col-12 col-lg-6 fs-4 px-3 px-lg-0 align-self-start pt-1'>{t('explore_trail_list')}</h1>
          {/* Search and Filter Section */}
          <div className="col-12 col-lg-6 px-3 px-lg-0 d-flex justify-content-end">
            <div className="input-group mb-3 w-auto me-auto me-lg-0">
              <span className={`${styles.search_icon} input-group-text pe-0`} id="basic-addon1">
                <img src={explore_search_button} alt="explore_search_button" className='pe-1' />
              </span>
              <input
                type="text"
                className={`${styles.search_input} form-control`}
                placeholder={t('search_trails')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {alert.message && (
              <AlertComponent message={alert.message} type={alert.type} />
            )}

            {/* Filters */}
            <Dropdown className={`px-2`}>
              <Dropdown.Toggle variant="" className={`${styles.filter_button} d-flex align-items-center py-1`}>
                <img src={explore_filter_button} alt="explore_filter_button" className='align-self-center pe-2' />
                {t('filters')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>{t('difficulty')}</Dropdown.Header>
                <Dropdown.Item onClick={() => setDifficultyFilter('')}>
                  {t('all_difficulties')}
                </Dropdown.Item>
                {trailDifficulties.map((trailDifficulty) => (
                  <Dropdown.Item key={trailDifficulty} onClick={() => setDifficultyFilter(trailDifficulty)}>
                    {t(`trail_difficulty.${trailDifficulty.toLowerCase()}`)}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Header>{t('location')}</Dropdown.Header>
                <Dropdown.Item onClick={() => setLocalityFilter('')}>
                  {t('all_localities')}
                </Dropdown.Item>
                {trailLocalities.map((trailLocation) => (
                  <Dropdown.Item key={trailLocation} onClick={() => setLocalityFilter(trailLocation)}>
                    {t(`trail_location.${trailLocation.toLowerCase()}`)}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => { setDifficultyFilter(''); setLocalityFilter(''); }}>
                  {t('reset_filter')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Sorting */}
            <Dropdown className={``}>
              <Dropdown.Toggle variant="" className={`${styles.filter_button} d-flex align-items-center py-1`}>
                <img src={sort_button} alt="sort_button" className='align-self-center pe-2' />
                {t('sort')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortOption('name-asc')}>
                  {t('name')} (A → Z)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOption('name-desc')}>
                  {t('name')} (Z → A)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOption('length-asc')}>
                  {t('length')} ({t('from_shortest')})
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOption('length-desc')}>
                  {t('length')} ({t('from_longest')})
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Grid Layout for Trails */}
        <div className={`d-flex row row-cols-1 row-cols-lg-3 pt-4 px-3 px-lg-0`}>
          {displayedTrails.map((trail) => (
            <div className={`col pb-3 pb-lg-4`}>
              <div key={trail._id} className={`${styles.trail_card}`}>
                <div className={`d-flex flex-column align-items-start`}>
                  <div className='pb-2'>
                    <img src={trail_card_icon} alt="trail_card_icon" className='' />
                  </div>
                  <div className={`${styles.trail_card_title}`}>
                    <p className='mb-0'>{trail.name}</p>
                  </div>
                  <div className={`${styles.trail_card_info} d-flex pt-2 pb-2`}>
                    <img src={trail_card_time} alt="trail_card_time" className='pe-1' />
                    <p className='mb-0 pe-3'>{trail.estimatedTime} min</p>
                    <img src={trail_card_location} alt="trail_card_location" className='pe-0' />
                    <p className='mb-0'>{t(`trail_location.${trail.locality.toLowerCase()}`)}</p>
                    {/*<p>{t(`trail_difficulty.${trail.difficulty.toLowerCase()}`)}</p>*/}
                  </div>
                  <div className={`${styles.trail_card_description}`}>
                    <p className='mb-0 text-start' dangerouslySetInnerHTML={{ __html: trail?.description }}></p>
                  </div>
                  <div className='d-flex justify-content-between pt-4 w-100'>
                    <div className='d-flex align-items-center'>
                      <a href={`${basePath}/trails/details/${trail._id}`} className={`${styles.trail_card_button_details} pe-1`}>
                        {t('see_details')}
                      </a>
                      <span className={`${styles.trail_card_button_details_icon}`}>
                        <img src={trail_card_arrow_right} alt="trail_card_arrow_right" width={22} className={`pe-0`} />
                      </span>
                    </div>
                    <button className={`btn ${styles.trail_card_button_start} py-1`} onClick={() => goTo(`${basePath}/trails/certification/${trail._id}`)}>{t('start_trail')}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeUser;