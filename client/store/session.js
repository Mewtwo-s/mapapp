import axios from 'axios';
import { sessionStarted } from './locationSharing';

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

const activateSession = (session) => {
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
export const activateSessionThunkCreator = (sessionId, lat, lng) => {
  console.log('activateSessionThunk', sessionId, lat, lng);
  return async (dispatch) => {
    const response = await axios.put(`/api/sessions/${sessionId}`, {
      status: 'Active',
      lat: lat,
      lng: lng,
    });
    const session = response.data;
    console.log('session', session);
    dispatch(activateSession(session));
  };
};

export const getSessionThunkCreator = (userId, code) => {
  console.log('getSessionThunkCreator');
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/sessions/${code}`);
      const session = response.data;
      console.log('SESSION', session);
      dispatch(getSession(session));
      dispatch(sessionStarted(userId, session.id));
    } catch (err) {
      console.error('Error in getSessionThunkCreator:', err);
    }
  };
};

export const joinSessionThunkCreator = (userId, code, history) => {
  console.log('joinSessionThunkCreator');
  return async (dispatch) => {
    const response = await axios.put(`/api/users/add/${userId}`, {
      code: code,
      accepted: true,
    });
    const session = response.data;
    dispatch(joinSession(session));
    dispatch(sessionStarted(userId, session.id));
    history.push(`/map/${code}`);
  };
};

export const createSessionThunkCreator = (hostId, history) => {
  return async (dispatch) => {
    const response = await axios.post(`/api/sessions/`, { hostId: hostId });
    const session = response.data;
    dispatch(createSession(session));
    dispatch(sessionStarted(hostId, session.id));
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
