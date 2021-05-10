import React, { useRef, useEffect, useState } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from 'react-google-maps';
// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  withGoogleMap(({ defaultCenter, markers, currentPosition }) => {
    const mapRef = useRef(null);

	const [currentLine, setCurrentLine] = useState();
    // console.log('markers', markers);

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
	if(!currentPosition) return 
	const origin = { lat: 40.756795, lng: -73.954298 };
	const destination = { lat: 41.756795, lng: -78.954298 };

	directionsService.route(
		{
		  origin: origin,
		  destination: currentPosition,
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

}, [currentPosition])

    // Fit bounds on mount, and when the markers change
    useEffect(() => {

      fitBounds();
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

		{currentPosition? <DirectionsRenderer directions={currentLine}/> :console.log('still loading')}
      </GoogleMap>
    );
  })
);

export default Map;
