import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import JoinRoom from './JoinRoom';
// import Session from './Session'
import axios from 'axios';

import sessionReducer from '../store/session';
import { Container } from '../GlobalStyles';
import { getAllSessionsThunkCreator } from '../store/allSessions';
import { clearAllLocations } from '../store/locationSharing';

/**
 * COMPONENT
 */
export const Home = (props) => {
  useEffect(() => {
    props.clearAllLocationHome();
  }, []);

  useEffect(() => {
    props.getAllSessions(props.userId);
  }, [props.userId]);
  const activeSessions = props.allSessions.filter(
    (session) => session.status === 'Active'
  );
  const pendingSessions = props.allSessions.filter(
    (session) => session.status === 'Pending'
  );
  const completedSessions = props.allSessions.filter(session => session.status === "Completed")
  console.log(props);
  return (
    <Container>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justtifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <JoinRoom history={props.history} />
        {props.sessionAction === "all" && 
        <div>

          {completedSessions.length > 0 && 
           <Link to={'/pastSessions'}>
           <h3>{`View Past Events (${completedSessions.length})`}</h3> 
       </Link>
          }
       

        <h3>{`Active Events (${activeSessions.length})`} </h3>
        <CardsContainer>
          {activeSessions.map((session) => {
            //this is broken
             let host = session.users.filter(user => user.id === session.hostId);
            
            return (
              <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                <Card style={{ backgroundColor: '#f3efd5'}}>
                  <p style={{ textAlign: 'center', fontWeight:'bold'}}>Meetup Spot: </p>
                  <p style={{ textAlign: 'center', fontWeight: 'bold'}}>{`${session.locationName}`}</p>
                  <p style={{ textAlign: 'center'}}>{`Event Code: ${session.code}`}</p>
                  {host.id === props.userId ? <p style={{ textAlign: 'center' }}>Hosted by you!</p> :
                  host.id ? 
                  <p>Hosted by {host.firstName} </p>: null
                     
                    }
                

                </Card>
              </Link>
            );
          })}
        </CardsContainer>
        <h3>{`Pending Events (${pendingSessions.length})`} </h3>
        <CardsContainer>
          {pendingSessions.map((session) => {
            return (
              <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                <Card>
                  {/* replace with place name */}
                  <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Meetup Spot: TBD </p>
                  <p style={{ textAlign: 'center' }}>{`Event Code: ${session.code}`}</p>
                  {session.hostId === props.userId && <p style={{ textAlign: 'center' }}>Hosted by you!</p>}

                </Card>
              </Link>
            );
          })}
        </CardsContainer>

        </div>
        
        }
      </div>
    </Container>
  );
};

const Card = styled.div`
  margin: 1rem;
  border: solid 2px #51adcf;
  border-radius: 10px;
  width: 200px;
  padding: 8px;
  background-color: #efefef;
  box-shadow: 0px 5px 20px rgb(48, 181, 204, 0.5);
  &:hover {
    background-color: #e4efe5;
  }
  @media screen and (max-width: 600px) {
    padding: 4px;
    width: 130px;
  }
`;

const CardsContainer = styled.div`
  padding: 10px;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  flex-basis: 33.333333%
   -webkit-justify-content: space-around;
  justify-content: space-around;

  @media screen and (max-width: 600px) {
    padding: 8px;
    display: flex;
    flex-basis: 50%
  }
`;

const mapState = (state) => {
  console.log('state home', state);
  return {
    email: state.auth.email,
    userId: state.auth.id,
    allSessions: state.allSessionsReducer,
    sessionAction: state.sessionAction

  };
};

const mapDispatch = (dispatch) => {
  return {
    clearAllLocationHome: () => {
      dispatch(clearAllLocations());
    },
    getAllSessions: (userId) => {
      dispatch(getAllSessionsThunkCreator(userId));
    },
  };
};

export default connect(mapState, mapDispatch)(Home);
