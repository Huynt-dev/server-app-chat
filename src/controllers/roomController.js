const roomModel = require("../models/roomModel");
const messageModel = require("../models/messageModel");

module.exports.rooms = async function (req, res) {
  var room = await roomModel
    .find({ users: req.user._id })
    .populate({ path: "users", select: "name avatar" });
  room.find;
  var countNewMessage = await messageModel
    .find({ toUser: req.user._id })
    .select("room user toUser isSeen");
  res.status(200).json({ room, countNewMessage });
};

module.exports.findMessageInRoom = async function (req, res) {
  try {
    const { idRoom, toUser } = req.params;
    var message = await messageModel.find({ room: idRoom }).populate("user");
    await messageModel.updateMany({ user: toUser }, { $set: { isSeen: true } });
    // .sort({ createdAt: -1 })
    // .limit(10);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error });
  }
};
