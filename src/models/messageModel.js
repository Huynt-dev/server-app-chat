const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },

  message: String,
});

const message = mongoose.model("message", messageSchema);

module.exports = message;
