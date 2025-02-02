import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailList.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AlertComponent from '../../components/AlertComponent';
import { useTranslation } from 'react-i18next'; // Import translation hook

//svg import
import backup_trail_image from '../assets/backup_trail_image.png';
import new_trail_button from '../assets/new_trail_button.svg';
import search_button from '../assets/search_button.svg';
import filter_button from '../assets/filter_button.svg';
import sort_button from '../assets/sort_button.svg';
import table_actions from '../assets/table_actions.svg';
import table_action_delete from '../assets/table_action_delete.svg';
import table_action_duplicate from '../assets/table_action_duplicate.svg';
import table_action_edit from '../assets/table_action_edit.svg';
import table_action_publish from '../assets/table_action_publish.svg';
import table_action_show from '../assets/table_action_show.svg';
import modal_clone from '../assets/modal_clone.svg';
import modal_delete from '../assets/modal_delete.svg';
import modal_publish from '../assets/modal_publish.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [trails, setTrail] = useState([]);
  const [trailToProcess, setTrailToProcess] = useState(null);
  const [cloneModalShow, setCloneModalShow] = useState(false);
  const [publishModalShow, setPublishModalShow] = useState(false);
  const [unpublishModalShow, setUnpublishModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [localityFilter, setLocalityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alert, setAlert] = useState({message: '', type: ''});
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
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  useEffect(() => {
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configuration)
      .then((response) => {
        setTrail(response.data.data);
      })
      .catch((error) => {
        setAlert({message: `${t('error_trail')}`, type: 'error'});
        console.log(error);
      });
  }, []);

  const handleConfirmPublish = () => {
    const configuration = {
      method: "put",
      url: `${backendUrl}/trails/publish/${trailToProcess}`,
      data: { published: true },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then(response => {
        setTrail(trails.map(trail => trail._id === trailToProcess ? { ...trail, published: true } : trail));
        setAlert({message: `${t('success_publish')}`, type: 'success'});
        handlePublishModalClose();
      })
      .catch(error => {
        console.log(error);
        setAlert({message: `${t('error_publish')}`, type: 'error'});
        handlePublishModalClose();
      });
  };

  const handleConfirmUnpublish = () => {
    const configuration = {
      method: "put",
      url: `${backendUrl}/trails/publish/${trailToProcess}`,
      data: { published: false },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then(response => {
        setTrail(trails.map(trail => trail._id === trailToProcess ? { ...trail, published: false } : trail));
        setAlert({message: `${t('success_unpublish')}`, type: 'success'});
        handleUnpublishModalClose();
      })
      .catch(error => {
        console.log(error);
        setAlert({message: `${t('error_unpublish')}`, type: 'error'});
        handleUnpublishModalClose();
      });
  };

  const handleConfirmClone = () => {
    const configuration = {
      method: "post",
      url: `${backendUrl}/trails/clone/${trailToProcess}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then(response => {
        setTrail([...trails, response.data.trail]);
        setAlert({message: `${t('success_duplicate')}`, type: 'success'});
        handleCloneModalClose();
      })
      .catch(error => {
        console.log(error);
        setAlert({message: `${t('error_duplicate')}`, type: 'error'});
        handleCloneModalClose();
      });
  };

  const handleConfirmDelete = () => {
    const configuration = {
      method: "delete",
      url: `${backendUrl}/trails/${trailToProcess}`,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    // make the API call
    api(configuration)
      .then((response) => {
        setTrail(trails.filter(trail => trail._id !== trailToProcess));
        setAlert({message: `${t('success_delete')}`, type: 'success'});
        handleDeleteModalClose();
      })
      .catch((error) => {
        console.log(error);
        setAlert({message: `${t('error_delete')}`, type: 'error'});
        handleDeleteModalClose();
      });
  };

  const addDefaultImg = event => {
    event.target.src = backup_trail_image;
  };

  const handleCloneModalShow = (trail_id) => {
    setTrailToProcess(trail_id);
    setCloneModalShow(true);
  };

  const handleCloneModalClose = () => {
    setTrailToProcess(null);
    setCloneModalShow(false);
  };

  const handlePublishModalShow = (trail_id) => {
    setTrailToProcess(trail_id);
    setPublishModalShow(true);
  };

  const handleUnpublishModalShow = (trail_id) => {
    setTrailToProcess(trail_id);
    setUnpublishModalShow(true);
  };

  const handlePublishModalClose = () => {
    setTrailToProcess(null);
    setPublishModalShow(false);
  };

  const handleUnpublishModalClose = () => {
    setTrailToProcess(null);
    setUnpublishModalShow(false);
  };

  const handleDeleteModalShow = (trail_id) => {
    setTrailToProcess(trail_id);
    setDeleteModalShow(true);
  };

  const handleDeleteModalClose = () => {
    setTrailToProcess(null);
    setDeleteModalShow(false);
  };

  // create maps for filters
  const getTrailStatus = (trail) => (trail.published ? "Published" : "Draft");
  const trailDifficulties = Array.from(new Set(trails.map((t) => t.difficulty)));
  const trailLocalities = Array.from(new Set(trails.map((t) => t.locality)));
  const trailStatuses = Array.from(new Set(trails.map((t) => getTrailStatus(t))));

  const getDisplayedTrails = () => {
    // search
    let searched = trails.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // filter
    let filtered = [...searched];
    if (difficultyFilter) {
      filtered = filtered.filter((t) => t.difficulty === difficultyFilter);
    }
    if (localityFilter) {
      filtered = filtered.filter((t) => t.locality === localityFilter);
    }
    if (statusFilter === 'Published') {
      filtered = filtered.filter((t) => t.published);
    } else if (statusFilter === 'Draft') {
      filtered = filtered.filter((t) => !t.published);
    }
    // sort
    let sorted = [...filtered];
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((t1, t2) => t1.name.localeCompare(t2.name));
        break;
      case 'name-desc':
        sorted.sort((t1, t2) => t2.name.localeCompare(t1.name));
        break;
      case 'length-asc':
        sorted.sort((t1, t2) => t1.length - t2.length);
        break;
      case 'length-desc':
        sorted.sort((t1, t2) => t2.length - t1.length);
        break;
      default:
        break;
    }
    return sorted;
  };

  const displayedTrails = getDisplayedTrails();

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  useEffect(() => {
      if (alert.message) {
        const timer = setTimeout(() => {
          setAlert({ message: '', type: '' });
        }, 3000); // Hide alert after 3 seconds
        return () => clearTimeout(timer);
      }
    }, [alert.message]);

  return (
    <div className='d-flex container-fluid mx-0 px-0'>
      <div className='col-3 pe-3'>
        <Navbar />
      </div>
      <div className='col-9 col-9 px-5'>
        <div className='py-4 ps-0'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>{t('trail_management')}</h1>
            <a className={`${styles.new_trail_button} btn btn-primary d-flex pe-4 py-2`} href={`${basePath}/trails/create`}>
              <img src={new_trail_button} alt="new_trail_button" className='pe-2' />
              {t('new_trail')}
            </a>
          </div>
          {alert.message && (
            <AlertComponent message={alert.message} type={alert.type} />
          )}
          <div className={`${styles.table_div}`}>
            <div className='d-flex justify-content-between'>
              <div className="input-group mb-3 mt-4 ms-4">
                <span className={`${styles.search_icon} input-group-text`} id="basic-addon1">
                  <img src={search_button} alt="search_button" className='pe-2' />
                </span>
                <input type="text" className={`${styles.search_input} form-control`} placeholder={t('search_trails')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className='d-flex align-items-center'>
                <Dropdown className="btn-secondary pe-4 py-1 me-2" >
                  <Dropdown.Toggle variant="secondary" id="dropdown-filters" className={`${styles.dropdown_toggle_sort} pe-3 me-3 d-flex`}>
                    {difficultyFilter || localityFilter || statusFilter
                      ? `${t('filters')} (${difficultyFilter || ''} ${localityFilter || ''} ${statusFilter || ''})`
                      : `${t('filters')}`
                    }
                    <img src={filter_button} alt="filter_button" className='px-2' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>{t('difficulty')}</Dropdown.Header>
                    <Dropdown.Item key='All difficulties' onClick={() => setDifficultyFilter('')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      {t('all_difficulties')}
                    </Dropdown.Item>
                    {trailDifficulties.map((trailDifficulty) => {
                      return (
                        <Dropdown.Item key={trailDifficulty} onClick={() => setDifficultyFilter(trailDifficulty)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                          {t(`trail_difficulty.${trailDifficulty.toLowerCase()}`)}
                        </Dropdown.Item>
                      )
                    })}
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Header>{t('location')}</Dropdown.Header>
                    <Dropdown.Item key='All localities' onClick={() => setLocalityFilter('')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      {t('all_localities')}
                    </Dropdown.Item>
                    {trailLocalities.map((trailLocation) => {
                      return (
                        <Dropdown.Item key={trailLocation} onClick={() => setLocalityFilter(trailLocation)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                          {t(`trail_location.${trailLocation.toLowerCase()}`)}
                        </Dropdown.Item>
                      )
                    })}
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Header>{t('status')}</Dropdown.Header>
                    <Dropdown.Item key='All statuses' onClick={() => setStatusFilter('')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      {t('all_statuses')}
                    </Dropdown.Item>
                    {trailStatuses.map((trailStatus) => {
                      return (
                        <Dropdown.Item key={trailStatus} onClick={() => setStatusFilter(trailStatus)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                          {t(`trail_status.${trailStatus.toLowerCase()}`)}
                        </Dropdown.Item>
                      )
                    })}
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item key="reset" onClick={() => { setStatusFilter(''); setDifficultyFilter(''); setLocalityFilter(''); }} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                    {t('reset_filter')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className='btn-secondary py-1 me-2' >
                  <Dropdown.Toggle variant="secondary" id="dropdown-sort" className={`${styles.dropdown_toggle_sort} pe-3 me-3 d-flex`}>
                    {t('sort')} <img src={sort_button} alt="sort_button" className='px-2' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className=''>
                    <Dropdown.Item onClick={() => setSortOption('name-asc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      {t('name')} (A → Z)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOption('name-desc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      {t('name')} (Z → A)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOption('length-asc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      {t('length')} ({t('from_shortest')})
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOption('length-desc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      {t('length')} ({t('from_longest')})
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className='pb-3'>
              <table className='table table-striped table-hover align-middle'>
                <thead>
                  <tr className={`${styles.table_header}`}>
                    <th className='ps-4'>{t('no.')}</th>
                    <th className=''>{t('trail')}</th>
                    <th className=''>{t('length')}</th>
                    <th className=''>{t('difficulty')}</th>
                    <th className=''>{t('location')}</th>
                    <th className=''>{t('status')}</th>
                    <th className=''>{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTrails.map((trail, index) => (
                    <tr key={trail._id} className={`${styles.table_data}`}>
                      <td className='ps-4'>{index + 1}</td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <img src={`${backendUrl}/${trail.thumbnail}`} alt="trail_img" style={{ width: '4rem', height: '4rem' }} className='me-2' onError={addDefaultImg} />
                          {trail.name}
                        </div>
                      </td>
                      <td>
                        {trail.length.toFixed(2)} km
                      </td>
                      <td>
                        {t(`trail_difficulty.${trail.difficulty.toLowerCase()}`)}
                      </td>
                      <td>
                        {t(`trail_location.${trail.locality.toLowerCase()}`)}
                      </td>
                      <td>
                        {trail.published ? (
                          <button className={`${styles.status_published} btn disabled`}>{t('published')}</button>
                        ) : (
                          <button className={`${styles.status_draft} btn disabled`}>{t('draft')}</button>
                        )}
                      </td>
                      <td className='ps-3'>
                        <Dropdown>
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic" className={`${styles.dropdown_toggle} rounded-circle p-1`}>
                            <img src={table_actions} alt="search_button" className='' />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className=''>
                            <Dropdown.Item href="#" onClick={() => handleCloneModalShow(trail._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_duplicate} alt="duplicate" className='pe-2' />{t('duplicate')}
                            </Dropdown.Item>
                            {trail.creator === userId && (
                              <>
                                {trail.published ? ( // change icon
                                  <Dropdown.Item href="#" onClick={() => handleUnpublishModalShow(trail._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                                    <img src={table_action_publish} alt="unpublish" className='pe-2' />{t('unpublish')}
                                  </Dropdown.Item>
                                ) : (
                                  <Dropdown.Item href="#" onClick={() => handlePublishModalShow(trail._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                                    <img src={table_action_publish} alt="publish" className='pe-2' />{t('publish')}
                                  </Dropdown.Item>
                                )}
                              </>
                            )}
                            <Dropdown.Item href={`${basePath}/trails/details/${trail._id}`} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_show} alt="show" className='pe-2' />{t('show_trail')}
                            </Dropdown.Item>
                            {trail.creator === userId && (
                              <>
                                {(!trail.published) && (
                                  <Dropdown.Item href={`${basePath}/trails/edit/${trail._id}`} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                                    <img src={table_action_edit} alt="edit" className='pe-2' />{t('edit_trail')}
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Item href="#" onClick={() => handleDeleteModalShow(trail._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                                  <img src={table_action_delete} alt="delete" className='pe-2' />{t('delete')}
                                </Dropdown.Item>
                              </>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`${styles.table_bottom} mt-1 mb-4 ms-4`}>
              {t('showing')} 1 {t('to')} {Object.keys(displayedTrails).length} {t('of')} {Object.keys(displayedTrails).length} {t('entries')}
            </div>
          </div>

          <Modal
            show={cloneModalShow}
            onHide={handleCloneModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className='d-flex flex-column align-items-center p-4'>
              <img src={modal_clone} alt="modal_clone" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>{t('duplicate_trail')}</h1>
              <p className={`${styles.modal_text}`}>{t('duplicate_text')}</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handleCloneModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                {t('cancel')}
              </Button>
              <Button variant="primary" onClick={() => handleConfirmClone()} className={`${styles.modal_clone_button} flex-fill ms-2 me-5`}>
                {t('duplicate')}
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={publishModalShow}
            onHide={handlePublishModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className='d-flex flex-column align-items-center p-4'>
              <img src={modal_publish} alt="modal_publish" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>{t('publish_trail')}</h1>
              <p className={`${styles.modal_text} mb-0`}>{t('publish_text1')}</p>
              <p className={`${styles.modal_text} `}>{t('publish_text2')}</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handlePublishModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                {t('cancel')}
              </Button>
              <Button variant="primary" onClick={() => handleConfirmPublish()} className={`${styles.modal_publish_button} flex-fill ms-2 me-5`}>
                {t('publish')}
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={unpublishModalShow}
            onHide={handleUnpublishModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className='d-flex flex-column align-items-center p-4'>
              <img src={modal_publish} alt="modal_publish" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>{t('unpublish_trail')}</h1>
              <p className={`${styles.modal_text} mb-0`}>{t('unpublish_text1')}</p>
              <p className={`${styles.modal_text} `}>{t('unpublish_text2')}</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handleUnpublishModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                {t('cancel')}
              </Button>
              <Button variant="primary" onClick={() => handleConfirmUnpublish()} className={`${styles.modal_publish_button} flex-fill ms-2 me-5`}>
                {t('unpublish')}
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={deleteModalShow}
            onHide={handleDeleteModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className='d-flex flex-column align-items-center p-4'>
              <img src={modal_delete} alt="modal_delete" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>{t('delete_trail')}</h1>
              <p className={`${styles.modal_text} mb-0`}>{t('delete_text1')}</p>
              <p className={`${styles.modal_text} `}>{t('delete_text2')}</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handleDeleteModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                {t('cancel')}
              </Button>
              <Button variant="primary" onClick={() => handleConfirmDelete()} className={`${styles.modal_delete_button} flex-fill ms-2 me-5`}>
                {t('delete')}
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </div>

  )
};

export default Home;