import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import axios from 'axios'
import sessionReducer from '../store/session';
import styled from 'styled-components';

/**
 * COMPONENT
 */
export const PastSessions = props => {
   // const {email} = props
   // const [sessions, setSessions] = useState([])

   // const fetchAllSession = async () =>{
   //   const {data} = await axios.get(`/api/sessions/allSessions/${props.userId}`)
   //   setSessions(data)
   // }

   // useEffect(() => {
   //     fetchAllSession()
   // }, []);

   const pastSessions = props.userSessions.filter(session => session.status === 'Completed')

   return (
      <div>
         <Link to='/home'> Back To Home </Link>
         <h1>Past Sessions</h1>
         { (pastSessions.length === 0) ? <h2>There're no past sessions</h2> :
            pastSessions.map(session => {
               return (
                  <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                     <Card>
                        {/* replace with place name */}
                        <h5>Place: name </h5>
                        {/* TODO: change Date format */}
                        <p>{`Session ended: ${session.updatedAt}`}</p>
                     </Card>
                  </Link>

               )
            })
         }
      </div>
   )
}

const mapState = state => {
   return {
      userSessions: state.auth.allSessions
   }
}

const Card = styled.div`
  border: solid 3px #51adcf;
  border-radius: 10px;
`
export default connect(mapState)(PastSessions)
