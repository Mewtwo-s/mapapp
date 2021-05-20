import socket from '../socket';
import store from '../store';

import { stopWatchingMyLocation } from './location';


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

// Creates a 'room' associated with the current session. Adds
// my socket Id to that room so all my communication is
// shared with others in that room
export const joinRoom = (userId, sessionId, userLoc ) => {
  console.log(`USER ${userId} JOIN ROOM ${sessionId}`);
  // to do: make sure socket is connected.
  return (dispatch) => {
    dispatch(userLocationChanged(userId, userLoc.lat, userLoc.lng));
    socket.emit('join-room', userId, sessionId);
    socket.emit('send-my-location', userId, sessionId, userLoc.lat, userLoc.lng);
    // start tracking my location
  
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
    console.log('send my location running', userId, loc, sessionId)
    if (loc.lat) {
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
