import Map from "./Map";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { DirectionsRenderer } from "react-google-maps";
import { joinRoom, leaveRoom } from "../store/locationSharing";
import { Button, Container } from "../GlobalStyles";
import { watchMyLocation, stopWatchingMyLocation } from "../store/location";
import {
  getSessionThunkCreator,
  activateSessionThunkCreator,
  endSessionThunkCreator,
} from "../store/session";
import Loading from "./Loading";
import { point, featureCollection } from "@turf/helpers";
import center from "@turf/center";
import axios from "axios";
import Place from "./Place";
import {
  arriveThunkCreator,
  getSessionUsersThunkCreator,
} from "../store/userSessions";
import EndedSession from "./EndedSession";
import DirectionsFailure from "./DirectionsFailure";

const MapContainer = (props) => {
  // const isValidLocation = Object.keys(props.myLocation).length > 0;
  let friendsJoined;
  if (props.allUsersInSession && props.allUsersInSession.length>1) {
    friendsJoined = props.allUsersInSession
      .filter((user) => user.id !== props.user.id)
      .map((user) => {
        if (user.firstName === "Temp_account") {
          return user.email + " (pending)"
        } else {
          return user.firstName
        }
        
      })
      .join(", ");
      // if (friendsJoined.length === 0) {
      //   if (props.allUsersInSession.length === 2) {
      //   friendsJoined = `${props.allUsersInSession.length -1} friend pending`} 
      //   else {
      //     friendsJoined = `${props.allUsersInSession.length -1} friends pending`}
      //   }
     
  } else {
    friendsJoined ='Just you!';
  }
  const [joined, setJoin] = useState(false);
  const [topPlaces, setTopPlaces] = useState();
  const [midPoint, setMidPoint] = useState();
  const [arrived, setArrived] = useState(false);

  const getPlaces = async (lat, lng) => {
    try {
      if (lat && lng) {
        const places = await (
          await axios.post("/api/google", { lat: lat, lng: lng })
        ).data;
        setTopPlaces(places);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleMagic() {
    console.log('handling magic')
    findMidpoint(props.allLocations);
  }

  function placeSelected(loc, name) {
    props.activateSession(props.session.id, loc.lat, loc.lng, name);
  }

  function userArrives() {
    props.userArrives(props.user.id, props.session.id);
    setArrived(true);
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
    props.getSession(props.user.id, props.match.params.code);
  }, []);

  // this effect occurs on unmounting only
  // useEffect(() => {
  //   return () => {
  //     props.leaveRoom(props.user.id, props.session.id);
  //     props.stopWatchingMyLocation();
  //   };
  // }, [props.session.id]);

  useEffect(() => {
    if (props.session.id && props.myLocation.lat && joined === false) {
      props.userJoinRoom(props.user.id, props.session.id, props.myLocation);
      setJoin(true);
    }
  }, [props.session.id, props.myLocation.lat]);

  useEffect(() => {
    props.startWatch(props.user.id, props.session.id);
    if (props.session.id) {
      props.getSessionUsers(props.session.id);
    }
  }, [props.session.id ]);

  useEffect(() => {
    if (midPoint) {
      getPlaces(midPoint.lat, midPoint.lng);
    }
  }, [midPoint]);

  useEffect(() => {
    if (props.session.status === "Active") {
      const acceptedUsers = props.allUsersInSession.filter(
        (user) => user.sessions[0].userSession.accepted === true
      );
      const allArrived = acceptedUsers.every(
        (user) => user.sessions[0].userSession.arrived === true
      );
      //this is just super inaccurate and not very realistic
      // const allLocationsMatch = props.allUsersInSession.every(user => user.currentLat === props.session.lat && user.currentLng === props.session.lng);
      if (allArrived === true) {
        props.endSession(props.session.id);
      }
    }
  }, [props.allUsersInSession]);
  return (
    <div>
      {props.directionsFailed === true && <DirectionsFailure />}
      {props.session.status === "Completed" ? (
        <EndedSession />
      ) : (
        <div>
          {joined === false && props.session.status !== "Completed" ? (
            <Loading message="your map" />
          ) : (
            <Container>
              <div style={{ textAlign: "center" }}>
                <h4>Event Code: {props.session.code}</h4>
                <p>Friends in this event:</p>
                {props.session.users && 
                  <p> {`${friendsJoined}`} </p>
                }
              </div>
              {arrived === true && <p>You have arrived!</p> }
              <div style={{ display: "flex", justifyContent: "center" }}>
                {props.session.status === "Pending" &&
                  props.session.hostId === props.user.id && (
                    <Button onClick={handleMagic}>Select Your Meetup Spot</Button>
                  )}
                
                {props.session.status === "Active" && (
                  <Button onClick={userArrives}> I have arrived </Button>
                )}
                {props.session.hostId === props.user.id && (
                  <Button onClick={() => props.endSession(props.session.id)}>
                    End Event
                  </Button>
                )}
                
              </div>
              {props.session.status === "Active" && (
                  <p>Click on the flags to open directions in Google Maps</p>
                )}
              <PlaceStyles>
                {props.session.status === "Pending" && topPlaces
                  ? topPlaces.map((place) => (
                      <Place
                        handle={placeSelected}
                        key={place.place_id}
                        location={place.geometry.location}
                        name={place.name}
                        open={
                          place.opening_hours
                            ? place.opening_hours.open_now
                            : null
                        }
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
                    style={{ height: "70vh", width: "100%" }}
                  />
                }
                mapElement={<div className="map" style={{ height: "100%" }} />}
              />
            </Container>
          )}
        </div>
      )}
      ;{" "}
    </div>
  );
};

const mapState = (state) => {
  return {
    user: state.auth,
    session: state.sessionReducer,
    myLocation: state.myLocation,
    allLocations: state.allLocations,
    allUsersInSession: state.userSessionsReducer,
    directionsFailed: state.directionsFailedReducer,
  };
};

const mapDispatch = (dispatch) => {
  return {
    startWatch: (userId, sessionId) => {
      dispatch(watchMyLocation(userId, sessionId));
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
    stopWatchingMyLocation: () => {
      dispatch(stopWatchingMyLocation());
    },
    leaveRoom: (userId, sessionId) => {
      dispatch(leaveRoom(userId, sessionId));
    },
  };
};

const PlaceStyles = styled.div`
  // max-width: 900px;
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto;
  // -webkit-justify-content: space-around;
  justify-content: center;

  @media screen and (max-width: 600px) {
    padding: 8px;
    // display: flex;
    // flex-direction: column;
  }
`;

export default connect(mapState, mapDispatch)(MapContainer);
