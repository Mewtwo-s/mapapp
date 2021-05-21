import React, {useHistory} from 'react'
import { Container } from '../GlobalStyles';
import styled from 'styled-components';
import {connect} from 'react-redux'
import { Link,  BrowserRouter as Router,
    Route,
    Switch,
    Redirect } from 'react-router-dom';
import { Login, Signup } from './AuthForm';

function UserJoinSession(props) {
    console.log('my history',useHistory)
    return (
    <div>
        <Link to='/signin'><Card>Existing User?</Card></Link>
       <Link to='/signup'> <Card>New User?</Card></Link>
    </div>
    )
}


const Card = styled.div`
    margin: 1rem;
    border: solid 2px #51adcf;
    border-radius: 10px;
    max-width: 1300px;
    width: 100%;
    padding: 8px;
    background-color: #EFEFEF;

    @media screen and (max-width:600px){
        padding: 8px;
        width: 90%;
        margin: 10px 10px;
    }`

const mapState = state => {
    console.log('state home', state)
    return {
        isLoggedIn: !!state.auth.id,
    }
  }
  

export default connect(mapState)(UserJoinSession)
