import socket from '../socket';

// room state:
// [{userId:x, position: {lat, lng}}, ...]

// actions
// const JOINED_ROOM
const POSITION_UPDATED = 'POSITION_UPDATED';

// action creators
const positionUpdated = (positionInfo) => {
  return { type: POSITION_UPDATED, positionInfo };
};

// thunks
const createRoom = (userId, sessionId) => {
  socket.emit('join-room', userId, sessionId);
  // send position to database so users joining later can get updates on users already joined
};

const updatePosition = (userId, sessionId, lat, lng) => {
  socket.emit('position-update', userId, sessionId, lat, lng);
  // {userId: xxx, lat: xxx, lng: xxx}
  dispatch(positionUpdated({ userId, lat, lng }));
};

/**
 * REDUCER
 */

// [{userId:amy, position: {lat, lng}}, {userId:hannah, position: {lat, lng}}, {userId:d, position: {lat, lng}}...]
export default function (state = [], action) {
  switch (action.type) {
    case POSITION_UPDATED:
      if (!state.find((user) => user.id === action.userId)) {
        return [...state, action.positionInfo];
      } else {
        return state.map((user) => {
          if (user.id === action.userId) {
            return (user.position = action.position);
          }
        });
      }
    // if user not in array
    //   add to array
    //   return [...state, {user: , positoin: ...}]
    // else
    //   loop map thru array and edit user
    default:
      return state;
  }
}
