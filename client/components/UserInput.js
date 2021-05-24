import React from 'react'

function UserInput(props) {
    const {handle} = props

    function handleSubmit(evt){
        evt.preventDefault()
        handle(evt.target.address.value)
    }
    return (
        <div>
            <h2>You are annoying, aren't you?</h2>
            <h4>Type your address in the searc box (currently default to Central Park)</h4>

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