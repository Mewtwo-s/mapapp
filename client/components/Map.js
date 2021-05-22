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

// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  withGoogleMap((props) => {
    const mapRef = useRef(null);
    const [currentLine, setCurrentLine] = useState();
    const [selectedPlace, setselectedPlace] = useState(null);

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
      const bounds = new window.google.maps.LatLngBounds();
      props.allLocations.map((item) => {
        bounds.extend({ lat: item.lat, lng: item.lng });
        return item.id;
      });
      mapRef.current.fitBounds(bounds);
    };

    // Fit bounds on mount, and when the markers change
    useEffect(() => {
      if (props.allLocations.length > 1) {
        fitBounds();
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
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setCurrentLine(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }

    // TEMP useEffect just for easy to read feedback.
    useEffect(() => {
      console.log('THIS USER:', props.user.id, props.user.firstName);
      console.log('USERS in SESSION:');
      if (props.session.users) {
        props.session.users.forEach((u) => console.log(u.id, u.firstName));
      }
    }, [props.session]);

    const getUserName = () => {
      if (props.session.users) {
        const firstName = props.session.users.find(
          (user) => user.id === props.user.id
        ).firstName;

        return firstName !== '' ? firstName : 'You';
      }
    };

    const renderUser = () => {
      return parseFloat(props.myLocation.lat) ? (
        <MarkerWithLabel
          key={props.user.id}
          icon={props.user.photo}
          position={{
            lat: parseFloat(props.myLocation.lat),
            lng: parseFloat(props.myLocation.lng),
          }}
          labelAnchor={new google.maps.Point(0, 0)}
          zIndex={100}
          labelStyle={markerLabelStyle}
        >
          <div>{getUserName()}</div>
        </MarkerWithLabel>
      ) : (
        console.log('location not reader')
      );
    };

    const renderOthers = () => {
      // creates a list of objects with consolidated user
      // and loc data for rendering
      const users = props.session.users;

      if (users && props.allLocations) {
        const otherUsers = users
          .filter((user) => user.id !== props.user.id)
          .reduce((modifiedUsers, user) => {
            // find user location
            const loc = props.allLocations.find(
              (loc) => loc.userId === user.id
            );
            if (loc) {
              modifiedUsers.push({ ...user, lat: loc.lat, lng: loc.lng });
            }
            return modifiedUsers;
          }, []);

        // Create the marker to render
        return otherUsers.map((user) => (
          <MarkerWithLabel
            key={`user_${user.id}`}
            icon={user.photo}
            position={{ lat: user.lat, lng: user.lng }}
            labelAnchor={new google.maps.Point(0, 0)}
            zIndex={100}
            labelStyle={markerLabelStyle}
          >
            <div>{user.firstName}</div>
          </MarkerWithLabel>
        ));
      }
    };

    const myLocationIsValid = props.myLocation.lat;
    const sessionIsValid =
      Object.keys(props.session).length > 0 && props.session.lat;
    const defCenter = myLocationIsValid
      ? { lat: props.myLocation.lat, lng: props.myLocation.lng }
      : { lat: 38.42595092237637, lng: -98.93746523313702 };

    return (
      <Container>
        {myLocationIsValid && (
          <GoogleMap ref={mapRef} defaultZoom={5} defaultCenter={defCenter}>
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
            {renderOthers()}

            {/* Draw the current user's marker */}
            {renderUser()}
          </GoogleMap>
        )}
      </Container>
    );
  })
);

const mapState = (state) => {
  console.log('Map state', state);
  return {
    user: state.auth,
    allLocations: state.allLocations,
    myLocation: state.myLocation,
    isLoggedIn: !!state.auth.id,
    session: state.sessionReducer,
  };
};

export default connect(mapState)(Map);
