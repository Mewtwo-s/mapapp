import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import JoinRoom from './JoinRoom';
// import Session from './Session'
import axios from 'axios';

import sessionReducer from '../store/session';
import { Container } from '../GlobalStyles';

import { clearAllLocations } from '../store/locationSharing';

/**
 * COMPONENT
 */
export const Home = props => {
 
  useEffect(() => {
    props.clearAllLocationHome();
  }, []);

  const activeSessions = props.userSessions.filter(session => session.status === "Active")
  const pendingSessions = props.userSessions.filter(session => session.status === "Pending")
 
  return (
    <Container>
      <Link to="/pastSessions" className="small-link">
        {' '}
        View Past Sessions{' '}
      </Link>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justtifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <JoinRoom history={props.history} />
        <h2>{`Active Sessions (${activeSessions.length})`} </h2>
        <CardsContainer>
          {activeSessions.map((session) => {
            return (
              <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                <Card>
                  <p style={{textAlign: 'center', fontWeight:'bold'}}>Meetup Spot: </p>
                  <p style={{ textAlign: 'center', fontWeight: 'bold'}}>{`${session.locationName}`}</p>
                  <p style={{ textAlign: 'center'}}>{`Session Code: ${session.code}`}</p>
                  {session.hostId === props.userId && <p style={{ textAlign: 'center' }}>Hosts by you!</p>}
                </Card>
              </Link>
            );
          })}
        </CardsContainer>
        <h2>{`Pending Sessions (${pendingSessions.length})`} </h2>
        <CardsContainer>
          {pendingSessions.map((session) => {
            return (
              <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                <Card>
                  {/* replace with place name */}
                  <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Meetup Spot: TBD </p>
                  <p style={{ textAlign: 'center' }}>{`Session Code: ${session.code}`}</p>
                  {session.hostId === props.userId && <p style={{ textAlign: 'center' }}>Hosts by you!</p>}
                </Card>
              </Link>
            );
          })}
        </CardsContainer>
      </div>
    </Container>
  );
};

const Card = styled.div`
  margin: 0.5rem;
  border: solid 2px #51adcf;
  border-radius: 10px;
  max-width: 300px;

  padding: 8px;
  background-color: #efefef;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: #e4efe5;
  }

  @media screen and (max-width: 600px) {
    padding: 8px;
    width: 275px;
  }
`;

const CardsContainer = styled.div`
  max-width: 1400px;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    padding: 8px;
    display: flex;
    flex-direction: column;
    just
  }
`;

const mapState = (state) => {
  console.log('state home', state);
  return {
    email: state.auth.email,
    userId: state.auth.id,
    userSessions: state.auth.allSessions,
  };
};

const mapDispatch = (dispatch) => {
  return {
    clearAllLocationHome: () => {
      dispatch(clearAllLocations());
    },
  };
};

export default connect(mapState, mapDispatch)(Home);
