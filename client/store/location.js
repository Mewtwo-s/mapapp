import { sendMyLocation } from './locationSharing';
import { getCurrentPositionAsync } from '../helpers';

// actions
const MY_LOCATION_UPDATED = 'MY_LOCATION_UPDATED';

// action creator
export const myLocationUpdated = (lat, lng) => {
  return {
    type: MY_LOCATION_UPDATED,
    lat,
    lng,
  };
};

// thunk

// // one-time call to get my current position and save it to the store
export const getMyLocation = () => {
  console.log('location.getMyLocation()');
  return async (dispatch) => {
    try {
      const response = await getCurrentPositionAsync();
      console.log('response', response);
      console.log('coords', response.coords);
      dispatch(
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
    const id = navigator.geolocation.watchPosition(watchSuccess, watchFail);
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
    case MY_LOCATION_UPDATED:
      return { lat: action.lat, lng: action.lng };
    default:
      return state;
  }
}
