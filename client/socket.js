import io from 'socket.io-client';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('socket connected to server');
});

socket.on('new-message', (message) => {
  console.log('user changed location:', message);
});

export default socket;
