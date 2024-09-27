const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

const userModel = require("./userSchema");
const isAuth = require("./isAuthMiddleware");

const app = express();
const MONGO_URI = `mongodb+srv://gangadhar:Ganga224@cluster0.oz1tc.mongodb.net/practiseDB`;
const mongoStore = new mongodbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: "secret key",
    store: mongoStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/register-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Register form</h1>

    <form action="/register" method="POST">
      <label for="name">Name : </label>
      <input type="text" id="name" name="name" /><br>
      <label for="email">Email : </label>
      <input type="text" id="email" name="email" /><br>
      <label for="password">Password : </label>
      <input type="text" id="password" name="password" /><br>

      <button type="submit">Submit</button>
    </form>
  </body>
</html>`);
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  const userObj = new userModel({
    name: name,
    email: email,
    password: password,
  });
  console.log(userObj);

  try {
    const userDB = await userObj.save();
    return res.status(201).json({
      message: "user created successfully",
      data: userDB,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.get("/login-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Login form</h1>

    <form action="/login" method="POST">
      <label for="email">Email : </label>
      <input type="text" id="email" name="email" /><br>
      <label for="password">Password : </label>
      <input type="text" id="password" name="password" /><br>

      <button type="submit">Submit</button>
    </form>
  </body>
</html>`);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const userdb = await userModel.findOne({ email: email });
    console.log(userdb);
    console.log(req.session);
    req.session.isAuth = true;

    if (!userdb) {
      return res.status(400).json("user not found register now!!");
    }
    if (password !== userdb.password) {
      return res.status(400).json("password incorrect");
    }
    if (password === userdb.password) {
      return res.status(200).json("login succesfull");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/test", isAuth, (req, res) => {
  return res.send("private data...");
});

app.listen(8000, () => {
  console.log("server is up and running");
});
