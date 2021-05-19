import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';
import JoinRoom from './JoinRoom'
// import Session from './Session'
import axios from 'axios'

/**
 * COMPONENT
 */
export const Home = props => {
  const {email} = props
  const [sessions, setSessions] = useState([])

  const fetchAllSession = async () =>{
    const {data} = await axios.get(`/api/sessions/allSessions/${props.userId}`)
    setSessions(data)
  }
  useEffect(() => {
      fetchAllSession()
  }, []);

  return (
    <div>
      {/* <Link to='/map'>Show Map</Link>
      {sessions.map(session=><Session code={session.code} id={session.id} key={session.id}/>)} */}
      <JoinRoom history= {props.history} />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.auth.email,
    userId: state.auth.id
  }
}

export default connect(mapState)(Home)
