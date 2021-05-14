module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client ${socket.id} has connected to the server!`);

    // add event listeners to the socket
    socket.on('new-message', (message, ...args) => {
      //send to all except sender
      //socket.broadcast.emit('new-message', message)

      //send to all users
      io.emit(
        'new-message',
        message ? `${message.lat},${message.lng}` : message
      );
      console.log('server received message,', message, args);
    });

    socket.on('session-created', (userId, sessionId) => {
      console.log('server.session-created', userId, sessionId);
      const roomName = 'room_' + sessionId;
      socket.join(roomName);
      io.to(roomName).emit('joined_room', `User ${userId} joined ${roomName}`);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected: ' + socket.id);
    });
  });
};
