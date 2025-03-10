const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport(
  {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'zella.prohaska@ethereal.email',
      pass: '5fJWDBqezKyR1q7V6K',
    },
  },
  {
    from: 'Squadhelp <zella.prohaska@ethereal.email>',
  }
);

const sendMail = async (message) => {
  try {
    await transport.sendMail(message);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendMail };
