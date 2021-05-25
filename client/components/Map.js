import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from 'react-google-maps';
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { connect } from 'react-redux';
import { Button, Container } from '../GlobalStyles';
import UserInput from './UserInput';
import { directionsFailed } from '../store/directionsFailure';
import {
  updateMyLocation,
  saveUserInputLocation,
  watchMyLocation,
} from '../store/location';

// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  withGoogleMap((props) => {
    const mapRef = useRef(null);
    const [currentLine, setCurrentLine] = useState();
    const [selectedPlace, setselectedPlace] = useState(null);
    const prevLocations = useRef();
    const [inputLoc, setInputLoc] = useState();
    const [usersForMarkers, setUsersForMarkers] = useState();

    const markerLabelStyle = {
      backgroundColor: 'black',
      color: 'white',
      fontSize: '14px',
      border: '2px solid white',
      borderRadius: '15px',
      padding: '4px',
    };

    // Fit bounds function
    const fitBounds = () => {
      console.log('FIT BOUNDS');
      const bounds = new window.google.maps.LatLngBounds();
      props.allLocations.map((item) => {
        bounds.extend({ lat: item.lat, lng: item.lng });
        return item.id;
      });
      mapRef.current.fitBounds(bounds);
    };

    useEffect(() => {
      if (
        prevLocations.current &&
        props.allLocations.length > prevLocations.current.length
      ) {
        fitBounds();
        prevLocations.current = props.allLocations;
      }
    }, [props.allLocations]);

    useEffect(() => {
      if (props.session.status === 'Active') {
        getDirections({ lat: props.session.lat, lng: props.session.lng });
      }
    }, [props.session, props.myLocation]);

    const directionsService = new google.maps.DirectionsService();

    function getDirections(loc) {
      directionsService.route(
        {
          origin: props.myLocation,
          destination: loc,
          travelMode: props.session.travelMode || 'DRIVING',
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setCurrentLine(result);
          } else {
            props.directionsFailed(true);
          }
        }
      );
    }

    const getUserName = () => {
      if (props.session.users) {
        const thisUser = props.session.users.find(
          (user) => user.id === props.user.id
        );
        if (thisUser) {
          const firstName = thisUser.firstName;
          return firstName !== '' ? firstName : 'You';
        }
      }
    };
    const userIcon = {
      url: `${props.user.photo}`, // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
    };

    const renderOthers = () => {
      // creates a list of objects with consolidated user
      // and loc data for rendering

      console.log('render otehrs BEGIN', props);
      const users = props.allUsersInSession;

      if (users) {
        users.map((user) => {
          let location;
          let currentLocationUser = props.allLocations.filter(
            (location) => location.userId === user.id
          );

          console.log('currentLocationUser ==>', currentLocationUser);

          console.log('props.allLocations==>', props.allLocations);

          if (currentLocationUser.length === 0) {
            console.log('length ===0', location);

            if (user.lat) {
              location = { lat: user.lat, lng: user.lng, userId: user.id };
            } else {
              location = { lat: 0, lng: 0, userId: user.id };
            }
          } else {
            location = {
              lat: currentLocationUser[0].session.userSession.lat,
              lng: currentLocationUser[0].session.userSession.lng,
              userId: user.id,
            };
            console.log('length !== 0', location);
          }
          console.log('render otehrs END ', location);

          // return (
          //   location.lat && (
          // <MarkerWithLabel
          //   key={`user_${user.id}`}
          //   icon={{
          //     url: `${user.photo}`, // url
          //     scaledSize: new google.maps.Size(40, 40), // scaled size
          //   }}
          //   position={{ lat: location.lat, lng: location.lng }}
          //   labelAnchor={new google.maps.Point(0, 0)}
          //   zIndex={100}
          //   labelStyle={markerLabelStyle}
          // >
          //   {/* <img src={user.photo} style={{ height: '70px', width: '70px' }} /> */}
          //   <div>{user.firstName}</div>
          // </MarkerWithLabel>
          //   )
          // );
        });
      }
    };

    // const renderOthers = () => {
    //   // creates a list of objects with consolidated user
    //   // and loc data for rendering
    // const users = props.session.users;

    // if (users && props.allLocations) {
    //   const otherUsers = users
    //     .filter((user) => user.id !== props.user.id)
    //     .reduce((modifiedUsers, user) => {
    //       // find user location
    //       const loc = props.allLocations.find(
    //         (loc) => loc.userId === user.id
    //       );
    //       if (loc) {
    //         modifiedUsers.push({ ...user, lat: loc.lat, lng: loc.lng });
    //       }
    //       return modifiedUsers;
    //     }, []);

    //     // Create the marker to render

    //     return otherUsers.map((user) => (
    //       <MarkerWithLabel
    //         key={`user_${user.id}`}
    //         //icon={user.photo}
    //         icon={{
    //           url: `${user.photo}`, // url
    //           scaledSize: new google.maps.Size(40, 40), // scaled size
    //         }}
    //         position={{ lat: user.lat, lng: user.lng }}
    //         labelAnchor={new google.maps.Point(0, 0)}
    //         zIndex={100}
    //         labelStyle={markerLabelStyle}
    //       >
    //         {/* <img src={user.photo} style={{ height: '70px', width: '70px' }} /> */}
    //         <div>{user.firstName}</div>
    //       </MarkerWithLabel>
    //     ));
    //   }
    // };

    const myLocationIsValid = props.myLocation.lat;
    const sessionIsValid =
      Object.keys(props.session).length > 0 && props.session.lat;
    const defCenter = myLocationIsValid
      ? { lat: props.myLocation.lat, lng: props.myLocation.lng }
      : { lat: 38.42595092237637, lng: -98.93746523313702 };

    function inputHandle(address) {
      console.log('in handle', address);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, function (results, status) {
        if (status == 'OK') {
          let lat = results[0].geometry.location.lat();
          let lng = results[0].geometry.location.lng();

          console.log(
            'should trigger update input thunk',
            props.user.id,
            lat,
            lng
          );
          props.updateLocation(lat, lng);
          props.saveInputLocation(props.user.id, lat, lng);
        } else {
          alert(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      });
    }

    useEffect(() => {
      let users = props.allUsersInSession.filter(
        (user) => user.id !== props.user.id
      );
      let updatedUsers = [];
      if (users) {
        let mapUsers = users.forEach((user) => {
          let location;
          let currentLocationUser = props.allLocations.filter(
            (location) => location.userId === user.id
          );

          if (currentLocationUser.length === 0) {
            if (user.sessions[0].userSession.currentLat) {
              location = {
                firstName: user.firstName,
                photo: user.photo,
                lat: user.sessions[0].userSession.currentLat,
                lng: user.sessions[0].userSession.currentLng,
                userId: user.id,
              };
            } else {
              location = {
                firstName: user.firstName,
                photo: user.photo,
                lat: 0,
                lng: 0,
                userId: user.id,
              };
            }
          } else {
            location = {
              firstName: user.firstName,
              photo: user.photo,
              lat: currentLocationUser[0].lat,
              lng: currentLocationUser[0].lng,
              userId: user.id,
            };
            console.log('length !== 0', location);
          }
          updatedUsers.push(location);
        });

        setUsersForMarkers(updatedUsers);
      }
    }, [props.allUsersInSession, props.allLocations]);

    // useEffect(()=>{

    // },[props.allUsersInSession, props.allLocations])

    console.log('PROPS - TRAVEL', props.session.travelMode);
    return (
      <Container>
        {props.myLocation.address ? <UserInput handle={inputHandle} /> : ''}
        {myLocationIsValid && (
          <GoogleMap
            ref={mapRef}
            defaultZoom={5}
            defaultCenter={defCenter}
            options={{
              disableDefaultUI: false,
              controlSize: 25,
              gestureHandling: 'greedy',
            }}
          >
            {sessionIsValid && (
              <Marker
                icon="https://maps.google.com/mapfiles/ms/icons/pink-dot.png"
                position={{ lat: props.session.lat, lng: props.session.lng }}
              />
            )}

            {/* Draw markers for top places */}

            {props.session.status === 'Pending' &&
              (props.topPlaces || []).map((place, index) => {
                return (
                  <Marker
                    icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    key={`top-places-marker_${index}`}
                    position={place.geometry.location}
                    onClick={() => {
                      setselectedPlace(place);
                    }}
                  >
                    {selectedPlace === place && (
                      <InfoWindow
                        onCloseClick={() => {
                          setselectedPlace(null);
                        }}
                        position={selectedPlace.geometry.location}
                      >
                        <div>
                          <h3>{selectedPlace.name}</h3>
                          <p>{selectedPlace.vicinity}</p>
                          <p>
                            {selectedPlace.opening_hours.open_now
                              ? 'Open Now'
                              : 'Closed Now'}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                  ///>
                );
              })}

            {props.myLocation.lat && (
              <DirectionsRenderer directions={currentLine} />
            )}

            {/* Draw labeled marker for each other person in the session */}
            {/* {renderOthers()} */}
            {}
            {usersForMarkers &&
              usersForMarkers.map((user) => (
                <MarkerWithLabel
                  key={`user_${user.userId}`}
                  icon={{
                    url: `${user.photo}`,
                    scaledSize: new google.maps.Size(40, 40), // scaled size
                  }}
                  position={new google.maps.LatLng(user.lat, user.lng)}
                  labelAnchor={new google.maps.Point(0, 0)}
                  zIndex={100}
                  labelStyle={markerLabelStyle}
                >
                  {/* <img src={user.photo} style={{ height: '70px', width: '70px' }} /> */}
                  <div>{user.firstName}</div>
                </MarkerWithLabel>
              ))}

            {/* Draw the current user's marker */}

            {props.myLocation.lat && (
              <MarkerWithLabel
                key={props.user.id}
                icon={{
                  url: `${props.user.photo}`, // url
                  scaledSize: new google.maps.Size(40, 40), // scaled size
                }}
                position={props.myLocation ? props.myLocation : savedLocation}
                labelAnchor={new google.maps.Point(0, 0)}
                zIndex={100}
                labelStyle={markerLabelStyle}
              >
                <div>{'Me'}</div>
              </MarkerWithLabel>
            )}
          </GoogleMap>
        )}
      </Container>
    );
  })
);

const mapState = (state) => {
  return {
    user: state.auth,
    allLocations: state.allLocations,
    myLocation: state.myLocation,
    isLoggedIn: !!state.auth.id,
    session: state.sessionReducer,
    allUsersInSession: state.userSessionsReducer,
    savedLocation: {
      lat: state.sessionReducer.currentLat,
      lng: state.sessionReducer.currentLng,
    },
  };
};

const mapDispatch = (dispatch) => {
  return {
    updateLocation: (lat, lng) => {
      dispatch(updateMyLocation(lat, lng));
    },
    saveInputLocation: (userId, lat, lng) => {
      dispatch(saveUserInputLocation(userId, lat, lng));
    },
    directionsFailed: (value) => dispatch(directionsFailed(value)),
    startWatch: (userId, sessionId) => {
      dispatch(watchMyLocation(userId, sessionId));
    },
  };
};

export default connect(mapState, mapDispatch)(Map);
