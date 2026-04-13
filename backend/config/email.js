const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `devFit <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "devFit — Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8f8f8; margin: 0; padding: 0; }
          .container { max-width: 480px; margin: 40px auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
          .header { background: #111; padding: 32px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 28px; letter-spacing: -1px; }
          .header span { color: #a0ff6f; }
          .body { padding: 32px; }
          .otp-box { background: #f4f4f4; border: 1px solid #e0e0e0; border-radius: 6px; text-align: center; padding: 24px; margin: 24px 0; }
          .otp { font-size: 40px; font-weight: 700; letter-spacing: 8px; color: #111; }
          .footer { padding: 20px 32px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>dev<span>Fit</span></h1>
          </div>
          <div class="body">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Welcome to devFit! Enter this OTP to verify your email address. It expires in <strong>10 minutes</strong>.</p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
            </div>
            <p style="color:#999;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
          <div class="footer">devFit · Made by Ashutosh · This is an automated message.</div>
        </div>
      </body>
      </html>
    `,
  };

  await resend.emails.send(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };
