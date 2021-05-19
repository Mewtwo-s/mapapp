import Map from './Map';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DirectionsRenderer } from 'react-google-maps';
import { sessionStarted } from '../store/locationSharing';

const MapContainer = (props) => {
  return (
    <>
      <h4>Session Code: {props.session.code}</h4>
      <Map
        history={props.history}
        match={props.match}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`}
        loadingElement={<div className="loader" />}
        containerElement={
          <div
            className="mapContainer"
            style={{ height: '100vh', width: '100%' }}
          />
        }
        mapElement={<div className="map" style={{ height: '100%' }} />}
      />
    </>
  );
};

const mapState = (state) => {
  return {
    user: state.auth,
    session: state.sessionReducer
  };
};
const mapDispatch = (dispatch) => {
  return {
    sessionStarted: (userId, sessionId) =>
      dispatch(sessionStarted(userId, sessionId)),
  };
};
export default connect(mapState, mapDispatch)(MapContainer);