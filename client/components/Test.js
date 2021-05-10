import React, { Component } from 'react';
import { GoogleMap } from 'react-google-maps'

class Test extends Component{

   render(){
      console.log('googlemap', GoogleMap)
      return(
         <h1>hello</h1>
      )
   }
}

export default Test