import axios from 'axios';
import { sessionStarted, clearAllLocations } from './locationSharing';
// import socket from '../socket';

const GET_SESSION = 'GET_SESSION';
const JOIN_SESSION = 'JOIN_SESSION';
const CREATE_SESSION = 'CREATE_SESSION';
const ACTIVATE_SESSION = 'ACTIVATE_SESSION';

//action creators
const getSession = (session) => {
  return {
    type: GET_SESSION,
    session,
  };
};

export const activateSession = (session) => {
  return {
    type: ACTIVATE_SESSION,
    session,
  };
};

const joinSession = (session) => {
  return {
    type: JOIN_SESSION,
    session,
  };
};
const createSession = (session) => {
  return {
    type: CREATE_SESSION,
    session,
  };
};


//thunks
export const activateSessionThunkCreator = (sessionId, lat, lng, locationName) => {

  return async (dispatch) => {
    const response = await axios.put(`/api/sessions/${sessionId}`, {
      status: 'Active',
      lat: lat,
      lng: lng,
      locationName: locationName
    });
    const session = response.data;
    dispatch(activateSession(session));
    // socket.emit('updated-session', session)
  };
};

export const getSessionThunkCreator = (userId, code) => {


  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/sessions/${code}`);
      const session = response.data;
      await dispatch(getSession(session));

    } catch (err) {
      console.error('Error in getSessionThunkCreator:', err);
    }
  };
};

export const joinSessionThunkCreator = (userId, code, history) => {

  return async (dispatch) => {
    try {
      const response = await axios.put(`/api/users/add/${userId}`, {
        code: code,
        accepted: true,
      });
      const session = response.data;
      await dispatch(joinSession(session));
      history.push(`/map/${code}`);
    } catch (err) {
      console.error(err)
    }

  };
};

export const createSessionThunkCreator = (hostId, history) => {
  return async (dispatch) => {

    try {
      const response = await axios.post(`/api/sessions/`, { hostId: hostId });
      const session = response.data;
      await dispatch(createSession(session));
    } catch (err) {
      console.error(err)
    }

  };
};

export default function sessionReducer(session = {}, action) {
  switch (action.type) {
    case GET_SESSION:
      return action.session;
    case JOIN_SESSION:
      return action.session;
    case CREATE_SESSION:
      return action.session;
    case ACTIVATE_SESSION:
      return action.session;
    default:
      return session;
  }
}
