import io from 'socket.io-client';
import store from './store';
import { userPositionChanged, sendMyPosition } from './store/room';

const socket = io(window.location.origin, { autoConnect: true });

socket.on('connect', () => {
  console.log(`I'm connected to the server. My socket id is ${socket.id}`);
});

// socket.on('new-message', (message) => {
//   console.log('client recieved message:', message);
// });

socket.on('user-joined-room', (userId, message) => {
  console.log(message);
  // send out a position update so the new user knows who/where we are
  store.dispatch(sendMyPosition());
});

socket.on('user-position-changed', (userId, lat, lng) => {
  console.log(`client ${userId} changed position to (${lat}, ${lng})`);
  store.dispatch(userPositionChanged(userId, lat, lng));
});

export default socket;
