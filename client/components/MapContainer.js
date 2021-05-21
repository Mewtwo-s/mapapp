import Map from './Map';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DirectionsRenderer } from 'react-google-maps';
import { sessionStarted, joinRoom } from '../store/locationSharing';
import { Button, Container } from '../GlobalStyles';
import {watchMyLocation} from '../store/location'
import {getSessionThunkCreator} from '../store/session';
import Loading from './Loading';

const MapContainer = (props) => {
  // const isValidLocation = Object.keys(props.myLocation).length > 0;
  const [joined, setJoin] = useState(false)

  useEffect(() => {
    props.startWatch(props.user.id);
    props.getSession(props.user.id, props.match.params.code);
  }, []);

  useEffect(() => {
    if(props.session.id && props.myLocation.lat && joined === false){
        props.userJoinRoom(props.user.id,  props.session.id, props.myLocation)
        setJoin(true)
    }
  }, [props.session.id, props.myLocation.lat]);
  
  return (
    <div>
    {joined === false ? <Loading message="your map"/> : 
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
} </div>
  );
};

const mapState = (state) => {
  return {
    user: state.auth,
    session: state.sessionReducer,
    myLocation: state.myLocation,
  };
};

const mapDispatch = (dispatch) => {
  return {
    startWatch: (userId) => {
      dispatch(watchMyLocation(userId));
    },
    getSession: (userId, sessionCode) => {
      dispatch(getSessionThunkCreator(userId, sessionCode));
    },
    userJoinRoom: (userId, sessionId, userLoc) => {
      dispatch(joinRoom(userId, sessionId, userLoc))
    }
  };
};


export default connect(mapState, mapDispatch)(MapContainer);
