const usersModel = require("../models/usersModel");
const roomModel = require("../models/roomModel");

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
    // console.log(q);
    res.status(200).json({ dataUsers });
  } catch (error) {
    console.log(error);
  }
};

module.exports.searchRoom = async function (req, res) {
  try {
    const { r } = req.query;
    console.log(r);
    const room = await roomModel.find({ users: req.user._id }).populate({
      path: "users",
      match: { name: { $regex: r } },
      select: "name avatar",
    });

    console.log(room);
    res.status(200).json({ room });
  } catch (error) {
    console.log(error);
  }
};
