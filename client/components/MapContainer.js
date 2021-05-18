import Map from './Map';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DirectionsRenderer } from 'react-google-maps';
import { sessionStarted } from '../store/locationSharing';

const MapContainer = (props) => {
  console.log('MAP CONTAINER', props);
  const [markers, setMarkers] = useState([]);
  const [currentPosition, setCurrentPosition] = useState();

  const getLocation = async () => {
    await navigator.geolocation.watchPosition(
      function (position) {
        const pos = {
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        console.log('old markers', markers);
        markers.push(pos);
        setMarkers(markers);
        // setMarkers([...markers, pos]);
        console.log('NEW markers', markers);
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
  // useEffect(() => {
  //   const sessionId = 88; // temp until we can pull from state
  //   if (props.user.id) {
  //     props.sessionStarted(props.user.id, sessionId);
  //   }
  // }, [props.user]);

  return (
    <Map
      history={props.history}
      match={props.match}
      email={props.email}
      currentPosition={currentPosition}
      defaultCenter={currentPosition}
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
  };
};
export default connect(mapState, mapDispatch)(MapContainer);
