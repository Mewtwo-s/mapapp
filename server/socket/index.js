module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(socket.id, ' has made a persistent connection to the server!');

    socket.on('new-message', (message) => {
      //send to all except sender
      //socket.broadcast.emit('new-message', message)

      //send to all users
      socket.emit(
        'new-message',
        message ? `${message.lat},${message.lng}` : message
      );
      console.log('server receives message,', message);
    });
  });
};
