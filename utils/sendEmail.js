const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Transporter config for Zoho Mail
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com", // Standard Zoho host
    port: 465, // SSL port
    secure: true, // true for 465, false for others
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // We will send HTML emails
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
