import axios from 'axios';
import { sessionStarted, clearAllLocations } from './locationSharing';
import socket from '../socket';

const GET_ALL_SESSIONS = 'GET_ALL_SESSIONS';
const ADD_A_SESSION = 'ADD_A_SESSION';
const EDIT_A_SESSION = 'EDIT_A_SESSION';

//action creators
const getAllSessions = (sessions) => {
  return {
    type: GET_ALL_SESSIONS,
    sessions,
  };
};

export const addASession = (session) => {
  return {
    type: ADD_A_SESSION,
    session,
  };
};

export const editASession = (session) => {
  return {
    type: EDIT_A_SESSION,
    session,
  };
};

export const getAllSessionsThunkCreator = (userId) => {

  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/sessions/allsessions/${userId}`);
      const sessions = response.data;
      await dispatch(getAllSessions(sessions));

    } catch (err) {
      console.error(`Could not get user's sessions`, err);
    }
  };
};


export default function allSessionsReducer(sessions = [], action) {
  switch (action.type) {
    case GET_ALL_SESSIONS:
      return action.sessions;
    case ADD_A_SESSION:
      return [...sessions, action.session];
    case EDIT_A_SESSION:
      return sessions.map((session) => 
      session.id === action.session.id ? action.session : session);
    default:
      return sessions;
  }
}
