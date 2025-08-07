const nodemailer = require("nodemailer");

// greetmail for new users
exports.sendGreetMail = async (to, name) => {
  try {
    // ✅ Use the same SMTP configuration that works
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

    const subject = "Welcome to WorkWave! Your Business Solutions Await 🌟";
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to WorkWave</title>
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
              }

              .email-header {
                  text-align: center;
                  margin-bottom: 30px;
              }

              .email-header img {
                  max-width: 200px;
                  border-radius: 10px;
              }

              .email-body {
                  line-height: 1.8;
                  color: #555;
                  font-size: 16px;
              }

              .email-body h3 {
                  color: #662d91;
                  font-size: 20px;
                  margin-top: 25px;
              }

              .email-body ul {
                  padding-left: 20px;
              }

              .email-body ul li {
                  margin: 10px 0;
              }

              .cta-button {
                  display: inline-block;
                  background-color: #662d91;
                  color: #ffffff;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  margin: 20px 0;
              }

              .email-footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e2e2e2;
                  color: #666;
              }

              .email-footer a {
                  color: #662d91;
                  text-decoration: none;
              }

              @media (max-width: 600px) {
                  .email-container {
                      padding: 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="email-header">
                  <img src="https://res.cloudinary.com/dwd71kz3s/image/upload/v1724846253/cmvtodvvvgafvhfkgepi.jpg" 
                       alt="WorkWave Admin" />
              </div>
              
              <div class="email-body">
                  <p>Dear <strong>${name}</strong>,</p>
                  
                  <p>Welcome to the <strong>WorkWave User</strong> platform!</p>
                  
                  <p>As a user, you now have the power to manage and offer services on our platform, making it easier for users to find and book what they need. From adding new services to tracking the performance of your offerings, WorkWave provides you with all the tools you need to succeed.</p>
                  
                  <h3>Here's what you can do:</h3>
                  <ul>
                      <li><strong>Add Services:</strong> List your services and reach more users in your area.</li>
                      <li><strong>Manage Offerings:</strong> Edit and update your service details at any time.</li>
                      <li><strong>Track Performance:</strong> Get insights and statistics on your service bookings and sales.</li>
                  </ul>
                  
                  <p>We're here to support you every step of the way. If you have any questions or need assistance, don't hesitate to contact us at <a href="mailto:support@workwave.com">support@workwave.com</a>.</p>
                  
                  <p>
                      <a href="https://work-wave-five.vercel.app/" class="cta-button">Start Managing Services</a>
                  </p>
                  
                  <p>Thank you for being a part of WorkWave. We're excited to see what you'll achieve!</p>
              </div>
              
              <div class="email-footer">
                  <p>Best regards,<br><strong style="color: #662d91;">Stack Surgeons</strong><br>WorkWave Team</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"WorkWave Team" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", to);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error("Error sending welcome email:", error);
    
    let errorMessage = "Failed to send welcome email";
    if (error.code === 'EAUTH') {
      errorMessage = "Invalid email credentials. Please check your app password.";
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = "Connection timeout. Please try again.";
    }
    
    return { success: false, error: errorMessage };
  }
};
