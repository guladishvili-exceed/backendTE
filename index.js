const express = require("express");

const app = express();

const userRoutes = require("./routes/userRoutes/authenticationRoutes");

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

const url = "mongodb+srv://nikita:Restart987@test.yxvwr.mongodb.net/test";

mongoose.connect(url, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", function () {
    console.log("Connected to database");
  })
  .on("error", function (error) {
    console.log(error);
  });

app.use("/", userRoutes);

app.listen(process.env.PORT, () => console.log("Server is up"));
