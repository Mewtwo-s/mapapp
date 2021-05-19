import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import User from './User'

function InviteForm(props) {
    console.log('in join form', props)
    const [relatedUsers, setUsers] = useState([])

    function handleSubmit(){
        alert('eysss')
    }

    const fetchAllSession = async () =>{
        const {data} = await axios.get(`/api/users`)
        setUsers(data)
      }
      useEffect(() => {
          fetchAllSession()
      }, []);

    return (
        <div>
    <form onSubmit={handleSubmit} name={name}>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />
          <button type='submit'>Submit</button>
        </div>
        <div>
 
        </div>    
      </form>
      {relatedUsers.map(user=><User user={user} key={user.id}/>)}
        </div>
    )
}
const mapState = state => {
  return {
    email: state.auth.email,
    userId: state.auth.id
  }
}
export default connect(mapState)(InviteForm)
