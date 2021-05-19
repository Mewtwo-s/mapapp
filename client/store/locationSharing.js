import socket from '../socket';
import store from '../store';
import {
  getMyLocation,
  watchMyLocation,
  stopWatchingMyLocation,
} from './location';

const USER_LOCATION_CHANGED = 'USER_LOCATION_CHANGED';
const CLEAR_ALL_LOCATIONS = 'CLEAR_ALL_LOCATIONS';

// action creators
export const userLocationChanged = (userId, lat, lng) => {
  return { type: USER_LOCATION_CHANGED, userId, lat, lng };
};

export const clearAllLocations = () => {
  return { type: CLEAR_ALL_LOCATIONS };
};

// thunks

// Call when this user has created a session or accepted an
// invitation to join one
export const sessionStarted = (userId, sessionId) => {
  console.log('sessionStarted', userId, sessionId);
  return async (dispatch) => {
    // save my current location immediately to the redux store
    await dispatch(getMyLocation());
    // join the room
    dispatch(joinRoom(userId, sessionId));
    // TO DO: send initial position to database...??
  };
};

// Creates a 'room' associated with the current session. Adds
// my socket Id to that room so all my communication is
// shared with others in that room
export const joinRoom = (userId, sessionId) => {
  console.log('JOIN ROOM');
  // to do: make sure socket is connected.
  return (dispatch) => {
    socket.emit('join-room', userId, sessionId);
    // start tracking my location
    dispatch(watchMyLocation());
  };
};

export const leaveRoom = (userId, sessionId) => {
  console.log('LEAVE ROOM');
  return (dispatch) => {
    socket.emit('leave-room', userId, sessionId);
    // stop tracking my location??
    dispatch(stopWatchingMyLocation());
  };
};

// send my current location to the room call this whenever
// we want to send our location to others in the same room
export const sendMyLocation = () => {
  return (dispatch) => {
    const userId = store.getState().auth.id;
    const loc = store.getState().myLocation;
    const sessionId = store.getState().sessionReducer.id;

    if (loc) {
      socket.emit('send-my-location', userId, sessionId, loc.lat, loc.lng);
    }
  };
};

/**
 * REDUCER
 */

// state is array of objects:
//  [{userId:2, lat: xx.xxx, lng: xx.xxx}...]
export default function (state = [], action) {
  switch (action.type) {
    case USER_LOCATION_CHANGED:
      if (!state.find((info) => info.userId === action.userId)) {
        // user is not in the array, add them
        return [
          ...state,
          { userId: action.userId, lat: action.lat, lng: action.lng },
        ];
      } else {
        // user is already in array, just update their info
        return state.map((info) => {
          return info.userId === action.userId
            ? { userId: action.userId, lat: action.lat, lng: action.lng }
            : info;
        });
      }
    case CLEAR_ALL_LOCATIONS:
      return [];
    default:
      return state;
  }
}
