import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import PointModal from '../../components/PointModal';
import Spinner from '../../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineDelete } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

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
import { Modify } from 'ol/interaction';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const EditTrail = () => {
  const [name, setName] = useState('');
  const [points, setPoints] = useState([]);
  const [description, setDescription] = useState('');
  const descriptionRef = useRef(description); // useRef to prevent rerenders
  const [difficulty, setDifficulty] = useState('Easy');
  const [locality, setLocality] = useState('Slovakia');
  const [season, setSeason] = useState('All Seasons');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0); // re-rendering the modal
  const [editMode, setEditMode] = useState(false); // because of the possibility to edit already created point
  const [currentPoint, setCurrentPoint] = useState(null);
  const [tempPoint, setTempPoint] = useState(null);
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());  // reference for the vector source (points & lines)
  const navigate = useNavigate();
  const { id } = useParams();
  const { quill, quillRef } = useQuill();
  const mapInstanceRef = useRef(null); // storage of mapinstance
  const hasLoadedInitialContent = useRef(false); // initial loading of description

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: `http://localhost:5555/trails/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // make the API call
    axios(configuration)
      .then((response) => {
        setName(response.data.name);
        setDescription(response.data.description);
        setLocality(response.data.locality);
        setDifficulty(response.data.difficulty);
        setSeason(response.data.season);
        setThumbnail(response.data.thumbnail);
        setPoints(response.data.points || []);
        loadExistingPoints(response.data.points || []);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('Failed to load trail.');
        console.log(error);
      });
  }, [id]);

  const handleEditTrail = () => {
    setLoading(true);
    // set configurations for the API call here
    const configuration = {
      method: "put",
      url: `http://localhost:5555/trails/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        points
      }
    };

    // make the API call
    axios(configuration)
      .then(() => {
        setLoading(false);
        setSuccessMessage('Trail updated.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        console.log('Server response data:', data);
        if (error.response) {
          console.log('Server responded with status code:', error.response.status);
          console.log('Server response data:', error.response.data);
        } else {
          console.log('Error:', error.message);
        }
      });
  };

  useEffect(() => {
    if (quill) {
      if (!hasLoadedInitialContent.current && description) {
        quill.clipboard.dangerouslyPasteHTML(description); // Set the initial description
        hasLoadedInitialContent.current = true; 
      } 
      quill.on('text-change', (delta, oldDelta, source) => {
        const currentContent = quill.root.innerHTML;

        // Only update state if the content has actually changed
        if (descriptionRef.current !== currentContent) {
          descriptionRef.current = currentContent;
          setDescription(currentContent);
        }        
      });
    }
  }, [quill, description]);

  useEffect(() => {
    // Initialize the map once (not every time the points state changes)
    if (mapInstanceRef.current || !mapRef.current) return;

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

    mapInstanceRef.current = map; // store map for later usage

    // Add click event listener to the map
    map.on('click', function (evt) {
      const coordinates = evt.coordinate;  // Get clicked coordinates
      const lonLat = toLonLat(coordinates);
      console.log("click " + lonLat);
      setTempPoint({ longitude: lonLat[0], latitude: lonLat[1], coordinates: coordinates, id: Date.now() });
      setModalKey(modalKey => modalKey + 1);
      setModalOpen(true);
    });

    // point movement if you want to edit the placement
    const modify = new Modify({ source: vectorSourceRef.current });
    map.addInteraction(modify);
    modify.on('modifyend', (evt) => {
      evt.features.forEach(feature => {
        const newCoords = toLonLat(feature.getGeometry().getCoordinates());
        const featureId = feature.getId();

        setPoints(currentPoints => currentPoints.map(point => {
          if (String(point._id) === featureId) {
            return { ...point, longitude: newCoords[0], latitude: newCoords[1] };
          }
          return point;
        }));
      });
    });
  }, []);

  const handleEditPoint = (point) => {
    setCurrentPoint(point);
    setEditMode(true);
    setModalOpen(true);
  }


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

  // function to delete the point
  const deletePoint = async (trailId, pointId) => {
    if (window.confirm('Are you sure you want to delete this point?')) {
      try {
        // set configurations for the API call here
        const configuration = {
          method: "delete",
          url: `http://localhost:5555/trails/point/${trailId}/${pointId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          }
        };
        // make the API call
        const response = await axios(configuration);
        if (response.status === 200) {
          alert('Point deleted successfully!');
          setPoints(points => {
            const updatedPoints = points.filter(point => point._id !== pointId);
            // Remove the feature from the map
            const featureToRemove = vectorSourceRef.current.getFeatureById(pointId);
            if (featureToRemove) {
              vectorSourceRef.current.removeFeature(featureToRemove);
            }
            // Redraw the trail with remaining points
            drawTrail(updatedPoints);
            return updatedPoints;
          });
        }
      } catch (error) {
        console.error('Failed to delete the point:', error);
        alert('Failed to delete the point.');
      }
    }
  };

  // function to load existing points to the map
  const loadExistingPoints = (trailPoints) => {
    vectorSourceRef.current.clear();
    trailPoints.forEach(p => { addPointToMap(p); });
    drawTrail(trailPoints);
    // zoom to the first point on trail
    if (trailPoints.length > 0) {
      const firstPoint = trailPoints[0];
      const firstPointCoords = fromLonLat([firstPoint.longitude, firstPoint.latitude]);
      mapInstanceRef.current.getView().setCenter(firstPointCoords);
      mapInstanceRef.current.getView().setZoom(14);
    }
  };

  // function to add point to the map
  const addPointToMap = (point) => {
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat([point.longitude, point.latitude])),
    });
    pointFeature.setId(String(point._id));
    pointFeature.setStyle(new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: 'blue' }),
        stroke: new Stroke({ color: 'white', width: 2 }),
      }),
    }));
    vectorSourceRef.current.addFeature(pointFeature);
  };

  // function to draw the trail line by connecting points
  const drawTrail = (trailPoints) => {
    // remove existing line features to prevent duplicates
    const features = vectorSourceRef.current.getFeatures();
    features.forEach(feature => {
      if (feature.getGeometry() instanceof LineString) {
        vectorSourceRef.current.removeFeature(feature);
      }
    });

    if (trailPoints.length > 1) {
      const lineCoordinates = trailPoints.map(p => fromLonLat([p.longitude, p.latitude]));
      const lineFeature = new Feature({
        geometry: new LineString(lineCoordinates),
      });
      lineFeature.setStyle(new Style({
        stroke: new Stroke({
          color: 'green',
          width: 2,
        })
      }));
      vectorSourceRef.current.addFeature(lineFeature);
    }
  };


  return (
    <div className='p-4'>
      <BackButton></BackButton>
      <h1 className='text-3xl my-4'>Edit Trail</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col'>
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
          {/*<textarea type='text' value={description} onChange={(e) => setDescription(e.target.value)} className='border-2 border-gray-500 px-4' rows="4"></textarea>*/}
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
          <label className='text-xl mr-4 text-gray-500'>Map points:</label>
          {points && points.length > 0 ? (
            <ul>
              {points.map((point, idx) => (
                <li key={point._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span>{`Point ${idx + 1}: ${point.title} (${point.longitude.toFixed(2)}, ${point.latitude.toFixed(2)})`}</span>
                  <button onClick={() => handleEditPoint(point)}><AiOutlineEdit className='text-yellow-600' /></button>
                  <button onClick={() => deletePoint(id, point._id)} style={{ marginLeft: '10px' }}>
                    <MdOutlineDelete className='text-2xl text-red-600' />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <span>No Points</span>
          )}
        </div>
        <PointModal key={modalKey} isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSavePoint} editMode={editMode} quizMode={false} pointData={editMode ? currentPoint : null}></PointModal>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Map - Click to Add Points</label>
          {/* Map container */}
          <div ref={mapRef} className='w-full h-96 border-2 border-gray-300' />
        </div>

        <button className='p-2 bg-sky-300 m-8' onClick={handleEditTrail}>
          Save
        </button>
      </div>
    </div>
  )
};

export default EditTrail;