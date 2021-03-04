const usersModel = require("../models/usersModel");
const roomModel = require("../models/roomModel");
const messageModel = require("../models/messageModel");

module.exports.searchUser = async function (req, res) {
  try {
    const { q } = req.query;
    const dataUsers = await usersModel
      .find({
        name: { $regex: q },
        _id: {
          $ne: req.user._id,
        },
      })
      .select("name avatar email isOnline");
    res.status(200).json({ dataUsers });
  } catch (error) {
    res.status(400).json("error");
  }
};

module.exports.searchRoom = async function (req, res) {
  try {
    const { r } = req.query;
    const room = await roomModel.find({ users: req.user._id }).populate({
      path: "users",
      match: { name: { $regex: r } },
      select: "name avatar",
    });
    var countNewMessage = await messageModel
      .find({ toUser: req.user._id })
      .select("room user toUser isSeen");

    res.status(200).json({ room, countNewMessage });
  } catch (error) {
    res.status(400).json("error");
  }
};
