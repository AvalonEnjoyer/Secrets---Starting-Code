//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
bcrypt = require("bcrypt");

const app = express();
const saltRounds = 10;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please check your data entry, no email specified!"],
  },
  password: {
    type: String,
    required: [true, "Please check your data entry, no password specified!"],
  },
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username })
      .then((foundUser) => {
        if (!foundUser) {
          console.log("Invalid username or password");
        } else {
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result === true) {
              res.render("secrets");
            } else {
              console.log("Invalid username or password");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    bcrypt.hash(req.body.password, saltRounds).then((hashedPassword) => {
      const newUser = new User({
        email: req.body.username,
        password: hashedPassword,
      });
      newUser
        .save()
        .then(() => {
          res.render("secrets");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
