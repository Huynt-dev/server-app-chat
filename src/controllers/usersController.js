const usersModel = require("../models/usersModel");
const roomModel = require("../models/roomModel");
const bcrypt = require("bcrypt");

module.exports.users = async function (req, res) {
  var dataUsers = await usersModel
    .find({
      _id: {
        $ne: req.user._id,
      },
    })
    .select("name avatar email isOnline");
  res.status(200).json({ dataUsers });
};

module.exports.showUser = async function (req, res) {
  try {
    const { idUser } = req.params;
    var userInfo = await usersModel
      .findOne({ _id: idUser })
      .select("name avatar email isOnline");
    res.status(200).json({ userInfo });
  } catch (error) {
    res.status(400).json("error");
  }
};

module.exports.findUserInRoom = async function (req, res) {
  try {
    const { idUser } = req.params;
    var room = await roomModel
      .findOne({
        $and: [{ users: idUser }, { users: req.user._id }],
      })
      .populate({ path: "users", select: "name" });

    if (room == null) {
      room = await roomModel.create({
        users: [idUser, req.user._id],
        who: "",
        lastMessage: "",
      });
    }

    res.status(200).json({ room });
  } catch (error) {
    res.status(400).json("error");
  }
};

module.exports.changeInfo = async function (req, res) {
  try {
    const { data } = req.body;

    if (req.user._id) {
      await usersModel.updateMany(
        { _id: req.user._id },
        { $set: { first_name: data.firstName, last_name: data.lastName } },
        { upsert: true }
      );

      res.status(200).json({ data });
    }
  } catch (error) {
    res.status(400).json("error");
  }
};

module.exports.changePass = async function (req, res) {
  try {
    const { data } = req.body;

    if (!req.user._id) {
      return res.status(401).json({ error: "Password error" });
    }

    const user = await usersModel.findOne({ _id: req.user._id }).lean();

    if (!user) {
      return res.status(401).json({ error: "Email is invalid" });
    }

    const isCorrectPassword = await bcrypt.compare(
      data.OldPassword,
      user.password
    );

    if (!isCorrectPassword) {
      return res.status(401).json({ error: "Password is invalid" });
    }

    const hashPassword = await bcrypt.hash(data.ConfirmPassword, 10);

    await usersModel.updateMany(
      { _id: req.user._id },
      { $set: { password: hashPassword } },
      { upsert: true }
    );

    res.status(200).json("ok");
  } catch (error) {
    res.status(400).json("error");
  }
};
