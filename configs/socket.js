const jwt = require("jsonwebtoken");

const connect = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.JWT_KEY);
      socket.user = payload;
      next();
    } catch (e) {
      console.log({ socketError: e });
    }
  });

  io.on("connection", (socket) => {
    console.log("---------------------");
    socket.emit("userBecomeOnline", socket.user._id);
    // console.log("new connection: ", socket.user._id);
    socket.on("auth", async (token) => {
      const { user } = await jwt.verify(token);
      socket.join(user);
      socket.currentUserId = user;
    });

    socket.on("sendMessage", ({ toUserId, message }) => {
      io.to(toUserId)
        .to(socket.currentUserId)
        .emit("newMessage", { fromUserId: socket.currentUserId, message });
    });

    console.log(socket.adapter.rooms);
    socket.on("disconnect", () => {
      // console.log(socket.user._id, " disconnected");
      socket.emit("userBecomeOffline", socket.user._id);
    });

    // .emit("tokenSuccess", { msg: "Token success!!" });
  });
};

module.exports = {
  connect,
};
