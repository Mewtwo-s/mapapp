const { db } = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');

const init = async () => {
  try {
    await db.sync();
    // start listening (and create a 'server' object representing our server)
    const server = app.listen(PORT, () =>
      console.log(`Mixing it up on port ${PORT}`)
    );

    // create socket server (io) and attach our express server to it
    const io = require('socket.io')(server, {
      cors: {
        origin: `http://localhost:${PORT}`,
      },
    });

    // start listening for connections on the socket
    require('./socket')(io);
    //must export app. Actually this doesn't seem to be necessary
    // module.exports = app;
  } catch (ex) {
    console.log(ex);
  }
};

init();
