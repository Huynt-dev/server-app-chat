const users = require("../models/usersModel");

module.exports.users = async function (req, res) {
  var data = await users.find();
  res.status(200).json({ data });
};
