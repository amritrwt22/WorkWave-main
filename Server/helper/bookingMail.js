const nodemailer = require("nodemailer");

exports.sendBookingMail = async (to,name,bookingDate,bookingTime,guestCount) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const subject = "WorkWave - Your Booking is Confirmed!";

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #1e1e1e; color: #ddd; padding: 20px;">
        <img src="https://res.cloudinary.com/dwd71kz3s/image/upload/v1724846253/cmvtodvvvgafvhfkgepi.jpg" 
         alt="WorkWave Booking Confirmation" 
         style="display: block; margin: 0 auto;  border-radius: 10px;"> 
        <div style="padding: 20px; background-color: #2b2b2b; border: 1px solid #444; border-radius: 10px; max-width: 600px; margin: 20px auto;">
            <p style="font-size: 18px;">Dear <span style="color: #662d91;">${name}</span>,</p>
            <p style="font-size: 16px; line-height: 1.6;">We are excited to confirm your booking with <strong style="color: #662d91;">WorkWave</strong>!</p>
            <p style="font-size: 16px; line-height: 1.6;">
                Your booking has been successfully confirmed. Here are the details:
            </p>
            <ul style="line-height: 1.8; font-size: 16px; color: #aaa;">
                <li><strong>Booking Date:</strong> ${bookingDate}</li>
                <li><strong>Booking Time:</strong> ${bookingTime}</li>
                <li><strong>Number of Guests:</strong> ${guestCount}</li>
            </ul>
            <p style="font-size: 16px; line-height: 1.6;">
                We look forward to welcoming you. If you have any questions or need to modify your booking, feel free to contact us at 
                <a href="mailto:support@workwave.com" style="color: #662d91; text-decoration: none;">support@workwave.com</a>.
            </p>
            <p>
                <a href="https://landing-page-orpin-one-53.vercel.app/" style="background-color: #662d91; color: #fff; padding: 12px 24px; 
                text-decoration: none; border-radius: 5px; font-size: 16px;">Manage Your Booking</a>
            </p>
            <p style="font-size: 16px; color: #aaa;">Thank you for choosing WorkWave!</p>
            <p style="font-size: 16px; color: #aaa;">Best regards,<br><span style="color: #662d91;">Stack Surgeons</span><br>WorkWave Team</p>
        </div>
    </div>`;

  let mailOptions = {
    from: "Workwave",
    to: to,
    subject: subject,
    html: html,
  };
  console.log("Mail sent to : " + to);
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("Error sending email: " + error);
  }
};
