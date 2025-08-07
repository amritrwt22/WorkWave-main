const nodemailer = require("nodemailer");
const UserModel = require("../models/users");
const crypto = require("crypto");

// Simple in-memory storage
const otpStorage = new Map();

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
    
    // Generate unique OTP for each request
    const otp = crypto.randomInt(100000, 999999).toString();
    
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Store OTP with email and expiration
    otpStorage.set(email, {
      otp: otp,
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `"WorkWave Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset - WorkWave",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Request</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }

                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    border-top: 10px solid #662d91;
                    transition: box-shadow 0.3s ease;
                }

                .email-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .email-header h2 {
                    color: #333;
                    font-size: 28px;
                    margin: 0;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .email-body {
                    line-height: 1.8;
                    color: #555;
                    font-size: 16px;
                }

                .email-body p {
                    margin: 14px 0;
                }

                .otp-code {
                    font-size: 32px;
                    color: #662d91;
                    font-weight: bold;
                    text-align: center;
                    margin: 30px 0;
                    letter-spacing: 2px;
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .email-footer {
                    margin-top: 40px;
                    text-align: center;
                    padding-top: 20px;
                    color: #999;
                    font-size: 12px;
                    border-top: 1px solid #e2e2e2;
                }

                .email-footer a {
                    color: #662d91;
                    text-decoration: none;
                }

                @media (max-width: 600px) {
                    .email-container {
                        padding: 20px;
                    }
                    .email-header h2 {
                        font-size: 24px;
                    }
                    .otp-code {
                        font-size: 28px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h2>Password Reset Request</h2>
                </div>
                <div class="email-body">
                    <p>Dear ${user.name},</p>
                    <p>We received a request to reset your password. Please use the OTP below to reset your password:</p>
                    <div class="otp-code">${otp}</div>
                    <p><strong>This OTP is valid for the next 15 minutes.</strong></p>
                    <p>If you did not request a password reset, please ignore this email or <a href="mailto:support@workwave.com">contact support</a>.</p>
                </div>
                <div class="email-footer">
                    <p>Best regards,<br><strong style="color: #662d91;">WorkWave Team</strong></p>
                    <p>If you have any questions, feel free to <a href="mailto:support@workwave.com">contact us</a>.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      msg: "OTP sent successfully"
    });

  } catch (error) {
    let errorMessage = "Failed to send email";
    if (error.code === 'EAUTH') {
      errorMessage = "Invalid email credentials. Please check your app password.";
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = "Connection timeout. Please try again.";
    }
    
    res.status(500).json({ 
      msg: errorMessage,
      error: error.message 
    });
  }
};

module.exports = {
  sendOtp,
  otpStorage
};
