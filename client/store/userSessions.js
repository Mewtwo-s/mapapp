import axios from 'axios'
import socket from '../socket';

const GET_SESSION_USERS = "GET_SESSION_USERS"
const ARRIVE = "ARRIVE"
const INVITE_USER = "INVITE_USERS"
const USER_JOIN_SESSION = "USER_JOIN_SESSION"

const getSessionUsersRows = (sessionUsers) => (
    {
   type: GET_SESSION_USERS,
   sessionUsers
})

export const arriveAction = (userSession) => ({
   type: ARRIVE,
   userSession
})

export const inviteAction = (user) => ({
   type: INVITE_USER,
   user
})

// export const userJoinSessionAction = (userSession) => ({
//    type: USER_JOIN_SESSION,
//    userSession

// })


export const getSessionUsersThunkCreator = (sessionId) => {
    return async (dispatch) => {
       try {
          const response = await axios.get(`/api/usersessions/${sessionId}`)
          const sessionUsers = response.data
          console.log(sessionUsers, 'sessionUsers thunk')
          dispatch(getSessionUsersRows(sessionUsers))
       } catch (error) {
          console.log(`Failed to get users for session ${sessionId}`)
       }
    }
 }

 export const inviteSessionUsersThunkCreator = (sessionId, email, hostName) => {
   return async (dispatch) => {
      try {
         const response = await axios.post(`/api/users/invite`, {hostName, email, sessionId})
         const invitedUser = response.data
         dispatch(inviteAction(invitedUser))
      } catch (error) {
         console.log(`Failed to invite user in ${sessionId}`)
      }
   }
}

export const arriveThunkCreator = (userId, sessionId) => {
   return async (dispatch) => {
      try {
         const response = await axios.put(`/api/usersessions/arrive/${userId}/${sessionId}`)
         const usersession = response.data
         dispatch(arriveAction(usersession))
         socket.emit('updated-user-status', usersession)
      } catch (error) {
         console.log(`Failed to update ${userId} to arrived`)
      }
   }
}


// export const userJoinSession = (userId, sessionId) => {
//    return async (dispatch)=>{
//       try{

//          const {data} = await axios.get(`/api/usersessions/${sessionId}`)
//          dispatch(getSessionUsersThunkCreator(data))

//       }catch{
//          console.log(`Failed to fetch userSession data`)
//       }
//    }
// }

export default function userSessionsReducer(state=[], action) {
   switch (action.type) {
    case GET_SESSION_USERS:
       return action.sessionUsers   
    case ARRIVE: 
        return state.map(user => {
           if (user.userId === action.userSession.userId) {
            return action.userSession} 
              else {
            return user
        }})

      default:
         return state
   }
}