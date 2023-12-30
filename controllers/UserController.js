const UserService = require("../services/UserService");
const Image = require ('../models/Image')

exports.getAllUsers = async (req, res) => {
  try {
    const Users = await UserService.getAllUsers();
    res.json({ data: Users, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "fail" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const User = await UserService.createUser(req.body);
    res.json({ data: User, status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, status: "fail" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const {
      _id,
      user_name,
      user_fullname,
      user_gender,
      user_picture,
      user_cover,
      user_work_title,
      user_work_place,
      user_current_city,
      user_hometown,
      user_birthday,
      user_registered,
      user_last_login,
      user_activated,
    } = await UserService.getUserById(req.params.id);
    res.json({
      data: {
        _id,
        user_name,
        user_fullname,
        user_gender,
        user_picture,
        user_cover,
        user_work_title,
        user_work_place,
        user_current_city,
        user_hometown,
        user_birthday,
        user_registered,
        user_last_login,
        user_activated,
      },
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "fail" });
  }
};

exports.updateUser = async (req, res) => {

  if (!req.session?.passport?.user) {
    res.json({message: "chưa đăng nhập", status: "fail"})
    return;
  }
  try {
    const user = await UserService.getUserById(req.params.id);
    if (req.session.passport.user.user_id != user?._id) {
      res.json({message:"bạn không có quyền sửa", status:"fail"})
      return;
    }
    const {user_fullname, user_gender, user_work_place, user_work_title, user_current_city, user_hometown, user_birthday} = req.body
    const birthday = new Date(user_birthday)
    const newUser = {user_fullname, user_gender, user_work_place, user_work_title, user_hometown, user_current_city, user_birthday: birthday}
    const option = req.body.whatIsChange
    let image1, image2
    switch (option) {
      case '01':
        try {
          await Image.findOneAndDelete({_id: user.user_cover})
        } catch (error) {
          
        }
        image1 = await Image.create({
          name: req.files[0].originalname,
          contentType: req.files[0].mimetype,
          data: req.files[0].buffer
        })
        newUser.user_cover = image1._id
        break;
      case '10':
        try {
          await Image.findOneAndDelete({_id: user.user_picture})
          
        } catch (error) {
          
        }
        image1 = await Image.create({
          name: req.files[0].originalname,
          contentType: req.files[0].mimetype,
          data: req.files[0].buffer
        })
        newUser.user_picture = image1._id
        break;
      case '11':
        try {
          await Image.findOneAndDelete({_id: user.user_cover})
          await Image.findOneAndDelete({_id: user.user_picture})
          
        } catch (error) {
          
        }
        image1 = await Image.create({
          name: req.files[0].originalname,
          contentType: req.files[0].mimetype,
          data: req.files[0].buffer
        })
        image2 = await Image.create({
          name: req.files[1].originalname,
          contentType: req.files[1].mimetype,
          data: req.files[1].buffer
        })
        newUser.user_picture = image1._id
        newUser.user_cover = image2._id
        break;
      default:
        break;
    }


    await UserService.updateUser(user._id, newUser)
    const newInfo = await UserService.getUserById(req.params.id);

    res.json({ data: newInfo, status: "success" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message, status: "fail" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const User = await UserService.deleteUser(req.params.id);
    res.json({ data: User, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "fail" });
  }
};

exports.getMyInfo = async (req, res) => {
  if (!req.session?.passport?.user) {
    res.json({message: "chưa đăng nhập", status: "fail"})
    return;
  }
  try {
    let User = await UserService.getUserById(req.session.passport.user.user_id);
    res.json({data: User, status: "success"})
  } catch (error) {
    res.status(500).json({ message: err.message, status: "fail" });
  }

}
exports.searchUsers = async (req, res) => {
  try {
    let search = req.query.search
    if (search && search?.length > 1) {
      const users = await UserService.searchUsers(search)
      res.json({data: users, status: 'success'})
      return;
    }
    res.json({message: "ít nhất 2 kí tự", status: 'fail'})
  } catch (error) {
    res.status(500).json({ message: error.message, status: "fail" });
  }
}