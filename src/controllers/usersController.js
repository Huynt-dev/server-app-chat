const usersModel = require("../models/usersModel");
const roomModel = require("../models/roomModel");

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
        lastMessage: "",
        // toUser: idUser,
      });
    }
    console.log(room);
    // console.log(req.user._id);

    res.status(200).json({ room });
  } catch (error) {
    console.log(error);
  }
};
