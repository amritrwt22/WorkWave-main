const mongoose = require("mongoose");

const url = process.env.DB_URL;

const dbConnect = async () => {
  try {
    // console.log(url);

    await mongoose.connect(url);
    console.log("Db connected");
  } catch (err) {
    console.log("Error is " + err);
  }
};

module.exports = dbConnect;
