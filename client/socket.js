import io from 'socket.io-client';
import store from './store';
import { userLocationChanged, sendMyLocation } from './store/locationSharing';

const socket = io(window.location.origin, { autoConLnect: true });

// TO DO: confirm socket connection via promise
socket.on('connect', () => {
  console.info(`CLIENT connected to the server. My socket id is ${socket.id}`);
});

socket.on('user-joined-room', (userId, message) => {
  console.info(message);
  // send out a position update so the new user knows who/where we are
  store.dispatch(sendMyLocation());
});

socket.on('user-left-room', (userId, message) => {
  console.info(message);
  // not sure there's anything else to do here...but i want the feedback
});

socket.on('user-location-changed', (userId, lat, lng) => {
  store.dispatch(userLocationChanged(userId, lat, lng));
});

export default socket;
