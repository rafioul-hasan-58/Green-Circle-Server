import nodemailer from "nodemailer";
import config from "../../config";

const sendEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.email,
      pass: config.app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"PH-HealthCare 👻" <rafioulhasan2@gmail.com>',
    to: email,
    subject: "Reset password link", // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  });

  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

export default sendEmail;
