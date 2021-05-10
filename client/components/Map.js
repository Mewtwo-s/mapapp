import React, { useRef, useEffect, useState } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
// =======================================================================
//  GOOGLE MAPS
// =======================================================================
const Map = withScriptjs(
  withGoogleMap(({ defaultCenter, markers }) => {
    const mapRef = useRef(null);

    const [currentPosition, setCurrentPosition] = useState();
    console.log('mapRef', mapRef);
    console.log('currentPosition', currentPosition);
    console.log('markers', markers);

    // Fit bounds function
    const fitBounds = () => {
      const bounds = new window.google.maps.LatLngBounds();
      console.log('markers in fitBounds', markers);
      markers.map((item) => {
        bounds.extend(item.position);
        return item.id;
      });
      mapRef.current.fitBounds(bounds);
    };

    // Fit bounds on mount, and when the markers change
    useEffect(() => {
      fitBounds();
    }, [markers]);

    const handleClick = (e) => {
      console.log('handleClick', e, e.latLng.lat(), e.latLng.lng());
      // const loc = {e.latlng.lat(), e.latLng.lng()}
      // setMarkerList([...markerList]);
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
        {/* {currentPosition && <Marker position={currentPosition} />} */}
      </GoogleMap>
    );
  })
);

export default Map;
