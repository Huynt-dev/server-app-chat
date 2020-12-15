var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../models/usersModel");

module.exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email }).lean();

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

    const token = await jwt.sign(dataSign, process.env.JWT_KEY);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, nickName, gender, password } = req.body;
    const existedUser = await users.findOne({
      $or: [{ email: email }, { user: user }],
    });

    if (existedUser) {
      return res.status(400).json({
        error: "Email đã được sử dụng",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await users.create({
      firstName,
      lastName,
      email,
      nickName,
      gender,
      password: hashPassword,
    });

    res.status(200).json({ user: "ok" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
