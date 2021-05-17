import io from 'socket.io-client';
import store from './store';
import { userLocationChanged, sendMyLocation } from './store/locationSharing';

const socket = io(window.location.origin, { autoConnect: true });

socket.on('connect', () => {
  console.log(`I'm connected to the server. My socket id is ${socket.id}`);
});

socket.on('user-joined-room', (userId, message) => {
  console.log(message);
  // send out a position update so the new user knows who/where we are
  store.dispatch(sendMyLocation());
});

socket.on('user-location-changed', (userId, lat, lng) => {
  store.dispatch(userLocationChanged(userId, lat, lng));
});

export default socket;
