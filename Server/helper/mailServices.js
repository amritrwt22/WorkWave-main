const nodemailer = require("nodemailer");

exports.sendGreetMail = async (to, name) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject =
    "Subject: Welcome to WorkWave! Your Business Solutions Await 🌟";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <img src="https://res.cloudinary.com/dwd71kz3s/image/upload/v1724846253/cmvtodvvvgafvhfkgepi.jpg" 
         alt="WorkWave Admin" 
         style="display: block; margin: 0 auto;">
         
        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 10px;">
            <p>Dear ${name},</p>
            <p>Welcome to the <strong>WorkWave User</strong> platform!</p>
            <p>
                As an user, you now have the power to manage and offer services on our platform, making it easier for users to find and book what they need. From adding new services to tracking the performance of your offerings, WorkWave Admin provides you with all the tools you need to succeed.
            </p>
            <h3 style="color: #007bff;">Here's what you can do:</h3>
            <ul style="line-height: 1.6;">
                <li>Add Services: List your services and reach more users in your area.</li>
                <li>Manage Offerings: Edit and update your service details at any time.</li>
                <li>Track Performance: Get insights and statistics on your service bookings and sales.</li>
            </ul>
            <p>
                We're here to support you every step of the way. If you have any questions or need assistance, don't hesitate to contact us at <a href="mailto:support@workwave.com">support@workwave.com</a>.
            </p>
            <p>
                <a href="https://work-wave-five.vercel.app/" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Managing Services</a>
            </p>
            <p>Thank you for being a part of WorkWave. We're excited to see what you'll achieve!</p>
            <p>Best regards,<br>Stack Surgeons<br>WorkWave Team</p>
        </div>
    </div>`;

  let mailOptions = {
    from: "Workwave",
    to: to,
    subject: subject,
    html: html,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("Error sending email: " + error);
  }
};
