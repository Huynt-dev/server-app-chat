const messageModel = require("../models/messageModel");

module.exports.message = async function (req, res) {
  const { userId } = req.params;
  var message = await messageModel.find({ user: userId });
  res.status(200).json({ message });
};
