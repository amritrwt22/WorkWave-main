const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
// no token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(req.cookies)
    console.log(token);
    if(!token){
      console.log("Unauthorized: No token provided")
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    console.log("hi");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded._id);
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.user = admin;
    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
