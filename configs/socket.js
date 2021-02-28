const jwt = require("jsonwebtoken");
const messageModel = require("../src/models/messageModel");
const roomModel = require("../src/models/roomModel");
const usersModel = require("../src/models/usersModel");
const connect = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.JWT_KEY);
      socket.user = payload;
      socket.join(socket.user._id);
      next();
    } catch (e) {
      console.log("token error");
    }
  });

  io.on("connection", (socket) => {
    usersModel.findOneAndUpdate(
      { _id: socket.user._id },
      { $set: { isOnline: true } },
      { new: true },
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );

    socket.on("sendMessage", async (data) => {
      const message = await messageModel.create({
        room: data.room,
        user: data.user,
        message: data.message,
        toUser: data.toUser,
      });

      await message
        .populate({
          path: "user",
          select: "name",
        })
        .execPopulate();

      await roomModel.updateMany(
        { _id: data.room },
        { $set: { who: message.user.name, lastMessage: data.message } },
        { upsert: true }
      );

      io.to(data.toUser).emit("newMessage", message);

      io.to(socket.user._id)
        .to(data.toUser)
        .emit("updateMessage", { message, idRoom: data.room });
    });

    socket.on("disconnect", () => {
      usersModel.findOneAndUpdate(
        { _id: socket.user._id },
        { $set: { isOnline: false } },
        { new: true },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
    });
  });
};

module.exports = {
  connect,
};
