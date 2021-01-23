const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // just 2 elements

    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    lastMessage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const rooms = mongoose.model("Room", roomsSchema);

module.exports = rooms;
