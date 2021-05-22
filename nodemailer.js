const nodemailer = require('nodemailer');

function runMailer (senderName, toEmail, gameCode, toName, userCode) {
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
    to: toEmail,
    subject: 'Your friend invited you to meet',
    html: 
        `
        <p>Hi ${toName}! </p>
        <p> Your friend ${senderName} wants to meet up! Join the session <a href="https://mapapp999test.herokuapp.com/${userCode}/${gameCode}">here</a></p>`
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

module.exports = runMailer