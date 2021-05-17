import React from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';

function JoinRoom(props) {

    function handleClick(){
        Axios.post('/api/sessions', {
            hostId: props.user.id,
            status:'Pending',
        })

        console.log('new room generated')
    }

    function handleJoin(evt){
        alert( evt.target.email.value)

    }
    return (
        <div>
            <button onClick={handleClick}>Generate Room Id</button>
            <form onSubmit={handleJoin}>
                <div>
                <label htmlFor="email">
                    <small>Join Existing Room</small>
                </label>
                <input name="email" type="text" />
                <button type='submit'>Join</button>
                </div>
                <div>
 
        </div>    
      </form>
        </div>
    )
}

const mapState = state => {
    return {
      user: state.auth
    }
  }
  

export default connect(mapState)(JoinRoom)
