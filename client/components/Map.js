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

//import centroid from '@turf/centroid';
// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  withGoogleMap(({ defaultCenter, markers, currentPosition }) => {
    const mapRef = useRef(null);

	const [currentLine, setCurrentLine] = useState();
   const [topPlaces, setTopPlaces] = useState();
   const [midPoint, setMidPoint] = useState();
	const [selectedPlace, setselectedPlace] = useState(null);
  
  const getPlaces = async (lat, lng) => {
    try {
      // default - nearby
      let { data } = await Axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=cafe&input=coffee&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&rankby=distance&location=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
      console.log('nearby..', data)
      // if no result from edge - textSearch
      if(data.results.length === 0){
        let result = await Axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?&input=coffee&inputtype=textquery&type=cafe&fields=photos,formatted_address,name,opening_hours,rating&radius=1000&location=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
        data = result.data;
        console.log('cornfield data', data);
      }
		 const places = data.results.filter(place => !place.types.includes("gas_station") && place.rating > 3.8).slice(0, 3);
		setTopPlaces(places)
		
      console.log(places);
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

  socket.emit('new-message', currentPosition)
	if(!midPoint || !midPoint.lat) return 
	console.log('midpoint', midPoint);
  console.log('currentLocation', currentPosition);
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
      console.log('markers', markers);
      console.log('midpoint', midPoint);
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

export default Map;
