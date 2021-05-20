import Map from './Map';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DirectionsRenderer } from 'react-google-maps';
import { sessionStarted } from '../store/locationSharing';

const MapContainer = (props) => {
  // const isValidLocation = Object.keys(props.myLocation).length > 0;

  return (
    <Map
      history={props.history}
      match={props.match}
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
    myLocation: state.myLocation,
  };
};
// const mapDispatch = (dispatch) => {
//   return {
//     sessionStarted: (userId, sessionId) =>
//       dispatch(sessionStarted(userId, sessionId)),
//   };
// };
export default connect(mapState)(MapContainer);
