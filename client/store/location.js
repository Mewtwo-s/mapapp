import { sendMyLocation, sendUserInputAddress } from './locationSharing';
import store from '../store';
import socket, { lastPersistedTimesObj } from '../socket';
import axios from 'axios';
import history from '../history';

// actions
const MY_LOCATION_UPDATED = 'MY_LOCATION_UPDATED';
const LOCATION_WATCH_STOPPED = 'LOCATION_WATCH_STOPPED';
const LOCATION_WATCH_STARTED = 'LOCATION_WATCH_STARTED';
const LOCATION_ERROR = 'LOCATION_ERROR';
const USER_INPUT_LOCATION = 'USER_INPUT_LOCATION';


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
export const watchMyLocation = (userId, sessionId) => {
  return (dispatch) => {
    // callback for when location check is successfull
    const watchSuccess = (pos) => {
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
     
      

      //make a db call to find their coords
      //if coords exist, we emit them in updateMyLocation
      //if coords don't exist, we take them off the map? show a field to input location?

      if (sessionId) {
        const { data } = await axios.get(`/api/usersessions/${userId}/${sessionId}`);

        if (data) {
          if(data.currentLat){
            dispatch(updateMyLocation(data.currentLat, data.currentLng));
          }
          else{
            dispatch(requestUserInputLocation(40.78146359807055, -73.96651380162687, 'pending'));
          }
     
        }
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


//////user input related


export const userInputLocation = (lat, lng, address) => {
  return {
    type: USER_INPUT_LOCATION,
    lat,
    lng,
    address,
  };
};

export const requestUserInputLocation = (lat, lng, address) => {
  return (dispatch) => {
    dispatch(userInputLocation(lat, lng, address));
  };
};

export const saveUserInputLocation = (userId, lat, lng) => {
  return async (dispatch) => {
    try{
     
      const sessionId = store.getState().sessionReducer.id;
    if (sessionId) {
      
      const { data } = await axios.put(`/api/usersessions/${userId}/${sessionId}`, {
        currentLat: lat,
        currentLng: lng,
      })}
    }catch(err){
      console.error('error while saving user input address')
    }
    

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

    case USER_INPUT_LOCATION:
      return { lat: action.lat, lng: action.lng, address: action.address };
    default:
      return state;
  }
}
