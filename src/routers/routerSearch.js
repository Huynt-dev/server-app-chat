const express = require("express");
const search = express.Router();
const searchController = require("../controllers/searchController");
const isAuth = require("../middleware/isAuth");

search.get("/", isAuth, searchController.searchUser);

search.get("/room", isAuth, searchController.searchRoom);
module.exports = search;
