import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import PointModal from '../../components/PointModal';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDelete } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// openlayers components
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';

import Cookies from "universal-cookie";

//svg import
import file_upload from '../assets/file_upload.png';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const CreateTrail = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [locality, setLocality] = useState('Slovakia');
  const [season, setSeason] = useState('All Seasons');
  const [thumbnail, setThumbnail] = useState('-');
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0); // re-rendering the modal
  const [tempPoint, setTempPoint] = useState(null);
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());  // Reference for the vector source (points & lines)
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false); // because of the possibility to edit already created point
  const [currentPoint, setCurrentPoint] = useState(null);
  const { quill, quillRef } = useQuill();

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * Math.PI / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  function calculateTrailLength(points) {
    let totalLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const point1 = points[i];
      const point2 = points[i + 1];
      const distance = haversineDistance(point1.latitude, point1.longitude, point2.latitude, point2.longitude);
      totalLength += distance;
    }

    return totalLength; // Length in kilometers
  }

  const handleSaveTrail = () => {
    setLoading(true);
    let trailLength = calculateTrailLength(points);
    // set configurations for the API call here
    const configuration = {
      method: "post",
      url: "http://localhost:5555/trails",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        description,
        difficulty,
        locality,
        season,
        thumbnail,
        length: trailLength,
        points
      }
    };

    // make the API call
    axios(configuration)
      .then((response) => {
        setLoading(false);
        setSuccessMessage('Trail saved.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        alert('An error occured.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(description);
      quill.on('text-change', (delta, oldDelta, source) => {
        //console.log('Text change!');
        //console.log(quill.getText()); // Get text only
        //console.log(quill.getContents()); // Get delta contents
        //console.log(quill.root.innerHTML); // Get innerHTML using quill
        //console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
        setDescription(quill.root.innerHTML);
      });
    }
  }, [quill]);

  useEffect(() => {
    // Initialize the map once (not every time the points state changes)
    if (!mapRef.current) return;

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),  // default location - maybe could be changed to something different
        zoom: 2,  // initial zoom level
      }),
    });


    // click event listener to the map
    map.on('click', function (evt) {

      const coordinates = evt.coordinate;
      const lonLat = toLonLat(coordinates);
      console.log("click " + lonLat);
      setTempPoint({ longitude: lonLat[0], latitude: lonLat[1], coordinates: coordinates, id: Date.now() });
      setModalKey(modalKey => modalKey + 1);
      setModalOpen(true);
      /*console.log("long: " + lonLat[0]);
      console.log("lat: " + lonLat[1]);
      console.log("coords: " + coordinates);
      console.log("id: " + Date.now());
      console.log("tmp point: " + tempPoint);
      console.log("modal open? " + modalOpen);
      console.log("------------------------");*/
    });
  }, []);  // empty array to ensure the map initializes only once

  const handleEditPoint = (point) => {
    setCurrentPoint(point);
    setEditMode(true);
    setModalOpen(true);
  }

  const removePoint = (pointId) => {
    setPoints(points => {
      const updatedPoints = points.filter(p => p.id !== pointId);
      updateMapPoints(updatedPoints);
      return updatedPoints;
    });
  }

  const updateMapPoints = (points) => {
    vectorSourceRef.current.clear();
    points.forEach(point => {
      const pointFeature = new Feature({
        geometry: new Point(fromLonLat([point.longitude, point.latitude])),
        id: point.id
      });
      pointFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({
              color: 'white',
              width: 2,
            }),
          }),
        })
      );
      vectorSourceRef.current.addFeature(pointFeature);
    });
    drawLine(points);
  };

  const drawLine = (points) => {
    if (points.length > 1) {
      const lineCoordinates = points.map(p => fromLonLat([p.longitude, p.latitude]));
      const lineFeature = new Feature({
        geometry: new LineString(lineCoordinates),
      });

      lineFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: 'green',
            width: 2,
          }),
        })
      );
      vectorSourceRef.current.addFeature(lineFeature);
    }
  };

  const handleSavePoint = (data) => {
    if (editMode) {
      setPoints(points => points.map(p => p.id === currentPoint.id ? { ...p, ...data } : p));
      updateMapPoints(points.map(p => p.id === currentPoint.id ? { ...p, ...data } : p));
    } else {
      const point = { ...data, longitude: tempPoint.longitude, latitude: tempPoint.latitude, id: tempPoint.id };
      setPoints(prevPoints => [...prevPoints, point]);
      updateMapPoints([...points, point]);
    }

    setModalOpen(false);
    setEditMode(false);
    setCurrentPoint(null);
  }

  return (
    <div className={`${styles.new_trail_container} ${styles.new_trail_bg} d-flex container-fluid mx-0 px-0`}>
      <div className='col-3 pe-4'>
        <Navbar />
      </div>
      <div className={`col-9 px-5`}>
        <div className='py-5 ps-0'>
          <div className='d-flex justify-content-between'>
            <div>
              <h1 className='text-3xl'>Add a New Trail</h1>
              <p className={`${styles.new_trail_text}`}>Please fill in all the details of your trail.</p>
            </div>
            <div className='d-flex align-items-center pb-4'>
              <button className={`${styles.save_button} btn btn-secondary`}>Save as Draft</button>
            </div>
          </div>
          <div>
            <Tabs
              defaultActiveKey="general"
              id="create-trail-tab"
              className="mb-3"
              justify
            >
              <Tab eventKey="general" title="General Information">
                <div className={`${styles.tabs_bg} p-4`}>
                  <div className={`${styles.file_upload} d-flex flex-column align-items-center mb-3 w-100`}>
                    <img src={file_upload} alt="file_upload" style={{ width: '8rem', height: '8rem' }} className='mt-5' />
                    <div className='d-flex'>
                      <div className={`${styles.upload_text_black} pe-1`}>Drag and drop or</div>
                      <div className={`${styles.upload_text_blue} pe-1`}>Choose File</div>
                      <div className={`${styles.upload_text_black}`}>to upload</div>
                    </div>

                  </div>
                  <div className='mb-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>Trail Name</label>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={`${styles.form_input} form-control`}></input>
                  </div>
                  <div className='mb-3 col-6 pe-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>Location</label>
                    <select value={locality} onChange={e => setLocality(e.target.value)} className={`${styles.form_input} form-select`}>
                      <option value="Slovakia">Slovakia</option>
                      <option value="Czech Republic">Czech Republic</option>
                      <option value="Spain">Spain</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className='mb-3 d-flex'>
                    <div className='col-6 pe-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Season</label>
                      <select value={season} onChange={e => setSeason(e.target.value)} className={`${styles.form_input} form-select`} >
                        <option value="All Seasons">All Seasons</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Autumn">Autumn</option>
                        <option value="Winter">Winter</option>
                      </select>
                    </div>
                    <div className='col-6 ps-3'>
                      <label className={`${styles.form_label} form-label mb-1`}>Difficulty</label>
                      <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={`${styles.form_input} form-select`}>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Challenging">Challenging</option>
                        <option value="Difficult">Difficult</option>
                      </select>
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label className={`${styles.form_label} form-label mb-1`}>Description</label>
                    <div /* style={{ width: 500 }} */ className={`${styles.description_input}`}>
                      <div ref={quillRef} className={`${styles.description_input_2}`}/>
                    </div>
                  </div>
                </div>

              </Tab>
              <Tab eventKey="points" title="Trail Content">
                Tab content for Trail Content
              </Tab>
              <Tab eventKey="overview" title="Overview">
                Tab content for Overview
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
};


