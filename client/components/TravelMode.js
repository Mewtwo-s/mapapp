import React, {useState} from 'react'

function TravelMode(evt) {

    const [travelMode, selectTravelMode] = useState()

    function handleChange(e){
        selectTravelMode(e.target.value)
    }
    return (
        <div>
            <select onChange={handleChange}>
                <option value="Cycling">Cycling</option>
                <option value="Driving">Driving</option>
                <option value="Transit">Transit</option>
                <option selected value="Walking">Walking</option>
            </select>
        </div>
    )
}

export default TravelMode