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
            <div style={{ display: 'flex', justifyContent: 'space-around'}}>
     
                <div style={{ display: 'flex', flexDirection: 'column', wrap: 'nowrap'}}>
                    <p>{open
                        ? 'Open Now'
                        : 'Closed Now'}</p>
                    {/* <p>Open: {open}</p> */}
                    <p>Price: {"$".repeat(`${price}`)} </p>
                    <p>Rating: {rating}</p>
                
                </div>
                <Button onClick={onTrigger} style={{width: '50%'}} >Select</Button>
            </div>
        </Card>
    )
}


const Card = styled.div`
    border: solid 2px #51adcf;
    border-radius: 10px;
    max-width: 1300px;
    width: 25%;
    background-color: #e4efe7;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5);
    @media screen and (max-width:600px){
        padding: 16px;
        width: 90%;
        margin: 10px;
    }
`

export default Place
