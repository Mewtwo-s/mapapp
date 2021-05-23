import { sendMyLocation } from './locationSharing';
import store from '../store';
import socket, { lastPersistedTimesObj } from '../socket';
import axios from 'axios';
import history from '../history';

// actions
const MY_LOCATION_UPDATED = 'MY_LOCATION_UPDATED';
const LOCATION_WATCH_STOPPED = 'LOCATION_WATCH_STOPPED';
const LOCATION_WATCH_STARTED = 'LOCATION_WATCH_STARTED';
const LOCATION_ERROR = 'LOCATION_ERROR';

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
// Start watching my location.
// we should add session ID into here
export const watchMyLocation = (userId) => {
  console.log('location.watchMyLocation()');
  return (dispatch) => {
    // callback for when location check is successfull
    const watchSuccess = (pos) => {
      console.log('watchSuccess', pos);
      // save my updates to the store
      dispatch(updateMyLocation(pos.coords.latitude, pos.coords.longitude));
      socket.emit(
        'user-location-changed',
        userId,
        pos.coords.latitude,
        pos.coords.longitude
      );
      //also add those new coords to the DB
    };

    // callback for when location check fails
    const watchFail = async (err) => {
      alert('Unable to detect your location');
      console.error('Unable to detect your location:', err);
      dispatch(updateMyLocation(23.111548543393226, 113.2436214181923));
      
      //make a db call to find their coords
      //if coords exist, we emit them in updateMyLocation
      //if coords don't exist, we take them off the map? show a field to input location?
      const sessionId = store.getState().sessionReducer.id;
      console.log('SESSION ID:', sessionId);
      console.log('HISTORY:', history);
      if (sessionId) {
        // this should return all the users in this session
        const { data } = axios.get(`/api/usersessions/${sessionId}`);
        console.log('USER SESSON:', data);
        // if (data) {
        //   console.log('FOUND SAVED LOC');
        //   dispatch(updateMyLocation(data.currentLat, data.currentLng));
        // }
      }
    };

    const options = {
      enableHighAccuracy: false,
    };

    // save the watchId so we can stop watching when needed
    const watchId = navigator.geolocation.watchPosition(
      watchSuccess,
      watchFail,
      options
    );
    dispatch(locationWatchStarted(watchId));
  };
};

export const stopWatchingMyLocation = () => {
  console.log('STOP watching location', location.stopWatching);
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
    console.log('updateMyLocation', lat, lng);
    // update state with my current position
    dispatch(myLocationUpdated(lat, lng));
    // send update to all users
    dispatch(sendMyLocation());
  };
};

// reducer
export default function (state = {}, action) {
  switch (action.type) {
    // case LOCATION_WATCH_STARTED:
    //   return { ...state, watchId: action.watchId };
    // case LOCATION_WATCH_STOPPED:
    //   return { ...state, watchId: null };
    case MY_LOCATION_UPDATED:
      return { lat: action.lat, lng: action.lng };
    default:
      return state;
  }
}
