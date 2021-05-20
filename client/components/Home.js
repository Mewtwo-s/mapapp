import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';
import JoinRoom from './JoinRoom'
// import Session from './Session'
import axios from 'axios'
import sessionReducer from '../store/session';

/**
 * COMPONENT
 */
export const Home = props => {
  // const {email} = props
  // const [sessions, setSessions] = useState([])

  // const fetchAllSession = async () =>{
  //   const {data} = await axios.get(`/api/sessions/allSessions/${props.userId}`)
  //   setSessions(data)
  // }

  // useEffect(() => {
  //     fetchAllSession()
  // }, []);

  const activeSessions = props.userSessions.filter( session => session.status === 'Active')

  return (
    <div>
      <JoinRoom history= {props.history} />
      <h1>Active Sessions</h1>
        {
          activeSessions.map( session => {
            return (
              <div key={`code-${session.code}`}style={{border: "solid 3px", width: "300px"}}>
                {/* replace with place name */}
                <h5>Place: name </h5> 
                <p>{`Session Code: ${session.code}`}</p>
              </div>
            )
          })
        }
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  console.log('userSesssion State', state.auth.allSessions)
  return {
    email: state.auth.email,
    userId: state.auth.id,
    userSessions : state.auth.allSessions
  }
}

export default connect(mapState)(Home)
