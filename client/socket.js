import io from 'socket.io-client';

const socket = io(window.location.origin, { autoConnect: true });

socket.on('connect', () => {
  console.log(`I'm connected to the server. My socket id is ${socket.id}`);
});

socket.on('new-message', (message) => {
  console.log('client recieved message:', message);
});

socket.on('position-update', (uid, sessionId, lat, lng) => {
  console.log(`client ${uid} changed position to (${lat}, ${lng})`);
  // dispatch({type:POSITION_UPDATED, userId: uid, position: position, sesssionId:sessionId; })
});

socket.on('joined_room', (message) => {
  console.log(message);
});

export default socket;
