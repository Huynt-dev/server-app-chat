const roomModel = require("../models/roomModel");
const messageModel = require("../models/messageModel");

module.exports.rooms = async function (req, res) {
  var room = await roomModel
    .find({ users: req.user._id })
    .populate({ path: "users", select: "name avatar" });

  res.status(200).json({ room });
};

module.exports.findMessageInRoom = async function (req, res) {
  try {
    const { idRoom } = req.params;

    var message = await messageModel.find({ room: idRoom }).populate("user");

    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
