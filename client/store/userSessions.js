import axios from 'axios'

const GET_SESSION_USERS = "GET_SESSION_USERS"
const ARRIVE = "ARRIVE"

const getSessionUsersRows = (sessionUsers) => (
    {
   type: GET_SESSION_USERS,
   sessionUsers
})

const arriveAction = (userSession) => ({
   type: ARRIVE,
   userSession
})


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

export const arriveThunkCreator = (userId, sessionId) => {
   return async (dispatch) => {
      try {
         const response = await axios.put(`/api/usersessions/arrive/${userId}/${sessionId}`)
         const usersession = response.data
         dispatch(arriveAction(usersession))
      } catch (error) {
         console.log(`Failed to update ${userId} to arrived`)
      }
   }
}


export default function userSessionsReducer(state=[], action) {
   switch (action.type) {
    case GET_SESSION_USERS:
       return action.sessionUsers   
    case ARRIVE: 
        return state.map((userSession) => 
        userSession.userId === action.usersession.userId ? action.usersession : usersession); 
      default:
         return state
   }
}