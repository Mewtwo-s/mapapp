import io from 'socket.io-client';
import store from './store';
import {
  userLocationChanged,
  sendMyLocation,
  userLeftRoom,
} from './store/locationSharing';
import { activateSession } from './store/session';
import { arriveAction } from './store/userSessions';
import axios from 'axios';

const socket = io(window.location.origin, { autoConLnect: true });

// TO DO: confirm socket connection via promise
socket.on('connect', () => {
  console.info(`CLIENT connected to the server. My socket id is ${socket.id}`);
});

// emitting updated session
socket.on('updated-session', (session) => {
  store.dispatch(activateSession(session));
});

// emitting updated user status
socket.on('updated-user-status', (usersession) => {
  store.dispatch(arriveAction(usersession));
});

socket.on('user-joined-room', (userId, message) => {
  console.info(message);
  // send out a position update so the new user knows who/where we are
  store.dispatch(sendMyLocation());
});

socket.on('user-left-room', (userId, message) => {
  console.info(message);
  // remove user from allLocations
  store.dispatch(userLeftRoom(userId));
});

const lastSavedTimes = {};
const saveInterval = 1000 * 60;

socket.on('user-location-changed', (userId, lat, lng) => {
  const elapsedTime = Date.now() - lastSavedTimes[userId];
  if (!lastSavedTimes[userId] || elapsedTime > saveInterval) {
    //save to db
    const sessionId = store.getState().sessionReducer.id;
    if (sessionId) {
      const { data } = axios.put(`/api/usersessions/${userId}/${sessionId}`, {
        currentLat: lat,
        currentLng: lng,
      });
      lastSavedTimes[userId] = Date.now();
    }
  }
  store.dispatch(userLocationChanged(userId, lat, lng));
});

export default socket;
