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
import axios from 'axios';
import { point, featureCollection } from '@turf/helpers';
import center from '@turf/center';
import socket from '../socket';
import { connect } from 'react-redux';
import history from '../history';
import Place from './Place';
import {
  getSessionThunkCreator,
  activateSessionThunkCreator,
} from '../store/session';
import { Button, Container } from '../GlobalStyles';

// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  withGoogleMap((props) => {
    const mapRef = useRef(null);
    const [currentLine, setCurrentLine] = useState();
    const [topPlaces, setTopPlaces] = useState();
    const [midPoint, setMidPoint] = useState();
    const [selectedPlace, setselectedPlace] = useState(null);
    // const [selection, setSelection] = useState('');
    console.log('Map props', props);

    const getPlaces = async (lat, lng) => {
      try {
        if (lat && lng) {
          const places = await (
            await axios.post('/api/google', { lat: lat, lng: lng })
          ).data;
          setTopPlaces(places);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const findMidpoint = async (locations) => {
      const initialLocations = locations.map((loc) => [loc.lat, loc.lng]);
      console.log('in find midpoint', initialLocations);
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

    // Fit bounds function
    const fitBounds = () => {
      console.log('FIT BOUNDS');
      const bounds = new window.google.maps.LatLngBounds();

      props.allLocations.map((item) => {
        console.log('ITEM', item);
        bounds.extend({ lat: item.lat, lng: item.lng });
        return item.id;
      });
      mapRef.current.fitBounds(bounds);
    };

    useEffect(() => {
      props.getSession(props.user.id, props.match.params.code);
    }, []);

    useEffect(() => {
      if (midPoint) {
        getPlaces(midPoint.lat, midPoint.lng);
      }
    }, [midPoint]);

    // Fit bounds on mount, and when the markers change
    useEffect(() => {
      if (props.allLocations.length > 2) {
        fitBounds();
      }
    }, [props.allLocations]);

    useEffect(() => {
      console.log('GETTING DIRECTIONS??');
      if (props.session.status === 'Active') {
        console.log('YES GETTING DIRECTIONS');
        getDirections({ lat: props.session.lat, lng: props.session.lng });
      }
    }, [props.session, props.myLocation]);

    function handleMagic() {
      findMidpoint(props.allLocations);
    }

    const directionsService = new google.maps.DirectionsService();

    function placeSelected(loc) {
      //console.log('PLACE SELECTED', loc);
      props.activateSession(props.session.id, loc.lat, loc.lng);
    }

    function getDirections(loc) {
      console.log('in getDirections', loc);
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

    const myLocationIsValid = Object.keys(props.myLocation).length > 0;
    const sessionIsValid =
      Object.keys(props.session).length > 0 && props.session.lat;
    const defCenter = myLocationIsValid
      ? props.myLocation
      : { lat: 38.42595092237637, lng: -98.93746523313702 };

    return (
      <Container>
        
        {props.session.status === 'Pending' &&
          props.session.hostId === props.user.id && (
            <Button onClick={handleMagic}> Show Meetup Spots! </Button>
          )}

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
              (topPlaces || []).map((place, index) => {
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
                          <h5>{selectedPlace.vicinity}</h5>
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


            {props.myLocation && (
              <DirectionsRenderer directions={currentLine} />
            )}

            {props.myLocation && <DirectionsRenderer directions={currentLine} />}

            {/* Draw labeled marker for each user in current session*/}
            {props.allLocations.length > 0 &&
              props.allLocations.map((loc) => {
                return (
                  <MarkerWithLabel
                    key={`user_${loc.userId}`}
                    icon={props.user.photo}
                    position={{ lat: loc.lat, lng: loc.lng }}
                    labelAnchor={new google.maps.Point(0, 0)}
                    zIndex={100}
                    labelStyle={{
                      backgroundColor: 'black',
                      color: 'white',
                      fontSize: '16px',
                      padding: '2px',
                    }}
                  >
                    <div>{`user ${loc.userId}`}</div>
                  </MarkerWithLabel>
                );
              })}
          </GoogleMap>
        )}

        {/* Draw place buttons */}
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
            : console.log('There are no fun places near by')}
        </PlaceStyles>
        
      </Container>
    );
  })
);

const mapState = (state) => {
  console.log('state',state) 
  return {
    user: state.auth,
    allLocations: state.allLocations,
    myLocation: state.myLocation,
    isLoggedIn: !!state.auth.id,
    session: state.sessionReducer,
  };
};

const mapDispatch = (dispatch) => {
  return {
    activateSession: (sessionId, lat, lng) => {
      dispatch(activateSessionThunkCreator(sessionId, lat, lng));
    },
    getSession: (userId, sessionCode) => {
      dispatch(getSessionThunkCreator(userId, sessionCode));
    },
  };
};

const PlaceStyles = styled.div`
  max-width: 1400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media screen and (max-width:600px){
    padding: 8px;
    display: flex;
    flex-direction: column;
  }
`
export default connect(mapState, mapDispatch)(Map);
