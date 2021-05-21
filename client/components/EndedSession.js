import React from 'react'
import { Link } from 'react-router-dom';
// import styled from 'styled-components';
import { Button } from '../GlobalStyles';

const Loading = (props) => {
  
    return (
        <div className="center" >
           <h1 className="center">This session has ended!</h1>
           <Link to={`/home`}>
            <Button>Return Home</Button>
           </Link>
        </div>
    )
}

export default Loading
