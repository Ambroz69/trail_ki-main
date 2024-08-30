import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Link } from 'react-router-dom';
import { AiOutlineCopy, AiFillCheckCircle, AiOutlineCheckCircle, AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Cookies from "universal-cookie";

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
        //setMessage(response.data.message);
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

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Trails list</h1>
        <Link to='/trails/create'><MdOutlineAddBox className='text-sky-800 text-4xl' /></Link>
      </div>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <table className='w-full border-separate border-spacing-2'>
          <thead>
            <tr>
              <th className='border border-slate-600 rounded-md'>No</th>
              <th className='border border-slate-600 rounded-md'>Image</th>
              <th className='border border-slate-600 rounded-md'>Trail</th>
              <th className='border border-slate-600 rounded-md'>Description</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Points</th>
              <th className='border border-slate-600 rounded-md'>Operations</th>
            </tr>
          </thead>
          <tbody>
            {trails.map((trail, index) => (
              <tr key={trail._id} className='h-8'>
                <td>{index + 1}</td>
                <td><img src={trail.thumbnail} alt='Picture' style={{ width: '100px', height: 'auto' }}></img></td>
                <td>{trail.name}</td>
                <td>
                  <div dangerouslySetInnerHTML={{ __html: trail.description }} />
                  <br />
                  {trail.length>0 ? ( 
                  <>
                  Length: {trail.length.toFixed(2)} km
                  </>
                  ):(<></>)}
                </td>
                <td>
                  {trail.points && trail.points.length > 0 ? (
                    <ul>
                      {trail.points.map((point, idx) => (
                        <li key={point._id}>
                          {`Point ${idx + 1}: ${point.title} (${point.longitude}, ${point.latitude})`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No Points</span>
                  )}
                </td>
                <td>
                  <div className='flex justify-center gap-x-4'>
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
  )
};

export default Home;