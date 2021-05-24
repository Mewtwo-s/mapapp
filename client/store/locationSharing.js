import socket from '../socket';
import store from '../store';

import { stopWatchingMyLocation } from './location';

const USER_LOCATION_CHANGED = 'USER_LOCATION_CHANGED';
const CLEAR_ALL_LOCATIONS = 'CLEAR_ALL_LOCATIONS';
const REMOVE_USER = 'REMOVE_USER';

// action creators
export const userLocationChanged = (userId, lat, lng) => {
  return { type: USER_LOCATION_CHANGED, userId, lat, lng };
};

export const clearAllLocations = () => {
  return { type: CLEAR_ALL_LOCATIONS };
};

export const removeUser = (userId) => {
  console.log('removeUser', userId);
  return { type: REMOVE_USER, userId };
};

// thunks

// Creates a 'room' associated with the current session. Adds
// my socket Id to that room so all my communication is
// shared with others in that room
export const joinRoom = (userId, sessionId, userLoc) => {
  console.log(`USER ${userId} JOIN ROOM ${sessionId}`);
  // to do: make sure socket is connected.
  return (dispatch) => {
    dispatch(userLocationChanged(userId, userLoc.lat, userLoc.lng));
    socket.emit('join-room', userId, sessionId);
    socket.emit(
      'send-my-location',
      userId,
      sessionId,
      userLoc.lat,
      userLoc.lng
    );
    // start tracking my location
  };
};

export const leaveRoom = (userId, sessionId) => {
  console.log('LEAVE ROOM', userId, sessionId);
  return (dispatch) => {
    if (userId && sessionId) {
      socket.emit('leave-room', userId, sessionId);
      // stop tracking my location??
      dispatch(stopWatchingMyLocation());
    }
  };
};

export const userLeftRoom = (userId) => {
  console.log('userLeftroom', userId);
  return (dispatch) => {
    const myId = store.getState().auth.id;
    if (userId !== myId) {
      dispatch(removeUser(userId));
    }
  };
};

// send my current location to the room call this whenever
// we want to send our location to others in the same room
export const sendMyLocation = () => {
  return (dispatch) => {
    const userId = store.getState().auth.id;
    const loc = store.getState().myLocation;
    const sessionId = store.getState().sessionReducer.id;
    console.log('send my location running', userId, loc, sessionId);
    if (loc.lat) {
      socket.emit('send-my-location', userId, sessionId, loc.lat, loc.lng);
    }
  };
};

export const sendUserInputAddress = () => {
  return (dispatch) => {
    const userId = store.getState().auth.id;
    const address = store.getState().address;
    const sessionId = store.getState().sessionReducer.id;
    console.log('send my location running', userId, address, sessionId);
    if (address) {
      socket.emit('send-my-address', userId, sessionId, address);
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
    case REMOVE_USER:
      console.log(state.filter((loc) => loc.userId !== action.userId));
      return state.filter((loc) => loc.userId !== action.userId);
    case CLEAR_ALL_LOCATIONS:
      return [];
    default:
      return state;
  }
}
