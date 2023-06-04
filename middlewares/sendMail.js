import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const sendMail = (email, subject, message) => {
  return new Promise((resolve, reject) => {
    try {
      const msg = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: subject,
        text: message,
      };
      nodemailer
        .createTransport({
          service: "gmail",
          auth: { user: process.env.MY_EMAIL, pass: process.env.MAIL_PASSWORD },
          port: 465,
          host: "smtp.gmail.com",
          secure: false,
        })
        .sendMail(msg, (err) => {
          !err ? resolve({ send: true, msg }) : resolve({ err });
        });
    } catch (err) {
      reject(err);
    }
  });
};

export default sendMail;
