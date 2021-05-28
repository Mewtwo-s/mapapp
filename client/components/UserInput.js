import React from 'react'

function UserInput(props) {
    const {handle} = props

    function handleSubmit(evt){
        evt.preventDefault()
        handle(evt.target.address.value)
    }
    return (
        <div>
            <h2>We can't seem to find your location!</h2>
            <h4>Type your address below. If left empty, it will default to central park!</h4>

            <form name="join" onSubmit={handleSubmit}>

                <div>
                <label htmlFor="address">
                    <small>Type Your Address</small>
                </label>
                <input name="address" type="text" />
                </div>
                <div>

                <button type='submit'> Location Me!</button>
                </div>

                </form>

        </div>
    )
}

export default UserInput