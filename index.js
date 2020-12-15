require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

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

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/auth", routerAuth);
app.use("/users", usersRouter);

mongoose.connection.on("connected", () => {
  console.log("Connected !!!!!");
  app.listen(process.env.PORT, () => {
    console.log("Server is running");
  });
});
