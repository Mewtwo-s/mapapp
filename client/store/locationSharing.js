import socket from '../socket';
import store from '../store';
import { updateMyLocation, myLocationUpdated } from './location';
import { getCurrentPositionAsync } from '../helpers';

const USER_POSITION_CHANGED = 'USER_POSITION_CHANGED';

// action creators
export const userLocationChanged = (userId, lat, lng) => {
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
      
      const { coords } = await getCurrentPositionAsync();
      const { latitude, longitude } = coords;
      dispatch(myLocationUpdated(latitude, longitude));
    } catch (err) {
      console.error('Error getting initial location.', err);
    }

    // TO DO: send initial position to database...

    // join the room
    dispatch(joinRoom(userId, sessionId));

    // start watching my location
    const watchSuccess = (pos) => {
      console.log('watchSuccess', pos);
      // save my updates to the store
      dispatch(updateMyLocation(pos.coords.latitude, pos.coords.longitude));
    };

    const watchFail = (err) => {
      console.error('WATCH ERROR.', err.code, err.message);
    };
    const id = navigator.geolocation.watchPosition(watchSuccess, watchFail);
  };
};

export const joinRoom = (userId, sessionId) => {
  return (dispatch) => {
    socket.emit('join-room', userId, sessionId);
  };
};

// send my current location to the room
export const sendMyLocation = () => {
  return (dispatch) => {
    const userId = store.getState().auth.id;
    const loc = store.getState().myLocation;

    // TEMP until store.getState().session.id is available from store
    const sessionId = 88;

    if (loc) {
      socket.emit('send-my-location', userId, sessionId, loc.lat, loc.lng);
    }
  };
};

/**
 * REDUCER
 */

// state is array of objects. E.g.
//  [{userId:2, lat: xx.xxx, lng: xx.xxx}...]
export default function (state = [], action) {
  switch (action.type) {
    case USER_POSITION_CHANGED:
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
    default:
      return state;
  }
}
