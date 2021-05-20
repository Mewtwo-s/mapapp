// import axios from 'axios'

// const GET_ACTIVE_SESSIONS = "GET_ACTIVE_SESSIONS"

// const _getActiveSessions = (activeSessions) => ({
//    type: GET_ACTIVE_SESSIONS,
//    activeSessions
// })

// export const getActiveSessions = () => {
//    return async (dispatch) => {
//       try {
//          const { data: activeSessions } = await axios.get(`auth/me/active-sessions`)
//          console.log('activeSessions in reducer', activeSessions )
//          dispatch(_getActiveSessions(activeSessions))
//       } catch (error) {
//          console.log(`Failed to get all active sessions for user ${userId}`)
//       }
//    }
// }


// export default function userSessionsReducer(state=[], action) {
//    switch (action.type) {
//       case GET_ACTIVE_SESSIONS: 
//          return action.activeSessions
//       default:
//          return state
//    }
// }