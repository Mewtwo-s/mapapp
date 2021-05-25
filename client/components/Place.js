import React ,{ useState, useEffect } from 'react'
import styled from 'styled-components';
import { PlaceButton, Container } from '../GlobalStyles';

const Place = (props) => {
    const [selection, setSelection] = useState('')
    const {handle, location, name, open, price, rating} = props
    
   async function onTrigger() { 
       handle(location, name)
    }
    return (
        <div onClick={onTrigger} id="placeCard">
            <h4>{name}</h4>
            
          <div>
            {open ? <p className="green">Open Now</p> : <p className="red">Closed Now </p>}
            {/* <p>Open: {open}</p> */}
            {price && <p>Price: {"$".repeat(`${price}`)} </p>}
            {rating && <p>Rating: {rating}</p>}
            
            </div>
            {/* <div>
            <PlaceButton onClick={onTrigger}>Select</PlaceButton>
            </div> */}
        </div>
    )
}

// const Card = styled.div`
//     border: solid 2px #51adcf;
//     border-radius: 10px;
//     width: 200px;
//     background-color: #e4efe7;
//     box-shadow: 0px 5px 20px rgb(48,181,204, 0.5);
//      &:hover {
//     background-color: #e4efe5;
//     }
//     @media screen and (max-width: 600px) {
//     padding: 8px;
//     width: 275px;
//   }

// `

export default Place
