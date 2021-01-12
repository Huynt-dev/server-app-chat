const users = require("../models/usersModel");

module.exports.users = async function (req, res) {
  var dataUsers = await users.find().select("name");
  res.status(200).json({ dataUsers });
};
