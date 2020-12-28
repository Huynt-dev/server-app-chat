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
    console.log("new connection: ", socket.id);

    socket
      .on("disconnect", () => {
        console.log(socket.user._id, " disconnected");
      })
      .emit("hello", { msg: "Hello world!!" });
  });
};

module.exports = {
  connect,
};
