import axios from 'axios';
import { sessionStarted, clearAllLocations } from './locationSharing';
import socket from '../socket';
import {addASession, editASession } from './allSessions';
import { userJoinsSession } from './userSessions';

const GET_SESSION = 'GET_SESSION';
const JOIN_SESSION = 'JOIN_SESSION';
const CREATE_SESSION = 'CREATE_SESSION';
const ACTIVATE_SESSION = 'ACTIVATE_SESSION';
const END_SESSION = 'END_SESSION';
const ADD_TRANSIT = 'ADD_TRANSIT';

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

export const endSession = (session) => {
  return {
    type: END_SESSION,
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

const addTransit = (session) => {
  return {
    type: ADD_TRANSIT,
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
    dispatch(editASession(session))
    socket.emit('updated-session', session)
  };
};

export const addTransitThunkCreator = (sessionId, transitType) => {

  return async (dispatch) => {
    const response = await axios.put(`/api/sessions/${sessionId}`, {
      travelMode: transitType
    });
    const session = response.data;
    dispatch(addTransit(session));
  };
};

export const endSessionThunkCreator = (sessionId) => {
  return async (dispatch) => {
    const response = await axios.put(`/api/sessions/${sessionId}`, {
      status: 'Completed'
    });
    const session = response.data;
    dispatch(endSession(session));
    dispatch(editASession(session))
    socket.emit('updated-session', session)
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
        code: code
      });
      const session = response.data;
      const user = await axios.put(`/api/usersessions/${userId}/${session.id}`, {accepted: true})
      await dispatch(joinSession(session));
      dispatch(addASession(session))
      await dispatch (userJoinsSession(user.data));
      socket.emit('updated-session', session)
      history.push(`/map/${code}`);
    } catch (err) {
      console.error(err)
    }

  };
};

export const createSessionThunkCreator = (hostId, travelMode, history) => {
  return async (dispatch) => {

    try {
      const response = await axios.post(`/api/sessions/`, { hostId: hostId});
      const session = response.data;
      await axios.put(`/api/usersessions/${hostId}/${session.id}`, {accepted: true})
      await dispatch(createSession(session));
      dispatch(addASession(session))
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
    case END_SESSION:
      return action.session;
    case ADD_TRANSIT:
      return action.session;
    default:
      return session;
  }
}
