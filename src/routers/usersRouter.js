const express = require("express");
const users = express.Router();
const userController = require("../controllers/usersController");

users.get("/", userController.users);

module.exports = users;
