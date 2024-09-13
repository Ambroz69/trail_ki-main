import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PointModal from '../../components/PointModal';
import Navbar from '../Navbar';
import styles from '../css/TrailCreate.module.css';

import SliderComponent from '../../components/quiztypes/SliderComponent'
import ShortAnswerComponent from '../../components/quiztypes/ShortAnswerComponent';
import TrueFalseComponent from '../../components/quiztypes/TrueFalseComponent';
import ChoiceComponent from '../../components/quiztypes/ChoiceComponent';
import PairsComponent from '../../components/quiztypes/PairsComponent';
import OrderComponent from '../../components/quiztypes/OrderComponent';
import TrailMap from '../../components/TrailMap';

// openlayers components
/*import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import LineString from 'ol/geom/LineString';
import Overlay from 'ol/Overlay';*/
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const ShowTrail = () => {
    const [trail, setTrail] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0); // re-rendering the modal
    const [currentPoint, setCurrentPoint] = useState(null);

    useEffect(() => {
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
                setTrail(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    const handleChangeAnswer = (index, field, value) => {
        const updatedAnswers = answers.map((answer, i) => {
          if (i === index) {
            if (quizType === 'true-false') { // transform the true/false into the text as there will be the correct answer
              answers[0].text = String(!answers[0].isCorrect);
            }
            //console.log("isCorrect? <" + answers[0].isCorrect + ">");
            return { ...answer, [field]: value };
          }
          //console.log("i !== index..." + answer);
          return answer;
        });
        //setAnswers(updatedAnswers);
        // Store the updated answers to preserve them when switching types
        //setPreviousAnswers((prev) => ({ ...prev, [quizType]: updatedAnswers }));
      };

    // map initializacion
    /*useEffect(() => {
        if (trail && trail.points && trail.points.length > 0) {
            // style of POI
            const defaultPointStyle = new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({ color: 'blue' }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2,
                    }),
                }),
            });
            // converts points to OpenLayer features
            const pointFeatures = trail.points.map(point => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat([point.longitude, point.latitude])),
                    title: point.title,
                    point: point,
                });
                feature.setStyle(new Style({
                    image: new Icon({
                        src: 'https://openlayers.org/en/v10.0.0/examples/data/icon.png',
                        scale: 1,
                    }),
                }));
                return feature;
            });

            // create line from points
            const lineCoordinates = trail.points.map(point => fromLonLat([point.longitude, point.latitude]));
            const lineFeature = new Feature({
                geometry: new LineString(lineCoordinates),
            });

            // creater vector source and layer
            const vectorSource = new VectorSource({
                features: [...pointFeatures, lineFeature],
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });

            // mapping
            const map = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(), // openstreetmap base
                    }),
                    vectorLayer,
                ],
                view: new View({
                    center: fromLonLat([trail.points[0].longitude, trail.points[0].latitude]),  // centers map on the first point
                    zoom: 14,
                }),
            });

            // popup for info on POI
            /*const popupOverlay = new Overlay({
                element: popupRef.current,
                positioning: 'bottom-center',
                stopEvent: false,
            });
            map.addOverlay(popupOverlay);

            // click event to highlight POI
            map.on('click', function (evt) {
                const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });
                if (feature && feature.getGeometry() instanceof Point) {
                    const pointData = feature.get('point');
                    if (pointData) {
                        setCurrentPoint(pointData); // Set the point data first
                        setModalOpen(true); // Then open the modal
                    }
                    feature.setStyle(new Style({
                        image: new CircleStyle({
                            radius: 8,
                            fill: new Fill({ color: 'red' }),
                            stroke: new Stroke({ color: 'white', width: 2 }),
                        }),
                    }));
                    //const coordinates = feature.getGeometry().getCoordinates();
                    //popupOverlay.setPosition(coordinates);
                    //const title = feature.get('title');
                    //popupRef.current.innerHTML = `<div class='bg-white p-2 rounded shadow-md'>${title}</div>`;
                }
            });
        }
    }, [trail]);*/

    return (
        <div className={`${styles.new_trail_container} ${styles.new_trail_bg} d-flex container-fluid mx-0 px-0`}>
            <div className='col-3 pe-4'>
                <Navbar />
            </div>
            <div className='p-4'>
                {trail ? (
                    <div className='flex flex-col p-4'>
                        <div className='my-4'>
                            <img src={trail.thumbnail} alt='Picture' style={{ width: '300px', height: 'auto' }}></img>
                            <h1 className='text-3xl'>{trail.name}</h1>
                        </div>
                        <div className='my-4'>
                            <div dangerouslySetInnerHTML={{ __html: trail.description }} />
                        </div>
                        <div className='my-4'>
                            <h4>Trail Contest:</h4>
                            <span className='text-l text-gray-500 mr-4'>Trail Type: </span><span>{trail.season}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Locality: </span><span>{trail.locality}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Total Quizes: </span><span>XY</span><br />
                            <span className='text-l text-gray-500 mr-4'>Total Points of Interest: </span><span>{trail.points.length}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Estimated time: </span><span>{trail.estimatedTime} min</span><br />
                            <span className='text-l text-gray-500 mr-4'>Trail Length: </span><span>{trail.length.toFixed(2)} km</span><br />
                            <span className='text-l text-gray-500 mr-4'>Trail Difficulty: </span><span>{trail.difficulty}</span><br />
                            <span className='text-l text-gray-500 mr-4'>Language: </span><span>{trail.language}</span>
                        </div>
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Points of Interest ({trail.points.length})</span>
                            <span>
                                {trail.points && trail.points.length > 0 ? (
                                    <ul>
                                        {trail.points.map((point, idx) => (
                                            <li key={point._id}>
                                                <div>{point.title}</div>
                                                <label className={`${styles.form_label} form-label mb-1`}>Question</label>
                                                <div>{point.quiz?.question}</div>
                                                {(() => {
                                                    switch (point.quiz?.type) {
                                                        case 'short-answer':
                                                            return (
                                                                <ShortAnswerComponent
                                                                    value=''
                                                                    onChange={(newValue) => handleChangeAnswer(0, 'text', newValue)}
                                                                />
                                                            );
                                                        case 'single':
                                                        case 'multiple':
                                                            return (
                                                                <>
                                                                    <ChoiceComponent
                                                                        quizType={point.quiz?.type}
                                                                        answers={point.quiz?.answers}
                                                                        handleChangeAnswer={handleChangeAnswer}
                                                                    />
                                                                </>
                                                            );
                                                        case 'slider':
                                                            return (
                                                                <SliderComponent
                                                                    correctValue={0}
                                                                    minValue={point.quiz?.minValue}
                                                                    maxValue={point.quiz?.maxValue}
                                                                    setCorrectValue={correctValue => setSliderCorrectValue(correctValue)}
                                                                />
                                                            );
                                                        case 'pairs':
                                                            return (
                                                                <>
                                                                    <PairsComponent
                                                                        answers={point.quiz?.answers}
                                                                        quizMode={true}
                                                                        handleChangeAnswer={handleChangeAnswer}
                                                                    />
                                                                </>
                                                            );
                                                        case 'order':
                                                            return (
                                                                <>
                                                                    <OrderComponent
                                                                        answers={point.quiz?.answers}
                                                                        quizMode={true}
                                                                        handleChangeAnswer={handleChangeAnswer}
                                                                    />
                                                                </>
                                                            );
                                                        case 'true-false':
                                                            return (
                                                                <TrueFalseComponent
                                                                    value={false}
                                                                    answer={false}
                                                                    handleChangeAnswer={handleChangeAnswer}
                                                                />
                                                            );
                                                        default:
                                                            return null;
                                                    }
                                                })()}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>No Points</span>
                                )}
                            </span>
                        </div>
                        <TrailMap
                            points={trail.points}
                            height='35rem'
                            editable={false}
                        />
                    </div>
                ) : (
                    <div>No Trail Data Available</div>
                )}
            </div>
        </div>
    )
};

export default ShowTrail;