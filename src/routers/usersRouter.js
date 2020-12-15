const express = require("express");
const users = express.Router();
const userController = require("../controllers/usersController");
const isAuth = require("../middleware/isAuth");

users.get("/", isAuth, userController.users);

module.exports = users;
