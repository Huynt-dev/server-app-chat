const express = require("express");
const users = express.Router();
const userController = require("../controllers/UsersController");

users.get("/", userController.users);

module.exports = users;
