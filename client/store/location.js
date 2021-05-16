import { sendMyPosition } from './room';
// actions
const MY_POSITION_UPDATED = 'MY_POSITION_UPDATED';

// action creator
export const myPositionUpdated = (lat, lng) => {
  console.log('myPositionUpdated', lat, lng);
  return {
    type: MY_POSITION_UPDATED,
    lat,
    lng,
  };
};

// thunk
export const updateMyPosition = (lat, lng) => {
  return (dispatch) => {
    console.log('location.updateMyPosition', lat, lng);
    // update state with my current position
    dispatch(myPositionUpdated(lat, lng));

    // send update to all users
    dispatch(sendMyPosition(lat, lng));
  };
};

// reducer
export default function (state = {}, action) {
  console.log('location reducer', action);
  switch (action.type) {
    case MY_POSITION_UPDATED:
      return { lat: action.lat, lng: action.lng };
    default:
      return state;
  }
}
