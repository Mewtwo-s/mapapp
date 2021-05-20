import React ,{ useState, useEffect } from 'react'
import styled from 'styled-components';
import { Button, Container } from '../GlobalStyles';

const Place = (props) => {
    const [selection, setSelection] = useState('')
    const {handle, location, name, open, price, rating, image} = props
    
   async function onTrigger() { 
       handle(location, name)
    }
    return (
        <Card>
            {/* check the props for image */}
            <img src={image}/> 
            <h4>{name}</h4>
            <p>{open
                ? 'Open Now'
                : 'Closed Now'}</p>
            {/* <p>Open: {open}</p> */}
            <p> {"$".repeat(`${price}`)} </p>
            <p>Rating: {rating}</p>
            <Button onClick={onTrigger}>Select</Button>
        </Card>
    )
}


const Card = styled.div`
   
    border: solid 5px #51adcf;
    border-radius: 10px;
    max-width: 1300px;
    width: 30%;
    padding: 8px;

    @media screen and (max-width:600px){
        padding: 8px;
        width: 90%;
        margin: 10px 10px;
    }
`

export default Place
