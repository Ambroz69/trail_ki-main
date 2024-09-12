import React, { useEffect, useRef } from 'react';
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
import styles from '../src/css/TrailCreate.module.css';

const TrailMap = ({ points, onPointAdd, onPointEdit, onPointRemove, editable, height }) => {
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());  // Shared vector source between maps
  const mapInstanceRef = useRef(null); // To store the map instance
  const modifyInteractionRef = useRef(null); // Store modify interaction to avoid adding multiple
  const pointsRef = useRef([]); // Keep track of points with useRef

  // Update pointsRef whenever points change
  useEffect(() => {
    if (Array.isArray(points)) {
      pointsRef.current = points; // Ensure it's an array before updating
    }
  }, [points]);

  useEffect(() => {
    // Initialize the map once
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
        center: fromLonLat([0, 0]), // Default location, adjust as needed
        zoom: 2,
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
  }, [editable]);

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
      points.forEach((point) => {
        let feature = vectorSourceRef.current.getFeatureById(point.id || point._id);

        if (feature) {
          // If feature exists, update its geometry
          setTimeout(() => {
            try {
              feature.getGeometry().setCoordinates(fromLonLat([point.longitude, point.latitude]));
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
          pointFeature.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: 'blue' }),
                stroke: new Stroke({ color: 'white', width: 2 }),
              }),
            })
          );
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

    // Optionally zoom the map to fit points
    if (points.length > 0 && mapInstanceRef.current) {
      const firstPointCoords = fromLonLat([points[0].longitude, points[0].latitude]);
      mapInstanceRef.current.getView().setCenter(firstPointCoords);
      mapInstanceRef.current.getView().setZoom(14); // Adjust zoom as needed
    }

  }, [points, editable]);

  return <div ref={mapRef} style={{ height: '38rem', width: '100%'}}/>;
};

export default TrailMap;