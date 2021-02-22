const express = require("express");
const profile = express.Router();
const usersController = require("../controllers/usersController");
const isAuth = require("../middleware/isAuth");

profile.post("/i", isAuth, usersController.changeInfo);

profile.post("/p", isAuth, usersController.changePass);

module.exports = profile;
