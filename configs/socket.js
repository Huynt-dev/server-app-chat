const jwt = require("jsonwebtoken");
const messageModel = require("../src/models/messageModel");
const roomModel = require("../src/models/roomModel");
const connect = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.JWT_KEY);
      socket.user = payload;
      console.log(socket.user);
      next();
    } catch (e) {
      console.log({ socketError: e });
    }
  });

  io.on("connection", (socket) => {
    console.log("---------------------");
    // socket.emit("userBecomeOnline", socket.user._id);
    // console.log("new connection: ", socket.user._id);

    // socket.on("auth", async (token) => {
    //   const user = await jwt.verify(token, process.env.JWT_KEY);
    //   socket.join(user._id);
    //   socket.currentUserId = user._id;
    // });

    // .to(toUserId)
    // .to(socket.currentUserId)
    socket.on("sendMessage", async (data) => {
      console.log(data);
      const message = await messageModel.create(data);
      await message
        .populate({
          path: "user",
          select: "name",
        })
        .execPopulate();
      const lastMessage = await roomModel.findOneAndUpdate(
        { _id: data.room },
        {
          lastMessage: data.message,
        }
      );

      console.log(lastMessage);
      io.emit("newMessage", message);
    });

    console.log(socket.adapter.rooms);
    socket.on("disconnect", () => {
      // console.log(socket.user._id, " disconnected");
      // socket.emit("userBecomeOffline", socket.user._id);
    });

    // .emit("tokenSuccess", { msg: "Token success!!" });
  });
};

module.exports = {
  connect,
};
