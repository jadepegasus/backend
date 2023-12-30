const https = require("https");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const path = require('path')
const Router = require("./routes/index.js");
const cors = require("cors");
const { Server } = require("socket.io");
const UserService = require("./services/UserService.js");

const mongoose = require("mongoose");
require("dotenv").config();

// Đọc chứng chỉ và private key
const credentials = {
  key: fs.readFileSync("./key/key1.pem", "utf8"),
  cert: fs.readFileSync("./key/www_habuiphuc_id_vn.chained.crt", "utf8"),
};

// connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mangxahoi")
  .catch((err) => {
    console.log(err);
  });

const app = express();

// link mac dinh
app.use(express.static("public"));
app.use(cors({
  origin: 'https://frontend-social-r1ky.onrender.com', // Đặt origin của frontend của bạn
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Bật sử dụng cookies và các header khác với credentials
}));
app.use(express.json());
//session
const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'none',
    secure: true,
    maxAge: 604800000
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient()
  })

});
app.use(sessionMiddleware);

// router
app.use("/", Router);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});

// Tạo máy chủ HTTPS va socket.io


module.exports = app;
