import React from 'react'
import {connect} from 'react-redux'
import {authenticate} from '../store'
import { getTempUserThunkCreator } from '../store/auth'

/**
 * COMPONENT
 */
class CompleteJoinForm extends React.Component {
  // const {displayName, handleSubmit, error, isLoggedIn} = props 

  async componentDidMount(){
    await this.props.getTempUser(this.props.match.params.userCode)
  }
  render() {
    const error = this.props.error;
    const isLoggedIn = this.props.isLoggedIn;
    const handleSubmit = this.props.handleSubmit;
  return (
    <div>
      {this.props.user.name || "hi"}
      <form onSubmit={handleSubmit} name="join">
      {isLoggedIn ? 
      <div>
        <h3>Welcome, </h3>
      </div>
      : <div>  
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
          <div>
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

        
        </div>
        }
        {error && error.response && <div> {error.response.data} </div>}
        <button type="submit">Join Event</button>
      </form>
    </div>
  )
}
}

const mapState = state => {
  return {
    error: state.auth.error,
    isLoggedIn: !!state.auth.id,
    user: state.auth,

  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const email = evt.target.email.value
      const password = evt.target.password.value
      const firstName = evt.target.firstName.value
      const lastName = evt.target.lastName.value
      const phoneNum = evt.target.phoneNum.value
        dispatch(authenticate(email, password, 'accept', firstName,
          lastName, phoneNum))
        
       }, 
    getTempUser: (confirmationCode) => dispatch(getTempUserThunkCreator(confirmationCode))
  }
}

export const AcceptWithAccount = connect(mapState, mapDispatch)(CompleteJoinForm)
export const AcceptWithoutAccount = connect(mapState, mapDispatch)(CompleteJoinForm)
