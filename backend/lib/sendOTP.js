import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {

  const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }

  });

  await transporter.sendMail({

    from: process.env.EMAIL,

    to: email,

    subject: "Emotion AI OTP Verification",

    html: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `
  });

};