// userauthMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userauthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = userauthMiddleware;
