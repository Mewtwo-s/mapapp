module.exports = (io) => {
  io.on('connection', (socket) => {
    console.info(`Client ${socket.id} has connected to the server!`);

    socket.on('join-room', (userId, sessionId) => {
      const roomName = 'room_' + sessionId;
      socket.join(roomName);
      console.info(`User ${userId} joins ${roomName}`);
      io.to(roomName).emit(
        'user-joined-room',
        userId,
        `User ${userId} joined ${roomName}`
      );
    });

    socket.on('send-my-location', (userId, sessionId, lat, lng) => {
      const roomName = 'room_' + sessionId;
      io.to(roomName).emit('user-location-changed', userId, lat, lng);
    });

    socket.on('disconnect', () => {
      console.info('user disconnected: ' + socket.id);
    });
  });
};
