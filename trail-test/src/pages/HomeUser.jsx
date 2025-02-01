import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailGrid.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

// SVG imports
import backup_trail_image from '../assets/backup_trail_image.png';
import search_button from '../assets/search_button.svg';
import filter_button from '../assets/filter_button.svg';
import sort_button from '../assets/sort_button.svg';

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
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/user";

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
  }, []);

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
    <div className='d-flex container-fluid mx-0 px-0'>
      <div className='col-3 pe-3'>
        <Navbar />
      </div>
      <div className='col-9 px-5'>
        <div className='py-4'>
          <h1 className='text-3xl my-4'>{t('trail_list')}</h1>

          {/* Search and Filter Section */}
          <div className="d-flex justify-content-between">
            <div className="input-group mb-3">
              <span className={`${styles.search_icon} input-group-text`} id="basic-addon1">
                <img src={search_button} alt="search_button" className='pe-2' />
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
            <Dropdown className="btn-secondary pe-4 py-1 me-2">
              <Dropdown.Toggle className={`${styles.dropdown_toggle_sort} d-flex`}>
                {t('filters')}
                <img src={filter_button} alt="filter_button" className='px-2' />
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
            <Dropdown className='btn-secondary py-1 me-2'>
              <Dropdown.Toggle className={`${styles.dropdown_toggle_sort} d-flex`}>
                {t('sort')}
                <img src={sort_button} alt="sort_button" className='px-2' />
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

          {/* Grid Layout for Trails */}
          <div className={`${styles.trail_grid}`}>
            {displayedTrails.map((trail) => (
              <div key={trail._id} className={`${styles.trail_card}`}>
                <img
                  src={`${backendUrl}/${trail.thumbnail}`}
                  alt="trail_img"
                  className={`${styles.trail_image}`}
                  onError={(e) => e.target.src = backup_trail_image}
                />
                <div className={`${styles.trail_info}`}>
                  <h3>{trail.name}</h3>
                  <p>{trail.length.toFixed(2)} km</p>
                  <p>{t(`trail_difficulty.${trail.difficulty.toLowerCase()}`)}</p>
                  <p>{t(`trail_location.${trail.locality.toLowerCase()}`)}</p>
                  <a href={`${basePath}/trails/details/${trail._id}`} className="btn btn-primary">
                    {t('show_trail')}
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeUser;