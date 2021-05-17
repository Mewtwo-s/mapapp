import Map from './Map';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DirectionsRenderer } from 'react-google-maps';
import { updateMyPosition } from '../store/location';
import { sessionStarted } from '../store/room';

const MapContainer = (props) => {
  const [markers, setMarkers] = useState([
    { position: { lat: 40.71590822862322, lng: -73.99917384606857 } },
  ]);
  const [currentPosition, setCurrentPosition] = useState();

  const getLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      function (position) {
        const pos = {
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        setMarkers([...markers, pos]);
        setCurrentPosition(pos.position);
      },
      function (error) {
        console.error('Error with GEOLOCATION:', error.code, error.message);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // TEMP: simulate starting or accepting a session
  // This will trigger the room join and location watching
  // wait until we have valid user data to start watching
  useEffect(() => {
    const sessionId = 88; // temp until we can pull from state
    if (props.user.id) {
      props.sessionStarted(props.user.id, sessionId);
      // const id = navigator.geolocation.watchPosition(watchSuccess, watchFail);
    }
  }, [props.user]);

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

const mapState = (state) => {
  return {
    user: state.auth,
  };
};
const mapDispatch = (dispatch) => {
  return {
    sessionStarted: (userId, sessionId) =>
      dispatch(sessionStarted(userId, sessionId)),
    updateMyPosition: (lat, lng) => dispatch(updateMyPosition(lat, lng)),
  };
};
export default connect(mapState, mapDispatch)(MapContainer);
