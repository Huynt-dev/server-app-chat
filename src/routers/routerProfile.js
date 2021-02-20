const express = require("express");
const profile = express.Router();
const usersController = require("../controllers/usersController");
const isAuth = require("../middleware/isAuth");

profile.post("/i", isAuth, usersController.changeInfo);

module.exports = profile;
