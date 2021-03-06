const { db } = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
if(process.env.NODE_ENV !=='production'){
  require('dotenv').config();
}

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
  } catch (ex) {
    console.log(ex);
  }
};

init();