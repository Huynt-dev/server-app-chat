const usersData = require("../models/UsersModel");

module.exports.users = async function(req, res){
    var data = await usersData.find();
    res.json({ data });
}