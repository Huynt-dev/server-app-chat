const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const isAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];

    // verify token
    const tokenData = await jwt.verify(token, process.env.JWT_KEY);

    if (!tokenData) {
      return res.json({
        error: "Invalid token",
      });
    }

    const user = await User.findOne({ _id: tokenData._id });

    if (!user) {
      return res.json({
        error: "User not found",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = isAuth;
