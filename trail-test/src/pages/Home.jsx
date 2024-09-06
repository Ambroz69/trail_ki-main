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
import backup_trail_image from '../assets/backup_trail_image.png';

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
    <div className='d-flex container container-fluid mx-0 px-0'>
      <div className='col-3'>
        <Navbar />
      </div>
      <div className='col-9 w-100'>
        <div className='py-4 ps-4'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>Trail Management</h1>
            <Link to='/trails/create'><MdOutlineAddBox className='text-sky-800 text-4xl' /></Link>
          </div>
          {loading ? (
            <Spinner></Spinner>
          ) : (
            <table className='table table-striped table-hover align-middle'>
              <thead>
                <tr className={`${styles.table_header}`}>
                  <th className='ps-5'>No.</th>
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
                    <td className='ps-5'>{index + 1}</td>
                    <td>
                      <div className='d-flex align-items-center'>
                        {/* <img src={trail.thumbnail} alt='trail_thumbnail' style={{ width: '4rem', height: '4rem' }} className='me-2' onerror="this.src=${};"></img> */}
                        <img src={trail.thumbnail} alt="trail_img" style={{ width: '4rem', height: '4rem' }} className='me-2' onError={addDefaultImg}/>
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
                    <td>
                      <div className='flex justify-start gap-x-2'>
                        <AiOutlineCopy className='text-2xl text-gray-600' onClick={() => handleOpenCloneModal(trail._id)} />
                        {trail.published ? (
                          <AiFillCheckCircle className='text-2xl text-green-800' />
                        ) : (
                          <AiOutlineCheckCircle className='text-2xl text-green-800' onClick={() => handleOpenModal(trail._id)} />
                        )}
                        <Link to={`/trails/details/${trail._id}`}><BsInfoCircle className='text-2xl text-blue-800' /></Link>
                        <Link to={`/trails/edit/${trail._id}`}><AiOutlineEdit className='text-2xl text-yellow-600' /></Link>
                        <Link to={`/trails/remove/${trail._id}`}><MdOutlineDelete className='text-2xl text-red-600' /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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