/* <div className='p-4'>
  <BackButton></BackButton>
  <h1 className='text-3xl my-4'>Create Trail</h1>
  {loading ? <Spinner /> : ''}
  <div className='flex flex-col p-4'>
    {successMessage && (
      <div className='bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3'>
        <p>{successMessage}</p>
      </div>
    )}
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Name</label>
      <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='border-2 border-gray-500 px-4'></input>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Description</label>
      <div style={{ width: 500 }}><div ref={quillRef} /></div>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Difficulty</label>
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)} >
        <option value="Easy">Easy</option>
        <option value="Moderate">Moderate</option>
        <option value="Challenging">Challenging</option>
        <option value="Difficult">Difficult</option>
      </select>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Season</label>
      <select value={season} onChange={e => setSeason(e.target.value)} >
        <option value="All Seasons">All Seasons</option>
        <option value="Spring">Spring</option>
        <option value="Summer">Summer</option>
        <option value="Autumn">Autumn</option>
        <option value="Winter">Winter</option>
      </select>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Locality</label>
      <select value={locality} onChange={e => setLocality(e.target.value)} >
        <option value="Slovakia">Slovakia</option>
        <option value="Czech Republic">Czech Republic</option>
        <option value="Spain">Spain</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Thumbnail</label>
      <input type='text' value={thumbnail} placeholder="Add Link to Image" onChange={(e) => setThumbnail(e.target.value)} className='border-2 border-gray-500 px-4'></input>
    </div>
    <div className='my-4'>
      <label className='text-l mr-4 text-gray-500'>Map points:</label>
      <ul>
        {points.map(point => (
          <li key={point.id}>
            {point.title || 'New Point'} - {point.latitude}, {point.longitude}
            <button onClick={() => handleEditPoint(point)}><AiOutlineEdit className='text-yellow-600'/></button>
            <button onClick={() => removePoint(point.id)}><MdOutlineDelete className='text-red-600'/></button>
          </li>
        ))}
      </ul>
    </div>
    <PointModal key={modalKey} isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSavePoint} editMode={editMode} pointData={currentPoint}></PointModal>
    <div className='my-4'>
      <label className='text-xl mr-4 text-gray-500'>Map - Click to Add Points</label>
      <div ref={mapRef} className='w-full h-96 border-2 border-gray-300' />
    </div>

    <button className='p-2 bg-sky-300 m-8' onClick={handleSaveTrail}>
      Save
    </button>
  </div>
</div> */

export default CreateTrail;