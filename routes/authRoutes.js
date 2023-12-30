const passport = require("passport");
require("dotenv").config();
const authRouters = require("express").Router();
const authFacebookRoute = require("./auth/authFacebookRoute");
const authGoogleRoute = require("./auth/authGoogleRoute");
const authLocalRoute = require('./auth/authLocalRoute')

authRouters.use("/facebook", authFacebookRoute);
authRouters.use("/google", authGoogleRoute);
authRouters.use("/password", authLocalRoute)

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

module.exports = authRouters;
