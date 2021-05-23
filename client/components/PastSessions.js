import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import axios from 'axios'
import sessionReducer from '../store/session';
import styled from 'styled-components';
import { Container } from '../GlobalStyles'

/**
 * COMPONENT
 */
export const PastSessions = props => {

   const pastSessions = props.userSessions.filter(session => session.status === 'Completed')

   return (
     <Container>
         <Link to='/home' className='small-link'> Back To Home </Link>
         <div style={{ display: 'flex', flexDirection: 'column', justtifyContent: 'center', alignItems: 'center' }}>
            <h3>Past Events</h3>
            <CardsContainer>
               { (pastSessions.length === 0) ? <h2>There are no past events</h2> :
                  pastSessions.map(session => {
                     return (
                        <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                           <Card>
                              <h5>
                                 {
                                 session.locationName ?
                                 `Meetup Spot: ${session.locationName}`:
                                 'Location was not selected'
                                 } 
                                 </h5>
                              {/* TODO: change Date format */}
                              <p>{`Event ended: ${session.updatedAt}`}</p>
                           </Card>
                        </Link>

                     )
                  })
               }
            </CardsContainer>
         </div>
      </Container>
   )
}

const mapState = state => {
   return {
      userSessions: state.auth.allSessions
   }
}

const Card = styled.div`
    margin: 1rem;
    border: solid 2px #51adcf;
    border-radius: 10px;
    width: 200px;
    padding: 8px;
    color: #e4efe7;
    background-color: #1F817F;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5);
   &:hover {
    background-color: #e4efe5;
    color: #0f3057
  }

`
const CardsContainer = styled.div`
  padding: 10px;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  flex-basis: 33.333333%;
   -webkit-justify-content: space-around;
  justify-content: space-around;

  @media screen and (max-width: 600px) {
    padding: 8px;
    display: flex;
    flex-direction: column;
    just
  }
`;


export default connect(mapState)(PastSessions)
