import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import Test from './Test'
const MapComponent = withScriptjs(withGoogleMap(props=> {

	const bounds = new window.google.maps.LatLngBounds()
	console.log('bounds',bounds)
	const place1 = {lat: 40.72999310526833, lng: -73.99265821567542};
	const place2 = { lat: 40.731582188116306, lng: -73.99344165069101 }
	const locations = [ place1, place2 ]

	locations.map((location, i) => {
		bounds.extend(new window.google.maps.LatLng(
			location.lat,
			location.lng
		))
	})
GoogleMap.fitBounds(bounds)

	return (
		<div>
		<GoogleMap 
		
			zoom={12}
			center={{ lat: 40.6501, lng: -73.9442  }}
		>
		{/* <Marker
				position={home}
    	/> */}
		 {/* new york */}
		 <Marker 
				position={{lat: 40.72999310526833, lng: -73.99265821567542}}
		/>

		 </GoogleMap>
		 <Test/>
		</div>
	)
}))


	
export default MapComponent
