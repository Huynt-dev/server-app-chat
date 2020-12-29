require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const socket = require("./configs/socket");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const usersRouter = require("./src/routers/usersRouter");
const routerAuth = require("./src/routers/authRouter");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));

mongoose.connect(process.env.CONNECT_DATA, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

socket.connect(io);
// connect to socket

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/auth", routerAuth);
app.use("/users", usersRouter);

mongoose.connection.on("connected", () => {
  console.log("Connected database !!!!!");
  server.listen(process.env.PORT, () => {
    console.log("Server is running");
  });
});
