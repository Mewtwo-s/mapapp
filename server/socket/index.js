module.exports = (io) => {
  // const rooms = [];
  io.on('connection', (socket) => {
    console.info(`Client ${socket.id} has connected to the server!`);

    socket.on('join-room', (userId, sessionId) => {
      const roomName = 'room_' + sessionId;
      socket.join(roomName);
      // if (!rooms.includes(roomName)) {
      //   rooms.push(roomName);
      // }

      console.info(`User ${userId} joins ${roomName}`);
      io.to(roomName).emit(
        'user-joined-room',
        userId,
        `User ${userId} joined ${roomName}`
      );
    });

    socket.on('leave-room', (userId, sessionId) => {
      const roomName = 'room_' + sessionId;
      console.log(`User ${userId} leaves ${roomName}`);
      io.to(roomName).emit(
        'user-left-room',
        userId,
        `User ${userId} left ${roomName}`
      );

      socket.leave(roomName);

      // // send message to all rooms
      // rooms.forEach((roomName) => {
      //   io.to(roomName).emit(
      //     'user-left-room',
      //     userId,
      //     `User ${userId} left ${roomName}`
      //   );
      // });
    });

    socket.on('send-my-location', (userId, sessionId, lat, lng) => {
      const roomName = 'room_' + sessionId;

      io.to(roomName).emit('user-location-changed', userId, lat, lng);
    });

    socket.on('updated-session', (session) => {
      socket.broadcast.emit('updated-session', session);
    });

    socket.on('updated-user-status', (usersession) => {
      socket.broadcast.emit('updated-user-status', usersession);
    });

    socket.on('disconnect', () => {
      console.info('user disconnected: ' + socket.id);
    });

    socket.on('send-my-address', (userId, sessionId, address) => {
      const roomName = 'room_' + sessionId;

      io.to(roomName).emit('user-location-changed', userId, address);
    });
  });
};
