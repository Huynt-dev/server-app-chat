require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.static("./public"));

mongoose.connect(process.env.CONNECT_DATA, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
mongoose.connection.on("connected",
app.listen(8080, () => {
    console.log("Server is running");
  })
)