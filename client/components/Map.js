import React, { useRef, useEffect, useState } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from 'react-google-maps';
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import Axios from 'axios';
import { point, featureCollection } from '@turf/helpers';
import center from '@turf/center';
import socket from '../socket';
import { connect } from 'react-redux';
// import { joinRoom, sendPosition } from '../store/room';
// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  // withGoogleMap(({ defaultCenter, markers, currentPosition }) => {
  withGoogleMap((props) => {
    const mapRef = useRef(null);
    // console.log('Map props', props);
    const [currentLine, setCurrentLine] = useState();
    const [topPlaces, setTopPlaces] = useState();
    const [midPoint, setMidPoint] = useState();
    const [selectedPlace, setselectedPlace] = useState(null);

    const getPlaces = async (lat, lng) => {
      try {
        if (lat && lng) {
          const places = await (
            await Axios.post('/api/google', { lat: lat, lng: lng })
          ).data;
          console.log('new way to get places..', places);
          setTopPlaces(places);

          console.log(places);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const findMidpoint = (markers) => {
      const initialLocations = markers.map((marker) => [
        marker.position.lat,
        marker.position.lng,
      ]);
      let finalLocations = [];
      for (let i = 0; i < initialLocations.length; i++) {
        finalLocations.push(
          point([initialLocations[i][0], initialLocations[i][1]])
        );
      }
      const features = featureCollection(finalLocations);
      const centerCenter = center(features);
      //const centroidCenter = centroid(features);
      setMidPoint({
        lat: centerCenter.geometry.coordinates[0],
        lng: centerCenter.geometry.coordinates[1],
      });
    };

    // Fit bounds function
    const fitBounds = () => {
      const bounds = new window.google.maps.LatLngBounds();

      props.markers.map((item) => {
        bounds.extend(item.position);
        return item.id;
      });
      mapRef.current.fitBounds(bounds);
    };

    const directionsService = new google.maps.DirectionsService();

    // useEffect for Direction: when current user position changed
    useEffect(() => {
      // ----
      // Temp. This should be called when session is created / joined
      // hard-coded session id for now
      // props.join(props.user.id, 99);
      // ----
      if (!midPoint || !midPoint.lat) return;
      console.log('midpoint', midPoint);
      console.log('currentLocation', props.currentPosition);
      getPlaces(midPoint.lat, midPoint.lng);
      directionsService.route(
        {
          origin: props.currentPosition,
          destination: midPoint,
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
    }, [midPoint, props.currentPosition]);

    // Fit bounds on mount, and when the markers change
    useEffect(() => {
      fitBounds();
      findMidpoint(props.markers);
    }, [props.markers]);

    const handleClick = (e) => {
      console.log('handleClick', e, e.latLng.lat(), e.latLng.lng());
      // socket.emit('session-created', e.latLng.lat(), 99);
      socket.emit(
        'position-update',
        e.latLng.lat(),
        99,
        e.latLng.lat(),
        e.latLng.lng()
      );
    };

    return (
      <GoogleMap
        ref={mapRef}
        onClick={(e) => handleClick(e)}
        defaultCenter={props.defaultCenter}
      >
        {/* Hardcoded markers passed from MapContainer */}
        {props.markers.map(({ position }, index) => (
          <Marker key={`marker_${index}`} position={position} />
        ))}

        {/* Draw midpoint marker */}
        {midPoint && (
          <Marker
            icon="http://maps.google.com/mapfiles/ms/icons/pink-dot.png"
            position={midPoint}
          />
        )}

        {/* Draw markers for top places */}
        {(topPlaces || []).map((place, index) => {
          return (
            <Marker
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              key={`top-places-marker_${index}`}
              position={place.geometry.location}
              onClick={() => {
                setselectedPlace(place);
              }}
            >
              {/* clicker */}
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

        {/* Draw the route polyline */}
        {props.currentPosition && (
          <DirectionsRenderer directions={currentLine} />
        )}

        {/* Draw marker for each connected user */}
        {props.locations.map((loc) => {
          return (
            <MarkerWithLabel
              key={`user_${loc.userId}`}
              icon="http://maps.google.com/mapfiles/ms/icons/golfer.png"
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
    );
  })
);

const mapState = (state) => {
  return {
    user: state.auth,
    locations: state.locations,
    currentLocation: state.currentLocation,
    currentSession: state.currentSession,
  };
};

// const mapDispatch = (dispatch) => {
//   return {
//     join: (uid, sessionId) => dispatch(joinRoom(uid, sessionId)),
//     sendPosition: (uid, sessionId, lat, lng) =>
//       dispatch(sendPosition(uid, sessionId, lat, lng)),
//   };
// };
export default connect(mapState)(Map);
