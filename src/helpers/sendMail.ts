import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const VERIFY_EMAIL_HTML = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #007bff;">Email Verification</h2>
    <p>
      Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}" style="color: #007bff; text-decoration: none; font-weight: bold;">here</a> to ${
      emailType === "VERIFY" ? "verify your email" : "reset your password"
    }.
    </p>
    <p>
      Alternatively, copy and paste the link below into your browser:
    </p>
    <p>
      <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}" style="color: #007bff; text-decoration: none;">
        ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </a>
    </p>
    <p style="font-size: 0.9em; color: #555;">
      If you did not request this, please ignore this email.
    </p>
    <p style="font-size: 0.8em; color: #777;">
      Regards,<br/>
      Muhammad Rehan
    </p>
  </div>
`;

    const RESET_PASSWORD_HTML = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #007bff;">Password Reset</h2>
    <p>
      Click <a href="${
        process.env.DOMAIN
      }/forgotpassword?token=${hashedToken}" style="color: #007bff; text-decoration: none; font-weight: bold;">here</a> to ${
      emailType === "VERIFY" ? "verify your email" : "reset your password"
    }.
    </p>
    <p>
      Alternatively, copy and paste the link below into your browser:
    </p>
    <p>
      <a href="${
        process.env.DOMAIN
      }/forgotpassword?token=${hashedToken}" style="color: #007bff; text-decoration: none;">
        ${process.env.DOMAIN}/forgotpassword?token=${hashedToken}
      </a>
    </p>
    <p style="font-size: 0.9em; color: #555;">
      If you did not request this, please ignore this email.
    </p>
    <p style="font-size: 0.8em; color: #777;">
      Regards,<br/>
      Muhammad Rehan
    </p>
  </div>
`;

    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Secure port
      secure: true, // Use SSL
      auth: {
        user: process.env.USER, // generated ethereal user
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: '"Muhammad Rehan 👻" rehantechforge@gmail.com', // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Forgot Your Password", // Subject line
      html: emailType === "VERIFY" ? VERIFY_EMAIL_HTML : RESET_PASSWORD_HTML,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log(`Error While Sending Mail to User ${error.message}`);
  }
};

export default sendEmail;
