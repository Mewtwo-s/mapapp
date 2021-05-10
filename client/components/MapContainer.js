import Map from './Map';
import React, { useEffect, useState } from 'react';

const MapContainer = () => {
  console.log('MapContainer');
  const [markers, setMarkers] = useState([
    { position: { lat: 40.67416, lng: -73.96585 } },
    { position: { lat: 40.63026, lng: -73.9636 } },
    { position: { lat: 55.5751451, lng: 36.2744976 } },
  ]);

  useEffect(() => {
    console.log('MapContainer.useEffect');
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log('position', position);
        const pos = {
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        setMarkers([...markers, pos]);
        console.log('markers in container', markers);
      },
      function (error) {
        console.error('Error with GEOLOCATION:', error.code, error.message);
      }
    );
  }, []);

  return (
    <Map
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
