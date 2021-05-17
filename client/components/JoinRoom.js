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
    return (
        <div>
            <button onClick={handleClick}>Generate Room Id</button>
        </div>
    )
}

const mapState = state => {
    return {
      user: state.auth
    }
  }
  

export default connect(mapState)(JoinRoom)
