const express = require("express");
const room = express.Router();
const roomController = require("../controllers/roomController");
const isAuth = require("../middleware/isAuth");

room.get("/", isAuth, roomController.rooms);

room.get("/:idRoom/:toUser", isAuth, roomController.findMessageInRoom);

module.exports = room;
