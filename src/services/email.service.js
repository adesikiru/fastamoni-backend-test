const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendThankYou = async (email) => {
  await transporter.sendMail({
    from: "Fastamoni <no-reply@fastamoni.com>",
    to: email,
    subject: "Thank you for your generosity ❤️",
    text: "Thank you for supporting fellow users on Fastamoni!",
  });
};
