const crypto = require("crypto");
const express = require("express");
const { getUserByEmail } = require("../../services/UserService");
const { isValidEmail } = require("../Signup");
const router = express.Router();
const UserService = require('../../services/UserService')

const verify = (req, res) => {
  const { user_email, user_password } = req.body;
  const failLogin = {
    message: "Incorrect user_email or password.",
    status: "fail",
  };
  if (!isValidEmail(user_email)) {
    return res.send(failLogin);
  }

  getUserByEmail(user_email)
    .then((kq) => {
      if (kq == null) return res.json(failLogin)
      crypto.pbkdf2(
        user_password,
        kq.salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return res.json({message: err.message, status: 'fail'});
          }
          if (!crypto.timingSafeEqual(kq.user_password, hashedPassword)) {
            return res.json(failLogin);
          }
          if (kq.facebook_id || kq.google_id) return res.json(failLogin);
          req.session.passport = {user: {user_id: kq._id, user_fullname: kq.user_fullname}}
          UserService.setActived(kq._id)
          return res.json({message: kq, status: "success"});
        }
      );
    })
    .catch((err) => res.json({message: err.message, status: "fail"}));
};

router.route("/").post(verify);

module.exports = router;
