const FollowingModel = require("../models/Following");

exports.getAllFollowingsByUserId = async (id) => {
  return await FollowingModel.find({user_id: id});
};

exports.createFollowing = async (Following) => {
  const newFollowing = new FollowingModel(Following);
  return await newFollowing.save();
};
exports.getFollowingById = async (id) => {
  return await FollowingModel.findById(id);
};

exports.deleteFollowing = async (id) => {

  return await FollowingModel.findByIdAndDelete(id);
};
