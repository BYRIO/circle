import { getLogger } from "log4js";
import * as nodemailer from "nodemailer";
const logger = getLogger("SENDMAIL");

const transporter = nodemailer.createTestAccount().then((account) => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass, // generated ethereal password
    },
  });
});

export const sendConfirmEmail = async (email, url) => {
  const mTransporter = await transporter;
  const info = await mTransporter.sendMail({
    from: '"Fred Foo 👻" <787298831@qq.com>',
    to: email,
    subject: "Please confirm your email",
    text: url,
    html: "<p><b>Hello</b> to myself!</p>",
  });
  logger.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return info;
};
export const sendResetEmail = async (email, url) => {
  const mTransporter = await transporter;
  const info = await mTransporter.sendMail({
    from: "test server <test@test.test>",
    to: email,
    subject: "Password reset.",
    text: url,
  });
  logger.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return info;
};
