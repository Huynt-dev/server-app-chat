const express = require("express");
const messages = express.Router();
const messageController = require("../controllers/messageController");
const isAuth = require("../middleware/isAuth");

messages.get("/:userId", isAuth, messageController.message);

module.exports = messages;
