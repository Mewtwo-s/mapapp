import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {authenticate} from '../store'
import MapComponent from './Map'
import { FormGroup, Label, Input , Button } from '../GlobalStyles'
import history from '../history'
import { Link } from 'react-router-dom';
import {joinSessionThunkCreator} from '../store/session'
import axios from 'axios'

/**
 * COMPONENT
 */
const AuthForm = props => {

  let pathName=props.location.pathname.substring(1);
  let displayName
  if (pathName === "signup") {
    displayName = "Sign Up";
  } else {
    displayName = "Login"
    pathName="login"

  }
  const {handleSubmit, error} = props 
  return (
    
    <FormContainer>
      <form onSubmit={handleSubmit} name={pathName}>
          <FormGroup>
            <div>
              <Label htmlFor="email">
                <small>Email *</small>
              </Label>
              <Input name="email" type="email" required placeholder='joe@mail.com'/>
            </div>
            <div>
              <Label htmlFor="password">
                <small>Password *</small>
              </Label>
            <Input name="password" type="password" required placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"/>
            </div>
          </FormGroup>
       

        {pathName==='signup'? 
        <div> 
          <FormGroup>
              <div>
                <Label htmlFor="firstName">
                  <small>First Name *</small>
                </Label>
                <Input name="firstName" type="text" required placeholder='Joe' />
              </div>
              <div>
                <Label htmlFor="lastName">
                  <small>Last Name *</small>
                </Label>
                <Input name="lastName" type="text" required placeholder='Smith'/>
              </div>
          </FormGroup> 
        
        <FormGroup id="imageUrl">
          <div>
              <Label htmlFor="photo">
                <small>Image URL (optional)</small>
              </Label>
              <Input name="photo" type="text" placeholder='e.g. https://image.png'/>
          </div>
        </FormGroup>
      </div>: 
      (null)  
      }
      

        {error && error.response && <div> {error.response.data} </div>}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
         <Button type="submit" style={{padding: "0.25em 3em"}}>{displayName}</Button>
        </div>
      </form>

      {
        pathName === 'login' ? 
          <p style={{textAlign:'center', color:'white'}}><small>Don't have an account? <Link to='/signup'>Sign Up here</Link></small> </p> :
          <p style={{ textAlign: 'center', color: 'white' }}><small>Already have an account? <Link to='/login'>Login </Link></small> </p>
      }
    </FormContainer>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    
    error: state.auth.error
  }
}

const mapSignup = state => {
  const roomCode = history.location.pathname.split('/')[history.location.pathname.split.length]

  return {
    error: state.auth.error,
    code: roomCode
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      const sessionCode = history.location.pathname.split('/')[history.location.pathname.split.length]
   
      if(formName==='signup'){
        const firstName = evt.target.firstName.value
        const lastName = evt.target.lastName.value
        const photo = evt.target.photo.value || "https://www.pinclipart.com/picdir/big/523-5232047_ladybug-clipart-five-ladybug-five-transparent-free-cartoon.png"
        dispatch(authenticate(email, password, formName, firstName,
          lastName, photo  ))
      }
      else{
        dispatch(authenticate(email, password, formName))
      } 
    },
  }
}

const FormContainer = styled.div`
  border-radius: 5px;
  background-color:#41adcf;
  justify-content: center;
  margin: 50px auto;
  padding: 20px;
  width: fit-content;
   @media screen and (max-width:600px){
     width: 90vw
   }
`



export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
