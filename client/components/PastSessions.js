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
            <h1>Past Sessions</h1>
            { (pastSessions.length === 0) ? <h2>There are no past sessions</h2> :
               pastSessions.map(session => {
                  return (
                     <Link to={`/map/${session.code}`} key={`code-${session.code}`}>
                        <Card>
                           <h5>{`Meetup Spot: ${session.locationName}`} </h5>
                           {/* TODO: change Date format */}
                           <p>{`Session ended: ${session.updatedAt}`}</p>
                        </Card>
                     </Link>

                  )
               })
            }
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
    max-width: 1300px;
    width: 100%;
    padding: 8px;
    color: #e4efe7;
    background-color: #1F817F;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5);
      &:hover {
    background-color: #e4efe5;
  }


    @media screen and (max-width:375px){
      padding: 8px;
    }
`

export default connect(mapState)(PastSessions)
