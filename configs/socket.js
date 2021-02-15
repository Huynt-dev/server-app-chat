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
    // socket.on("auth", async (token) => {
    //   const user = await jwt.verify(token, process.env.JWT_KEY);
    //   socket.join(user._id);
    //   socket.currentUserId = user._id;
    // });

    // .to(toUserId)
    // .to(socket.currentUserId)

    // socket.on("Join-room", (idRoom) => {
    // socket.leave(!idRoom);
    // socket.join(idRoom);
    // console.log(socket.adapter.rooms);

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
        // console.log(data.message),
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

      // socket.to(idRoom).emit("newMessage", message);
      // io.sockets.in(idRoom).emit("updateMessage", message);
      io.emit("updateMessage", { message, idRoom: data.room });
    });
    // });

    // console.log(socket.adapter.rooms);
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
