const message = require("../models/messageModel");

module.exports.message = async function (req, res) {
  const { idUser } = req.params;
  var message = await message.find();
  res.status(200).json({ message });
};
