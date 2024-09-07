import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Link } from 'react-router-dom';
import { AiOutlineCopy, AiFillCheckCircle, AiOutlineCheckCircle, AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailList.module.css';
import Dropdown from 'react-bootstrap/Dropdown';

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

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const Home = () => {
  const [trails, setTrail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [trailToPublish, setTrailToPublish] = useState(null);
  const [trailToClone, setTrailToClone] = useState(null);
  //const [message, setMessage] = useState("");

  /*useEffect(()=> {
      setLoading(true);
      axios.get('http://localhost:5555/trails').then((response) => {
          setTrail(response.data.data);
          setLoading(false);
      })
      .catch((error) => {
          console.log(error);
          setLoading(false);
      });
  }, []);*/

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

  const handleOpenCloneModal = (id) => {
    setTrailToClone(id);
    setCloneModalOpen(true);
  };

  const handleCloseCloneModal = () => {
    setTrailToClone(null);
    setCloneModalOpen(false);
  };

  const handleOpenModal = (id) => {
    setTrailToPublish(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setTrailToPublish(null);
    setModalOpen(false);
  };

  const handleConfirmPublish = () => {
    setLoading(true);
    axios.put(`http://localhost:5555/trails/publish/${trailToPublish}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setTrail(trails.map(trail => trail._id === trailToPublish ? { ...trail, published: true } : trail));
        setLoading(false);
        handleCloseModal();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        handleCloseModal();
      });
  };

  const handleConfirmClone = () => {
    setLoading(true);
    axios.post(`http://localhost:5555/trails/clone/${trailToClone}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setTrail([...trails, response.data.trail]);
        setLoading(false);
        handleCloseCloneModal();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        handleCloseCloneModal();
      });
  };

  const addDefaultImg = event => {
    event.target.src = backup_trail_image;
  }

  return (
    <div className='d-flex container-fluid mx-0 px-0'>
      <div className='col-3'>
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
                    <img src={filter_button} alt="sort_button" className='px-2' />
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
                          {/* <img src={trail.thumbnail} alt='trail_thumbnail' style={{ width: '4rem', height: '4rem' }} className='me-2' onerror="this.src=${};"></img> */}
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
                            <Dropdown.Item href="#" className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_duplicate} alt="duplicate" className='pe-2' />Duplicate
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_publish} alt="publish" className='pe-2' />Publish
                            </Dropdown.Item>
                            <Dropdown.Item href={`/trails/details/${trail._id}`} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_show} alt="show" className='pe-2' />Show Trail
                            </Dropdown.Item>
                            <Dropdown.Item href={`/trails/edit/${trail._id}`} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_edit} alt="edit" className='pe-2' />Edit Trail
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_delete} alt="delete" className='pe-2' />Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        {/* <div className='flex justify-start gap-x-2'>
                          <AiOutlineCopy className='text-2xl text-gray-600' onClick={() => handleOpenCloneModal(trail._id)} />
                          {trail.published ? (
                            <AiFillCheckCircle className='text-2xl text-green-800' />
                          ) : (
                            <AiOutlineCheckCircle className='text-2xl text-green-800' onClick={() => handleOpenModal(trail._id)} />
                          )}
                          <Link to={`/trails/details/${trail._id}`}><BsInfoCircle className='text-2xl text-blue-800' /></Link>
                          <Link to={`/trails/edit/${trail._id}`}><AiOutlineEdit className='text-2xl text-yellow-600' /></Link>
                          <Link to={`/trails/remove/${trail._id}`}><MdOutlineDelete className='text-2xl text-red-600' /></Link>
                        </div> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`${styles.table_bottom} mt-1 mb-4 ms-4`}>
              Showing 1 to 9 of 9 entries
            </div>
          </div>

          <ConfirmationModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmPublish}
            message="Are you sure you want to publish this trail?"
          />
          <ConfirmationModal
            isOpen={cloneModalOpen}
            onClose={handleCloseCloneModal}
            onConfirm={handleConfirmClone}
            message="Are you sure you want to clone this trail?"
          />
        </div>
      </div>
    </div>

  )
};

export default Home;