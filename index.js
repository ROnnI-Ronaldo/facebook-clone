const express = require("express");
const mongoose = require("mongoose");
const bodyParses = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParses.json());

//init router middleware
app.use("/api/users", require("./router/users"));
app.use("/api/auth", require("./router/auth"));

//CONNECT TO MONGO DB
mongoose
  .connect(
    `mongodb+srv://ROnnI:${process.env.MONG_DB_PASSWORD}@cluster0.gdebc.mongodb.net/facebook-clone?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("mongo bd connected"))
  .catch((err) => console.log(err));

//request handler

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App running in port ${PORT}`));
