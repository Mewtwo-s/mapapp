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
  let friendsJoined
  if (props.session.users ){
    friendsJoined = props.session.users.filter(user => user.id !== props.user.id).map(user => user.firstName).join(', ')
  }
  return (
    <Container>
      <Link to='/home'> Back To Home </Link>
      <div style={{textAlign:'center'}}>
        <h4>Session Code: {props.session.code}</h4>
        <p>In this session:</p>
        {props.session.users ? <p> {`You, ${friendsJoined}`} </p> : 'Finding friends'}
      </div>
      
  
      <Map
        history={props.history}
        match={props.match}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`}
        loadingElement={<div className="loader" />}
        containerElement={
          <div
            className="mapContainer"
            style={{ height: '70vh', width: '100%' }}
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

const MapSize = styled.div`
  height: 65vh, width: 100%
`
export default connect(mapState)(MapContainer);
