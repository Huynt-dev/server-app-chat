const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },

    last_name: { type: String, required: true },

    name: { type: String, required: true },

    email: { type: String, required: true },

    password: { type: String, required: true },

    gender: { type: String, required: true },

    isOnline: { type: Boolean, required: true },

    avatar: {
      type: String,
      default: "https://robohash.org/temporibusonisadipisci.png?size=300x300",
    },
  },
  {
    timestamps: true,
  }
);

const users = mongoose.model("User", usersSchema);

module.exports = users;
