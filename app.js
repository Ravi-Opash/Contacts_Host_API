const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authRoute = require("./routes/auth");
const contactRoute = require("./routes/contacts");

const app = express();

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoute);
app.use(contactRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

const MONGODB_URI =
  "mongodb+srv://Ravi1411:Ravi1411@nodejs.19qxclq.mongodb.net/demo_project?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(3000);
    console.log("connected to db...!");
  })
  .catch((err) => {
    console.log(err);
});
