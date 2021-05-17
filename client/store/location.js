import { sendMyLocation } from './locationSharing';

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
