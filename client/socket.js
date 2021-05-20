import io from 'socket.io-client';
import store from './store';
import { userLocationChanged, sendMyLocation } from './store/locationSharing';
// import { activateSession } from './store/session';

const socket = io(window.location.origin, { autoConLnect: true });

// TO DO: confirm socket connection via promise
socket.on('connect', () => {
  console.info(`CLIENT connected to the server. My socket id is ${socket.id}`);
});

//emitting updated session
// socket.on('updated-session', (session) => {
//   store.dispatch(activateSession(session))
// })

socket.on('user-joined-room', (userId, message) => {
  console.info(message);
  // send out a position update so the new user knows who/where we are
  store.dispatch(sendMyLocation());
});

socket.on('user-left-room', (userId, message) => {
  console.info(message);
  // not sure there's anything else to do here...but i want the feedback
});

const lastPersistedTimesObj = {};

socket.on('user-location-changed', (userId, lat, lng) => {
  if (!lastPersistedTimesObj[userId] || Date.now() - lastPersistedTimesObj[userId]> 1000*60){
    lastPersistedTimesObj[userId] = Date.now()
    //trigger a call to the db to add the location
    //store.dispatch(addLocationsToUserThunk(userId, lat, lng, sessionId))
  }
  store.dispatch(userLocationChanged(userId, lat, lng));
});
export { lastPersistedTimesObj };
export default socket;
