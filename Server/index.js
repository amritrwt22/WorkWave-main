const express = require("express");
const app = express();
const PORT = 3001;
const dbConnect = require("./middlewares/db");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const businessRouter = require("./routes/businessRouter");
const bookingRouter = require("./routes/bookingRouter");
const reviewRouter = require("./routes/reviewsRouter");
const serviceRouter = require("./routes/serviceRouter");
const otpRoute = require("./routes/otpRoute");
const userDashboard = require("./routes/userDashboard");
const Booking = require("./models/bookingDetails");
const Razorpay = require("razorpay");
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();
app.use(express.json());
const corsOptions = {
  origin: [
    "http://localhost:3000", // Keep for development
    "https://work-wave-main.vercel.app" // Your deployed frontend
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
dbConnect();

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/business", businessRouter);
app.use("/booking", bookingRouter);
app.use("/reviews", reviewRouter);
app.use("/services", serviceRouter);
app.use("/otp", otpRoute);
app.use("/usdashboard", userDashboard);
app.post("/orders", async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);

    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
app.listen(3002, () => {
  console.log(`Backend is Running`);
});

app.get("/", (req, res) => {
  res.send("Hello from workwave backend!");
});
