import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';
/**
 * COMPONENT
 */
export const Home = props => {
  const {email} = props

  return (
    <div>
      <h3>hi {props.email}</h3>
      <Link to='/map'>Show Map</Link>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.auth.email
  }
}

export default connect(mapState)(Home)
