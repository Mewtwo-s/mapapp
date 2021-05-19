import React ,{ useState, useEffect } from 'react'

function Place(props) {
    const [selection, setSelection] = useState('')
    const {handle, location, name, open, price, rating} = props
    
   async function onTrigger() { 
       handle(location, name)
    }
    return (
        <div>
            <h4>{name}</h4>
            <div>Open: {open}</div>
            <div>$$$: {price}</div>
            <div>Rating: {rating}</div>
            <button onClick={onTrigger}>Select</button>
        </div>
    )
}

export default Place
