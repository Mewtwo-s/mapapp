import socket from '../socket';
import store from '../store';
import { updateMyPosition, myPositionUpdated } from './location';
import { getCurrentPositionAsync } from '../helpers';

const USER_POSITION_CHANGED = 'USER_POSITION_CHANGED';

// action creators
export const userPositionChanged = (userId, lat, lng) => {
  console.log('room.userPositionChanged', userId, lat, lng);
  return { type: USER_POSITION_CHANGED, userId, lat, lng };
};

// thunks
export const sessionStarted = (userId, sessionId) => {
  console.log('sessionStarted', userId, sessionId);

  return async (dispatch) => {
    // set an initial location before we join the room. Not
    // sure if this is the best place for this, but needs to
    // happpen before we join the room
    try {
      console.log('SETTING initial location');
      const { coords } = await getCurrentPositionAsync();
      const { latitude, longitude } = coords;
      dispatch(myPositionUpdated(latitude, longitude));
    } catch (err) {
      console.error('Error getting initial location.', err);
    }

    // join the room
    dispatch(joinRoom(userId, sessionId));

    // start watching my location
    const watchSuccess = (pos) => {
      console.log('watchSuccess', pos);
      // save my updates to the store
      dispatch(updateMyPosition(pos.coords.latitude, pos.coords.longitude));
    };

    const watchFail = (err) => {
      console.error('WATCH ERROR.', err.code, err.message);
    };
    const id = navigator.geolocation.watchPosition(watchSuccess, watchFail);
  };
};

export const joinRoom = (userId, sessionId) => {
  return (dispatch) => {
    console.log('room.joinRoom', userId, sessionId);
    socket.emit('join-room', userId, sessionId);
    // send initial position to database
  };
};

// send my current location to the room
// export const sendMyPosition = (userId, sessionId, lat, lng) => {
// export const sendMyPosition = (userId) => {
export const sendMyPosition = () => {
  return (dispatch) => {
    console.log('sendMyPosition. store:', store.getState());
    const userId = store.getState().auth.id;
    const loc = store.getState().myLocation;

    // temp until store.getState().session.id is available from store
    const sessionId = 88; // store.session.id
    if (loc) {
      socket.emit('send-my-position', userId, sessionId, loc.lat, loc.lng);
    }
  };
};

/**
 * REDUCER
 */

// [{userId:2, lat: xx.xxx, lng: xx.xxx}}, {userId:4, lat: xx.xxx, lng: xx.xxx}, {userId:5, lat: xx.xxx, lng: xx.xxx}...]
export default function (state = [], action) {
  // console.log('room reducer', action);
  switch (action.type) {
    case USER_POSITION_CHANGED:
      if (!state.find((info) => info.userId === action.userId)) {
        // user is not already in the array, add them
        console.log(`ROOM REDUCER. Adding User ${action.userId} to array`);
        return [
          ...state,
          { userId: action.userId, lat: action.lat, lng: action.lng },
        ];
      } else {
        // user is already in array, just update their info
        console.log(`ROOM REDUCER. Editing User ${action.userId}`);
        return state.map((info) => {
          return info.userId === action.userId
            ? { userId: action.userId, lat: action.lat, lng: action.lng }
            : info;
        });
      }
    default:
      return state;
  }
}
