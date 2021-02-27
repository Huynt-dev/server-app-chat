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
  // console.log("test", count);
  // var countSeen = count.reduce(
  //   (total, x) => (x.isSeen === false ? total + 1 : total),
  //   0
  // );
  // console.log(countSeen);

  res.status(200).json({ room, countNewMessage });
};

// module.exports.seen = async function (req, res) {
//   var countNewMessage = await messageModel
//     .find({ toUser: req.user._id })
//     .select("user toUser isSeen");
//   // console.log("test", count);
//   // var countSeen = count.reduce(
//   //   (total, x) => (x.isSeen === false ? total + 1 : total),
//   //   0
//   // );
//   // console.log(countSeen);
//   res.status(200).json({ countNewMessage });
// };

module.exports.findMessageInRoom = async function (req, res) {
  try {
    const { idRoom } = req.params;

    var message = await messageModel.find({ room: idRoom }).populate("user");

    // .sort({ createdAt: -1 })
    // .limit(10);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error });
  }
};
