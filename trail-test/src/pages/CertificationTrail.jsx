import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import styles from '../css/TrailShow.module.css';

import Cookies from "universal-cookie";

import TrailMap from '../../components/TrailMap';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CertificationTrail = () => {
  const [trail, setTrail] = useState(null);
  const { id } = useParams();

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

  const handleProximityTask = (point) => {
    console.log(`You are near point: ${point.title}`);
  }

  return (
    <div className={`${styles.show_trail_bg} d-flex container-fluid mx-0 px-0`}>
      <div className='col-3 pe-4'>
        <Navbar />
      </div>
      <div className={`col-9 ps-4 pe-5 mt-5`}>
        <div className={`${styles.white_bg} p-0`}>
          <div className='mb-5'>
            <TrailMap
              points={trail?.points}
              height='30rem'
              editable={false}
              useGPS={true}
              onProximityTask={handleProximityTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationTrail;