const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // just 2 elements
    who: { type: String },
    lastMessage: { type: String },
    lastUser: { type: String },
  },
  {
    timestamps: true,
  }
);

const rooms = mongoose.model("Room", roomsSchema);

module.exports = rooms;
