import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailList.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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

const Home = () => {
  const [trails, setTrail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trailToProcess, setTrailToProcess] = useState(null);
  const [cloneModalShow, setCloneModalShow] = useState(false);
  const [publishModalShow, setPublishModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  useEffect(() => {
    setLoading(true);
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: "http://localhost:5555/trails",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    axios(configuration)
      .then((response) => {
        setTrail(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleConfirmPublish = () => {
    setLoading(true);
    axios.put(`http://localhost:5555/trails/publish/${trailToProcess}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setTrail(trails.map(trail => trail._id === trailToProcess ? { ...trail, published: true } : trail));
        setLoading(false);
        handlePublishModalClose();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        handlePublishModalClose();
      });
  };

  const handleConfirmClone = () => {
    setLoading(true);
    axios.post(`http://localhost:5555/trails/clone/${trailToProcess}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setTrail([...trails, response.data.trail]);
        setLoading(false);
        handleCloneModalClose();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        handleCloneModalClose();
      });
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    const configuration = {
      method: "delete",
      url: `http://localhost:5555/trails/${trailToProcess}`,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    // make the API call
    axios(configuration)
      .then((response) => {
        setTrail(trails.filter(trail => trail._id !== trailToProcess));
        setLoading(false);
        handleDeleteModalClose();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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

  const handlePublishModalClose = () => {
    setTrailToProcess(null);
    setPublishModalShow(false);
  };

  const handleDeleteModalShow = (trail_id) => {
    setTrailToProcess(trail_id);
    setDeleteModalShow(true);
  };

  const handleDeleteModalClose = () => {
    setTrailToProcess(null);
    setDeleteModalShow(false);
  };

  return (
    <div className='d-flex container-fluid mx-0 px-0'>
      <div className='col-3 pe-3'>
        <Navbar />
      </div>
      <div className='col-9 col-9 px-5'>
        <div className='py-4 ps-0'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>Trail Management</h1>
            <a className={`${styles.new_trail_button} btn btn-primary d-flex pe-4 py-2`} href='/trails/create'>
              <img src={new_trail_button} alt="new_trail_button" className='pe-2' />
              New Trail
            </a>
          </div>
          <div className={`${styles.table_div}`}>
            <div className='d-flex justify-content-between'>
              <div className="input-group mb-3 mt-4 ms-4">
                <span className={`${styles.search_icon} input-group-text`} id="basic-addon1">
                  <img src={search_button} alt="search_button" className='pe-2' />
                </span>
                <input type="text" className={`${styles.search_input} form-control`} placeholder="Search trails..." />
              </div>
              <div className='d-flex align-items-center'>
                <a className={`${styles.filter_button} btn btn-secondary pe-4 py-1 me-2`} href='#'>
                  <div className='d-flex'>
                    Filters
                    <img src={filter_button} alt="filter_button" className='px-2' />
                  </div>
                </a>
                <a className={`${styles.filter_button} btn btn-secondary pe-4 py-1 me-3`} href='#'>
                  <div className='d-flex'>
                    Sort
                    <img src={sort_button} alt="sort_button" className='px-2' />
                  </div>
                </a>
              </div>
            </div>
            <div className='pb-3'>
              <table className='table table-striped table-hover align-middle'>
                <thead>
                  <tr className={`${styles.table_header}`}>
                    <th className='ps-4'>No.</th>
                    <th className=''>Trail</th>
                    <th className=''>Length</th>
                    <th className=''>Difficulty</th>
                    <th className=''>Location</th>
                    <th className=''>Status</th>
                    <th className=''>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trails.map((trail, index) => (
                    <tr key={trail._id} className={`${styles.table_data}`}>
                      <td className='ps-4'>{index + 1}</td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <img src={trail.thumbnail} alt="trail_img" style={{ width: '4rem', height: '4rem' }} className='me-2' onError={addDefaultImg} />
                          {trail.name}
                        </div>
                      </td>
                      <td>
                        {trail.length.toFixed(2)} km
                      </td>
                      <td>
                        {trail.difficulty}
                      </td>
                      <td>
                        {trail.locality}
                      </td>
                      <td>
                        {trail.published ? (
                          <button className={`${styles.status_published} btn disabled`}>Published</button>
                        ) : (
                          <button className={`${styles.status_draft} btn disabled`}>Draft</button>
                        )}
                      </td>
                      <td className='ps-3'>
                        <Dropdown>
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic" className={`${styles.dropdown_toggle} rounded-circle p-1`}>
                            <img src={table_actions} alt="search_button" className='' />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className=''>
                            <Dropdown.Item href="#" onClick={() => handleCloneModalShow(trail._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_duplicate} alt="duplicate" className='pe-2' />Duplicate
                            </Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => handlePublishModalShow(trail._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_publish} alt="publish" className='pe-2' />Publish
                            </Dropdown.Item>
                            <Dropdown.Item href={`/trails/details/${trail._id}`} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_show} alt="show" className='pe-2' />Show Trail
                            </Dropdown.Item>
                            <Dropdown.Item href={`/trails/edit/${trail._id}`} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_edit} alt="edit" className='pe-2' />Edit Trail
                            </Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => handleDeleteModalShow(trail._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_delete} alt="delete" className='pe-2' />Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`${styles.table_bottom} mt-1 mb-4 ms-4`}>
              Showing 1 to {Object.keys(trails).length} of {Object.keys(trails).length} entries
            </div>
          </div>

          <Modal
            show={cloneModalShow}
            onHide={handleCloneModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className='d-flex flex-column align-items-center p-4'>
              <img src={modal_clone} alt="sort_button" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>Duplicate Trail</h1>
              <p className={`${styles.modal_text}`}>Are you sure you want to create a duplicate of this trail?</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handleCloneModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => handleConfirmClone()} className={`${styles.modal_clone_button} flex-fill ms-2 me-5`}>
                Duplicate
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
              <img src={modal_publish} alt="sort_button" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>Publish Trail</h1>
              <p className={`${styles.modal_text} mb-0`}>Are you sure you want to publish this trail?</p>
              <p className={`${styles.modal_text} `}>Once published, it will be available to the public.</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handlePublishModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => handleConfirmPublish()} className={`${styles.modal_publish_button} flex-fill ms-2 me-5`}>
                Publish
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
              <img src={modal_delete} alt="sort_button" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>Delete Trail</h1>
              <p className={`${styles.modal_text} mb-0`}>Are you sure you want to delete this trail?</p>
              <p className={`${styles.modal_text} `}>This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handleDeleteModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => handleConfirmDelete()} className={`${styles.modal_delete_button} flex-fill ms-2 me-5`}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </div>

  )
};

export default Home;