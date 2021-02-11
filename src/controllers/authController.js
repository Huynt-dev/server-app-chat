const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../models/usersModel");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email }).lean();
    // console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Email is invalid" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(401).json({ error: "Password is invalid" });
    }

    const dataSign = {
      email: user.email,
      _id: user._id,
      name: user.name,
    };
    delete user.password;
    const token = await jwt.sign(dataSign, process.env.JWT_KEY);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, nickName, password, gender } = req.body;
    const existedUser = await users.findOne({
      $or: [{ email: email }, { name: nickName }],
    });

    if (existedUser) {
      return res.status(400).json({
        error: "Email đã được sử dụng",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await users.create({
      first_name: firstName,
      last_name: lastName,
      name: nickName,
      email: email,
      gender: gender,
      password: hashPassword,
      isOnline: false,
    });

    res.status(200).json({ user: "ok" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
