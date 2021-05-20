import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {authenticate} from '../store'
import MapComponent from './Map'
import { FormGroup, Label, Input , Button } from '../GlobalStyles'


/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props 
  return (
    <FormContainer>

      <form onSubmit={handleSubmit} name={name}>
        <div>
          <FormGroup>
            <div>
              <Label htmlFor="email">
                <small>Email</small>
              </Label>
              <Input name="email" type="email" required placeholder='required'/>
            </div>
            <div>
              <Label htmlFor="password">
                <small>Password</small>
              </Label>
              <Input name="password" type="password" required placeholder='required'/>
            </div>
          </FormGroup>
        </div>

        {props.name==='signup'? 
        <div> 
          <FormGroup>
              <div>
                <Label htmlFor="firstName">
                  <small>First Name</small>
                </Label>
                <Input name="firstName" type="text" required placeholder='required' />
              </div>
              <div>
                <Label htmlFor="lastName">
                  <small>Last Name</small>
                </Label>
                <Input name="lastName" type="text" />
              </div>
              <div>
                <Label htmlFor="phoneNum">
                  <small>Phone Number</small>
                </Label>
                <Input name="phoneNum" type="text" />
              </div>
          </FormGroup> 
          
        <FormGroup>
            <h4 style={{ color: 'white', marginBottom: '0px', marginTop: '1rem' }}>
              Default address:
          </h4>
        </FormGroup>
            
        <FormGroup>
          <div>
            <Label htmlFor="street">
              <small>Street</small>
            </Label>
            <Input name="street" type="text" />
          </div>
          <div>
            <Label htmlFor="city">
              <small>City</small>
            </Label>
            <Input name="city" type="text" />
          </div>

          <div>
            <Label htmlFor="state">
              <small>State</small>
            </Label>
            <Input name="state" type="text" />
          </div>
        </FormGroup>

        <FormGroup>
          <div>
            <Label htmlFor="zipCode">
              <small>Zip Code</small>
            </Label>
            <Input name="zipCode" type="text" />
          </div>
          <div>
            <Label htmlFor="country">
              <small>Country</small>
            </Label>
            <Input name="country" type="text" />
          </div>
        </FormGroup>
        
        <FormGroup>
          <div>
            <Label htmlFor="photo">
              <small>Image URL</small>
            </Label>
            <Input name="photo" type="text" />
          </div>
        </FormGroup>
      </div>: 
      (null)  
      }
      

        {error && error.response && <div> {error.response.data} </div>}
        <FormGroup>
          <Button type="submit">{displayName}</Button>
        </FormGroup>
        
      </form>
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
    name: 'login',
    displayName: 'Login',
    error: state.auth.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.auth.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      if(formName==='signup'){
        const firstName = evt.target.firstName.value
        const lastName = evt.target.lastName.value
        const phoneNum = evt.target.phoneNum.value
        // const preferTransportation = evt.target.preferTransportation.value
        const street = evt.target.street.value
        const city = evt.target.city.value
        const state = evt.target.state.value
        const country = evt.target.country.value
        const zipCode = evt.target.zipCode.value
        const photo = evt.target.photo.value
        dispatch(authenticate(email, password, formName, firstName,
          lastName, phoneNum, street, city, state, country, zipCode, photo  ))
      }
      else{
        dispatch(authenticate(email, password, formName))
      } }
  }
}

const FormContainer = styled.div`
  width: 90%;
  border-radius: 5px;
  background-color:#51adcf;
  margin: 25px 25px;
  padding: 20px;
`

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
