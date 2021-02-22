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
      console.log("socket.user", socket.user);
      socket.join(socket.user._id);
      next();
    } catch (e) {
      console.log("token error");
    }
  });

  io.on("connection", (socket) => {
    console.log("---------------------");

    // socket.emit("userBecomeOnline", socket.user._id);
    console.log("new connection: ", socket.id);
    const isOnline = usersModel.findOneAndUpdate(
      { _id: socket.user._id },
      { isOnline: true }
    );

    socket.on("sendMessage", async (data) => {
      console.log(data);
      const message = await messageModel.create(data);
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

      // await roomModel.findAndModify({
      //   query: { _id: data.room },
      //   update: { $set: { who: message.user.name, lastMessage: data.message } },
      //   new: true,
      //   upsert: true,
      // });

      // socket.join(message.user._id);
      io.to(data.toUser).emit("newMessage", message);

      io.to(socket.user._id)
        .to(data.toUser)
        .emit("updateMessage", { message, idRoom: data.room });
    });
    // });

    socket.on("disconnect", () => {
      console.log("user disconnect ", socket.id);
      const isoffline = usersModel.findOneAndUpdate(
        { _id: socket.user._id },
        { isOnline: false }
      );
    });

    // .emit("tokenSuccess", { msg: "Token success!!" });
  });
};

module.exports = {
  connect,
};
