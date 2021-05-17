module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client ${socket.id} has connected to the server!`);

    // add event listeners to the socket
    // socket.on('new-message', (message, ...args) => {
    //   //send to all users
    //   io.emit(
    //     'new-message',
    //     message ? `${message.lat},${message.lng}` : message
    //   );
    //   console.log('server received message,', message, args);
    // });

    socket.on('join-room', (userId, sessionId) => {
      console.log('SOCKET join-room', userId, sessionId);
      const roomName = 'room_' + sessionId;
      socket.join(roomName);
      io.to(roomName).emit(
        'user-joined-room',
        userId,
        `User ${userId} joined ${roomName}`
      );
    });

    socket.on('send-my-position', (userId, sessionId, lat, lng) => {
      console.log('SOCKET send-my-position', userId, sessionId, lat, lng);
      const roomName = 'room_' + sessionId;
      io.to(roomName).emit('user-position-changed', userId, lat, lng);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected: ' + socket.id);
    });
  });
};
