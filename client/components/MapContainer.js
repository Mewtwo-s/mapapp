import Map from './Map';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DirectionsRenderer } from 'react-google-maps';
import { sessionStarted, joinRoom } from '../store/locationSharing';
import { Button, Container } from '../GlobalStyles';
import { watchMyLocation } from '../store/location';
import {
  getSessionThunkCreator,
  activateSessionThunkCreator,
  endSessionThunkCreator,
} from '../store/session';
import Loading from './Loading';
import { point, featureCollection } from '@turf/helpers';
import center from '@turf/center';
import axios from 'axios';
import Place from './Place';
import { arriveThunkCreator, getSessionUsersThunkCreator } from '../store/userSessions'
import EndedSession from './EndedSession';


const MapContainer = (props) => {
  // const isValidLocation = Object.keys(props.myLocation).length > 0;
  let friendsJoined;
  if (props.session.users) {
    friendsJoined = props.session.users
      .filter((user) => user.id !== props.user.id)
      .map((user) => user.firstName)
      .join(', ');
  }
  const [joined, setJoin] = useState(false);
  const [topPlaces, setTopPlaces] = useState();
  const [midPoint, setMidPoint] = useState();

  const getPlaces = async (lat, lng) => {
    try {
      if (lat && lng) {
        const places = await (
          await axios.post('/api/google', { lat: lat, lng: lng })
        ).data;
        setTopPlaces(places);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleMagic() {
    findMidpoint(props.allLocations);
  }

  function placeSelected(loc, name) {
    props.activateSession(props.session.id, loc.lat, loc.lng, name);
  }

  function userArrives() {
    props.userArrives(props.user.id, props.session.id);
  }

  const findMidpoint = async (locations) => {
    const initialLocations = locations.map((loc) => [loc.lat, loc.lng]);

    let finalLocations = [];
    if (initialLocations.length > 0) {
      for (let i = 0; i < initialLocations.length; i++) {
        finalLocations.push(
          point([initialLocations[i][0], initialLocations[i][1]])
        );
      }

      const features = featureCollection(finalLocations);

      const centerCenter = center(features);
      await setMidPoint({
        lat: centerCenter.geometry.coordinates[0],
        lng: centerCenter.geometry.coordinates[1],
      });
    }
  };

  useEffect(() => {
    props.startWatch(props.user.id);
    props.getSession(props.user.id, props.match.params.code);
  }, []);

  useEffect(() => {
    if (props.session.id && props.myLocation.lat && joined === false) {
      props.userJoinRoom(props.user.id, props.session.id, props.myLocation);
      setJoin(true);
    }
  }, [props.session.id, props.myLocation.lat]);

  useEffect(() => {
    if (props.session.id) {
      props.getSessionUsers(props.session.id);
    }
  }, [props.session]);

  useEffect(() => {
    if (midPoint) {
      getPlaces(midPoint.lat, midPoint.lng);
    }
  }, [midPoint]);

  useEffect(() => {
    if (props.session.status === "Active") {
      const allArrived= props.allUsersInSession.every(user => user.arrived === true);
      //this is just super inaccurate and not very realistic
      // const allLocationsMatch = props.allUsersInSession.every(user => user.currentLat === props.session.lat && user.currentLng === props.session.lng);
      if (allArrived === true || allLocationsMatch === true) {
        props.endSession(props.session.id);
      }
    }
   
  }, [props.allUsersInSession]);
  
  return (
    <div>
     {props.session.status === "Completed" ? <EndedSession /> :
    <div>
    {joined === false && props.session.status !== "Completed" ? <Loading message="your map"/> :
      <Container>
      <Link to='/home' className='small-link'> Back To Home </Link>
      <div style={{textAlign:'center'}}>
        <h4>Session Code: {props.session.code}</h4>
        <p>In this session:</p>
        {props.session.users ? <p> {`You, ${friendsJoined}`} </p> : 'Finding friends'}
      </div>
   
    <div style={{display: 'flex', justifyContent:'center'}}>
        {
          props.session.status === 'Pending' &&
          props.session.hostId === props.user.id && (
            <Button onClick={handleMagic}> Show Meetup Spots! </Button>
          )  
        }
          
        {props.session.status === 'Active' &&
            <Button onClick={userArrives}> I have arrived </Button>
          
          }

        {props.session.hostId === props.user.id && 
            <Button onClick={() => props.endSession(props.session.id)}>End Session</Button>}
      </div>
              <PlaceStyles>
                {props.session.status === 'Pending' && topPlaces
                  ? topPlaces.map((place) => (

                    <Place
                      handle={placeSelected}
                      key={place.place_id}
                      location={place.geometry.location}
                      name={place.name}
                      open={place.opening_hours ? place.opening_hours.open_now : null}
                      price={place.price_level}
                      rating={place.rating}
                      place={place.image}
                    />

                  ))

                  : null}
              </PlaceStyles>


      <Map
        topPlaces={topPlaces}
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
    }
    </div>
} </div>

  );
};

const mapState = (state) => {
  return {
    user: state.auth,
    session: state.sessionReducer,
    myLocation: state.myLocation,
    allLocations: state.allLocations, 
    allUsersInSession: state.userSessionsReducer

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
      dispatch(joinRoom(userId, sessionId, userLoc));
    },
    activateSession: (sessionId, lat, lng, name) => {
      dispatch(activateSessionThunkCreator(sessionId, lat, lng, name));
    },
    userArrives: (userId, sessionId) => {
      dispatch(arriveThunkCreator(userId, sessionId));
    },
    getSessionUsers: (sessionId) => {
      dispatch(getSessionUsersThunkCreator(sessionId));
    },
    endSession: (sessionId) => {
      dispatch(endSessionThunkCreator(sessionId));
    },
  };
};

const PlaceStyles = styled.div`
  max-width: 1400px;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    padding: 8px;
    display: flex;
    flex-direction: column;
    just
  }
`;


export default connect(mapState, mapDispatch)(MapContainer);
