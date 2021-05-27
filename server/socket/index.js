module.exports = (io) => {
  const rooms = {};
  io.on('connection', (socket) => {
    socket.on('join-room', (userId, sessionId) => {
      const roomName = 'room_' + sessionId;
      socket.join(roomName);

      // store room and user with associated socket
      rooms[socket.id] = { userId, roomName };
      io.to(roomName).emit(
        'user-joined-room',
        userId,
        `User ${userId} joined ${roomName}`
      );
    });

    socket.on('leave-room', (userId, sessionId) => {
      const roomName = 'room_' + sessionId;
      io.to(roomName).emit(
        'user-left-room',
        userId,
        `User ${userId} left ${roomName}`
      );

      socket.leave(roomName);
      delete rooms[socket.id];
    });

    socket.on('send-my-location', (userId, sessionId, lat, lng) => {
      const roomName = 'room_' + sessionId;
      io.to(roomName).emit('user-location-changed', userId, lat, lng);
    });

    socket.on('updated-session', (session) => {
      io.to('room_' + session.id).emit('updated-session', session);
    });

    socket.on('updated-user-status', (usersession) => {
      roomName = rooms[socket.id].roomName;
      io.to(roomName).emit('updated-user-status', usersession);
    });

    socket.on('disconnecting', () => {
      const roomData = rooms[socket.id];
      if (roomData) {
        const userId = roomData.userId;
        const room = roomData.roomName;
        socket.broadcast.emit(
          'user-left-room',
          userId,
          `User ${userId} in room ${room} is disconnecting.`
        );
      }
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
