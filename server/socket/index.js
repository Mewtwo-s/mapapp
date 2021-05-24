module.exports = (io) => {
  // {socketId: {roomName:'', socketId:''}}
  const rooms = {};
  io.on('connection', (socket) => {
    console.info(`Client ${socket.id} has connected to the server!`);

    socket.on('join-room', (userId, sessionId) => {
      const roomName = 'room_' + sessionId;
      socket.join(roomName);

      // store rooms with associated socket and user
      rooms[socket.id] = { userId, roomName };
      console.log('SOCKET ROOMS', rooms);
      console.log(rooms[socket.id]);

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
      delete rooms[socket.id];
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

    socket.on('disconnecting', () => {
      console.info('user disconnecting: ' + socket.id);
      // need to get the room and user from this socket id
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
      // need to get the room and user from this socket id
    });

    socket.on('send-my-address', (userId, sessionId, address) => {
      const roomName = 'room_' + sessionId;

      io.to(roomName).emit('user-location-changed', userId, address);
    });
  });
};
