import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import {getFriendsThunk} from '../store/user'

class Test extends Component{
constructor(props) {
   super(props)
}

componentDidMount(){
   this.props.fetchFriendsFromThunk(this.props.user.id)
}

   render(){
      return(
         <h1>TEST</h1>
      )
   }
}

const mapState = state => {
   return {
     user: state.auth
   }
 }

 const mapDispatch = dispatch => {
   return {
     fetchFriendsFromThunk: (userId) => {
       dispatch(getFriendsThunk(userId))
     }
   }
 }
export default connect(mapState, mapDispatch)(Test)
