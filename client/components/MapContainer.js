import Map from './Map';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DirectionsRenderer } from 'react-google-maps';
import { sessionStarted } from '../store/locationSharing';
import { Button, Container } from '../GlobalStyles';

const MapContainer = (props) => {
  // const isValidLocation = Object.keys(props.myLocation).length > 0;
  return (
    <Container>
      <Link to='/home'> Back To Home </Link>
      <h4>Session Code: {props.session.code}</h4>
      <p>Friends in this session:</p>
        {props.session.users && props.session.users.map(user => {
          return (
            <p key={`user_${user.id}`}>{user.firstName}</p>
          )
        })}
  
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
    </Container>
  );
};

const mapState = (state) => {
  return {
    user: state.auth,
    session: state.sessionReducer,
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
