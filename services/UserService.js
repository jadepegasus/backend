const UserModel = require("../models/User");

exports.getAllUsers = async () => {
  return await UserModel.find();
};

exports.createUser = async (User) => {
  const newUser = new UserModel(User);
  return await newUser.save();
};
exports.getUserById = async (id) => {
  return await UserModel.findById(id);
};

exports.getUserByEmail = async (user_email) => {
  return await UserModel.findOne({user_email});
}

exports.getUserByFacebookId = async (facebook_id) => {
  return await UserModel.findOne({facebook_id})
}

exports.getUserByGoogleId = async (google_id) => {
  return await UserModel.findOne({google_id})
}

exports.updateUser = async (id, User) => {
  return await UserModel.findByIdAndUpdate(id, User);
};

exports.deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};
exports.searchUsers = async (keyword) => {
  let search = new RegExp(keyword, "i");
  return await UserModel.find({$or: [{user_email: search}, {user_fullname: search}]}, {_id: 1, user_fullname: 1, user_activated: 1, user_picture: 1})
}
exports.getFriends = async (array) => {
  const friends = [];
  for (let user_id of array) {
    let user = await UserModel.findById(user_id, {_id: 1, user_fullname: 1, user_activated: 1, user_picture: 1})
    friends.push(user)
  }
  return friends;
}

exports.setActived = async (user_id) => {
  return await UserModel.findByIdAndUpdate(user_id, {user_activated: 'on'})
}

exports.unActived = async (user_id) => {
  return await UserModel.findByIdAndUpdate(user_id, {user_activated: 'off'})
}