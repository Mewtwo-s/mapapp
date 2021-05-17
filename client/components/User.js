import React from 'react'

function User({user}) {

    function handleSubmitUser(){
        alert(user.id)
    }
    return (
        <div>
            <div>
                <span>{user.id}</span>
                <div></div>
                <span>{user.email}</span>
                <button onClick={handleSubmitUser}>send</button>

            </div>
        </div>
    )
}

export default User
