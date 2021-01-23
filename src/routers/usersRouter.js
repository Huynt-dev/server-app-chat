const express = require("express");
const users = express.Router();
const userController = require("../controllers/usersController");
const isAuth = require("../middleware/isAuth");

users.get("/", isAuth, userController.users);

users.get("/:idUser", isAuth, userController.findUserInRoom);

module.exports = users;
