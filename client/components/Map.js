import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

const MapComponent = withScriptjs(withGoogleMap(props=> {
	return (
		<GoogleMap 
			defaultZoom={12}
			defaultCenter={{ lat: 21.1744336, lng: 72.7954677 }}
		/>
	)
}))

export default MapComponent
