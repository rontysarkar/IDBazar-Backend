import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(
      "Email Service not ready to send email, check email configeration",
    );
    console.log(error)
  } else {
    console.log("Email Service Ready to send email");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to,
    subject,
    html: body,
  });
};

export const sendVerificationToEmail = async(to:string,token:string)=>{
    const verificationUrl = `${process.env.FRONTEND_URL}/varify-email/${token}`;
    const html = `
        <h1>Welcome to your IDBazar!</h1>
        <p>Thank you for registering.Please click Link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email Hare!<a/>
        <p>If you didn't request this or already verified,Please ignore this email</p>
    `
    await sendEmail(to,"Please verify your email",html);
}

export const sendResetPasswordLinkToEmail = async(to:string,token:string)=>{
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
    const html = `
        <h1>Welcome to your IDBazar! Reset Your Password</h1>
        <p>Your Have requested to reset your passowrd.click Link below to set a new password:</p>
        <a href="${resetUrl}">Reset Password!<a/>
        <p>If you didn't request this ,Please ignore this email</p>
    `
    await sendEmail(to,"Please Reset Your Password",html);
}