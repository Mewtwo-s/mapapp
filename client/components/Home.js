import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';
import JoinRoom from './JoinRoom'
// import Session from './Session'
import axios from 'axios'

import sessionReducer from '../store/session';
import { Container } from '../GlobalStyles';

import {clearAllLocations} from '../store/locationSharing'


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

  const fetchAllSession = async () =>{
    const {data} = await axios.get(`/api/sessions/allSessions/${props.userId}`)
    setSessions(data)
  }
  useEffect(() => {
    props.clearAllLocationHome()  
    fetchAllSession()
      
  }, []);


  return (
    <Container>
      <Link to='/pastSessions'> View Past Sessions </Link>
      <JoinRoom history= {props.history} />
      <h1>Active Sessions</h1>
        {
          activeSessions.map( session => {
            return (
              <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                <Card>
                  {/* replace with place name */}
                  <h5>Meetup Spot: name </h5>
                  <p>{`Session Code: ${session.code}`}</p>
                </Card>
              </Link>
              
            )
          })
        }
    </Container>
  )
}

const Card = styled.div`
   
    border: solid 5px #51adcf;
    border-radius: 10px;
    max-width: 1300px;
    width: 30%;
    padding: 8px;

    @media screen and (max-width:600px){
        padding: 8px;
        width: 90%;
        margin: 10px 10px;
    }
`
const mapState = state => {
  return {
    email: state.auth.email,
    userId: state.auth.id,
    userSessions : state.auth.allSessions
  }
}

const mapDispatch = (dispatch) => {
  return {
    clearAllLocationHome: () => {
      dispatch(clearAllLocations());
    },
   
  };
};

export default connect(mapState, mapDispatch)(Home)

