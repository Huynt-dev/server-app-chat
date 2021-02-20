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
        who: "",
        lastMessage: "",
      });
    }

    res.status(200).json({ room });
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeInfo = async function (req, res) {
  try {
    const { idUser } = req.params;
    const { data } = req.body;

    console.log(data.firstName);
    // await usersModel.findOneAndUpdate(
    //   { _id: idUser },
    //   { first_name: data.firstName, last_name: data.LastName }
    // );
    if (req.user._id) {
      await usersModel.updateMany(
        // console.log(data.message),
        { _id: req.user._id },
        { $set: { first_name: data.firstName, last_name: data.lastName } },
        { upsert: true }
      );

      res.status(200).json({ data });
    }

    // if (idUser === JSON.stringify(req.user._id)) {

    // }
    // res.status(400).json("error");
  } catch (error) {
    console.log(error);
  }
};
