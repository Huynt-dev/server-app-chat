require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const socket = require("./configs/socket");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT,
  },
});

const usersRouter = require("./src/routers/usersRouter");
const routerAuth = require("./src/routers/authRouter");
const roomRouter = require("./src/routers/roomRouter");
const routerSearch = require("./src/routers/routerSearch");
const routerProfile = require("./src/routers/routerProfile");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));

mongoose.connect(process.env.CONNECT_DATA, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

socket.connect(io);

app.get("/", function (req, res) {
  res.send("Hello HuyNT!");
});

app.use("/auth", routerAuth);
app.use("/users", usersRouter);
app.use("/room", roomRouter);
app.use("/search", routerSearch);
app.use("/profile", routerProfile);

mongoose.connection.on("connected", () => {
  console.log("Connected database !!!!!");
  server.listen(process.env.PORT, () => {
    console.log("Server is running port " + process.env.PORT);
  });
});
