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
    // console.log("new connection: ", socket.id);
    console.log("---------------------");
    socket.join("xxx");
    console.log(socket.adapter.rooms);
    socket.on("disconnect", () => {
      console.log(socket.user._id, " disconnected");
    });

    socket.on("NEW-MESSAGE", (chat) => {
      console.log(socket.id, chat);
      io.sockets.in("xxx").emit("NEW-MESSAGE", chat);
    });

    // .emit("tokenSuccess", { msg: "Token success!!" });
  });
};

module.exports = {
  connect,
};
