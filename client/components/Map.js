import React, { useRef, useEffect, useState } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
 InfoWindow
} from 'react-google-maps';
import Axios from 'axios';
import {point, featureCollection } from '@turf/helpers';
import center from '@turf/center';
import socket from '../socket'
import {connect} from 'react-redux'
import history from '../history'

//import centroid from '@turf/centroid';
// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  withGoogleMap(({ email, defaultCenter, markers, currentPosition }) => {
    const mapRef = useRef(null);

	const [currentLine, setCurrentLine] = useState();
   const [topPlaces, setTopPlaces] = useState();
   const [midPoint, setMidPoint] = useState();
	const [selectedPlace, setselectedPlace] = useState(null);
  
  const getPlaces = async (lat, lng) => {
    try {
      if(lat && lng){
        const places = await (await Axios.post('/api/google', {lat:lat, lng:lng})).data
  
        setTopPlaces(places)
        
      }

    } catch (error) {
      console.log(error);
    }
  }

  const findMidpoint = (markers) => {
    const initialLocations = markers.map(marker => [marker.position.lat, marker.position.lng]);
    let finalLocations = [];
    for (let i = 0; i < initialLocations.length; i++) {
      finalLocations.push(point([initialLocations[i][0], initialLocations[i][1]])
      )}
    const features = featureCollection(finalLocations);
    const centerCenter = center(features);
    //const centroidCenter = centroid(features);
    setMidPoint({lat: centerCenter.geometry.coordinates[0], lng:centerCenter.geometry.coordinates[1]});
  }


    // Fit bounds function
    const fitBounds = () => {
      const bounds = new window.google.maps.LatLngBounds();

      markers.map((item) => {
        bounds.extend(item.position);
        return item.id;
      });
      mapRef.current.fitBounds(bounds);
	};
	
	
	const directionsService = new google.maps.DirectionsService();


// useEffect for Direction: when current user position changed
useEffect(()=>{


  socket.emit('new-message', {location:currentPosition, email})
	if(!midPoint || !midPoint.lat) return 

  getPlaces(midPoint.lat, midPoint.lng);
	directionsService.route(
		{
      origin: currentPosition,
      destination: midPoint,
      travelMode: google.maps.TravelMode.DRIVING
		},
		(result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
		
    setCurrentLine(result)
      } else {
      console.error(`error fetching directions ${result}`);
      }
		}
  );

}, [midPoint, currentPosition])

    // Fit bounds on mount, and when the markers change
    useEffect(() => {

      fitBounds();
      findMidpoint(markers);

    }, [markers]);

    const handleClick = (e) => {
      console.log('handleClick', e, e.latLng.lat(), e.latLng.lng());

    };
	
    return (
      <GoogleMap
        ref={mapRef}
        onClick={(e) => handleClick(e)}
        defaultCenter={defaultCenter}
      >

        {markers.map(({ position }, index) => (
          <Marker key={`marker_${index}`} position={position} />
        ))}

        {midPoint && <Marker icon="http://maps.google.com/mapfiles/ms/icons/pink-dot.png" position={midPoint} />}
    
		
			{(topPlaces || []).map((place, index) => {
				return (
					<Marker icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" key={`top-places-marker_${index}`} position={place.geometry.location}

						onClick={() => {
							setselectedPlace(place);
						}}
					>
						{/* clicker */}
						{(selectedPlace === place) && (
							<InfoWindow
								onCloseClick={() => {
									setselectedPlace(null);
								}}
								position={
									selectedPlace.geometry.location
								}
							>
								<div>
									<h3>{selectedPlace.name}</h3>
									<h5>{selectedPlace.vicinity}</h5>
									<p>{selectedPlace.opening_hours.open_now ? 'Open Now' : 'Closed Now'}</p>
								</div>
							</InfoWindow>
						)}

					</Marker>
						
					///>
				 )
				}
			)}

		{currentPosition? <DirectionsRenderer directions={currentLine}/> :console.log('still loading')}
      </GoogleMap>
    );
  })
);

const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id
  }
}
export default connect(mapState)(Map);
