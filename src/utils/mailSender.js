/*
  Send Email utility function
*/

import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: "Postaway",
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;
