import React from 'react'
// import styled from 'styled-components';
// import { Button, Container } from '../GlobalStyles';

const Loading = (props) => {
  
    return (
        <div >
           <h1 className="center">{`Loading ${props.message}...`}</h1>
           <div className="loader"></div>
        </div>
    )
}




export default Loading
