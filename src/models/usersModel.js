const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    first_name: String,

    last_name: String,

    name: String,

    email: String,

    password: String,

    gender: String,

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
