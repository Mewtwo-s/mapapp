import Map from './Map';
import React, { useEffect, useState } from 'react';
import {DirectionsRenderer
} from 'react-google-maps';
import {connect} from 'react-redux'

const MapContainer = (props) => {

  const [markers, setMarkers] = useState([
    { position: { lat: 40.71590822862322, lng: -73.99917384606857 } },
  ]);
  const [currentPosition, setCurrentPosition] = useState();

 const getLocation = async ()=>{

  await navigator.geolocation.watchPosition(
    function (position) {
 
      const pos = {
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      };
      console.log('old markers', markers)
      markers.push(pos)
      setMarkers(markers)
      // setMarkers([...markers, pos]);
      console.log('NEW markers', markers)
      setCurrentPosition(pos.position)

    },
    function (error) {
      console.error('Error with GEOLOCATION:', error.code, error.message);
    }
  );}



  useEffect(() => {
    getLocation()
  }, []);

  return (
    <Map
      email={props.email}
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

const mapState = state => {
  return {
    email: state.auth.email
  }
}
export default connect(mapState)(MapContainer);
