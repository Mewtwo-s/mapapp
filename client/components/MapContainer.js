import Map from './Map';
import React, { useEffect, useState } from 'react';
import {DirectionsRenderer
} from 'react-google-maps';

const MapContainer = () => {
  // const [markers, setMarkers] = useState([
  //   { position: { lat: 40.67416, lng: -73.96585 } },
  //   { position: { lat: 40.63026, lng: -73.9636 } },
  // ]);
  [35.64568301498501, -98.18051154877574]
  const [markers, setMarkers] = useState([
    { position: { lat: 40.67416, lng: -73.9636 } },
    { position: { lat: 37.80182592881937, lng: -122.39742309755147 } },
    { position: { lat: 40.63026, lng: -73.9636 } },
    { position: { lat: 30.617206029970014, lng: -96.33420309619648 } },
  ]);
  const [currentPosition, setCurrentPosition] = useState();

 const getLocation = async ()=>{

  await navigator.geolocation.getCurrentPosition(
    function (position) {

      const pos = {
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      };
      setMarkers([...markers, pos]);
      setCurrentPosition(pos.position)

    },
    function (error) {
      console.error('Error with GEOLOCATION:', error.code, error.message);
    }
  );

}
  useEffect(() => {
    getLocation()
  }, []);



  return (
    <Map
      currentPosition={currentPosition}
      defaultCenter={{ lat: 6.4454594, lng: 3.449074 }}
      markers={markers}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`}
      loadingElement={<div className="loader" />}
      containerElement={
        <div
          className="mapContainer"
          style={{ height: '100vh', width: '100vh' }}
        />
      }
      mapElement={<div className="map" style={{ height: '100%' }} />}
    />
  );
};
export default MapContainer;
