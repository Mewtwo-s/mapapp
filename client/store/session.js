import Axios from 'axios';
import {sessionStarted} from './locationSharing';

const GET_SESSION = 'GET_SESSION';
const JOIN_SESSION = 'JOIN_SESSION';
const CREATE_SESSION = 'CREATE_SESSION';


//action creators
const getSession = (session) => {
    return {
        type: GET_SESSION,
        session
    }
}

const joinSession = (session) => {
    return {
        type: JOIN_SESSION,
        session
    }
}
const createSession = (session) => {
    return {
        type: CREATE_SESSION,
        session
    }
}

//thunks

export const getSessionThunkCreator = (code) => {
    return async (dispatch) => {
        const response = await Axios.get(`/api/sessions/${code}`);
        const session = response.data;
        dispatch(getSession(session));
    }
}

export const joinSessionThunkCreator = (userId, code, history) => {
    return async (dispatch) => {
        const response = await Axios.put(`/api/users/add/${userId}`, {code: code, accepted: true});
        const session = response.data;
        dispatch(joinSession(session));
        dispatch(sessionStarted(userId, session.id))
        history.push(`/map/${code}`);
    }
}

export const createSessionThunkCreator = (hostId, history) => {
    return async (dispatch) => {
        const response = await Axios.post(`/api/sessions/`, {hostId: hostId});
        const session = response.data;
        dispatch(createSession(session));
        dispatch(sessionStarted(userId, session.id))
    }
}

export default function sessionReducer(session = {}, action) {
    switch (action.type) {
        case GET_SESSION:
            return action.session;
        case JOIN_SESSION:
            return action.session;
        case CREATE_SESSION:
            return action.session;
        default:
            return session;
    }
}