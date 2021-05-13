import React from 'react'
import {connect} from 'react-redux'
import {authenticate} from '../store'
import MapComponent from './Map'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props
  console.log('here im prop', props)
 
  return (
    <div>

      <form onSubmit={handleSubmit} name={name}>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        {props.name==='signup'? <div>  <div>
          <label htmlFor="firstName">
            <small>First Name</small>
          </label>
          <input name="firstName" type="text" />
        </div>
        <div>
          <label htmlFor="lastName">
            <small>Last Name</small>
          </label>
          <input name="lastName" type="text" />
        </div>
       
        <div>
          <label htmlFor="phoneNum">
            <small>Phone Number</small>
          </label>
          <input name="phoneNum" type="text" />
        </div>
        
        <div>
          <label htmlFor="street">
            <small>Street</small>
          </label>
          <input name="street" type="text" />
        </div>
        <div>
          <label htmlFor="city">
            <small>City</small>
          </label>
          <input name="city" type="text" />
        </div>

        <div>
          <label htmlFor="state">
            <small>State</small>
          </label>
          <input name="state" type="text" />
        </div>

        <div>
          <label htmlFor="country">
            <small>Country</small>
          </label>
          <input name="country" type="text" />
        </div>
        <div>
          <label htmlFor="zipCode">
            <small>Zip Code</small>
          </label>
          <input name="zipCode" type="text" />
        </div>
        <div>
          <label htmlFor="photo">
            <small>photo</small>
          </label>
          <input name="photo" type="text" />
        </div> </div>: (null)  }
      

        {error && error.response && <div> {error.response.data} </div>}
        <button type="submit">{displayName}</button>
      </form>
    </div>
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

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
