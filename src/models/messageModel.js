const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    toUser: {
      type: String,
    },

    expire_at: { type: Date, default: Date.now, expires: 3600 },
  },

  {
    timestamps: true,
  }
);

const messages = mongoose.model("Messages", messagesSchema);

module.exports = messages;
