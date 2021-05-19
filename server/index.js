const { db } = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
require('dotenv').config();
const nodemailer = require('nodemailer');

const init = async () => {
  try {
    await db.sync();
    // start listening (and create a 'server' object representing our server)
    const server = app.listen(PORT, () =>
      console.log(`Mixing it up on port ${PORT}`),
      console.log(`this is my client id ${process.env.OAUTH_CLIENTID}`)
    );
require('dotenv').config();
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

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

let mailOptions = {
  from: 'mapappproduction@gmail.com',
  to: 'hannahwischnia@gmail.com',
  subject: 'Your friend invited you to meet',
  text: 'Your friend NAME wants to meet up! Join the session HERE'
};

transporter.sendMail(mailOptions, function(err, data) {
  if (err) {
    console.log("Error " + err);
  } else {
    console.log("Email sent successfully");
  }
});