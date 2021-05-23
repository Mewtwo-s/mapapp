import React ,{ useState, useEffect } from 'react'
import styled from 'styled-components';
import { Button, Container } from '../GlobalStyles';

const Place = (props) => {
    const [selection, setSelection] = useState('')
    const {handle, location, name, open, price, rating} = props
    
   async function onTrigger() { 
       handle(location, name)
    }
    return (
        <Card>
            <h3 style={{textAlign: 'center'}}>{name}</h3>
            
            <p style={{ textAlign:'center'}}>
                {open ? 'Open Now' : 'Closed Now'}</p>
            {/* <p>Open: {open}</p> */}
            <p style={{ textAlign:'center'}}>Price: {"$".repeat(`${price}`)} </p>
            <p style={{ textAlign: 'center' }}>Rating: {rating}</p>
            <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={onTrigger} style={{margin: "5px"}}>Select</Button>
            </div>
        </Card>
    )
}

const Card = styled.div`
    border: solid 2px #51adcf;
    border-radius: 10px;
    width: 200px;
    background-color: #e4efe7;
    box-shadow: 0px 5px 20px rgb(48,181,204, 0.5);
     &:hover {
    background-color: #e4efe5;
    }
    @media screen and (max-width: 600px) {
    padding: 8px;
    width: 275px;
  }

`

export default Place
