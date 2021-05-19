import { sendMyLocation } from './locationSharing';
import { getCurrentPositionAsync } from '../helpers';
import store from '../store';

// actions
const MY_LOCATION_UPDATED = 'MY_LOCATION_UPDATED';
const LOCATION_WATCH_STOPPED = 'LOCATION_WATCH_STOPPED';
const LOCATION_WATCH_STARTED = 'LOCATION_WATCH_STARTED';

// action creator
export const myLocationUpdated = (lat, lng) => {
  return {
    type: MY_LOCATION_UPDATED,
    lat,
    lng,
  };
};

export const locationWatchStopped = (watchId) => {
  return {
    type: LOCATION_WATCH_STOPPED,
    watchId,
  };
};

export const locationWatchStarted = (watchId) => {
  return {
    type: LOCATION_WATCH_STARTED,
    watchId,
  };
};

// thunk

// // one-time call to get my current position and save it to the store
export const getMyLocation = () => {
  console.log('location.getMyLocation()');
  return async (dispatch) => {
    console.log('dispatching async get location');
    try {
      const response = await getCurrentPositionAsync();
      console.log('response', response);
      console.log('coords', response.coords);
      await dispatch(
        myLocationUpdated(response.coords.latitude, response.coords.longitude)
      );
    } catch (err) {
      console.error('Error getting initial location.', err);
    }
  };
};

// Start watching my location.
export const watchMyLocation = () => {
  console.log('location.watchMyLocation()');
  return (dispatch) => {
    // callback for when location check is successfull
    const watchSuccess = (pos) => {
      console.log('watchSuccess', pos);
      // save my updates to the store
      dispatch(updateMyLocation(pos.coords.latitude, pos.coords.longitude));
    };

    // callback for when location check fails
    const watchFail = (err) => {
      console.error('WATCH ERROR.', err.code, err.message);
    };

    // save the watchId so we can stop watching when needed
    const watchId = navigator.geolocation.watchPosition(
      watchSuccess,
      watchFail
    );
    dispatch(locationWatchStarted(watchId));
  };
};

export const stopWatchingMyLocation = () => {
  console.log(location.stopWatching);
  return (dispatch) => {
    // get the watchId so we can stop the watching function
    const { watchId } = store.getState().myLocation;
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      dispatch(locationWatchStopped(watchId));
    }
  };
};

export const updateMyLocation = (lat, lng) => {
  return (dispatch) => {
    // update state with my current position
    dispatch(myLocationUpdated(lat, lng));
    // send update to all users
    dispatch(sendMyLocation());
  };
};

// reducer
export default function (state = {}, action) {
  switch (action.type) {
    case LOCATION_WATCH_STARTED:
      return { ...state, watchId: action.watchId };
    case LOCATION_WATCH_STOPPED:
      return { ...state, watchId: null };
    case MY_LOCATION_UPDATED:
      return { lat: action.lat, lng: action.lng };
    default:
      return state;
  }
}
