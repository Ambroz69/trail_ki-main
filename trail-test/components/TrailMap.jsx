import React, { useEffect, useRef, useState } from 'react';
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
import { Style, Stroke, Fill, Circle as CircleStyle, Text as TextStyle } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Modify } from 'ol/interaction';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const TrailMap = ({ points, onPointAdd, onPointEdit, onPointRemove, editable, height, useGPS, onProximityTask = () => { } }) => {
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());  // Shared vector source between maps
  const mapInstanceRef = useRef(null); // To store the map instance
  const modifyInteractionRef = useRef(null); // Store modify interaction to avoid adding multiple
  const pointsRef = useRef([]); // Keep track of points with useRef
  const positionSourceRef = useRef(new VectorSource()); // source for position marker
  const [userLocation, setUserLocation] = useState(null);

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * Math.PI / 180;
    const R = 6371e3; // Radius of Earth in meters
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  }

  // Country Coordinates Mapping
  const countryCoordinates = {
    "Slovakia": [19.699, 48.669],
    "Czech Republic": [15.473, 49.817],
    "Spain": [-3.749, 40.463],
    "Other": [0, 0] // Default for unknown country
  };

  const getUserCountryFromToken = (token) => {
    try {
      const [header, payload, signature] = token.split('.');
      if (!header || !payload || !signature) {
        throw new Error('Invalid token structure');
      }

      const tokenPayload = JSON.parse(atob(payload));
      return tokenPayload?.userCountry || null; // Return the userID if available
    } catch (error) {
      console.error('Error decoding token:', error);
      return null; // Return null if the token is invalid or userID is not present
    }
  };

  // Update pointsRef whenever points change
  useEffect(() => {
    if (Array.isArray(points)) {
      pointsRef.current = points; // Ensure it's an array before updating
    }
  }, [points]);

  useEffect(() => {
    const userCountry = getUserCountryFromToken(token);

    // Get user geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]); // Store user location
        },
        () => {
          console.warn("User denied Geolocation. Using country-based location.");
          setUserLocation(countryCoordinates[userCountry] || countryCoordinates["Other"]);
        }
      );
    } else {
      console.warn("Geolocation is not supported. Using country-based location.");
      setUserLocation(countryCoordinates[userCountry] || countryCoordinates["Other"]);
    }
  }, []);

  useEffect(() => {
    // Initialize the map once
    if (!mapRef.current) return;

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    });

    const positionLayer = new VectorLayer({
      source: positionSourceRef.current,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
        positionLayer,
      ],
      view: new View({
        center: fromLonLat(userLocation||[0,0]), // Location based on GPS or Country in profile
        zoom: 12,
      }),
    });

    mapInstanceRef.current = map;

    // Add click event for adding new points, only if map is editable
    if (editable) {
      map.on('click', function (evt) {
        const coordinates = evt.coordinate;
        const lonLat = toLonLat(coordinates);
        onPointAdd({ longitude: lonLat[0], latitude: lonLat[1], id: Date.now() });
      });
    }

    // Cleanup map on component unmount
    return () => {
      map.setTarget(null);
    };
  }, [userLocation, editable]);

  // Update map points when points change
  useEffect(() => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.clear();

    // Only add Modify interaction if map is editable
    if (editable && !modifyInteractionRef.current) {
      const modify = new Modify({ source: vectorSourceRef.current });
      mapInstanceRef.current.addInteraction(modify);

      modify.on('modifyend', (evt) => {
        evt.features.forEach(feature => {
          const newCoords = toLonLat(feature.getGeometry().getCoordinates());
          const featureId = feature.getId();

          if (newCoords && featureId) {
            const pointToUpdate = pointsRef.current.find(point => point.id === featureId || point._id === featureId);
            console.log(pointToUpdate);
            if (pointToUpdate) {
              //setTimeout(() => {
              if (newCoords[0] && newCoords[1]) {
                try {
                  feature.getGeometry().setCoordinates(fromLonLat([newCoords[0], newCoords[1]]));
                  onPointEdit(pointToUpdate._id || pointToUpdate.id, { longitude: newCoords[0], latitude: newCoords[1] }, pointsRef.current);
                } catch (error) {
                  console.error('Failed to set coordinates:', error);
                }
              } else {
                console.error('Invalid coordinates after modification:', newCoords);
              }
              //}, 100); // Adjust this delay as necessary (e.g., 100ms)
            } else {
              console.error('Failed to move');
            }
          }
        });
      });

      modifyInteractionRef.current = modify;
    }

    // Function to update or add individual points without clearing the whole source
    const updateMapPoints = (points) => {
      points?.forEach((point) => {
        let feature = vectorSourceRef.current.getFeatureById(point.id || point._id);

        const pointStyle = new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'white', width: 2 }),
          }),
          text: !editable ? new TextStyle({
            text: point.title, // Display point title when not editable
            offsetY: -15, // Adjust text position above the point
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'white', width: 2 }),
          }) : null,
        });

        if (feature) {
          // If feature exists, update its geometry
          setTimeout(() => {
            try {
              feature.getGeometry().setCoordinates(fromLonLat([point.longitude, point.latitude]));
              feature.setStyle(pointStyle);
            } catch (error) {
              console.error('Error while updating feature coordinates:', error);
            }
          }, 100);
        } else {
          // Otherwise, create a new feature and add it to the vector source
          const pointFeature = new Feature({
            geometry: new Point(fromLonLat([point.longitude, point.latitude])),
            id: point._id || point.id,
          });
          pointFeature.setStyle(pointStyle);
          pointFeature.setId(point._id || point.id); // Assign ID to the feature
          setTimeout(() => {
            vectorSourceRef.current.addFeature(pointFeature);
          }, 100);
        }
      });
    };

    // Update map points when points change
    updateMapPoints(points);

    // Draw lines between points if there are multiple
    if (points?.length > 1) {
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

    // Optionally zoom the map to fit points
    if (points?.length > 0 && mapInstanceRef.current) {
      const firstPointCoords = fromLonLat([points[0].longitude, points[0].latitude]);
      if (useGPS) { // center map on the user location
        if (!navigator.geolocation) {
          console.log('Geolocation is not supported by your browser.');
          return;
        }

        navigator.geolocation.watchPosition( // real-time GPS, if you want only position once, use getCurrentPosition
          (position) => {
            const { latitude, longitude } = position.coords;
            // update the position marker
            const positionFeature = new Feature({
              geometry: new Point(fromLonLat([longitude, latitude])),
            });
            positionFeature.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 8,
                  fill: new Fill({ color: 'red' }),
                  stroke: new Stroke({ color: 'white', width: 2 }),
                }),
              })
            );
            // clear previous marker and add new one
            positionSourceRef.current.clear();
            positionSourceRef.current.addFeature(positionFeature);
            // check proximity to points
            points.forEach((point) => {
              const distance = haversineDistance(latitude, longitude, point.latitude, point.longitude);
              if (distance <= 10) { // proximity radius in meters
                onProximityTask(point); // trigger showing the task
              }
            });
            // center and zoom map to position
            const view = mapInstanceRef.current.getView();
            view.setCenter(fromLonLat([longitude, latitude]));
            view.setZoom(16);
          },
          (error) => {
            //console.error('Geolocation error:', error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        mapInstanceRef.current.getView().setCenter(firstPointCoords);
        mapInstanceRef.current.getView().setZoom(16); // Adjust zoom as needed
      }
    }

  }, [points, editable, onProximityTask]);

  return <div ref={mapRef} style={{ height: height, width: '100%' }} />;
};

export default TrailMap;