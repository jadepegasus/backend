const crypto = require("crypto");
const express = require("express");
const { getUserByEmail, createUser } = require("../services/UserService");
const router = express.Router();

const validatePassword = function isValidPassword(password) {
  // Ít nhất 8 ký tự, chỉ chứa chữ cái và chữ số
  const passwordRegex = /^[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

const validateEmail = function isValidEmail(email) {
  // Biểu thức chính quy kiểm tra địa chỉ email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
exports.isValidEmail = validateEmail;
exports.isValidPassword = validatePassword;

router.route("/").post(async function (req, res) {
  let { user_email, user_password, user_fullname, user_gender, user_birthday } =
    req.body;
  let birthday = new Date(user_birthday);

  if (birthday.toUTCString() === "Invalid Date") {
    birthday = new Date();
  }
  if (!validateEmail(user_email)) {
    return res.json({ message: "email không hợp lệ", status: "fail" });
  }
  if (!validatePassword(user_password)) {
    return res.json({
      message: "mật khẩu ít nhất 8 ký tự, chỉ chứa chữ cái và chữ số",
      status: "fail",
    });
  }
  const check_user_exist = await getUserByEmail(user_email);
  if (check_user_exist) {
    return res.json({ message: "email đã được sử dụng", status: "fail" });
  }

  // tạo mã băm của mật khẩu
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    user_password,
    salt,
    310000,
    32,
    "sha256",
    function (err, hashedPassword) {
      if (err) {
        return res.json({ err, status: "fail" });
      }
      const user = {
        user_email,
        user_password: hashedPassword,
        user_fullname,
        user_gender,
        user_birthday: birthday,
        salt
      };
      createUser(user)
        .then((kq) => {
          req.session.passport = {
            user: { user_id: kq._id, user_fullname: kq.user_fullname },
          };
          res.json({ data: kq, status: "success" });
        })
        .catch((err) => {
          res.json({ message: err, status: "fail" });
        });
    }
  );
});

exports.signupRouter = router;
